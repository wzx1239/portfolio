'use client';
import { useEffect, useState, type RefObject } from 'react';

// Attach media URLs only once they are close enough to be needed.
export function useNearViewport<T extends Element>(root: RefObject<T | null>) {
  const [near, setNear] = useState(false);
  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        setNear(true);
        observer.disconnect();
      }
    }, { rootMargin: '400px 0px' });
    observer.observe(node);
    return () => observer.disconnect();
  }, [root]);
  return near;
}
