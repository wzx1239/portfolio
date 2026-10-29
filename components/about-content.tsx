'use client';
import { publicPath } from '@/lib/public-path';
import { useEffect, useRef, type CSSProperties } from 'react';
import { Media } from '@/components/media/media';
import { usePassportMedia } from '@/components/projects/use-passport-media';
import { ProjectThumbnail } from '@/components/projects/project-thumbnail';
import { ToolLogo } from '@/components/tool-logo';
import { useLanguage } from '@/components/layout/language-provider';
import { projects } from '@/data/projects';
import { copy, site } from '@/data/site';
import './about-record.css';

export function AboutContent({ embedded = false }: { embedded?: boolean }) {
  const { t } = useLanguage();
  const spread = useRef<HTMLDivElement>(null);
  const previewReady = usePassportMedia(spread, embedded);
  useEffect(() => {
    const node = spread.current;
    if (!node) return;
    // A global effect can run while this streamed boundary is still hydrating.
    // Only expose this book to imperative material updates after its own commit.
    node.dataset.paperReady = 'true';
    return () => { delete node.dataset.paperReady; };
  }, []);
  const Container = embedded ? 'section' : 'main';
  const Heading = embedded ? 'h2' : 'h1';
  const prefix = embedded ? 'home' : 'record';
  return <Container id={embedded ? 'passport' : 'main'} className="about-record page-gutter">
    <header className="record-heading"><Heading>{t(copy.about)}</Heading></header>
    <div ref={spread} className="record-spread" style={{ '--paper-rx': '0.000deg' } as CSSProperties}>
      {embedded && <div className="passport-cover-leaf" aria-hidden="true"><div className="passport-cover-face"><span>{t(copy.about)}</span><p>{t(site.displayName)}</p></div></div>}
      <section className="record-information" aria-labelledby={`${prefix}-information-heading`}>
        <header className="record-panel-heading"><h2 id={`${prefix}-information-heading`}>{t(copy.profile)}</h2></header>
        <div className="record-identity">
          <div className="record-portrait"><Media asset={{ ...site.portrait, image: '/media/homepage-previews/portrait.webp' }} className="portrait" priority sizes="100px" /></div>
          <p className="record-name">{t(site.displayName)}</p>
        </div>
        <dl id="contact" className="record-contact">
          <div><dt>{t(copy.birthDate)}</dt><dd>{site.birthDate}</dd></div>
          <div><dt>{t(copy.email)}</dt><dd><a href={`mailto:${site.email}`}>{site.email}</a></dd></div>
          <div><dt>{t(copy.languages)}</dt><dd>{site.languages.map((language, i) => <p key={i}>{t(language)}</p>)}</dd></div>
        </dl>
        <section className="record-education" aria-labelledby="record-education-heading">
          <h2 id="record-education-heading" className="record-section-heading">{t(copy.education)}</h2>
          {site.education.map(education => <div className="record-education-entry" key={education.level.en}>
            <h3>{t(education.level)}</h3>
            {education.schools.map(school => <div key={school.name.en} className="record-school"><p>{t(school.name)}</p><span>{school.dates}</span></div>)}
            <p className="record-major"><span>{t(copy.major)}</span><span className="record-major-value">{t(education.major)}{'school' in education && education.school ? ` (${t(education.school)})` : ''}</span></p>
          </div>)}
        </section>
        <section className="record-tools" aria-labelledby="record-tools-heading"><h2 id="record-tools-heading" className="record-section-heading">{t(copy.skills)}</h2>
          {site.toolGroups.map(group => <div className="record-tool-group" key={group.label.en}><h3>{t(group.label)}</h3><ul style={{ '--tool-count': group.items.length } as React.CSSProperties}>{group.items.map(item => <li key={item} title={item === 'Adobe Creative Cloud' ? 'Adobe Creative' : item}><ToolLogo name={item} /><span>{item === 'Adobe Creative Cloud' ? 'Adobe Creative' : item}</span></li>)}</ul></div>)}
        </section>
        <div className="record-resume"><a href={publicPath(site.resume)} download className="text-link">{t(copy.resume)} ↓</a><div><p>{t(copy.resumeDetail)}</p></div></div>
      </section>
      <section className="record-projects" aria-labelledby={`${prefix}-projects-heading`}>
        <header className="record-panel-heading"><h2 id={`${prefix}-projects-heading`}>{t(copy.selected)}</h2></header>
        <div className="about-stamps">{projects.map(project => <ProjectThumbnail key={project.id} project={project} variant="stamp" mediaReady={previewReady} />)}</div>
      </section>
    </div>
  </Container>;
}
