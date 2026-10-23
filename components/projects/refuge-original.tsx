'use client';
import { publicPath } from '@/lib/public-path';
import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { useLanguage } from '@/components/layout/language-provider';
import pages from '@/data/refuge-original.json';
import './refuge-original.css';

export type SourcePage = {
  page:number; width:number; height:number; src:string;
  text:{en:string;zh:string;x:number;y:number;size:number;matrix:number[];width:number;bold:boolean;color:number[];sans?:boolean;blockHeight?:number}[];
};
function SourceComposition({ page }: { page: SourcePage }) {
  const { language } = useLanguage();
  const [zoom, setZoom] = useState(false);
  const composition = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const node = composition.current;
    if (!node) return;
    const fit = () => {
      node.querySelectorAll<HTMLElement>('.refuge-source-line').forEach(line => {
        const text = line.firstElementChild as HTMLElement;
        text.style.transform = 'none';
        if (line.classList.contains('is-block')) {
          const base = parseFloat(getComputedStyle(line).fontSize);
          text.style.fontSize = `${base}px`;
          if (text.scrollHeight > line.clientHeight) text.style.fontSize = `${base * Math.max(.65,line.clientHeight / text.scrollHeight)}px`;
        } else text.style.transform = `scaleX(${Math.min(1,line.clientWidth / Math.max(1,text.scrollWidth))})`;
      });
    };
    const observer = new ResizeObserver(fit); observer.observe(node); fit();
    return () => observer.disconnect();
  }, [language, zoom]);
  return <section className={`refuge-source-page${zoom ? ' is-zoomed' : ''}`} id={`pdf-${page.page}`}>
    <button type="button" className="refuge-page-zoom" onClick={() => setZoom(!zoom)} aria-pressed={zoom} aria-label={language === 'zh' ? '缩放图组' : 'Zoom composition'}>{zoom ? '−' : '+'}</button>
    <div className="refuge-source-scroll">
      <div ref={composition} className="refuge-source-composition section-media" style={{aspectRatio:`${page.width}/${page.height}`}}>
        <img className="refuge-source-drawing" src={publicPath(page.src)} width={Math.round(page.width*3)} height={Math.round(page.height*3)} alt="" loading="lazy" />
        {page.text.map((entry,index) => {
          const row = entry as typeof entry & {blockHeight?:number};
          const color = row.color.length === 1 ? Array(3).fill(row.color[0]) : row.color.length === 4 ? row.color.slice(0,3).map(c=>(1-c)*(1-row.color[3])) : row.color.slice(0,3);
          const style = {
            left:`${row.x/page.width*100}%`,top:`${row.y/page.height*100}%`,
            width:`${row.width/page.width*100}%`,
            fontSize:`${row.size/page.width*100}cqw`,
            color:`rgb(${color.map(n=>Math.round(n*255)).join(' ')})`,
            fontWeight:row.bold?700:400,
            ...(row.sans ? {fontFamily:'Arial, "Microsoft YaHei", sans-serif'} : {}),
            transform:`matrix(${[...row.matrix,0,0].join(',')}) translateY(-.8em)`,
            ...(row.blockHeight ? {height:`${row.blockHeight/page.width*100}cqw`} : {}),
          } as CSSProperties;
          return <span key={index} className={`refuge-source-line${row.blockHeight?' is-block':''}`} style={style}><span>{row[language]}</span></span>;
        })}
      </div>
    </div>
  </section>;
}
export function RefugeOriginal() {
  return <OriginalCompositions pages={pages} />;
}
export function OriginalCompositions({pages}:{pages:SourcePage[]}) {
  useLayoutEffect(() => {
    const page = pages.find(page => `#pdf-${page.page}` === location.hash);
    if (page) document.getElementById(`pdf-${page.page}`)?.scrollIntoView({block:'start'});
  }, [pages]);
  return <div className="refuge-source-sequence">{pages.map(page=><SourceComposition key={page.page} page={page}/>)}</div>;
}
