'use client';
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { routePath } from '@/lib/public-path';
import './trace-loading.css';

export type TraceEntry = { number: string; title: string; path: string };
type Phase = 'boot' | 'cover' | 'waiting' | 'ready' | 'reveal' | 'off';
type Loader = { phase: Phase; discover: boolean; cover: boolean; title: string; number: string };
const positions = [[13,23],[42,16],[76,25],[26,44],[59,40],[83,56],[15,70],[42,78],[68,68],[82,84]];
const storageKey = 'portfolio-trace-navigation';

export function TraceLoading({ entries }: { entries: TraceEntry[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const root = useRef<HTMLDivElement>(null);
  const target = useRef<string | null>(null);
  const [loader, setLoader] = useState<Loader>({ phase:'boot', discover:true, cover:false, title:'', number:'' });
  const [found, setFound] = useState<number[]>([]);
  const foundRef = useRef(new Set<number>());
  const [pulses, setPulses] = useState<{ id:number; x:number; y:number; radius:number }[]>([]);
  const frames = useRef(new Set<number>());
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const down = useRef<{x:number;y:number} | null>(null);
  const active = loader.phase !== 'off';

  useEffect(() => {
    const mode = document.documentElement.dataset.traceEntry;
    target.current = routePath(location.pathname);
    if (mode === 'off') { setLoader(s=>({...s,phase:'off'})); return; }
    let pending: { x?:number; y?:number } | null = null;
    try { pending=JSON.parse(sessionStorage.getItem(storageKey)||'null'); sessionStorage.removeItem(storageKey); } catch {}
    const entry = entries.find(e=>e.path===target.current);
    root.current?.style.setProperty('--trace-origin-x', `${pending?.x ?? innerWidth/2}px`);
    root.current?.style.setProperty('--trace-origin-y', `${pending?.y ?? innerHeight/2}px`);
    setLoader({phase:'waiting',discover:mode!=='route',cover:false,title:entry?.title||'',number:entry?.number||''});
  }, [entries]);

  // Capture real, unmodified same-origin route activations before Link handlers.
  // Hash navigation, downloads and modified/new-tab clicks retain their behavior.
  useEffect(() => {
    function navigate(event: MouseEvent) {
      if(event.defaultPrevented || event.button!==0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor=(event.target as Element)?.closest<HTMLAnchorElement>('a[href]');
      if(!anchor || anchor.hasAttribute('download') || (anchor.target && anchor.target!=='_self') || anchor.closest('.trace-loader')) return;
      const url=new URL(anchor.href,location.href);
      if(url.origin!==location.origin || !/^https?:$/.test(url.protocol) || url.pathname===location.pathname) return;
      const base=process.env.NEXT_PUBLIC_BASE_PATH||'';
      if(base && url.pathname!==base && !url.pathname.startsWith(base+'/')) return;
      event.preventDefault();
      const path=routePath(url.pathname);
      const entry=entries.find(e=>e.path===path);
      const x=event.detail ? event.clientX : innerWidth/2, y=event.detail ? event.clientY : innerHeight/2;
      target.current=path;
      root.current?.style.setProperty('--trace-origin-x',`${x}px`);
      root.current?.style.setProperty('--trace-origin-y',`${y}px`);
      setLoader({phase:'cover',discover:false,cover:true,title:entry?.title || (path==='/'?'':path==='/projects'?'Projects':path==='/about'?'About':''),number:entry?.number||''});
      if(process.env.NEXT_PUBLIC_STATIC_EXPORT==='1') {
        try { sessionStorage.setItem(storageKey,JSON.stringify({href:url.href,x,y,at:Date.now()})); } catch {}
        location.assign(url.href);
      } else router.push(path+url.search+url.hash,{scroll:true});
    }
    function historyNavigation() {
      const path=routePath(location.pathname),entry=entries.find(e=>e.path===path);
      target.current=path;
      root.current?.style.setProperty('--trace-origin-x',`${innerWidth/2}px`);
      root.current?.style.setProperty('--trace-origin-y',`${innerHeight/2}px`);
      setLoader({phase:'cover',discover:false,cover:true,title:entry?.title||'',number:entry?.number||''});
    }
    document.addEventListener('click',navigate,true);
    window.addEventListener('popstate',historyNavigation);
    return ()=>{document.removeEventListener('click',navigate,true);window.removeEventListener('popstate',historyNavigation);};
  }, [entries,router]);

  // LOADING is delayed on route changes, while navigation itself starts at once.
  useEffect(() => {
    if(loader.phase!=='cover') return;
    const timer=setTimeout(()=>setLoader(s=>s.phase==='cover'?{...s,phase:'waiting'}:s),180);
    return ()=>clearTimeout(timer);
  }, [loader.phase]);

  useEffect(() => {
    if(!['cover','waiting'].includes(loader.phase) || routePath(pathname)!==target.current) return;
    let cancelled=false, checking=false;
    const cleanImages: (()=>void)[]=[];
    const observers=new MutationObserver(check);
    function check() {
      if(cancelled || checking || document.readyState==='loading') return;
      const path=target.current;
      const entry=entries.find(e=>e.path===path);
      const main=entry ? document.querySelector(`main[data-project-slug="${path!.split('/').pop()}"]`) : path==='/' ? document.querySelector('#main .ticket-scroll-sequence') : path==='/projects' ? document.querySelector('#main #projects') : document.querySelector('main:not([data-route-pending])');
      if(!main || document.querySelector('main[data-route-pending]')) return;
      checking=true;
      // Only existing critical still images. Never wait for/play/preload videos,
      // hidden Passport stamps, below-fold images, or YouTube players.
      const images=Array.from(document.querySelectorAll<HTMLImageElement>('main .ticket-preview-shell:first-child img,main .project-hero img,main img[loading="eager"],main img[fetchpriority="high"]'));
      Promise.all(images.map(image=>new Promise<void>(resolve=>{
        if(image.complete) { resolve(); return; }
        const done=()=>{image.removeEventListener('load',done);image.removeEventListener('error',done);resolve();};
        cleanImages.push(()=>{image.removeEventListener('load',done);image.removeEventListener('error',done);});
        image.addEventListener('load',done,{once:true});image.addEventListener('error',done,{once:true});
      }))).then(()=>{if(!cancelled)setLoader(s=>({...s,phase:'ready'}));});
    }
    observers.observe(document.body,{childList:true,subtree:true});
    document.addEventListener('readystatechange',check);
    check();
    return ()=>{cancelled=true;observers.disconnect();document.removeEventListener('readystatechange',check);cleanImages.forEach(fn=>fn());};
  }, [pathname,loader.phase,entries]);

  useEffect(()=>{
    if(loader.phase!=='ready' && loader.phase!=='reveal')return;
    const timer=setTimeout(()=>setLoader(s=>({...s,phase:s.phase==='ready'?'reveal':'off'})),loader.phase==='ready'?400:280);
    return()=>clearTimeout(timer);
  },[loader.phase]);
  useEffect(()=>{
    if(!['cover','waiting'].includes(loader.phase))return;
    // Failed routes/images must never trap visitors over the site's error UI.
    const timer=setTimeout(()=>setLoader(s=>({...s,phase:'off'})),15000);
    return()=>clearTimeout(timer);
  },[loader.phase]);

  useEffect(()=>{
    if(!active)return;
    const previous=document.activeElement as HTMLElement|null;
    // A modal focus boundary avoids mutating route elements before their own
    // streamed hydration has committed.
    root.current?.focus({preventScroll:true});
    const containFocus=(e:FocusEvent)=>{if(root.current&&!root.current.contains(e.target as Node))root.current.focus({preventScroll:true});};
    document.addEventListener('focusin',containFocus);
    const prevent=(e:WheelEvent)=>e.preventDefault();
    const node=root.current;node?.addEventListener('wheel',prevent,{passive:false});
    return()=>{node?.removeEventListener('wheel',prevent);document.removeEventListener('focusin',containFocus);if(previous?.isConnected)previous.focus({preventScroll:true});};
  },[active]);
  useEffect(()=>{if(loader.phase==='off'){frames.current.forEach(cancelAnimationFrame);frames.current.clear();clearTimeout(fadeTimer.current);setPulses([]);}},[loader.phase]);
  useEffect(()=>()=>{frames.current.forEach(cancelAnimationFrame);clearTimeout(fadeTimer.current);},[]);

  function items(){return Array.from(root.current?.querySelectorAll<HTMLElement>('.trace-discovery-item')||[]);}
  function discover(node:HTMLElement,index:number,strength:number){
    node.style.opacity=String(Math.max(strength,foundRef.current.has(index) ? .13 : 0));
    if(strength>.12 && !foundRef.current.has(index)){foundRef.current.add(index);setFound([...foundRef.current]);}
  }
  function residual(){items().forEach((node,i)=>node.style.opacity=foundRef.current.has(i)?'.13':'0');}
  function explore(event:PointerEvent){
    if(!loader.discover)return;
    const x=event.clientX,y=event.clientY,radius=Math.max(95,Math.min(innerWidth,innerHeight)*.18);
    items().forEach((node,i)=>{const r=node.getBoundingClientRect();const distance=Math.hypot(x-(r.left+r.width/2),y-(r.top+r.height/2));discover(node,i,Math.max(0,1-distance/radius));});
    clearTimeout(fadeTimer.current);fadeTimer.current=setTimeout(residual,300);
  }
  function pulse(x:number,y:number){
    if(!loader.discover)return;
    const radius=Math.hypot(innerWidth,innerHeight),id=Date.now();
    frames.current.forEach(cancelAnimationFrame);frames.current.clear();
    setPulses([{id,x,y,radius}]);
    const start=performance.now(),nodes=items(),reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    function tick(now:number){
      const p=reduced?1:Math.min(1,(now-start)/650),wave=radius*p;
      nodes.forEach((node,i)=>{const r=node.getBoundingClientRect();if(Math.hypot(x-r.left-r.width/2,y-r.top-r.height/2)<=wave)discover(node,i,.85);});
      if(p<1){const frame=requestAnimationFrame(time=>{frames.current.delete(frame);tick(time);});frames.current.add(frame);}else {setPulses(p=>p.filter(pulse=>pulse.id!==id));clearTimeout(fadeTimer.current);fadeTimer.current=setTimeout(residual,180);}
    }
    tick(start);
  }
  const traces=[...entries,{number:'10',title:'FUTURE',path:''}];
  return <div ref={root} className="trace-loader" data-phase={loader.phase} data-discovery={loader.discover} data-cover={loader.cover} tabIndex={-1} role="dialog" aria-modal={active} aria-label="Trace loading" hidden={loader.phase==='off'} onKeyDown={e=>{if(['Tab',' ','ArrowDown','ArrowUp','PageDown','PageUp','Home','End'].includes(e.key))e.preventDefault();}} onPointerMove={explore} onPointerLeave={residual} onPointerDown={e=>{down.current={x:e.clientX,y:e.clientY};}} onPointerCancel={()=>{down.current=null;residual();}} onPointerUp={e=>{if(down.current&&Math.hypot(e.clientX-down.current.x,e.clientY-down.current.y)<12)pulse(e.clientX,e.clientY);down.current=null;}}>
    <div className="trace-discovery" aria-hidden="true">{traces.map((entry,i)=><div key={entry.number} className="trace-discovery-item" style={{left:`${positions[i][0]}%`,top:`${positions[i][1]}%`}}><span>{entry.number}</span><p>{entry.title}</p>{i===9&&<small>DESTINATION UNKNOWN</small>}</div>)}</div>
    {pulses.map(p=><div key={p.id} className="trace-loading-pulse" aria-hidden="true" style={{left:p.x,top:p.y,width:p.radius*2,height:p.radius*2}}/>)}
    <div className="trace-loading-instructions"><p>MOVE TO EXPLORE</p><p>CLICK TO TRACE</p><p>TRACES {String(found.filter(i=>i<9).length).padStart(2,'0')} / 09</p></div>
    <div className="trace-loading-destination">{loader.number&&<span>{loader.number}</span>}{loader.title&&<p>{loader.title}</p>}</div>
    <p className="trace-loading-status" role="status" aria-live="polite">{loader.phase==='ready'||loader.phase==='reveal'?'READY':loader.discover||loader.phase==='waiting'?'LOADING':''}</p>
  </div>;
}
