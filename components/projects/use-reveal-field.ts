'use client';
import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { useReducedMotion } from 'framer-motion';
import { revealSettings as settings } from './reveal-settings';
import { subscribeTrace } from '@/components/trace/trace-input';
import { traceSettings } from '@/components/trace/trace-settings';
import { TraceMemory } from '@/components/trace/trace-memory';
import { traceMask } from '@/components/trace/trace-mask';

const clamp = (n: number, low = 0, high = 1) => Math.max(low, Math.min(high, n));

export function useRevealField() {
  const root = useRef<HTMLElement>(null);
  const image = useRef<HTMLDivElement>(null);
  const reduced = Boolean(useReducedMotion());
  const memory = useRef(new TraceMemory());
  const [engaged, setEngaged] = useState(false);
  const state = useRef({ raf: 0, visible: false, coarse: false, prominent: false, inside: false, focus: false,
    pointer: false, x: 0, y: 0, px: 0, py: 0, field: 0, full: 0, entered: 0, last: 0,
    scrollY: 0, scrollTime: 0, velocity: 0, speed: 0, engaged: false, disposed: false, painted:0, pointerTime:0, fallbackX:0, fallbackY:0, sharedTime:0 });
  const tick = useRef<(time: number) => void>(() => {});
  // Exploring the loading overlay must not activate media hidden underneath it.
  const blocked = () => Boolean(root.current?.closest('[inert],[data-stamps-ready="false"]') || document.querySelector('.trace-loader:not([hidden])'));
  function wake() {
    const s = state.current;
    if (!s.visible || s.disposed || s.raf || document.hidden || reduced || blocked()) return;
    s.last = performance.now();
    s.raf = requestAnimationFrame(time => tick.current(time));
  }
  tick.current = time => {
    const s = state.current;
    s.raf = 0;
    if (!s.visible || document.hidden || reduced || !root.current || !image.current || blocked()) return;
    if(time-s.painted<1000/traceSettings.maxFPS){s.raf=requestAnimationFrame(time=>tick.current(time));return;}
    s.painted=time;
    const dt = clamp(time - s.last, 1, 34); s.last = time;
    const rect = image.current.getBoundingClientRect();
    const radius = clamp(rect.width * settings.radiusRatio, settings.minRadius, settings.maxRadius) * (1 + s.speed * .12);
    const distance = Math.hypot(Math.max(rect.left - s.px, 0, s.px - rect.right), Math.max(rect.top - s.py, 0, s.py - rect.bottom));
    const intent = s.focus || (s.coarse ? s.prominent : s.inside);
    if (intent && !s.entered) s.entered = time;
    if (!intent) s.entered = 0;
    const targetFull = s.focus ? 1 : intent ? clamp((time - s.entered - settings.hoverActivationDelay) / settings.activationDuration) : 0;
    const targetField = intent ? 1 : s.pointer && !s.coarse ? clamp(1 - distance / radius) * .6 : 0;
    const response = targetField < s.field ? traceSettings.revealRecovery : settings.transitionSpeed;
    const ease = 1 - Math.exp(-dt / response);
    const oldX = s.x, oldY = s.y;
    const tx = s.coarse || s.focus ? rect.width / 2 : s.px - rect.left;
    const ty = s.coarse || s.focus ? rect.height / 2 : s.py - rect.top;
    s.x += (tx - s.x) * ease; s.y += (ty - s.y) * ease;
    s.field += (targetField - s.field) * ease; s.full += (targetFull - s.full) * ease;
    s.velocity *= Math.exp(-dt / 90);
    const tailX = clamp((s.x - oldX) * 1.1, -18, 18), tailY = clamp((s.y - oldY) * 1.1, -18, 18);
    const values = {
      '--rf-x': `${s.x.toFixed(2)}px`, '--rf-y': `${s.y.toFixed(2)}px`,
      '--rf-stretch': (1 + s.speed * .38).toFixed(3),
      '--rf-r': `${(radius + s.full * Math.hypot(rect.width, rect.height) * 1.6).toFixed(2)}px`,
      '--rf-tail-x': `${tailX.toFixed(2)}px`, '--rf-tail-y': `${tailY.toFixed(2)}px`,
      '--rf-shift-x': `${(tailX / 18 * settings.distortionStrength).toFixed(2)}px`,
      '--rf-shift-y': `${(tailY / 18 * settings.distortionStrength).toFixed(2)}px`,
      '--rf-field': s.field.toFixed(4), '--rf-full': s.full.toFixed(4),
      '--rf-scroll': `${(s.velocity * settings.scrollTravel).toFixed(3)}px`,
    };
    for (const [key, value] of Object.entries(values)) root.current.style.setProperty(key, value);
    const fields=memory.current.read(time);
    root.current.style.setProperty('--rf-mask',traceMask(fields,rect,settings.strength,s.full));
    root.current.dataset.traceSegments=String(fields.length);
    const shouldEngage = intent && s.full > .55;
    if (s.engaged !== shouldEngage) { s.engaged = shouldEngage; setEngaged(shouldEngage); }
    const busy = fields.length>0 || (intent && targetFull < 1) || Math.abs(targetFull - s.full) > .001 || Math.abs(targetField - s.field) > .001 || Math.abs(tx - s.x) > .05 || Math.abs(ty - s.y) > .05 || Math.abs(tailX) > .01 || Math.abs(tailY) > .01 || Math.abs(s.velocity) > .001;
    root.current.dataset.revealRunning = String(busy);
    if (busy) s.raf = requestAnimationFrame(time => tick.current(time));
  };
  useEffect(() => {
    const node = root.current, media = image.current, s = state.current;
    if (!node || !media) return;
    s.disposed = false;
    const touch = matchMedia('(hover: none), (pointer: coarse)');
    const stop = () => {
      cancelAnimationFrame(s.raf); s.raf = 0; s.inside = false; s.pointer = false; s.entered = 0;
      s.field = 0; s.full = 0; s.velocity = 0; s.engaged = false; setEngaged(false);
      memory.current.clear();node.style.removeProperty('--rf-mask');node.dataset.traceSegments='0';
      node.style.setProperty('--rf-field', '0'); node.style.setProperty('--rf-full', '0'); node.style.setProperty('--rf-scroll', '0px');
      node.dataset.revealRunning = 'false';
    };
    const gate = node.closest('[data-stamps-ready]');
    const gateObserver = new MutationObserver(() => {
      if (blocked()) { s.focus = false; stop(); } else wake();
    });
    if (gate) gateObserver.observe(gate, { attributes: true, attributeFilter: ['data-stamps-ready'] });
    const updateMode = () => { s.coarse = touch.matches; wake(); };
    updateMode(); s.scrollY = window.scrollY;
    const unsubscribe = subscribeTrace(sample => {
      if (blocked()) { s.focus = false; stop(); return; }
      if (!s.visible || reduced || s.coarse) return;
      const rect=media.getBoundingClientRect();
      const distance=Math.hypot(Math.max(rect.left-sample.x,0,sample.x-rect.right),Math.max(rect.top-sample.y,0,sample.y-rect.bottom));
      s.px=sample.x; s.py=sample.y; s.speed=sample.speed;
      s.sharedTime=sample.time;
      s.inside=sample.x>=rect.left && sample.x<=rect.right && sample.y>=rect.top && sample.y<=rect.bottom;
      const reach=clamp(rect.width*settings.radiusRatio,settings.minRadius,settings.maxRadius)*1.2;
      s.pointer=sample.x>-1000 && distance<reach;
      // Retain recent path portions as they cross or approach this image.
      if(s.pointer)memory.current.add(sample,1,Math.min(traceSettings.size*settings.traceWidth,Math.max(26,rect.width*.24)));
      else memory.current.add({x:-10000,y:-10000,time:sample.time,speed:0});
      if(!s.pointer && s.field<.002 && s.full<.002 && !s.focus && !memory.current.segments.length) return;
      wake();
    });
    const observer = new IntersectionObserver(entries => {
      s.visible = entries[0].isIntersecting;
      s.scrollY = window.scrollY;
      if (!s.visible) stop(); else wake();
    }, { rootMargin: '60px' });
    const prominence = new IntersectionObserver(entries => {
      s.prominent = entries[0].isIntersecting && entries[0].intersectionRatio >= .4; wake();
    }, { rootMargin: '-18% 0px -18% 0px', threshold: [0, .4, .7] });
    observer.observe(media); prominence.observe(media);
    const scroll = () => {
      const y = window.scrollY, now = performance.now();
      memory.current.translate(0,s.scrollY-y);
      if (s.visible && !reduced) s.velocity = clamp((y - s.scrollY) / Math.max(Math.min(now - s.scrollTime, 80), 16) / 25, -1, 1);
      s.scrollY = y; s.scrollTime = now; wake();
    };
    const visibility = () => { if (document.hidden) stop(); else wake(); };
    const resize = new ResizeObserver(wake); resize.observe(media);
    window.addEventListener('scroll', scroll, { passive: true });
    document.addEventListener('visibilitychange', visibility); touch.addEventListener('change', updateMode);
    if (reduced) stop();
    return () => {
      s.disposed = true; gateObserver.disconnect(); unsubscribe(); cancelAnimationFrame(s.raf); observer.disconnect(); prominence.disconnect(); resize.disconnect();
      window.removeEventListener('scroll', scroll); document.removeEventListener('visibilitychange', visibility); touch.removeEventListener('change', updateMode);
    };
    // The listeners and animation loop share mutable refs, without pointer-triggered React renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);
  function move(event: PointerEvent<HTMLElement>) {
    const s = state.current;
    if (reduced || s.coarse || event.pointerType === 'touch' || blocked()) return;
    const rect = image.current?.getBoundingClientRect(); if (!rect) return;
    const now=performance.now();
    // Local input fallback for desktop layouts where ambient Trace is disabled.
    if(now-s.sharedTime>80){
      const dt=now-s.pointerTime;
      s.speed=s.pointerTime && dt<180?clamp(Math.hypot(event.clientX-s.fallbackX,event.clientY-s.fallbackY)/Math.max(dt,4)/traceSettings.velocitySensitivity):0;
      memory.current.add({x:event.clientX,y:event.clientY,time:now,speed:s.speed},1,Math.min(traceSettings.size*settings.traceWidth,Math.max(26,rect.width*.24)));
    }
    s.pointerTime=now;s.fallbackX=event.clientX;s.fallbackY=event.clientY;
    if (!s.pointer) { s.x = event.clientX - rect.left; s.y = event.clientY - rect.top; }
    s.px = event.clientX; s.py = event.clientY; s.pointer = true;
    s.inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
    wake();
  }
  function leave() { state.current.inside = false; state.current.pointer = false; state.current.entered = 0; wake(); }
  function focus(value: boolean) { state.current.focus = value && !blocked(); if (!value) state.current.entered = 0; wake(); }
  return { root, image, engaged: engaged && !reduced, reduced, move, leave, focus };
}
