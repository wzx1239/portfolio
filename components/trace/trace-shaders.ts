import { traceSettings as settings } from './trace-settings';
export const vertexSource = `attribute vec2 aPosition; varying vec2 vUv;
void main(){vUv=aPosition*.5+.5;gl_Position=vec4(aPosition,0.,1.);}`;
export const fragmentSource = `
precision highp float;
varying vec2 vUv;
uniform vec2 uViewport;
uniform vec3 uBase;
uniform vec3 uSurface; // grain, broad variation, cool undertone
uniform vec2 uEnvironment; // material visibility, darkness
uniform float uStrength;
uniform float uRefraction;
uniform float uTraceTone;
uniform vec3 uTraceColour;
uniform vec4 uTraces[${settings.maxTraces}]; // connected segment endpoints
uniform vec4 uMotion[${settings.maxTraces}]; // radius, strength, age, seed
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.)),f.x),f.y);}
vec3 surface(vec2 p){
 float tone=(noise(p*.0023)*.65+noise(p*.0061+19.)*.35-.5)*uSurface.y;
 float grain=(hash(floor(p*1.15))-.5)*uSurface.x;
 float cool=(noise(p*.0014+vec2(43.,71.))-.5)*uSurface.z;
 return uBase*uEnvironment.y+(vec3(tone+grain)+vec3(.28,.15,1.)*cool)*uEnvironment.x;
}
void main(){
 vec2 pixel=vec2(vUv.x,1.-vUv.y)*uViewport;
 vec2 displacement=vec2(0.);float residue=0.;
 for(int i=0;i<${settings.maxTraces};i++){
  vec4 t=uTraces[i];vec4 m=uMotion[i];
  if(m.y>.0001 && all(lessThan(abs(pixel-(t.xy+t.zw)*.5),abs(t.zw-t.xy)*.5+vec2(m.x*1.8)))){
   vec2 axis=t.zw-t.xy;float len=max(length(axis),.01);vec2 dir=axis/len;
   float along=clamp(dot(pixel-t.xy,dir)/len,0.,1.);
   vec2 q=(pixel-mix(t.xy,t.zw,along))/max(m.x,1.);
   q=vec2(dot(q,dir),dot(q,vec2(-dir.y,dir.x)));
   float a=atan(q.y,q.x);
   float edge=1.+${settings.shape[0]}*sin(a*3.+m.w)+${settings.shape[1]}*cos(a*5.-m.w)+${settings.shape[2]}*sin(a*7.);
   float mask=1.-smoothstep(.06,1.34,length(q)/edge);
   float field=mask*m.y;
   vec2 flow=vec2(noise(pixel*.014+vec2(m.w,m.z))-.5,noise(pixel*.011+13.+m.z)-.5);
   displacement+=(flow*.85+dir*.7)*field*uRefraction;
   residue+=field*(noise(pixel*.017+flow+m.z)-.5);
  }
 }
 vec3 base=surface(pixel+displacement*uStrength);
 // Small signed tonal changes read as refraction, never a luminous brush/outline.
 base+=uTraceColour*(residue/(1.+abs(residue))*uTraceTone*uStrength);
 gl_FragColor=vec4(base,1.);
}`;
