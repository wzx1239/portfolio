'use client';
import Link from 'next/link';
import { useLanguage } from '@/components/layout/language-provider';
import { ContentSection } from './content-section';
import { copy } from '@/data/site';
import type { Project, DeepDive } from '@/lib/types';
export function DeepDiveDetail({ project, dive }: { project: Project; dive: DeepDive }) {
  const { t } = useLanguage();
  return <main id="main" className="deep-dive-page"><header className="page-gutter"><Link className="text-link" href={`/projects/${project.slug}`}>← {t(project.title)}</Link><p className="mono eyebrow">{project.number} / {t(copy.deepDive)}</p><h1>{t(dive.title)}</h1><p>{t(dive.summary)}</p></header>{dive.sections.map(section => <ContentSection key={section.id} section={section} projectSlug={project.slug} />)}</main>;
}
