'use client';
import { useLanguage } from '@/components/layout/language-provider';
import { copy } from '@/data/site';
export default function Loading() { const { t } = useLanguage(); return <main id="main" className="route-loader" role="status"><span className="loading-lines"/><span className="mono">{t(copy.loading)} ↗</span></main>; }
