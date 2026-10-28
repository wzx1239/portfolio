'use client';
import Image from 'next/image';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useReducedMotion } from 'framer-motion';
import { publicPath } from '@/lib/public-path';
import type { MediaAsset } from '@/lib/types';
export type TicketContent = { number: string; title: string; category: string; description: string; date: string; hero?: MediaAsset; artwork?: { src: string; width: number; height: number } };
// Decorative barcode derived from project number/year; not scan data.
const bars = [2,1,1,3,1,2,3,1,2,1,1,2,3,2,1,1,3,1,2,2,1,3,1,2];
export function ProjectTicket({ ticket, priority = false }: { ticket: TicketContent; priority?: boolean }) {
  const { number, title, category, description, date, hero, artwork } = ticket;
  const video = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const [engaged, setEngaged] = useState(false);
  const [requested, setRequested] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const update = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);
  useEffect(() => {
    const media = video.current;
    if (!media) return;
    if (engaged && visible && !reduced) void media.play().catch(() => setPlaying(false));
    else { media.pause(); setPlaying(false); }
  }, [engaged, requested, visible, reduced]);
  const engage = () => { setEngaged(true); if (!reduced) setRequested(true); };
  return <div className="ticket-preview-shell" style={{ '--ticket-index': Number(number) - 1, '--ticket-pull-direction': Number(number) <= 5 ? 1 : -1 } as CSSProperties} data-engaged={engaged} onPointerEnter={event => { if (event.pointerType === 'mouse') engage(); }} onPointerLeave={() => setEngaged(false)}>
    <article className="project-ticket" tabIndex={0} data-project-number={number} aria-label={[number, title, category, date].filter(Boolean).join(' — ')} onFocus={engage} onBlur={() => setEngaged(false)}>
      <div className="ticket-information">
        <div className="ticket-information-top"><span className="ticket-project-number">{number}</span><span className="ticket-category">{category}</span></div>
        <h1 className="ticket-title" aria-label={title}>{artwork && <Image className="ticket-title-artwork" src={publicPath(artwork.src)!} alt={title} width={artwork.width} height={artwork.height} sizes="(max-width: 700px) 18vw, 16vw" priority={priority} />}{!artwork && <span className="ticket-future-title">{title}</span>}</h1>
        <div className="ticket-information-bottom"><span>{description}</span></div>
      </div>
      <div className="ticket-project-media">
        {hero?.image && <Image src={publicPath(hero?.image)!} alt={title} fill sizes="(max-width: 700px) 32vw, 29vw" priority={priority} />}
        {requested && hero?.video && <video ref={video} src={publicPath(hero?.video)} muted loop playsInline controls={false} preload="none" aria-hidden="true" className={playing ? 'is-playing' : ''} onPlaying={() => setPlaying(true)} onError={() => setPlaying(false)} />}
      </div>
      <div className="ticket-detail" aria-hidden="true">
        <svg className="ticket-barcode" viewBox="0 0 96 112" preserveAspectRatio="none">{bars.map((width,index) => <rect key={index} x={bars.slice(0,index).reduce((total,value) => total+value+2,0)} y="0" width={width} height="112" fill="currentColor" />)}</svg>
        <span className="ticket-serial">{date}</span>
      </div>
    </article>
  </div>;
}
