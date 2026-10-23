'use client';
import { useLanguage } from '@/components/layout/language-provider';
import { Reveal } from '@/components/motion/reveal';
import { ProjectThumbnail } from './project-thumbnail';
import { categories, projects } from '@/data/projects';
import { copy } from '@/data/site';

export function ProjectDirectory({ standalone = false }: { standalone?: boolean }) {
  const { language, t } = useLanguage();
  const Heading = standalone ? 'h1' : 'h2';
  return <section className={`project-directory page-gutter ${standalone ? 'directory-standalone' : ''}`} id="projects" aria-labelledby="directory-heading">
    <Reveal className="directory-heading"><div><Heading id="directory-heading">{t(copy.projects)}</Heading></div></Reveal>
    <div className="category-jumps mono" aria-label={language === 'en' ? 'Jump to discipline' : '跳转至领域'}>{categories.map(c => <a key={c.id} href={`#${c.id}`} className={`category-jump category-${c.id}`}><span className="category-dot" />{t(c.directoryName)}<span>{c.range}</span> ↓</a>)}</div>
    {categories.map(category => <section key={category.id} id={category.id} className={`category-section category-${category.id}`} aria-labelledby={`heading-${category.id}`}>
      <Reveal className="category-heading"><div className="category-title"><h2 id={`heading-${category.id}`}>{t(category.directoryName)}</h2><span className="category-range">{category.range}</span></div></Reveal>
      <div className="project-row">{projects.filter(project => project.category === category.id).map((project, i) => <ProjectThumbnail key={project.id} project={project} featured={i === 0} />)}</div>
    </section>)}
  </section>;
}
