import { traceSettings as settings } from './trace-settings';
import type { TraceInput } from './trace-input';

export type TraceSegment = { ax:number; ay:number; bx:number; by:number; born:number; life:number; energy:number; width:number; speed:number; seed:number };
export type TraceField = TraceSegment & { age:number; strength:number; radius:number; driftX:number; driftY:number };
const clamp=(n:number)=>Math.max(0,Math.min(1,n));

/** Bounded connected path, shared by the GPU surface and project masks. */
export class TraceMemory {
  segments:TraceSegment[]=[];
  private anchor:TraceInput|null=null;
  private tip:TraceSegment|null=null;
  private sequence=0;
  add(sample:TraceInput, intensity=1, width=settings.size as number) {
    if(sample.x < -1000 || sample.y < -1000) { this.anchor=null; this.tip=null; return; }
    const previous=this.anchor;
    if(!previous || sample.time-previous.time>180) { this.anchor=sample; this.tip=null; return; }
    const distance=Math.hypot(sample.x-previous.x,sample.y-previous.y);
    if(distance<.4) return; // A stationary pointer never replenishes the field.
    const power=clamp(sample.speed);
    if(!this.tip || sample.time-this.tip.born>=settings.sampleInterval) {
      this.tip={ax:previous.x,ay:previous.y,bx:sample.x,by:sample.y,born:sample.time,
        life:settings.decay+(settings.fastDecay-settings.decay)*power,
        energy:Math.pow(power,1.25)*intensity,width:width*(.72+power*.35),speed:power,seed:(this.sequence++%37)*.93};
      this.segments.push(this.tip);
      if(this.segments.length>settings.maxTraces)this.segments.shift();
    } else {
      // Extend a continuous segment rather than stamping separated pointer dots.
      this.tip.bx=sample.x;this.tip.by=sample.y;
      this.tip.energy=Math.max(this.tip.energy,Math.pow(power,1.25)*intensity);
    }
    this.anchor=sample;
  }
  read(now:number):TraceField[] {
    this.segments=this.segments.filter(s=>now-s.born<s.life);
    return this.segments.map(s=>{
      const age=clamp((now-s.born)/s.life),length=Math.hypot(s.bx-s.ax,s.by-s.ay)||1;
      const drift=(1-Math.exp(-age*5))*s.speed*settings.inertia;
      return {...s,age,strength:s.energy*Math.pow(1-age,1.45),radius:s.width*(1+settings.diffusion*age),driftX:(s.bx-s.ax)/length*drift,driftY:(s.by-s.ay)/length*drift};
    });
  }
  translate(dx:number,dy:number) {
    for(const s of this.segments){s.ax+=dx;s.bx+=dx;s.ay+=dy;s.by+=dy;}
    if(this.anchor){this.anchor={...this.anchor,x:this.anchor.x+dx,y:this.anchor.y+dy};}
  }
  clear(){this.segments=[];this.anchor=null;this.tip=null;}
}
