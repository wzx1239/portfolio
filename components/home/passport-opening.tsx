'use client';
import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { AboutContent } from '@/components/about-content';
import { Showreel } from './showreel';
import { passportMotion as settings } from './passport-settings';
import './passport-opening.css';

export function PassportOpening() {
  const root = useRef<HTMLElement>(null);
  const reduced = Boolean(useReducedMotion());
  useEffect(() => {
    const section = root.current;
    const book = section?.querySelector<HTMLElement>('.about-record');
    const reel = section?.querySelector<HTMLElement>('.sequence-reel');
    if (!section || !book || !reel) return;
    let raf = 0, disposed = false;
    const clamp = (n: number) => Math.max(0, Math.min(1, n));
    const phase = (p: number, start: number, end: number) => clamp((p - start) / (end - start));
    function draw() {
      raf = 0;
      if (!section || !book || !reel || disposed) return;
      const desktop = window.innerWidth > 1350 && book.offsetHeight < window.innerHeight - 110;
      const enabled = !reduced && desktop;
      section.dataset.animated = String(enabled);
      section.dataset.simplified = String(!reduced && !desktop);
      const progress = clamp(-section.getBoundingClientRect().top / (window.innerHeight * settings.scrollViewports));
      const opening = enabled ? phase(progress, settings.openingStart, settings.openingEnd) : 1;
      const arrival = phase(progress, settings.arrivalStart, settings.arrivalEnd);
      const recession = phase(progress, 0, settings.reelEnd);
      section.style.setProperty('--sequence-progress', progress.toFixed(5));
      section.style.setProperty('--reel-recede', recession.toFixed(5));
      section.style.setProperty('--passport-arrive', arrival.toFixed(5));
      section.style.setProperty('--passport-open', opening.toFixed(5));
      const open = opening >= .999;
      section.dataset.open = String(open);
      book.inert = !open;
      reel.inert = enabled && recession >= .99;
    }
    function wake() { if (!raf && !disposed && !document.hidden) raf = requestAnimationFrame(draw); }
    const resize = new ResizeObserver(wake);
    resize.observe(book);
    window.addEventListener('scroll', wake, { passive: true });
    window.addEventListener('resize', wake);
    document.addEventListener('visibilitychange', wake);
    draw();
    // Honour a direct content anchor after the enhanced scroll range is measured.
    if (window.location.hash === '#introduction') {
      section.querySelector('#introduction')?.scrollIntoView({ behavior: 'instant', block: 'start' });
      wake();
    }
    return () => { disposed = true; cancelAnimationFrame(raf); resize.disconnect(); book.inert = false; reel.inert = false; window.removeEventListener('scroll', wake); window.removeEventListener('resize', wake); document.removeEventListener('visibilitychange', wake); };
  }, [reduced]);
  return <section ref={root} className="home-passport" data-open="true" style={{
    '--sequence-distance': `${settings.scrollViewports * 100}svh`,
    '--passport-angle-max': `${settings.angle}deg`,
    '--passport-perspective': `${settings.perspective}px`,
    '--passport-lift': `${settings.lift}deg`,
    '--explore-position': `${settings.scrollViewports * settings.openingEnd * 100}svh`,
  } as React.CSSProperties}>
    <div id="introduction" className="passport-explore-anchor" />
    <div className="sequence-stage">
      <div className="sequence-reel"><Showreel /></div>
      <div className="passport-stage"><AboutContent embedded /></div>
    </div>
  </section>;
}
