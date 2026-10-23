'use client';
import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { labProjects } from './data';
import { ExperimentHeader } from './experiment-header';
import { ProjectUnit } from './project-unit';
import { spatialSettings as settings } from './settings';
import { advance, clamp, resetSpring, spring, useLabFrame } from './use-lab-frame';

const depths = [-.85, .35, 1];

export function SpatialGallery() {
  const reduced = Boolean(useReducedMotion());
  const [intensity, setIntensity] = useState(1);
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const links = useRef<(HTMLAnchorElement | null)[]>([]);
  const motion = useRef({ y: 0, time: 0, targetVelocity: 0, velocity: spring(), progress: spring(.5) });

  function reset() {
    const state = motion.current;
    state.y = window.scrollY; state.time = 0; state.targetVelocity = 0;
    resetSpring(state.velocity); resetSpring(state.progress, .5);
    links.current.forEach(element => {
      if (!element) return;
      for (const name of ['--scroll-y', '--scroll-x', '--scroll-rx', '--scroll-skew', '--scroll-scale-y', '--scroll-scale-x', '--crop-y', '--title-x', '--field']) element.style.removeProperty(name);
    });
  }

  const wake = useLabFrame({ root: stage, reduced, reset,
    scroll: time => {
      const state = motion.current;
      // A discrete mouse-wheel step must react too, including the first input after idle.
      const elapsed = state.time && time - state.time < 110 ? Math.max(time - state.time, 8) : 16;
      state.targetVelocity = clamp((window.scrollY - state.y) / elapsed * 1000 / settings.velocityScale, -1, 1);
      state.y = window.scrollY; state.time = time;
    },
    frame: (dt, time) => {
      const root = section.current;
      if (!root || !stage.current) return false;
      const state = motion.current;
      if (time - state.time > 50) state.targetVelocity = 0;
      const rect = root.getBoundingClientRect();
      const progress = clamp(-rect.top / Math.max(rect.height - window.innerHeight, 1), 0, 1);
      let busy = advance(state.velocity, state.targetVelocity, dt, settings.stiffness, settings.damping);
      busy = advance(state.progress, progress, dt, settings.stiffness, settings.damping) || busy;
      const strength = intensity * clamp(stage.current.clientWidth / 1000, .55, 1);
      const speed = state.velocity.value * strength;
      links.current.forEach((element, index) => {
        if (!element) return;
        const depth = depths[index];
        const properties = {
          '--scroll-y': `${(speed * settings.travel * depth).toFixed(3)}px`,
          '--scroll-x': `${(speed * 6 * depth).toFixed(3)}px`,
          '--scroll-rx': `${(speed * settings.tilt * depth).toFixed(3)}deg`,
          '--scroll-skew': `${(speed * settings.skew * depth).toFixed(3)}deg`,
          '--scroll-scale-y': (1 + Math.abs(speed) * settings.stretch).toFixed(4),
          '--scroll-scale-x': (1 - Math.abs(speed) * settings.stretch * .25).toFixed(4),
          '--crop-y': `${((state.progress.value - .5) * 2 * settings.crop * depth * strength).toFixed(3)}px`,
          '--title-x': `${(-speed * 9 * depth).toFixed(3)}px`,
          '--field': Math.min(Math.abs(speed), 1).toFixed(4),
        };
        for (const [name, value] of Object.entries(properties)) element.style.setProperty(name, value);
      });
      return busy || time - state.time < 70;
    },
  });
  useEffect(() => { wake(); }, [intensity, wake]);

  return <section ref={section} id="spatial" className="lab-experiment lab-spatial" aria-labelledby="spatial-heading" data-still={reduced || intensity === 0}>
    <div className="lab-spatial-sticky">
      <ExperimentHeader index={2} intensity={intensity} onIntensity={setIntensity}/>
      <div ref={stage} className="lab-stage"><div className="lab-gallery">{labProjects.map((project, index) => <ProjectUnit key={project.number} project={project} linkRef={element => { links.current[index] = element; }}/>)}</div></div>
    </div>
  </section>;
}
