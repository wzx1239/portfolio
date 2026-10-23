'use client';
import { useCallback, useEffect, useRef, type RefObject } from 'react';

export type Spring = { value: number; velocity: number };
export const spring = (value = 0): Spring => ({ value, velocity: 0 });
export const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export function advance(channel: Spring, target: number, dt: number, stiffness: number, damping: number) {
  // Two small semi-implicit steps keep the response stable on slower frames.
  for (let substep = 0; substep < 2; substep++) {
    channel.velocity += ((target - channel.value) * stiffness - channel.velocity * damping) * dt / 2;
    channel.value += channel.velocity * dt / 2;
  }
  if (Math.abs(target - channel.value) < .008 && Math.abs(channel.velocity) < .02) {
    channel.value = target;
    channel.velocity = 0;
    return false;
  }
  return true;
}

export function resetSpring(channel: Spring, value = 0) { channel.value = value; channel.velocity = 0; }

type Options = {
  root: RefObject<HTMLElement | null>;
  reduced: boolean;
  frame: (dt: number, time: number) => boolean;
  reset: () => void;
  scroll?: (time: number) => void;
};

// One loop per study. It sleeps after settling and cancels outside the viewport.
export function useLabFrame({ root, reduced, frame, reset, scroll }: Options) {
  const handlers = useRef({ frame, reset, scroll });
  handlers.current = { frame, reset, scroll };
  const state = useRef({ raf: 0, active: false, previous: 0, disposed: false });
  const tick = useRef<(time: number) => void>(() => {});
  tick.current = (time: number) => {
    const current = state.current;
    current.raf = 0;
    if (!current.active || current.disposed || document.hidden) return;
    const dt = clamp((time - current.previous) / 1000 || 1 / 60, 1 / 240, 1 / 30);
    current.previous = time;
    const busy = handlers.current.frame(dt, time);
    if (busy) current.raf = requestAnimationFrame(time => tick.current(time));
    else if (root.current) root.current.dataset.motionActive = 'false';
  };
  const wake = useCallback(() => {
    const current = state.current;
    if (!current.active || current.disposed || current.raf || document.hidden) return;
    current.previous = performance.now();
    if (root.current) root.current.dataset.motionActive = 'true';
    current.raf = requestAnimationFrame(time => tick.current(time));
  }, [root]);

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    state.current.disposed = false;
    const stop = () => {
      cancelAnimationFrame(state.current.raf);
      state.current.raf = 0;
      node.dataset.motionActive = 'false';
      handlers.current.reset();
    };
    if (reduced) {
      state.current.active = false;
      stop();
      return () => { state.current.disposed = true; stop(); };
    }
    let intersecting = false;
    const observer = new IntersectionObserver(entries => {
      intersecting = entries[0].isIntersecting;
      state.current.active = intersecting && !document.hidden;
      if (state.current.active) wake(); else stop();
    }, { rootMargin: '120px' });
    observer.observe(node);
    const onScroll = () => {
      if (!state.current.active) return;
      handlers.current.scroll?.(performance.now());
      wake();
    };
    const onVisibility = () => {
      state.current.active = intersecting && !document.hidden;
      if (state.current.active) wake(); else stop();
    };
    const resize = new ResizeObserver(wake);
    resize.observe(node);
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      state.current.disposed = true;
      state.current.active = false;
      observer.disconnect(); resize.disconnect(); stop();
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [root, reduced, wake]);
  return wake;
}
