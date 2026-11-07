'use client';
import { useEffect, useRef, useState } from 'react';
import { publicPath } from '@/lib/public-path';
import manifest from '@/data/architecture-image-performance.json';
export const architectureImages = manifest as Record<string,{src:string;width:number;height:number;variants:{src:string;width:number}[]}>;
export function ArchitectureImage({src,alt='',className='',priority=false,sizes='100vw',fullResolution=false,onReady}:{src:string;alt?:string;className?:string;priority?:boolean;sizes?:string;fullResolution?:boolean;onReady?:()=>void}) {
 const root=useRef<HTMLSpanElement>(null);const [near,setNear]=useState(false);const [wide,setWide]=useState(false);const image=architectureImages[src];
 useEffect(()=>{
  const node=root.current;if(!node)return;
  const resize=new ResizeObserver(()=>setWide(node.getBoundingClientRect().width>1600));resize.observe(node);
  // Start the next composition before it enters view; do not queue the whole page.
  const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){setNear(true);observer.disconnect();}},{rootMargin:'1000px 0px'});observer.observe(node);
  return()=>{resize.disconnect();observer.disconnect();};
 },[]);
 // Avoid jumping from 1600px to a 3500px original solely due to display scaling.
 // Zoom and genuinely wide compositions retain the original-resolution candidate.
 const variants=image.variants.filter(v=>v.width<=1600||fullResolution||wide);
 const fallback=variants[variants.length-1];
 return <span ref={root} className={`architecture-image ${className}`}>
  {(priority||near)&&<img src={publicPath(fallback.src)} srcSet={variants.map(v=>`${publicPath(v.src)} ${v.width}w`).join(', ')} sizes={sizes} width={image.width} height={image.height} alt={alt} loading="eager" fetchPriority={priority?'high':'auto'} decoding="async" onLoad={onReady} />}
 </span>;
}
