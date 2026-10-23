import type { TraceField } from './trace-memory';
import { traceSettings } from './trace-settings';

/** One bounded SVG image, not a DOM particle tree. Decoded only while memory changes. */
export function traceMask(fields:TraceField[],rect:{left:number;top:number;width:number;height:number},strength:number,full:number) {
  const paths=fields.map(f=>{
    const ax=f.ax+f.driftX-rect.left,ay=f.ay+f.driftY-rect.top;
    const bx=f.bx+f.driftX-rect.left,by=f.by+f.driftY-rect.top;
    const dx=bx-ax,dy=by-ay,length=Math.hypot(dx,dy)||1,ux=dx/length,uy=dy/length;
    const points=Array.from({length:16},(_,i)=>{
      const a=i*Math.PI/8,c=Math.cos(a),s=Math.sin(a);
      const [h3,h5,h7]=traceSettings.shape;
      const edge=1+h3*Math.sin(a*3+f.seed)+h5*Math.cos(a*5-f.seed)+h7*Math.sin(a*7);
      const r=f.radius*edge,ex=c>0?bx:ax,ey=c>0?by:ay;
      return [ex+(ux*c-uy*s)*r,ey+(uy*c+ux*s)*r];
    });
    const n=(v:number)=>v.toFixed(1),mid=(a:number[],b:number[])=>`${n((a[0]+b[0])/2)} ${n((a[1]+b[1])/2)}`;
    let d=`M${mid(points[15],points[0])}`;
    for(let i=0;i<16;i++)d+=`Q${n(points[i][0])} ${n(points[i][1])} ${mid(points[i],points[(i+1)%16])}`;
    return `<path d="${d}Z" opacity="${Math.min(1,f.strength*strength).toFixed(3)}"/>`;
  }).join('');
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${Math.ceil(rect.width)}" height="${Math.ceil(rect.height)}" viewBox="0 0 ${rect.width} ${rect.height}"><defs><filter id="s" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${Math.min(9,rect.width*.025).toFixed(1)}"/></filter></defs><rect width="100%" height="100%" fill="white" opacity="${full.toFixed(3)}"/><g fill="white" filter="url(#s)">${paths}</g></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}
