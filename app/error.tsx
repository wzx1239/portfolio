'use client';
import { useLanguage } from '@/components/layout/language-provider';
import { copy } from '@/data/site';
export default function Error({ reset }: { error: Error; reset: () => void }) { const { t } = useLanguage(); return <main id="main" className="not-found page-gutter"><p className="mono">INDEX / ERROR</p><h1>{t(copy.unavailable)}</h1><button className="button-link" onClick={reset}>{t(copy.retry)} ↗</button></main>; }
