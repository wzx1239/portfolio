'use client';
import Link from 'next/link';
import { useLanguage } from '@/components/layout/language-provider';
import { copy } from '@/data/site';
export default function NotFound() { const { t } = useLanguage(); return <main id="main" className="not-found page-gutter"><p className="mono">INDEX / 404</p><h1>{t(copy.notFound)}</h1><Link className="button-link" href="/">{t(copy.returnHome)} ↗</Link></main>; }
