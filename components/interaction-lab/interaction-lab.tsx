'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useLanguage } from '@/components/layout/language-provider';
import { experiments, labCopy } from './data';
import { MagneticGallery } from './magnetic-gallery';
import { RevealGallery } from './reveal-gallery';
import { SpatialGallery } from './spatial-gallery';

export function InteractionLab() {
  const { language, setLanguage, t } = useLanguage();
  const reduced = useReducedMotion();
  const [active, setActive] = useState('');
  useEffect(() => {
    const nodes = experiments.map(experiment => document.getElementById(experiment.id));
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
    }, { rootMargin: '-20% 0px -65% 0px', threshold: 0 });
    nodes.forEach(node => { if (node) observer.observe(node); });
    return () => observer.disconnect();
  }, []);

  return <main id="main" className="interaction-lab">
    <header className="lab-topbar"><Link className="lab-home-link" href="/">← {t(labCopy.back)}</Link><a className="lab-topbar-title" href="#lab-intro">{t(labCopy.title)}</a><nav aria-label={language === 'en' ? 'Lab experiments' : '实验导航'}>{experiments.map(experiment => <a key={experiment.id} href={`#${experiment.id}`} aria-current={active === experiment.id ? 'location' : undefined} aria-label={`${experiment.letter} / ${t(experiment.title)}`}>{experiment.letter}</a>)}</nav><div className="lab-language"><button lang="en" aria-pressed={language === 'en'} onClick={() => setLanguage('en')}>EN</button><span>·</span><button lang="zh-CN" aria-pressed={language === 'zh'} onClick={() => setLanguage('zh')}>中文</button></div></header>
    <section id="lab-intro" className="lab-intro"><p className="lab-kicker">{t(labCopy.draft)}</p><h1>{t(labCopy.title)}</h1><div className="lab-intro-copy"><h2>{t(labCopy.intro)}</h2><p>{t(labCopy.description)}</p></div><div className="lab-jump-list">{experiments.map(experiment => <a key={experiment.id} href={`#${experiment.id}`}><span>{experiment.letter}</span><span>{t(experiment.title)}</span><span aria-hidden="true">↘</span></a>)}</div><p className="lab-access-note">{t(reduced ? labCopy.reduced : labCopy.touch)}</p></section>
    <MagneticGallery />
    <RevealGallery />
    <SpatialGallery />
    <footer className="lab-footer"><p>{t(labCopy.end)}</p><div>{experiments.map(experiment => <a key={experiment.id} href={`#${experiment.id}`}>{experiment.letter} ↗</a>)}</div><Link href="/">← {t(labCopy.back)}</Link></footer>
  </main>;
}
