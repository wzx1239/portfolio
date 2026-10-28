'use client';
import { publicPath } from '@/lib/public-path';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useLanguage } from '@/components/layout/language-provider';
import { TransitionLink } from '@/components/layout/transition-link';
import { Media } from '@/components/media/media';
import { Reveal } from '@/components/motion/reveal';
import { ContentSection } from './content-section';
import { SoftwareMarquee } from './software-marquee';
import { ArchitectureNarrative } from './architecture-narrative';
import { copy } from '@/data/site';
import { categories, getProject } from '@/data/projects';
import type { Project } from '@/lib/types';
const RefugeOriginal = dynamic(() => import('./refuge-original').then(module => module.RefugeOriginal));
const WhiteOriginal = dynamic(() => import('./white-original').then(module => module.WhiteOriginal));

export function ProjectDetail({ project }: { project: Project }) {
  const { t } = useLanguage();
  const next = getProject(project.nextProject)!;
  const category = categories.find(c => c.id === project.category)!;
  const title = <h1 id="project-title">{t(project.title)}</h1>;
  return <main id="main" data-project-slug={project.slug} className={`project-detail category-${project.category}${project.architecture ? ' has-architecture' : ''}${project.architecture?.original ? (project.number==='04'?' refuge-original':' white-original') : ''}`}>
    <section className="project-hero" aria-labelledby="project-title"><Media asset={project.hero} className="project-hero-media" transitionName={`project-${project.number}`} priority sizes="100vw" label /><div className="project-hero-index mono">{project.number} / {t(category.name)}</div><div className="project-hero-caption page-gutter"><div>{!project.architecture && t(project.subtitle).trim() && <p className="mono">{t(project.subtitle)}</p>}{project.originalPdf?<div className="project-title-row">{title}<a className="text-link project-pdf-download" href={publicPath(project.originalPdf.src)} download={project.originalPdf.filename}>{t(copy.originalPdf)} <span aria-hidden="true">↓</span></a></div>:title}</div><a href="#overview" className="circle-arrow" aria-label={t(copy.overview)}>↓</a></div></section>
    <section id="overview" className="project-overview page-gutter"><Reveal className="overview-grid"><div><p className="mono eyebrow">{project.number} / {t(copy.overview)}</p><Link className="text-link" href="/projects">← {t(copy.back)}</Link></div><div><p className="overview-summary">{t(project.summary)}</p>{project.metadata.length>0 && <dl className="project-metadata">{project.metadata.map((field, i) => <div key={i} data-metadata-group={field.label.en==='Team / Time'?'team-time':field.label.en.toLowerCase()}><dt className="mono">{t(field.label)}</dt><dd>{t(field.value)}</dd></div>)}</dl>}</div></Reveal></section>
    {project.architecture && (project.architecture.original ? (project.number==='04'?<RefugeOriginal />:<WhiteOriginal number={project.number} />) : <ArchitectureNarrative sections={project.architecture.sections} />)}
    {project.sections.map(section => <ContentSection key={section.id} section={section} projectSlug={project.slug} />)}
    {project.deepDives.length > 0 && <section className="deep-dive-links page-gutter"><p className="mono eyebrow">{t(copy.deepDive)}</p>{project.deepDives.map(dive => <Link className="text-link" key={dive.slug} href={`/projects/${project.slug}/deep-dive/${dive.slug}`}>{t(dive.title)} ↗</Link>)}</section>}
    <SoftwareMarquee software={project.software} />
    <section className={`next-project page-gutter category-${next.category}`}><p className="mono eyebrow">{t(copy.next)} / {next.number}</p><TransitionLink href={`/projects/${next.slug}`} className="next-link" transitionName={`project-${next.number}`}><div><span className="next-number">{next.number}</span><h2>{t(next.title)}</h2><span className="next-arrow" aria-hidden="true">↗</span></div><Media asset={next.thumbnail} className="next-preview" sizes="(max-width: 700px) 100vw, 25vw" /></TransitionLink><Link className="text-link" href="/projects">{t(copy.back)} ↗</Link></section>
  </main>;
}
