'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { routePath } from '@/lib/public-path';
import { publishTrace, subscribeTrace } from './trace-input';
import { TraceMemory } from './trace-memory';
import { traceSettings as settings } from './trace-settings';
import { vertexSource, fragmentSource } from './trace-shaders';
import './digital-surface.css';

const clamp = (v:number, low=0, high=1) => Math.max(low,Math.min(high,v));

export function DigitalSurface() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [enabled, setEnabled] = useState(false);
  const path = routePath(usePathname());
  useEffect(() => {
    const mode = matchMedia('(min-width:901px) and (hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)');
    const change = () => setEnabled(mode.matches);
    change(); mode.addEventListener('change',change);
    return () => mode.removeEventListener('change',change);
  }, []);
  // Input remains available to Reveal even when the ambient GPU is unavailable.
  useEffect(() => {
    if(!enabled)return;
    let previous:{x:number;y:number;time:number}|null=null,velocity=0;
    const move=(event:PointerEvent)=>{
      if(event.pointerType==='touch')return;
      const time=performance.now(),dt=previous?time-previous.time:0;
      const instant=previous && dt<180?Math.hypot(event.clientX-previous.x,event.clientY-previous.y)/Math.max(dt,4):0;
      velocity=dt<180?velocity*.45+instant*.55:0;
      publishTrace({x:event.clientX,y:event.clientY,time,speed:clamp(velocity/settings.velocitySensitivity),target:event.target instanceof Element?event.target:null});
      previous={x:event.clientX,y:event.clientY,time};
    };
    const leave=()=>{previous=null;velocity=0;publishTrace({x:-10000,y:-10000,speed:0,time:performance.now()});};
    window.addEventListener('pointermove',move,{passive:true});window.addEventListener('blur',leave);document.documentElement.addEventListener('pointerleave',leave);
    return()=>{window.removeEventListener('pointermove',move);window.removeEventListener('blur',leave);document.documentElement.removeEventListener('pointerleave',leave);leave();};
  },[enabled]);
  useEffect(() => {
    const node=canvas.current;
    if (!node || !enabled) return;
    const gl=node.getContext('webgl',{alpha:false,antialias:false,depth:false,stencil:false,powerPreference:'low-power',preserveDrawingBuffer:false});
    if (!gl) { node.dataset.state='unsupported'; return; }
    function compile(kind:number,source:string) {
      const shader=gl!.createShader(kind);
      if (!shader) return null;
      gl!.shaderSource(shader,source);gl!.compileShader(shader);
      if (!gl!.getShaderParameter(shader,gl!.COMPILE_STATUS)) { gl!.deleteShader(shader); return null; }
      return shader;
    }
    const vertex=compile(gl.VERTEX_SHADER,vertexSource),fragment=compile(gl.FRAGMENT_SHADER,fragmentSource);
    if (!vertex || !fragment) { if(vertex)gl.deleteShader(vertex);if(fragment)gl.deleteShader(fragment);node.dataset.state='unsupported';return; }
    const program=gl.createProgram();
    if (!program) { gl.deleteShader(vertex);gl.deleteShader(fragment);return; }
    gl.attachShader(program,vertex);gl.attachShader(program,fragment);gl.linkProgram(program);
    if (!gl.getProgramParameter(program,gl.LINK_STATUS)) {gl.deleteProgram(program);gl.deleteShader(vertex);gl.deleteShader(fragment);node.dataset.state='unsupported';return;}
    gl.useProgram(program);
    const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
    const attribute=gl.getAttribLocation(program,'aPosition');gl.enableVertexAttribArray(attribute);gl.vertexAttribPointer(attribute,2,gl.FLOAT,false,0,0);
    const uniforms={viewport:gl.getUniformLocation(program,'uViewport'),base:gl.getUniformLocation(program,'uBase'),surface:gl.getUniformLocation(program,'uSurface'),environment:gl.getUniformLocation(program,'uEnvironment'),strength:gl.getUniformLocation(program,'uStrength'),refraction:gl.getUniformLocation(program,'uRefraction'),tone:gl.getUniformLocation(program,'uTraceTone'),traces:gl.getUniformLocation(program,'uTraces[0]'),motion:gl.getUniformLocation(program,'uMotion[0]')};
    const memory=new TraceMemory();
    const traces=new Float32Array(settings.maxTraces*4),motion=new Float32Array(settings.maxTraces*4);
    let raf=0,lastFrame=0,disposed=false,lost=false,width=innerWidth,height=innerHeight;
    let x=-10000,y=-10000,paper:HTMLElement|null=null,tilt=0;
    let mediaCoverage=0,bookCoverage=0,scrollY=window.scrollY,material=1,darkness=1,context=1;
    const home=document.querySelector<HTMLElement>('.home-passport');
    const coverage=new Map<Element,number>();
    const books=()=>Array.from(document.querySelectorAll<HTMLElement>('.record-spread[data-paper-ready="true"]'));
    const mediaObserver=new IntersectionObserver(entries=>{
      for(const entry of entries)coverage.set(entry.target,entry.intersectionRect.width*entry.intersectionRect.height);
      let mediaArea=0,bookArea=0;
      for(const [element,area] of coverage) { if(element.matches('.record-spread'))bookArea+=area;else mediaArea+=area; }
      mediaCoverage=clamp(mediaArea/(width*height));bookCoverage=clamp(bookArea/(width*height));wake();
    },{threshold:[0,.15,.3,.5,.7,.9,1]});
    const observed=new Set<Element>();
    const observeMedia=()=>{document.querySelectorAll('.project-hero-media,.section-media,.showreel-media,.record-spread').forEach(media=>{if(!observed.has(media)){observed.add(media);mediaObserver.observe(media);}});};
    const mutations=new MutationObserver(observeMedia);mutations.observe(document.body,{childList:true,subtree:true});observeMedia();
    function setState(state:string){if(node!.dataset.state!==state)node!.dataset.state=state;}
    function resize(){
      width=innerWidth;height=innerHeight;
      const scale=Math.min(settings.renderScale,Math.sqrt(settings.maxPixels/(width*height)));
      node!.width=Math.round(width*scale);node!.height=Math.round(height*scale);gl!.viewport(0,0,node!.width,node!.height);
      gl!.uniform2f(uniforms.viewport,width,height);
      const css=getComputedStyle(document.documentElement),number=(key:string,fallback:number)=>{const raw=css.getPropertyValue(key).trim();return raw && Number.isFinite(Number(raw))?Number(raw):fallback;};
      gl!.uniform3f(uniforms.base,number('--digital-r',23)/255,number('--digital-g',26)/255,number('--digital-b',33)/255);
      gl!.uniform3f(uniforms.surface,number('--digital-grain',.016),number('--digital-variation',.027),number('--digital-cool',.006));
      gl!.uniform1f(uniforms.refraction,settings.refraction);gl!.uniform1f(uniforms.tone,settings.tonalStrength);
      wake();
    }
    function draw(now:number){
      raf=0;if(disposed||lost||document.hidden)return;
      if(now-lastFrame<1000/settings.maxFPS){raf=requestAnimationFrame(draw);return;}lastFrame=now;
      let active=false;traces.fill(0);motion.fill(0);
      const fields=memory.read(now);
      for(let i=0;i<fields.length;i++){
        const d=fields[i];active=true;
        const dx=d.bx-d.ax,dy=d.by-d.ay,length=Math.hypot(dx,dy)||1;
        const stretch=d.speed*settings.stretch*d.radius*.35;
        traces.set([d.ax+d.driftX-dx/length*stretch,d.ay+d.driftY-dy/length*stretch,d.bx+d.driftX,d.by+d.driftY],i*4);
        motion.set([d.radius,d.strength,d.age,d.seed],i*4);
      }
      // A tiny independent rotate property leaves the existing scroll transform untouched.
      const target=paper?clamp((y-paper.getBoundingClientRect().top)/paper.offsetHeight-.5,-.5,.5)*settings.paperTilt*2:0;
      tilt+=(target-tilt)*.25;if(Math.abs(target-tilt)>.002)active=true;
      for(const book of books()){
        book.style.setProperty('--paper-rx',`${tilt.toFixed(3)}deg`);
        if(book===paper){const rect=book.getBoundingClientRect();book.style.setProperty('--paper-light-x',`${clamp((x-rect.left)/rect.width)*100}%`);book.style.setProperty('--paper-light-y',`${clamp((y-rect.top)/rect.height)*100}%`);}
      }
      const mediaWeight=clamp((mediaCoverage-.2)/.55),bookWeight=clamp(bookCoverage/.55);
      const opening=home?clamp(Number(home.style.getPropertyValue('--passport-open'))||0):1;
      const targetMaterial=(path.startsWith('/projects/') ? .72 : 1)-mediaWeight*.3-bookWeight*opening*.18;
      const targetDarkness=1-mediaWeight*.05+bookWeight*(1-opening)*.015;
      const targetContext=(path.startsWith('/projects/')?settings.projectIntensity:1)*(1-(1-settings.mediaIntensity)*mediaWeight)*(1-bookWeight*opening*.2);
      // A short, quiet settle between page states; no perpetual ambient animation.
      const ease=1-Math.exp(-Math.min(1000/settings.maxFPS,50)/420);
      material+=(targetMaterial-material)*ease;darkness+=(targetDarkness-darkness)*ease;context+=(targetContext-context)*ease;
      if(Math.abs(targetMaterial-material)>.001 || Math.abs(targetDarkness-darkness)>.001 || Math.abs(targetContext-context)>.001)active=true;
      gl!.uniform2f(uniforms.environment,material,darkness);
      gl!.uniform1f(uniforms.strength,settings.intensity*context);gl!.uniform4fv(uniforms.traces,traces);gl!.uniform4fv(uniforms.motion,motion);gl!.drawArrays(gl!.TRIANGLES,0,6);
      node!.dataset.ready='true';setState(active?'running':'idle');
      if(active)raf=requestAnimationFrame(draw);
    }
    function wake(){if(!raf&&!disposed&&!lost&&!document.hidden)raf=requestAnimationFrame(draw);}
    const unsubscribe=subscribeTrace(sample=>{
      x=sample.x;y=sample.y;
      const target=sample.target;
      paper=target?.closest<HTMLElement>('.record-spread[data-paper-ready="true"]')??null;
      const overContent=Boolean(target?.closest('.media,.record-spread,.reveal-project,.site-header'));
      memory.add(sample,overContent ? .04 : 1);
      wake();
    });
    const scroll=()=>{const delta=window.scrollY-scrollY;scrollY=window.scrollY;memory.translate(0,-delta);paper=null;wake();};
    const visibility=()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;memory.clear();paper=null;}else{memory.clear();wake();}};
    const contextLost=(event:Event)=>{event.preventDefault();lost=true;cancelAnimationFrame(raf);raf=0;node!.dataset.ready='false';setState('unsupported');};
    window.addEventListener('resize',resize);window.addEventListener('scroll',scroll,{passive:true});document.addEventListener('visibilitychange',visibility);node.addEventListener('webglcontextlost',contextLost);
    resize();
    return()=>{
      disposed=true;cancelAnimationFrame(raf);mediaObserver.disconnect();mutations.disconnect();
      unsubscribe();window.removeEventListener('resize',resize);window.removeEventListener('scroll',scroll);document.removeEventListener('visibilitychange',visibility);node.removeEventListener('webglcontextlost',contextLost);
      for(const book of books()){book.style.removeProperty('--paper-rx');book.style.removeProperty('--paper-light-x');book.style.removeProperty('--paper-light-y');}
      node.dataset.ready='false';setState('disabled');gl.deleteBuffer(buffer);gl.deleteProgram(program);gl.deleteShader(vertex);gl.deleteShader(fragment);
    };
  },[enabled,path]);
  return <canvas ref={canvas} className="digital-trace-surface" aria-hidden="true" data-state="disabled" />;
}
