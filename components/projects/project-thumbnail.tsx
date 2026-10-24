'use client';
import { publicPath } from '@/lib/public-path';
import Image from 'next/image';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useLanguage } from '@/components/layout/language-provider';
import { TransitionLink } from '@/components/layout/transition-link';
import type { Project } from '@/lib/types';
import { useRevealField } from './use-reveal-field';
import { revealSettings as settings } from './reveal-settings';
import './reveal-field.css';

export function ProjectThumbnail({ project, featured = false, variant = 'directory' }: { project: Project; featured?: boolean; variant?: 'directory' | 'stamp' }) {
  const { t } = useLanguage();
  const field = useRevealField();
  const video = useRef<HTMLVideoElement>(null);
  const [loadVideo, setLoadVideo] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const previewSource = project.previewVideo || (variant === 'stamp' ? project.hero.video : undefined);
  useEffect(() => {
    if (field.engaged && previewSource && !videoFailed) setLoadVideo(true);
    if (!field.engaged) { video.current?.pause(); setPlaying(false); }
    else if (video.current) void video.current.play().catch(() => setPlaying(false));
  }, [field.engaged, previewSource, loadVideo, videoFailed]);
  const style = {
    '--rf-saturation': settings.restingSaturation, '--rf-contrast': settings.restingContrast,
    '--rf-brightness': settings.restingBrightness, '--rf-core': `${Math.round((1 - settings.softness) * 100)}%`,
    '--rf-video-speed': `${settings.videoTransitionSpeed}ms`,
  } as CSSProperties;
  const still = (duplicate = false) => project.thumbnail.image && !imageFailed ? <Image src={publicPath(project.thumbnail.image)!} alt={duplicate ? '' : t(project.thumbnail.alt)} fill sizes="(max-width: 700px) 100vw, (min-width: 1200px) 45vw, 40vw" loading="lazy" unoptimized={project.thumbnail.image.endsWith('.svg')} draggable={false} onError={() => setImageFailed(true)} /> : <div className="rf-fallback" role={duplicate ? undefined : 'img'} aria-label={duplicate ? undefined : t(project.thumbnail.alt)} />;
  return <article ref={field.root} style={style} className={`project-item reveal-project category-${project.category} ${variant === 'stamp' ? 'project-stamp' : ''} ${featured ? 'project-featured' : ''} ${field.engaged ? 'preview-active' : ''}`} onPointerMove={field.move} onPointerLeave={field.leave} onPointerCancel={field.leave} onFocus={() => field.focus(true)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) field.focus(false); }}>
    <TransitionLink className="project-link" href={`/projects/${project.slug}`} transitionName={`project-${project.number}`} prefetch aria-label={`${project.number} — ${t(project.title)}`}>
      <div ref={field.image} className="thumbnail-wrap">
        <div className="rf-surface project-thumbnail" data-transition-media="">
          <div className="rf-rest">{still()}</div>
          <div className="rf-original" aria-hidden="true">{still(true)}
            {loadVideo && !videoFailed && !field.reduced && <video ref={video} src={publicPath(previewSource)} poster={publicPath(project.thumbnail.image)} muted playsInline loop preload="none" className={playing && field.engaged ? 'rf-video is-playing' : 'rf-video'} aria-hidden="true" onPlaying={() => setPlaying(true)} onError={() => { setVideoFailed(true); setPlaying(false); }} />}
          </div>
        </div>
        <span className="thumbnail-number">{project.number}</span><span className="thumbnail-arrow" aria-hidden="true"><span>↗</span><span>↗</span></span>
        <span className="activation-line" aria-hidden="true" />
      </div>
      <div className="project-caption"><h3>{t(project.title)}</h3></div>
      {variant !== 'stamp' && <p className="project-subtitle">{t(project.subtitle)}</p>}
    </TransitionLink>
  </article>;
}
