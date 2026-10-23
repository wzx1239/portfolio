'use client';
import { useEffect } from 'react';
import { metalSettings } from './metal-settings';
export function MetalSurface() {
  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
    const pointer = matchMedia('(hover: hover) and (pointer: fine)');
    let raf = 0, last = 0, x = .5, y = .5;
    const draw = (time: number) => {
      raf = 0;
      if (document.hidden || reduce.matches || !pointer.matches) return;
      if (time - last < metalSettings.updateInterval) { raf = requestAnimationFrame(draw); return; }
      last = time;
      document.documentElement.style.setProperty('--metal-x', `${(50 + (x - .5) * metalSettings.pointerTravel * 2).toFixed(1)}%`);
      document.documentElement.style.setProperty('--metal-y', `${(26 + (y - .5) * metalSettings.pointerTravel).toFixed(1)}%`);
    };
    const move = (event: PointerEvent) => {
      if (reduce.matches || !pointer.matches) return;
      const overBook = event.target instanceof Element && Boolean(event.target.closest('.record-spread'));
      document.documentElement.dataset.passportPointer = String(overBook);
      if (overBook) return;
      x = event.clientX / window.innerWidth; y = event.clientY / window.innerHeight;
      if (!raf) raf = requestAnimationFrame(draw);
    };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };
    window.addEventListener('pointermove', move, { passive: true }); document.addEventListener('visibilitychange', stop);
    return () => { stop(); window.removeEventListener('pointermove', move); document.removeEventListener('visibilitychange', stop); delete document.documentElement.dataset.passportPointer; document.documentElement.style.removeProperty('--metal-x'); document.documentElement.style.removeProperty('--metal-y'); };
  }, []);
  return null;
}
