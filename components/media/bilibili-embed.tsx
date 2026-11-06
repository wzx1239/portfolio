'use client';
import { useEffect, useRef, useState } from 'react';

export function BilibiliEmbed({ videoId, title }: { videoId: string; title: string }) {
  const root = useRef<HTMLDivElement>(null);
  const [nearViewport, setNearViewport] = useState(false);
  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        setNearViewport(true);
        observer.disconnect();
      }
    }, { rootMargin: '400px 0px' });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <div ref={root} className="bilibili-embed section-media">
    {nearViewport && <iframe data-trace-frame-ready="false" onLoad={event=>{event.currentTarget.dataset.traceFrameReady='true';}} onError={event=>{event.currentTarget.dataset.traceFrameReady='true';}} src={`https://player.bilibili.com/player.html?bvid=${videoId}&page=1&autoplay=0`} title={title} loading="lazy" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />}
  </div>;
}
