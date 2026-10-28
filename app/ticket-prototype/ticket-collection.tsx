import type { CSSProperties } from 'react';
import { futureTicket } from '@/data/future-ticket';
import { projects } from '@/data/projects';
import { ProjectTicket, type TicketContent } from './project-ticket';
import titleArtworks from './title-artworks.json';
import './ticket-prototype.css';
const artworks: Record<string, TicketContent['artwork']> = titleArtworks;
const categoryLabels = { game: 'GAME', architecture: 'ARCHITECTURE', video: 'VIDEO' };
export function TicketCollection() {
  return <section className="ticket-prototype-stage page-gutter" aria-label="Projects 01–09 + Future"><div className="ticket-collection" style={{ '--ticket-count': projects.length + 1 } as CSSProperties}>{projects.map((project, index) => {
    const discipline = project.metadata.find(field => field.label.en === 'Discipline')?.value.en ?? '';
    const time = project.metadata.find(field => field.label.en === 'Team / Time')?.value.en ?? '';
    const date = time.split(' · ').find(part => /\d{4}/.test(part)) ?? '';
    return <ProjectTicket key={project.id} priority={index === 0} ticket={{
      number: project.number, title: project.title.en, category: categoryLabels[project.category],
      description: discipline, date, hero: project.hero, artwork: artworks[project.number],
    }} />;
  })}<ProjectTicket ticket={futureTicket} /></div></section>;
}
