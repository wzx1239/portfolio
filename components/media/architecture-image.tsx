'use client';
import { useRef, useState } from 'react';
import { useNearViewport } from './use-near-viewport';
import { publicPath } from '@/lib/public-path';
import manifest from '@/data/architecture-image-performance.json';
export const architectureImages = manifest as Record<string,{src:string;width:number;height:number;variants:{src:string;width:number}[];blur:string}>;
export function ArchitectureImage({src,alt='',className='',priority=false,sizes='100vw',onReady}:{src:string;alt?:string;className?:string;priority?:boolean;sizes?:string;onReady?:()=>void}) {
 const root=useRef<HTMLSpanElement>(null);const near=useNearViewport(root);const [loaded,setLoaded]=useState(false);const image=architectureImages[src];const load=priority||near;
 return <span ref={root} className={`architecture-image ${className}`}>
  <img className="architecture-image-blur" src={image.blur} alt="" aria-hidden="true" style={{opacity:loaded?0:1}} />
  {load&&<img src={publicPath(image.src)} srcSet={image.variants.map(v=>`${publicPath(v.src)} ${v.width}w`).join(', ')} sizes={sizes} width={image.width} height={image.height} alt={alt} loading="eager" fetchPriority={priority?'high':'auto'} decoding="async" onLoad={()=>{setLoaded(true);onReady?.();}} style={{opacity:loaded?1:0}} />}
 </span>;
}
