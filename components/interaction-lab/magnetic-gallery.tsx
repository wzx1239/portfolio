'use client';
import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { useReducedMotion } from 'framer-motion';
import { labProjects } from './data';
import { ExperimentHeader } from './experiment-header';
import { ProjectUnit } from './project-unit';
import { magneticSettings as settings } from './settings';
import { advance, clamp, resetSpring, spring, useLabFrame } from './use-lab-frame';

export function MagneticGallery() {
  const reduced = Boolean(useReducedMotion());
  const [intensity, setIntensity] = useState(1);
  const stage = useRef<HTMLDivElement>(null);
  const anchors = useRef<(HTMLElement | null)[]>([]);
  const links = useRef<(HTMLAnchorElement | null)[]>([]);
  const pointer = useRef({ x: 0, y: 0, active: false });
  const channels = useRef(labProjects.map(() => ({ x: spring(), y: spring(), rx: spring(), ry: spring(), field: spring() })));

  function reset() {
    pointer.current.active = false;
    channels.current.forEach((state, index) => {
      Object.values(state).forEach(channel => resetSpring(channel));
      const element = links.current[index];
      if (!element) return;
      for (const name of ['--magnet-x', '--magnet-y', '--magnet-rx', '--magnet-ry', '--image-parallax-x', '--image-parallax-y', '--field']) element.style.removeProperty(name);
    });
  }

  const wake = useLabFrame({ root: stage, reduced, reset, frame: dt => {
    let busy = false;
    const rectangles = anchors.current.map(element => element?.getBoundingClientRect());
    rectangles.forEach((rect, index) => {
      const element = links.current[index];
      if (!rect || !element) return;
      const dx = pointer.current.x - (rect.left + rect.width / 2);
      const dy = pointer.current.y - (rect.top + rect.height / 2);
      const influence = pointer.current.active ? Math.pow(clamp(1 - Math.hypot(dx, dy) / settings.radius, 0, 1), 1.6) : 0;
      const nx = clamp(dx / (rect.width * .5), -1, 1);
      const ny = clamp(dy / (rect.height * .5), -1, 1);
      const targets = { x: nx * settings.travel * influence * intensity, y: ny * settings.travel * influence * intensity, rx: -ny * settings.tilt * influence * intensity, ry: nx * settings.tilt * influence * intensity, field: influence * Math.min(intensity, 1) };
      const state = channels.current[index];
      for (const name of Object.keys(targets) as (keyof typeof targets)[]) busy = advance(state[name], targets[name], dt, settings.stiffness, settings.damping) || busy;
      element.style.setProperty('--magnet-x', `${state.x.value.toFixed(3)}px`);
      element.style.setProperty('--magnet-y', `${state.y.value.toFixed(3)}px`);
      element.style.setProperty('--magnet-rx', `${state.rx.value.toFixed(3)}deg`);
      element.style.setProperty('--magnet-ry', `${state.ry.value.toFixed(3)}deg`);
      element.style.setProperty('--image-parallax-x', `${(-state.x.value * settings.imageParallax / Math.max(settings.travel, 1)).toFixed(3)}px`);
      element.style.setProperty('--image-parallax-y', `${(-state.y.value * settings.imageParallax / Math.max(settings.travel, 1)).toFixed(3)}px`);
      element.style.setProperty('--field', state.field.value.toFixed(4));
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

  return <section id="magnetic" className="lab-experiment lab-magnetic" aria-labelledby="magnetic-heading" data-still={reduced || intensity === 0}>
    <ExperimentHeader index={0} intensity={intensity} onIntensity={setIntensity}/>
    <div ref={stage} className="lab-stage" onPointerMove={move} onPointerLeave={leave} onPointerCancel={leave}>
      <div className="lab-gallery">{labProjects.map((project, index) => <ProjectUnit key={project.number} project={project} anchorRef={element => { anchors.current[index] = element; }} linkRef={element => { links.current[index] = element; }}/>)}</div>
    </div>
  </section>;
}
