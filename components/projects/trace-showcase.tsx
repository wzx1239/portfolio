'use client';
import { publicPath } from '@/lib/public-path';
import { useEffect, useId, useRef, useState, type CSSProperties } from 'react';
import { useLanguage } from '@/components/layout/language-provider';
import type { Localized, Section } from '@/lib/types';
import { useNearViewport } from '@/components/media/use-near-viewport';

export function TraceShowcase({ steps, label }: { steps: NonNullable<Section['steps']>; label: Localized }) {
  const { t } = useLanguage();
  const descriptionId = useId();
  const [active, setActive] = useState(0);
  const [technicalOpen, setTechnicalOpen] = useState(false);
  const technicalId = useId();
  const root = useRef<HTMLDivElement>(null);
  const near = useNearViewport(root);
  const [requested, setRequested] = useState<number[]>([]);
  useEffect(() => {
    if (near) setRequested(previous => previous.includes(active) ? previous : [...previous, active]);
  }, [near, active]);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const [visible, setVisible] = useState(false);
  const [documentVisible, setDocumentVisible] = useState(true);
  const step = steps[active];
  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const observer = new IntersectionObserver(entries => setVisible(entries[0].isIntersecting), { threshold: 0 });
    observer.observe(node);
    const update = () => setDocumentVisible(!document.hidden);
    update(); document.addEventListener('visibilitychange', update);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update); };
  }, []);
  useEffect(() => {
    videos.current.forEach((video, index) => {
      if (!video) return;
      if (index === active && visible && documentVisible) void video.play().catch(() => { /* Poster remains if autoplay is blocked. */ });
      else video.pause();
    });
  }, [active, visible, documentVisible, requested]);
  function select(index: number) {
    setTechnicalOpen(false);
    if (index !== active && videos.current[index]?.readyState) videos.current[index]!.currentTime = 0;
    setActive(index);
  }
  return <div ref={root} className="trace-showcase" onPointerLeave={() => { if (Boolean(root.current && getComputedStyle(root.current).getPropertyValue('--showcase-side-by-side').trim() === '1')) setTechnicalOpen(false); }} onBlur={event => { if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget as Node)) setTechnicalOpen(false); }} onKeyDown={event => { if (event.key === 'Escape') setTechnicalOpen(false); }}>
    <div className="trace-showcase-main">
    <div className="trace-showcase-viewer">
      {steps.map((item, index) => <video ref={node => { videos.current[index] = node; }} key={item.id} src={requested.includes(index) ? publicPath(item.video) : undefined} poster={requested.includes(index) ? publicPath(item.thumbnail) : undefined} width={item.width} height={item.height} autoPlay={index === active && visible && documentVisible} muted loop playsInline controls={false} preload={requested.includes(index) ? 'metadata' : 'none'} aria-label={index === active ? t(item.title) : undefined} aria-hidden={index !== active} className={index === active ? 'is-active' : ''} />)}
    </div>
    <div className="trace-showcase-selectors" role="group" aria-label={t(label)}>
      {steps.map((item, index) => <button key={item.id} type="button" aria-pressed={index === active} aria-controls={descriptionId} onClick={() => select(index)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={publicPath(item.thumbnail)} alt="" width={item.width} height={item.height} loading="lazy" />
        <span>{item.number} {t(item.selector)}</span>
      </button>)}
    </div>
    <div id={descriptionId} className="trace-showcase-description" aria-live="polite" aria-atomic="true">
      <h3>{t(step.title)}</h3><p>{t(step.body)}</p>
    </div>
    {step.implementation && <button className="how-made-trigger" type="button" aria-expanded={technicalOpen} aria-controls={technicalId} onPointerEnter={event => { if (event.pointerType === 'mouse' && Boolean(root.current && getComputedStyle(root.current).getPropertyValue('--showcase-side-by-side').trim() === '1')) setTechnicalOpen(true); }} onClick={event => { if (event.detail > 0 && Boolean(root.current && getComputedStyle(root.current).getPropertyValue('--showcase-side-by-side').trim() === '1')) setTechnicalOpen(true); else setTechnicalOpen(open => !open); }}>{t({ en: 'HOW I MADE IT', zh: '实现方式' })} <span aria-hidden="true">{technicalOpen ? '−' : '+'}</span></button>}
    </div>
    {step.implementation && <div className={`how-made${technicalOpen ? ' is-open' : ''}`}>

      <div id={technicalId} className="how-made-content" aria-hidden={!technicalOpen} inert={!technicalOpen}>
        <div className="how-made-items">{step.implementation.map((item, index) => <div className="how-made-item" key={item.heading.en} style={{ '--technical-index': index } as CSSProperties}><h4>{t(item.heading)}</h4><p>{t(item.body)}</p></div>)}</div>
      </div>
    </div>}
  </div>;
}
