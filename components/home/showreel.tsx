'use client';
import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Media } from '@/components/media/media';
import { useLanguage } from '@/components/layout/language-provider';
import { copy, site } from '@/data/site';

export function Showreel() {
  const { t } = useLanguage();
  const reduce = useReducedMotion();
  const root = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(true);
  const [paused, setPaused] = useState(false);
  const [ended, setEnded] = useState(false);
  const [ready, setReady] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [documentVisible, setDocumentVisible] = useState(true);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => setVisible(entries[0].intersectionRatio >= .5), { threshold: [0, .5] });
    if (root.current) observer.observe(root.current);
    const change = () => setDocumentVisible(!document.hidden);
    document.addEventListener('visibilitychange', change);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', change); };
  }, []);
  useEffect(() => {
    if (visible) { setEnded(false); setPaused(false); setCycle(value => value + 1); }
  }, [visible]);
  const running = visible && documentVisible && !paused && !ended && !reduce;
  return <section ref={root} className={`showreel ${ended ? 'reel-ended' : ''}`} aria-label={t(copy.reel)}>
    <h1 className="sr-only">{site.name} — {t(copy.selected)}</h1>
    <Media asset={site.showreel} className="showreel-media" priority loop={false} active={running} restartKey={cycle} onReady={() => setReady(true)} onEnded={() => setEnded(true)} sizes="100vw" />
    {!ready && <div className="initial-loader" role="status"><span className="loading-lines"/><span>{t(copy.loading)}</span></div>}
    {site.showreel.placeholder && <div className="showreel-placeholder"><span className="reel-frame" aria-hidden="true"/><div><p>{t(copy.showreelTitle)}</p><span>{t(copy.showreelPending)}</span></div></div>}
    <div className="hero-bottom page-gutter">
      <span className="hero-identity">{site.name}<span>{t(copy.showreelTitle)}</span></span>
      <div className="hero-actions">
        {site.showreel.video && !reduce && <button className="reel-control" onClick={() => {
          if (ended) { setEnded(false); setCycle(value => value + 1); setPaused(false); }
          else setPaused(value => !value);
        }} aria-label={t(paused || ended ? copy.play : copy.pause)}><span aria-hidden="true">{paused || ended ? '▶' : 'Ⅱ'}</span><span>{t(paused || ended ? copy.play : copy.pause)}</span></button>}
        <a className={`reel-continue ${ended ? 'encouraged' : ''}`} href="#introduction"><span>{t(ended ? copy.reelEnd : copy.skipReel)}</span><span className="circle-arrow" aria-hidden="true">↓</span></a>
      </div>
    </div>
  </section>;
}
