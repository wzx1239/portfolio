'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { routePath } from '@/lib/public-path';
import { useLanguage } from './language-provider';
import { copy, site } from '@/data/site';
export function SiteFooter() {
  const { t } = useLanguage();
  const isProjectDetail = /^\/projects\/[^/]+$/.test(routePath(usePathname()));
  return <footer className="site-footer page-gutter">
    <div className="footer-top"><p>{t(copy.contact)}</p><a className="text-link" href={`mailto:${site.email}`}>{site.email} ↗</a></div>
    <div className="footer-bottom mono"><span>© {new Date().getFullYear()} {site.name}</span>{!isProjectDetail && <Link href="/#main">↑ {t(copy.home)}</Link>}</div>
  </footer>;
}
