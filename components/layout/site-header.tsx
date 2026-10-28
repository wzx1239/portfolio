'use client';
import Link from 'next/link';
import { routePath } from '@/lib/public-path';
import { usePathname } from 'next/navigation';
import { useEffect, useState, type MouseEvent } from 'react';
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
  function scrollHome(event: MouseEvent<HTMLAnchorElement>, destination: 'home' | 'about') {
    if (path !== '/' || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    window.history.replaceState(window.history.state, '', event.currentTarget.href);
    const sequence = document.querySelector<HTMLElement>('.ticket-scroll-sequence');
    const simplified = matchMedia('(prefers-reduced-motion: reduce), (max-width: 1000px)').matches;
    const passport = sequence?.querySelector<HTMLElement>('.collection-passport');
    const top = destination === 'home' || !sequence ? 0 : simplified && passport ? window.scrollY + passport.getBoundingClientRect().top - 80 : window.scrollY + sequence.getBoundingClientRect().top + window.innerHeight * Number(sequence.dataset.aboutScroll || 0) + 2;
    window.scrollTo({ top, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }
  const hidden = path === '/' && !pastHero;
  return <>
    <a className="skip-link" href="#main">{t(copy.skip)}</a>
    <header className={`site-header ${hidden ? 'header-hidden' : ''}`} inert={hidden}>
      <Link href="/" onClick={event => scrollHome(event, 'home')} className="identity" aria-label={`${site.name} — ${t(copy.home)}`}>{site.name}<span className="identity-dot" /></Link>
      <nav aria-label={language === 'en' ? 'Main navigation' : '主导航'}>
        <Link href="/" onClick={event => scrollHome(event, 'home')}>{t(copy.home)}</Link>
        <Link href="/projects" aria-current={path.startsWith('/projects') ? 'page' : undefined}>{t(copy.projects)}<span className="nav-count">09</span></Link>
        <Link href="/#about" onClick={event => scrollHome(event, 'about')}>{t(copy.about)}</Link>
        <div className="language-switch" aria-label={language === 'en' ? 'Language' : '语言'}>
          <button lang="en" aria-pressed={language === 'en'} onClick={() => setLanguage('en')}>EN</button><span aria-hidden="true">/</span><button lang="zh-CN" aria-pressed={language === 'zh'} onClick={() => setLanguage('zh')}>中文</button>
        </div>
      </nav>
    </header>
  </>;
}
