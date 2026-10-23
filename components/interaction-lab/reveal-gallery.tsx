'use client';
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { useReducedMotion } from 'framer-motion';
import { labProjects } from './data';
import { ExperimentHeader } from './experiment-header';
import { ProjectUnit } from './project-unit';
import { revealSettings as settings } from './settings';
import { advance, clamp, resetSpring, spring, useLabFrame } from './use-lab-frame';

export function RevealGallery() {
  const reduced = Boolean(useReducedMotion());
  const [intensity, setIntensity] = useState(1);
  const stage = useRef<HTMLDivElement>(null);
  const images = useRef<(HTMLDivElement | null)[]>([]);
  const links = useRef<(HTMLAnchorElement | null)[]>([]);
  const pointer = useRef({ x: 0, y: 0, active: false });
  const channels = useRef(labProjects.map(() => ({ x: spring(), y: spring(), field: spring() })));

  function reset() {
    pointer.current.active = false;
    channels.current.forEach((state, index) => {
      Object.values(state).forEach(channel => resetSpring(channel));
      const element = links.current[index];
      if (!element) return;
      element.style.setProperty('--field', '0');
    });
  }

  const wake = useLabFrame({ root: stage, reduced, reset, frame: dt => {
    let busy = false;
    const rectangles = images.current.map(element => element?.getBoundingClientRect());
    rectangles.forEach((rect, index) => {
      const element = links.current[index];
      if (!rect || !element) return;
      const outsideX = Math.max(rect.left - pointer.current.x, 0, pointer.current.x - rect.right);
      const outsideY = Math.max(rect.top - pointer.current.y, 0, pointer.current.y - rect.bottom);
      const radius = clamp(rect.width * settings.radiusRatio, settings.minRadius, settings.maxRadius) * intensity;
      const field = pointer.current.active ? clamp(1 - Math.hypot(outsideX, outsideY) / Math.max(radius, 1), 0, 1) : 0;
      const x = pointer.current.x - rect.left;
      const y = pointer.current.y - rect.top;
      const state = channels.current[index];
      if (state.field.value === 0 && field > 0) { resetSpring(state.x, x); resetSpring(state.y, y); }
      if (pointer.current.active && field > 0) {
        busy = advance(state.x, x, dt, settings.stiffness, settings.damping) || busy;
        busy = advance(state.y, y, dt, settings.stiffness, settings.damping) || busy;
      }
      busy = advance(state.field, field, dt, settings.stiffness, settings.damping) || busy;
      const tailX = clamp(state.x.velocity / 28, -35, 35) * settings.fluidity * intensity;
      const tailY = clamp(state.y.velocity / 28, -35, 35) * settings.fluidity * intensity;
      const stretch = Math.min(Math.hypot(tailX, tailY) / 80, .22);
      const properties = {
        '--reveal-x': `${state.x.value.toFixed(2)}px`, '--reveal-y': `${state.y.value.toFixed(2)}px`,
        '--reveal-rx': `${(radius * (1 + stretch)).toFixed(2)}px`, '--reveal-ry': `${(radius * .82).toFixed(2)}px`,
        '--reveal-tail-x': `${tailX.toFixed(2)}px`, '--reveal-tail-y': `${tailY.toFixed(2)}px`,
        '--reveal-shift-x': `${(clamp(state.x.velocity / 1000, -1, 1) * settings.displacement * intensity).toFixed(2)}px`,
        '--reveal-shift-y': `${(clamp(state.y.velocity / 1000, -1, 1) * settings.displacement * intensity).toFixed(2)}px`,
        '--field': state.field.value.toFixed(4),
      };
      for (const [name, value] of Object.entries(properties)) element.style.setProperty(name, value);
    });
    return busy;
  } });
  useEffect(() => { wake(); }, [intensity, wake]);

  function move(event: PointerEvent<HTMLDivElement>) {
    if (reduced || (event.pointerType !== 'mouse' && event.pointerType !== 'pen')) return;
    pointer.current = { x: event.clientX, y: event.clientY, active: true };
    wake();
  }
  function leave() { pointer.current.active = false; wake(); }

  return <section id="reveal" className="lab-experiment lab-reveal" aria-labelledby="reveal-heading" data-still={reduced || intensity === 0} style={{ '--resting-blur': `${settings.restingBlur}px`, '--resting-contrast': settings.restingContrast } as CSSProperties}>
    <ExperimentHeader index={1} intensity={intensity} onIntensity={setIntensity}/>
    <div ref={stage} className="lab-stage" onPointerMove={move} onPointerLeave={leave} onPointerCancel={leave}>
      <div className="lab-gallery">{labProjects.map((project, index) => <ProjectUnit key={project.number} project={project} reveal imageRef={element => { images.current[index] = element; }} linkRef={element => { links.current[index] = element; }}/>)}</div>
    </div>
  </section>;
}
