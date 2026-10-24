'use client';
import Link from 'next/link';
import { Media } from '@/components/media/media';
import { Reveal } from '@/components/motion/reveal';
import { useLanguage } from '@/components/layout/language-provider';
import { copy } from '@/data/site';
import type { Section } from '@/lib/types';
import { TraceShowcase } from './trace-showcase';
import { YouTubeEmbed } from '@/components/media/youtube-embed';

export function ContentSection({ section, projectSlug }: { section: Section; projectSlug: string }) {
  const { t } = useLanguage();
  return <section id={section.id} className={`content-section section-${section.kind} page-gutter${section.fullWidth ? ' section-full-width' : ''}${section.steps ? ' section-mechanic' : ''}${section.items ? ' section-compact-list' : ''}`}>
    <Reveal className="section-heading">{section.eyebrow && <p className="mono eyebrow">{t(section.eyebrow)}</p>}<div><h2>{t(section.title)}</h2>{section.body && <p>{t(section.body)}</p>}{section.deepDiveSlug && <Link className="text-link" href={`/projects/${projectSlug}/deep-dive/${section.deepDiveSlug}`}>{t(copy.deepDive)} →</Link>}</div></Reveal>
    {section.youtube ? <YouTubeEmbed videoId={section.youtube} title={t(section.title)} /> : section.media && <Reveal><Media asset={section.media} className="section-media" label sizes="(max-width: 700px) 100vw, 90vw" /></Reveal>}
    {section.steps && <TraceShowcase steps={section.steps} label={section.title} />}
    {section.items && <ol className="implementation-list">{section.items.map(item => <li key={item.number}><span className="mono implementation-number">{item.number}</span><div><h3>{t(item.title)}</h3><p>{t(item.body)}</p></div></li>)}</ol>}
    {section.kind === 'technical' && !section.media && <div className="technical-placeholder"><div className="technical-lines" aria-hidden="true"><span/><i/><span/><i/><span/></div><p className="mono">{t(copy.technical)}</p></div>}
  </section>;
}
