'use client';
import { useEffect, useState, type RefObject } from 'react';

export function usePassportMedia(root: RefObject<HTMLElement | null>, embedded: boolean) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const sequence = embedded ? node.closest<HTMLElement>('.ticket-scroll-sequence') : null;
    if (sequence) {
      // Hidden book images must follow the actual animation, not their layout
      // rectangles: the book already occupies the sticky viewport while hidden.
      const observer = new MutationObserver(check);
      function check() {
        const progress = Number(sequence!.style.getPropertyValue('--collection-progress'));
        if (progress >= Number(sequence!.dataset.passportLoadAt || .16)) {
          setReady(true);
          observer.disconnect();
        }
      }
      observer.observe(sequence, { attributes: true, attributeFilter: ['style'] });
      check();
      return () => observer.disconnect();
    }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { setReady(true); observer.disconnect(); }
    }, { rootMargin: '400px 0px' });
    observer.observe(node);
    return () => observer.disconnect();
  }, [root, embedded]);
  return ready;
}
