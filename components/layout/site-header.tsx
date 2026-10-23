'use client';
import Link from 'next/link';
import { routePath } from '@/lib/public-path';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useLanguage } from './language-provider';
import { copy, site } from '@/data/site';

export function SiteHeader() {
  const path = routePath(usePathname());
  const { language, setLanguage, t } = useLanguage();
  const [pastHero, setPastHero] = useState(false);
  useEffect(() => {
    const check = () => {
      const heroHeight = document.querySelector<HTMLElement>('.showreel')?.offsetHeight ?? window.innerHeight;
      setPastHero(path !== '/' || window.scrollY >= heroHeight - 80);
    };
    check();
    window.addEventListener('scroll', check, { passive: true });
    return () => window.removeEventListener('scroll', check);
  }, [path]);
  const hidden = path === '/' && !pastHero;
  return <>
    <a className="skip-link" href="#main">{t(copy.skip)}</a>
    <header className={`site-header ${hidden ? 'header-hidden' : ''}`} inert={hidden}>
      <Link href="/" className="identity" aria-label={`${site.name} — ${t(copy.home)}`}>{site.name}<span className="identity-dot" /></Link>
      <nav aria-label={language === 'en' ? 'Main navigation' : '主导航'}>
        <div className="language-switch" aria-label={language === 'en' ? 'Language' : '语言'}>
          <button lang="en" aria-pressed={language === 'en'} onClick={() => setLanguage('en')}>EN</button><span aria-hidden="true">·</span><button lang="zh-CN" aria-pressed={language === 'zh'} onClick={() => setLanguage('zh')}>中文</button>
        </div>
        <Link href="/about" aria-current={path === '/about' ? 'page' : undefined}>{t(copy.about)}</Link>
        <Link href="/projects" aria-current={path.startsWith('/projects') ? 'page' : undefined}>{t(copy.projects)}<span className="nav-count">09</span></Link>
      </nav>
    </header>
  </>;
}
