'use client';
import Link from 'next/link';
import { useLanguage } from './language-provider';
import { copy, site } from '@/data/site';
export function SiteFooter() {
  const { t } = useLanguage();
  return <footer className="site-footer page-gutter">
    <div className="footer-top"><p>{t(copy.contact)}</p><a className="text-link" href={`mailto:${site.email}`}>{site.email} ↗</a></div>
    <div className="footer-bottom mono"><span>© {new Date().getFullYear()} {site.name}</span><a href={`tel:${site.phoneHref}`}>{site.phone}</a><Link href="/#main">↑ {t(copy.home)}</Link></div>
  </footer>;
}
