// Observe the already-mounted destination. Do not create requests, preload media,
// change video playback, or consider resources outside the current viewport.
export function watchInitialViewport(getMain: () => HTMLElement | null, onState: (ready: boolean) => void) {
  let disposed = false, frame = 0, lastCheck = 0, interval = 32;
  let previous = '', stableFrames = 0, reported: boolean | undefined;
  const decoded = new WeakMap<HTMLImageElement, { src: string; ready: boolean }>();
  const ids = new WeakMap<Element, number>();
  let nextId = 0;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  function id(node: Element) { if(!ids.has(node)) ids.set(node,++nextId); return ids.get(node); }
  function visible(node: HTMLElement, main: HTMLElement) {
    const r=node.getBoundingClientRect();
    if(r.width<=0 || r.height<=0 || r.bottom<=0 || r.right<=0 || r.top>=innerHeight || r.left>=innerWidth)return false;
    for(let current:HTMLElement|null=node;current;current=current.parentElement){
      const style=getComputedStyle(current);
      if(current.hidden || style.display==='none' || style.visibility==='hidden' || style.visibility==='collapse' || Number(style.opacity)<.01)return false;
      if(current===main)break;
    }
    return true;
  }
  function imageReady(image: HTMLImageElement) {
    if(!image.complete || image.naturalWidth===0)return false;
    const src=image.currentSrc||image.src;
    let record=decoded.get(image);
    if(!record || record.src!==src){
      record={src,ready:false};decoded.set(image,record);
      const current=record;
      if(typeof image.decode==='function') {
        void image.decode().then(()=>{current.ready=true;wake();},()=>{
          // Some browsers reject decode() for an already usable vector/frame.
          // Broken images (zero natural dimensions) never count as ready.
          current.ready=image.complete&&image.naturalWidth>0;wake();
        });
      }else current.ready=true;
    }
    return record.ready;
  }
  function report(value:boolean){if(reported!==value){reported=value;onState(value);}}
  function stylesheetReady(){return Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')).every(link=>link.disabled || (link.media && !matchMedia(link.media).matches) || Boolean(link.sheet));}
  function rect(node:Element){const r=node.getBoundingClientRect();return [r.x,r.y,r.width,r.height].map(n=>Math.round(n*2)/2).join(',');}
  function check(now:number){
    frame=0;
    if(disposed)return;
    if(document.hidden || now-lastCheck<interval){schedule();return;}
    lastCheck=now;
    const main=getMain();
    if(!main || document.readyState==='loading' || !stylesheetReady()){
      stableFrames=0;previous='';report(false);interval=100;schedule();return;
    }
    const images=Array.from(main.querySelectorAll<HTMLImageElement>('img')).filter(node=>visible(node,main));
    const videos=Array.from(main.querySelectorAll<HTMLVideoElement>('video')).filter(node=>visible(node,main));
    const embeds=Array.from(main.querySelectorAll<HTMLIFrameElement>('iframe[data-trace-frame-ready]')).filter(node=>visible(node,main));
    const text=Array.from(main.querySelectorAll<HTMLElement>('h1,h2,p,dt,dd')).filter(node=>visible(node,main)).slice(0,24);
    const imageStates=images.map(imageReady);
    let resources=imageStates.every(Boolean);
    for(const video of videos){
      if(video.readyState>=2)continue; // A decoded current frame, not just metadata.
      const poster=video.closest('.media')?.querySelector<HTMLImageElement>('img');
      const canShowPoster=video.paused && (video.controls || reduced.matches) && poster && imageReady(poster);
      if(!canShowPoster)resources=false;
    }
    if(embeds.some(frame=>frame.dataset.traceFrameReady!=='true'))resources=false;
    if(document.fonts){
      for(const node of [main,...text]){
        const style=getComputedStyle(node);
        try{if(!document.fonts.check(`${style.fontWeight} ${style.fontSize} ${style.fontFamily}`,node.textContent?.slice(0,24)||'A'))resources=false;}catch{/* System-font shorthands may be non-serializable. */}
      }
    }
    const signature=[innerWidth,innerHeight,rect(main).split(',').slice(0,2).join(','),...images.map(n=>`${id(n)}:${n.currentSrc||n.src}:${rect(n)}`),...videos.map(n=>`${id(n)}:${n.currentSrc||n.src}:${rect(n)}`),...embeds.map(n=>`${id(n)}:${n.src}:${rect(n)}`),...text.map(n=>`${id(n)}:${rect(n)}:${getComputedStyle(n).fontSize}`)].join('|');
    if(!resources){stableFrames=0;previous=signature;report(false);interval=100;}
    else {
      if(signature===previous)stableFrames++;else{stableFrames=0;previous=signature;report(false);}
      interval=32;
      if(stableFrames>=3)report(true);
    }
    schedule();
  }
  function schedule(){if(!disposed&&!frame)frame=requestAnimationFrame(check);}
  function wake(){lastCheck=0;interval=32;schedule();}
  const mutation=new MutationObserver(records=>{if(records.some(record=>!(record.target instanceof Element && record.target.closest('.trace-loader'))))wake();});
  mutation.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['src','srcset','class','style','hidden','data-trace-mounted','data-trace-frame-ready']});
  document.addEventListener('load',wake,true);document.addEventListener('error',wake,true);
  document.addEventListener('loadeddata',wake,true);document.addEventListener('visibilitychange',wake);
  window.addEventListener('resize',wake);window.addEventListener('scroll',wake,{passive:true});
  schedule();
  return()=>{
    disposed=true;cancelAnimationFrame(frame);mutation.disconnect();
    document.removeEventListener('load',wake,true);document.removeEventListener('error',wake,true);
    document.removeEventListener('loadeddata',wake,true);document.removeEventListener('visibilitychange',wake);
    window.removeEventListener('resize',wake);window.removeEventListener('scroll',wake);
  };
}
