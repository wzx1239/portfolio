'use client';
import { publicPath } from '@/lib/public-path';
import Image from 'next/image';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useLanguage } from '@/components/layout/language-provider';
import type { MediaAsset } from '@/lib/types';
import { copy } from '@/data/site';
import videoDimensions from '@/data/video-dimensions.json';
import { useNearViewport } from './use-near-viewport';

type Props = { asset: MediaAsset; className?: string; priority?: boolean; active?: boolean; loop?: boolean; restartKey?: number; onEnded?: () => void; onReady?: () => void; transitionName?: string; sizes?: string; label?: boolean };
export function Media({ asset, className = '', priority = false, active = true, loop = true, restartKey, onEnded, onReady, transitionName, sizes = '(max-width: 700px) 100vw, 60vw', label = false }: Props) {
  const { t } = useLanguage();
  const reduce = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const near = useNearViewport(root);
  const dimensions = asset.video ? (videoDimensions as Record<string, { width: number; height: number }>)[asset.video] : undefined;
  // Unknown future clips may fetch metadata to establish their native geometry.
  const loadVideo = priority || near || !dimensions;
  const video = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);
  const [documentVisible, setDocumentVisible] = useState(true);
  const [imageFailed, setImageFailed] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  useEffect(() => { setImageFailed(false); setVideoFailed(false); }, [asset.image, asset.video]);
  useEffect(() => { if (!asset.image) onReady?.(); }, [asset.image, onReady]);
  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const playback = new IntersectionObserver(entries => setVisible(entries[0].isIntersecting && entries[0].intersectionRatio >= .25), { threshold: [0, .25] });
    playback.observe(node);
    const onVisibility = () => setDocumentVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => { playback.disconnect(); document.removeEventListener('visibilitychange', onVisibility); };
  }, []);
  useEffect(() => {
    if (restartKey !== undefined && video.current) video.current.currentTime = 0;
  }, [restartKey]);
  useEffect(() => {
    const el = video.current;
    if (!el) return;
    if (asset.controls) { if (!visible || !documentVisible) el.pause(); return; }
    const shouldPlay = Boolean(visible && active && documentVisible && !reduce && !videoFailed);
    if (shouldPlay) {
      void el.play().catch(() => { /* Poster remains visible if autoplay is blocked. */ });
    } else el.pause();
  }, [visible, active, documentVisible, reduce, videoFailed, loop, asset.controls, asset.video, loadVideo]);
  // Metadata supplies the native dimensions even before this video enters view.
  // Visibility and reduced motion still control playback, never media geometry.
  const hasVideo = asset.video && !videoFailed;
  return <div ref={root} style={!hasVideo && asset.imageAspectRatio ? { aspectRatio: asset.imageAspectRatio } : undefined} className={`media ${hasVideo ? 'has-native-video' : ''} ${asset.placeholder ? 'is-placeholder' : ''} ${asset.controls ? 'has-playback-controls' : ''} ${className}`}>
    <div className="media-surface" style={transitionName ? { viewTransitionName: transitionName } as CSSProperties : undefined} data-transition-media="" data-transition-target={transitionName}>
    <div className="media-fallback" role={!asset.image || imageFailed ? 'img' : undefined} aria-label={!asset.image || imageFailed ? t(asset.alt) : undefined}/>
    {asset.image && !imageFailed && <Image src={publicPath(asset.image)!} alt={t(asset.alt)} fill style={asset.imageAspectRatio ? { objectFit: 'contain' } : undefined} sizes={sizes} loading={priority ? 'eager' : 'lazy'} preload={priority} unoptimized={asset.image.endsWith('.svg')} onLoad={onReady} onError={() => { setImageFailed(true); onReady?.(); }} />}
    {hasVideo && <video ref={video} src={loadVideo ? publicPath(asset.video) : undefined} poster={loadVideo ? publicPath(asset.image) : undefined} width={dimensions?.width} height={dimensions?.height} muted={!asset.controls} controls={asset.controls} playsInline loop={asset.controls ? false : loop} preload={loadVideo ? 'metadata' : 'none'} aria-label={t(asset.alt)} onCanPlay={onReady} onEnded={onEnded} onError={() => { setVideoFailed(true); onReady?.(); }} />}
    </div>
    {asset.placeholder && <div className="media-placeholder" aria-hidden="true"><span className="media-placeholder-mark"/><span>{asset.variant === 10 ? t(copy.portrait) : t(label ? copy.placeholder : copy.mediaPending)}</span></div>}
  </div>;
}
