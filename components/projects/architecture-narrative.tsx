'use client';
import { publicPath } from '@/lib/public-path';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/components/layout/language-provider';
import type { ArchitectureSection, ArchitectureVisual } from '@/lib/types';
import './architecture-narrative.css';

export function ArchitectureNarrative({ sections }: { sections: ArchitectureSection[] }) {
  const { t, language } = useLanguage();
  const [expanded, setExpanded] = useState<ArchitectureVisual | null>(null);
  const [actualSize, setActualSize] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const el = dialog.current;
    if (expanded && el && !el.open) el.showModal();
    if (!expanded && el?.open) el.close();
  }, [expanded]);
  return <div className="architecture-narrative">
    {sections.map((section, index) => <section key={section.id} id={section.id} className={`architecture-section architecture-${section.layout} page-gutter`}>
      <header className="architecture-heading">
        <span className="architecture-chapter mono">{String(index + 1).padStart(2,'0')}</span>
        <div><h2>{t(section.title)}</h2>
          {section.paragraphs?.map((paragraph,i) => <p key={i}>{t(paragraph)}</p>)}
        </div>
      </header>
      {section.facts && <dl className="architecture-facts">{section.facts.map((fact,i) => <div key={i}><dt>{t(fact.label)}</dt><dd>{t(fact.value)}</dd></div>)}</dl>}
      <div className="architecture-visuals">
        {section.visuals.map((visual,i) => <figure key={visual.src} className="architecture-figure section-media">
          <button type="button" className="architecture-inspect" onClick={() => { setActualSize(false); setExpanded(visual); }} aria-label={`${language === 'zh' ? '放大查看' : 'Enlarge'}: ${t(visual.caption)}`} aria-haspopup="dialog">
            <Image src={publicPath(visual.src)!} width={visual.width} height={visual.height} alt={t(visual.caption)} sizes={section.layout === 'pair' ? '(max-width: 800px) 100vw, 48vw' : '100vw'} loading="lazy" />
            <span className="architecture-enlarge" aria-hidden="true">↗</span>
          </button>
          <figcaption><span className="mono">{String(i + 1).padStart(2,'0')}</span>{t(visual.caption)}</figcaption>
        </figure>)}
      </div>
    </section>)}
    <dialog ref={dialog} className="architecture-lightbox" onCancel={() => setExpanded(null)} onClose={() => setExpanded(null)} aria-label={language === 'zh' ? '图纸详情' : 'Drawing detail'}>
      {expanded && <>
        <div className="architecture-lightbox-toolbar"><p>{t(expanded.caption)}</p><button type="button" aria-pressed={actualSize} onClick={() => setActualSize(!actualSize)}>{actualSize ? (language === 'zh' ? '适应窗口' : 'Fit to window') : (language === 'zh' ? '原始尺寸' : 'Actual size')}</button><button type="button" onClick={() => setExpanded(null)} aria-label={language === 'zh' ? '关闭' : 'Close'}>{language === 'zh' ? '关闭' : 'Close'} ×</button></div>
        <div className={`architecture-lightbox-scroll${actualSize ? ' is-actual' : ''}`}><img src={publicPath(expanded.src)} width={expanded.width} height={expanded.height} alt={t(expanded.caption)} /></div>
      </>}
    </dialog>
  </div>;
}
