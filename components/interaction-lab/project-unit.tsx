'use client';
import { publicPath } from '@/lib/public-path';
import Link from 'next/link';
import { useLanguage } from '@/components/layout/language-provider';
import { labCopy, type LabProject } from './data';

type Props = {
  project: LabProject;
  anchorRef?: (element: HTMLElement | null) => void;
  linkRef?: (element: HTMLAnchorElement | null) => void;
  imageRef?: (element: HTMLDivElement | null) => void;
  reveal?: boolean;
};

export function ProjectUnit({ project, anchorRef, linkRef, imageRef, reveal = false }: Props) {
  const { t } = useLanguage();
  return <article ref={anchorRef} className="lab-project">
    <Link ref={linkRef} className="lab-project-link" href={project.href} draggable={false} aria-label={`${t(labCopy.open)} ${project.number} — ${t(project.title)}`}>
      <div ref={imageRef} className="lab-image">
        {/* Small local SVG fixtures deliberately avoid fabricated project art. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={reveal ? 'lab-reveal-base' : 'lab-original'} src={publicPath(project.image)} alt={`${t(labCopy.testImage)} ${project.number}`} loading="lazy" decoding="async" draggable={false} width={1200} height={900}/>
        {reveal && <div className="lab-reveal-layer" aria-hidden="true"><img src={publicPath(project.image)} alt="" loading="lazy" decoding="async" draggable={false} width={1200} height={900}/></div>}
      </div>
      <div className="lab-caption"><span className="lab-project-number">{project.number}</span><h3>{t(project.title)}</h3><span className="lab-project-arrow" aria-hidden="true">↗</span></div>
      <p className="lab-project-subtitle">{t(project.subtitle)}</p>
      <span className="lab-project-line" aria-hidden="true"/>
    </Link>
  </article>;
}
