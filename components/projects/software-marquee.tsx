'use client';
import type { CSSProperties } from 'react';
import { useLanguage } from '@/components/layout/language-provider';
import { softwareLogos, softwareLogoPath } from '@/data/software';
import './software-marquee.css';

export function SoftwareMarquee({ software = [] }: { software?: string[] }) {
  const { language } = useLanguage();
  const logos = [...new Set(software)].flatMap(name => softwareLogos[name] ? [{ name, ...softwareLogos[name] }] : []);
  if (!logos.length) return null;
  // Each identical half exceeds the viewport; -50% is exactly one repeat period.
  const repeats = Math.ceil(8 / logos.length);
  return <section className="software-marquee" aria-label={language === 'zh' ? '使用软件' : 'Software used'}>
    <h2 className="software-marquee-heading page-gutter mono eyebrow">{language === 'zh' ? '使用工具' : 'TOOLS USED'}</h2>
    <div className="software-marquee-track">
      {[0, 1].map(copy => <div key={copy} className="software-marquee-group" aria-hidden={copy === 1 || undefined}>
        {Array.from({ length: repeats }, (_, cycle) => logos.map(logo => <span key={`${cycle}-${logo.name}`} className="software-marquee-item" aria-hidden={cycle > 0 || undefined}>
          <span className="software-marquee-logo" role="img" aria-label={logo.name} style={{ '--software-mask': `url('${softwareLogoPath(logo.file)}')`, '--software-scale': logo.scale } as CSSProperties} />
          <span className="software-marquee-name" aria-hidden="true">{logo.name}</span>
        </span>))}
      </div>)}
    </div>
  </section>;
}
