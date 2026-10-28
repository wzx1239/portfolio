'use client';
import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { routePath } from '@/lib/public-path';
import './trace-loading.css';

export type TraceEntry = { number: string; title: string; path: string };
type Phase = 'boot' | 'pending' | 'waiting' | 'ready' | 'reveal' | 'off';
type Loader = { phase: Phase; id: number };
const positions = [[13,23],[42,16],[76,25],[26,44],[59,40],[83,56],[15,70],[42,78],[68,68],[82,84]];
const storageKey = 'portfolio-trace-navigation';
const noticeableWait = 180;

export function TraceLoading({ entries }: { entries: TraceEntry[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const root = useRef<HTMLDivElement>(null);
  const target = useRef<string | null>(null);
  const startedAt = useRef(0);
  const [loader, setLoader] = useState<Loader>({ phase:'boot', id:0 });
  const residualMarks = useRef(new Set<number>());
  const [pulses, setPulses] = useState<{ id:number; x:number; y:number; radius:number }[]>([]);
  const frames = useRef(new Set<number>());
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const down = useRef<{x:number;y:number} | null>(null);
  const active = loader.phase !== 'off' && loader.phase !== 'pending';

  useEffect(() => {
    const mode = document.documentElement.dataset.traceEntry;
    target.current = routePath(location.pathname);
    if (mode === 'off') { setLoader({phase:'off',id:1}); return; }
    let pending: { x?:number; y?:number; at?:number } | null = null;
    try { pending=JSON.parse(sessionStorage.getItem(storageKey)||'null'); sessionStorage.removeItem(storageKey); } catch {}
    root.current?.style.setProperty('--trace-origin-x', `${pending?.x ?? innerWidth/2}px`);
    root.current?.style.setProperty('--trace-origin-y', `${pending?.y ?? innerHeight/2}px`);
    startedAt.current = mode==='route' && pending?.at ? pending.at : Date.now();
    setLoader({phase:mode==='route' && Date.now()-startedAt.current<noticeableWait?'pending':'waiting',id:1});
  }, [entries]);

  useEffect(() => {
    function begin(path:string,x:number,y:number) {
      target.current=path;
      startedAt.current=Date.now();
      root.current?.style.setProperty('--trace-origin-x',`${x}px`);
      root.current?.style.setProperty('--trace-origin-y',`${y}px`);
      // Pending is invisible and non-modal. Fast navigation never shows a
      // miniature loader, READY interstitial or artificial navigation delay.
      setLoader(s=>({phase:'pending',id:s.id+1}));
    }
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
      const x=event.detail ? event.clientX : innerWidth/2, y=event.detail ? event.clientY : innerHeight/2;
      begin(path,x,y);
      if(process.env.NEXT_PUBLIC_STATIC_EXPORT==='1') {
        try { sessionStorage.setItem(storageKey,JSON.stringify({href:url.href,x,y,at:startedAt.current})); } catch {}
        location.assign(url.href);
      } else router.push(path+url.search+url.hash,{scroll:true});
    }
    const historyNavigation=()=>begin(routePath(location.pathname),innerWidth/2,innerHeight/2);
    document.addEventListener('click',navigate,true);
    window.addEventListener('popstate',historyNavigation);
    return ()=>{document.removeEventListener('click',navigate,true);window.removeEventListener('popstate',historyNavigation);};
  }, [router]);

  useEffect(() => {
    if(loader.phase!=='pending') return;
    const timer=setTimeout(()=>setLoader(s=>s.id===loader.id && s.phase==='pending'?{...s,phase:'waiting'}:s),Math.max(0,noticeableWait-(Date.now()-startedAt.current)));
    return ()=>clearTimeout(timer);
  }, [loader.phase,loader.id]);

  useEffect(() => {
    if(!['pending','waiting'].includes(loader.phase) || routePath(pathname)!==target.current) return;
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
      // Wait only for already-requested critical stills. This never attaches a
      // video, hidden Passport stamp URL, YouTube iframe or new image request.
      const images=Array.from(document.querySelectorAll<HTMLImageElement>('main .ticket-preview-shell:first-child img,main .project-hero img,main img[loading="eager"],main img[fetchpriority="high"]'));
      Promise.all(images.map(image=>new Promise<void>(resolve=>{
        if(image.complete) { resolve(); return; }
        const done=()=>{image.removeEventListener('load',done);image.removeEventListener('error',done);resolve();};
        cleanImages.push(()=>{image.removeEventListener('load',done);image.removeEventListener('error',done);});
        image.addEventListener('load',done,{once:true});image.addEventListener('error',done,{once:true});
      }))).then(()=>{
        if(!cancelled)setLoader(s=>s.id!==loader.id?s:{...s,phase:s.phase==='pending'?'off':'ready'});
      });
    }
    observers.observe(document.body,{childList:true,subtree:true});
    document.addEventListener('readystatechange',check);
    check();
    return ()=>{cancelled=true;observers.disconnect();document.removeEventListener('readystatechange',check);cleanImages.forEach(fn=>fn());};
  }, [pathname,loader.phase,loader.id,entries]);

  useEffect(()=>{
    if(loader.phase!=='ready' && loader.phase!=='reveal')return;
    const timer=setTimeout(()=>setLoader(s=>s.id===loader.id?{...s,phase:s.phase==='ready'?'reveal':'off'}:s),loader.phase==='ready'?400:280);
    return()=>clearTimeout(timer);
  },[loader.phase,loader.id]);
  useEffect(()=>{
    if(!['pending','waiting'].includes(loader.phase))return;
    const timer=setTimeout(()=>setLoader(s=>s.id===loader.id?{...s,phase:'off'}:s),15000);
    return()=>clearTimeout(timer);
  },[loader.phase,loader.id]);

  useEffect(()=>{
    if(!active)return;
    const previous=document.activeElement as HTMLElement|null;
    root.current?.focus({preventScroll:true});
    const containFocus=(e:FocusEvent)=>{if(root.current&&!root.current.contains(e.target as Node))root.current.focus({preventScroll:true});};
    document.addEventListener('focusin',containFocus);
    const prevent=(e:WheelEvent)=>e.preventDefault();
    const node=root.current;node?.addEventListener('wheel',prevent,{passive:false});
    return()=>{node?.removeEventListener('wheel',prevent);document.removeEventListener('focusin',containFocus);if(previous?.isConnected)previous.focus({preventScroll:true});};
  },[active]);
  useEffect(()=>{
    if(!['waiting','off'].includes(loader.phase))return;
    frames.current.forEach(cancelAnimationFrame);frames.current.clear();clearTimeout(fadeTimer.current);setPulses([]);
    if(loader.phase==='waiting'){residualMarks.current.clear();items().forEach(node=>node.style.opacity='0');}
  },[loader.phase,loader.id]);
  useEffect(()=>()=>{frames.current.forEach(cancelAnimationFrame);clearTimeout(fadeTimer.current);},[]);

  function items(){return Array.from(root.current?.querySelectorAll<HTMLElement>('.trace-discovery-item')||[]);}
  function discover(node:HTMLElement,index:number,strength:number){
    node.style.opacity=String(Math.max(strength,residualMarks.current.has(index) ? .13 : 0));
    if(strength>.12)residualMarks.current.add(index);
  }
  function residual(){items().forEach((node,i)=>node.style.opacity=residualMarks.current.has(i)?'.13':'0');}
  function explore(event:PointerEvent){
    if(!active)return;
    const x=event.clientX,y=event.clientY,radius=Math.max(95,Math.min(innerWidth,innerHeight)*.18);
    items().forEach((node,i)=>{const r=node.getBoundingClientRect();const distance=Math.hypot(x-(r.left+r.width/2),y-(r.top+r.height/2));discover(node,i,Math.max(0,1-distance/radius));});
    clearTimeout(fadeTimer.current);fadeTimer.current=setTimeout(residual,300);
  }
  function pulse(x:number,y:number){
    if(!active)return;
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
  return <div ref={root} className="trace-loader" data-phase={loader.phase} tabIndex={-1} role="dialog" aria-modal={active} aria-label="Trace loading" hidden={!active} onKeyDown={e=>{if(['Tab',' ','ArrowDown','ArrowUp','PageDown','PageUp','Home','End'].includes(e.key))e.preventDefault();}} onPointerMove={explore} onPointerLeave={residual} onPointerDown={e=>{down.current={x:e.clientX,y:e.clientY};}} onPointerCancel={()=>{down.current=null;residual();}} onPointerUp={e=>{if(down.current&&Math.hypot(e.clientX-down.current.x,e.clientY-down.current.y)<12)pulse(e.clientX,e.clientY);down.current=null;}}>
    <div className="trace-discovery" aria-hidden="true">{traces.map((entry,i)=><div key={entry.number} className="trace-discovery-item" style={{left:`${positions[i][0]}%`,top:`${positions[i][1]}%`}}><span>{entry.number}</span><p>{entry.title}</p>{i===9&&<small>DESTINATION UNKNOWN</small>}</div>)}</div>
    {pulses.map(p=><div key={p.id} className="trace-loading-pulse" aria-hidden="true" style={{left:p.x,top:p.y,width:p.radius*2,height:p.radius*2}}/>)}
    <p className="trace-loading-status" role="status" aria-live="polite">{loader.phase==='ready'||loader.phase==='reveal'?'READY':'LOADING'}</p>
  </div>;
}
