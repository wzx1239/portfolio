'use client';
import { useEffect, useRef, type ReactNode } from 'react';
import './ticket-scroll-sequence.css';

export const ticketCollectionMotion = {
  scrollViewports: 2.6,
  holdViewports: .25,
  collectStart: .15,
  enterStart: .20, enterEnd: .65,
  openStart: .20, openEnd: .88,
  occlusionStart: .40,
  visibleFraction: .18,
  pocketY: .52,
  rimReveal: 90,
  lowerReveal: 24,
  // This is the existing passport presentation scale, never a ticket scale.
  passportScale: .75,
  stack: [[-5,-38,-.6],[-2,27,.5],[4,-19,-.4],[6,44,.7],[-4,-48,-.7],[2,12,.4],[7,-29,-.3],[-6,53,.6],[0,-5,-.5],[-2,17,.4]],
  // Individual departure, arrival, curve exponent and downward path bend.
  timing: [[.15,.74,.90,36],[.18,.82,1.1,62],[.16,.78,1.05,45],[.21,.88,.9,76],[.17,.85,1.2,58],[.19,.92,.95,86],[.22,.95,1.15,68],[.16,.90,1.1,98],[.20,1,.95,80],[.23,1,1.08,72]],
};

export function TicketScrollSequence({ children, passport }: { children: ReactNode; passport: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const sequence = root.current;
    const field = sequence?.querySelector<HTMLElement>('.ticket-collection');
    if (!sequence || !field) return;
    const book = sequence.querySelector<HTMLElement>('.record-spread');
    const passportLayer = sequence.querySelector<HTMLElement>('.collection-passport');
    const tickets = Array.from(field.querySelectorAll<HTMLElement>('.ticket-preview-shell'));
    const preference = matchMedia('(prefers-reduced-motion: reduce), (max-width: 1000px)');
    let frame = 0;
    let lastProgress = -1;
    let geometry: { x: number; y: number; lean: number }[] = [];
    let pocket = { shift: 0, top: 0, bottom: 0 };
    const clamp = (p: number) => Math.max(0, Math.min(1, p));
    const smooth = (p: number) => p * p * (3 - 2 * p);
    function measure() {
      if (!sequence || !field || !book || !passportLayer) return;
      const stage = field.parentElement!;
      const fieldRect = field.getBoundingClientRect();
      const stageRect = stage.getBoundingClientRect();
      // Untransformed offsets keep resize measurements independent of scroll.
      let x = 0, y = 0;
      let node: HTMLElement | null = book;
      while (node && node !== passportLayer) { x += node.offsetLeft; y += node.offsetTop; node = node.offsetParent as HTMLElement | null; }
      const bookScale = ticketCollectionMotion.passportScale;
      const bookWidth = book.offsetWidth * bookScale;
      const bookHeight = book.offsetHeight * bookScale;
      const bookLeft = passportLayer.offsetLeft + x * bookScale;
      const bookTop = stageRect.height * (1 - bookScale) / 2 + y * bookScale;
      const shift = stageRect.width / 2 - (bookLeft + bookWidth / 2);
      pocket = { shift, top: Math.max(0, bookTop - ticketCollectionMotion.rimReveal), bottom: Math.max(0, stageRect.height - bookTop - bookHeight - ticketCollectionMotion.lowerReveal) };
      geometry = tickets.map((ticket, i) => {
        const [dx,dy] = ticketCollectionMotion.stack[i];
        // Tuck behind the right edge of the Project Index leaf.
        const targetX = bookLeft + shift + bookWidth - ticket.offsetWidth * (.5 - ticketCollectionMotion.visibleFraction) + dx;
        const targetY = bookTop + bookHeight * ticketCollectionMotion.pocketY + dy;
        return {
          x: stageRect.left + targetX - fieldRect.left - ticket.offsetLeft - ticket.offsetWidth / 2,
          y: stageRect.top + targetY - fieldRect.top - ticket.offsetTop - ticket.offsetHeight / 2,
          lean: parseFloat(getComputedStyle(ticket).getPropertyValue('--ticket-lean')) || 0,
        };
      });
      lastProgress = -1;
      draw();
    }
    function draw() {
      frame = 0;
      if (!sequence) return;
      // Passport fully open is the sole endpoint for every animated property.
      // Keep the ticket state reached here; do not force any ticket to its target.
      const progress = preference.matches ? ticketCollectionMotion.openEnd : Math.min(ticketCollectionMotion.openEnd, clamp(-sequence.getBoundingClientRect().top / (innerHeight * ticketCollectionMotion.scrollViewports)));
      // Once the endpoint is reached, later scroll events cannot rewrite any
      // ticket transform. Reverse scrolling resumes the same timeline.
      if (progress === lastProgress) return;
      lastProgress = progress;
      const phase = (start: number, end: number) => clamp((progress - start) / (end - start));
      const arrival = smooth(phase(ticketCollectionMotion.enterStart, ticketCollectionMotion.enterEnd));
      const opening = smooth(phase(ticketCollectionMotion.openStart, ticketCollectionMotion.openEnd));
      const center = preference.matches ? 0 : smooth(phase(.20,.90));
      sequence.dataset.collecting = String(progress > ticketCollectionMotion.collectStart);
      sequence.dataset.inserting = String(progress >= ticketCollectionMotion.occlusionStart);
      sequence.style.setProperty('--collection-progress', String(progress));
      sequence.style.setProperty('--passport-arrive', String(arrival));
      sequence.style.setProperty('--passport-open', String(opening));
      sequence.style.setProperty('--passport-center-x', `${pocket.shift * center}px`);
      // Storage aperture clips only the tickets at the holder's top/bottom.
      // The opaque original passport leaves provide the front/side occlusion.
      const aperture = preference.matches ? 0 : smooth(phase(.70,1));
      sequence.style.setProperty('--pocket-clip-top', `${pocket.top * aperture}px`);
      sequence.style.setProperty('--pocket-clip-bottom', `${pocket.bottom * aperture}px`);
      if (passportLayer) { passportLayer.inert = opening < .999; passportLayer.style.visibility = arrival > 0 ? 'visible' : 'hidden'; }
      if (book) book.inert = opening < .999;
      tickets.forEach((ticket, i) => {
        const item = geometry[i];
        if (!item) return;
        const [start, finish, exponent, bend] = ticketCollectionMotion.timing[i];
        const local = clamp((progress - start) / (finish - start));
        const travel = smooth(Math.pow(local, exponent));
        const arc = Math.sin(Math.PI * travel) * bend;
        ticket.style.setProperty('--collection-x', `${item.x * travel}px`);
        ticket.style.setProperty('--collection-y', `${item.y * travel + arc}px`);
        ticket.style.setProperty('--ticket-current-lean', `${item.lean + (ticketCollectionMotion.stack[i][2] - item.lean) * smooth(local)}deg`);
      });
    }
    function wake() { if (!frame) frame = requestAnimationFrame(draw); }
    const resize = new ResizeObserver(measure);
    resize.observe(field);
    if (book) resize.observe(book);
    window.addEventListener('scroll', wake, { passive: true });
    window.addEventListener('resize', measure);
    preference.addEventListener('change', measure);
    measure();
    if (window.location.hash === '#about') {
      const top = preference.matches && passportLayer ? window.scrollY + passportLayer.getBoundingClientRect().top - 80 : window.scrollY + sequence.getBoundingClientRect().top + innerHeight * ticketCollectionMotion.scrollViewports * ticketCollectionMotion.openEnd + 2;
      window.scrollTo({ top, behavior: 'instant' });
      wake();
    }
    return () => { cancelAnimationFrame(frame); resize.disconnect(); window.removeEventListener('scroll', wake); window.removeEventListener('resize', measure); preference.removeEventListener('change', measure); };
  }, []);
  return <div ref={root} className="ticket-scroll-sequence" data-about-scroll={ticketCollectionMotion.scrollViewports * ticketCollectionMotion.openEnd} style={{ '--collection-scroll': `${ticketCollectionMotion.scrollViewports * ticketCollectionMotion.openEnd * 100}svh`, '--collection-hold': `${ticketCollectionMotion.holdViewports * 100}svh` } as React.CSSProperties}><div className="ticket-scroll-stage">{children}<section id="introduction" className="collection-passport home-passport" data-animated="true" style={{ '--passport-angle-max': '178deg', '--passport-lift': '9deg', '--passport-perspective': '2400px' } as React.CSSProperties}><div className="passport-stage">{passport}</div></section></div></div>;
}
