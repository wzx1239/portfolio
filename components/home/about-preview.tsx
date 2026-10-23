'use client';
import Link from 'next/link';
import { useLanguage } from '@/components/layout/language-provider';
import { Reveal } from '@/components/motion/reveal';
import { copy, site } from '@/data/site';
export function AboutPreview() {
  const { t } = useLanguage();
  return <section className="about-preview page-gutter" id="introduction" aria-labelledby="intro-heading">
    <Reveal className="preview-grid"><span className="eyebrow">{t(copy.previewEyebrow)}</span>
      <div className="preview-copy"><Link href="/about" className="positioning-link"><h2 id="intro-heading"><span>{t(site.displayName)}</span><span className="positioning-arrow" aria-hidden="true">↗</span></h2><span className="intro-rule" aria-hidden="true" /></Link><div className="preview-meta"><Link href="/about" className="text-link">{t(copy.meet)} ↗</Link></div></div>
    </Reveal>
  </section>;
}
