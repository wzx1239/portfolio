import type { CSSProperties } from 'react';
import { futureTicket } from '@/data/future-ticket';
import { projects } from '@/data/projects';
import { ProjectTicket, type TicketContent } from './project-ticket';
import titleArtworks from './title-artworks-web.json';
import homepagePreviews from '@/data/homepage-previews.json';
import './ticket-prototype.css';
const artworks: Record<string, TicketContent['artwork']> = titleArtworks;
const categoryLabels = { game: 'GAME', architecture: 'ARCHITECTURE', video: 'VIDEO' };
function formatTicketDate(value: string): string {
  const numeric = value.match(/^(\d{4})[./](\d{1,2})\s*[–—-]\s*(\d{4})[./](\d{1,2})$/);
  if (numeric) return `${numeric[1]}.${numeric[2].padStart(2, '0')}–${numeric[3]}.${numeric[4].padStart(2, '0')}`;
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const range = value.match(/^([A-Za-z]+)\s*[–—-]\s*([A-Za-z]+),?\s+(\d{4})$/);
  if (range) {
    const start = months.indexOf(range[1]) + 1;
    const end = months.indexOf(range[2]) + 1;
    if (start && end) return `${range[3]}.${String(start).padStart(2, '0')}–${range[3]}.${String(end).padStart(2, '0')}`;
  }
  return value;
}

export function TicketCollection() {
  return <section className="ticket-prototype-stage page-gutter" aria-label="Projects 01–09 + Future"><div className="ticket-collection" style={{ '--ticket-count': projects.length + 1 } as CSSProperties}>{projects.map((project, index) => {
    const discipline = project.metadata.find(field => field.label.en === 'Discipline')?.value.en ?? '';
    const time = project.metadata.find(field => field.label.en === 'Team / Time')?.value.en ?? '';
    const date = formatTicketDate(time.split(' · ').find(part => /\d{4}/.test(part)) ?? '');
    return <ProjectTicket key={project.id} priority={index === 0} ticket={{
      number: project.number, title: project.title.en, category: categoryLabels[project.category],
      description: discipline, date, hero: { ...project.hero, image: homepagePreviews[project.number as keyof typeof homepagePreviews].ticketImage, video: project.previewVideo || project.hero.video }, artwork: artworks[project.number],
    }} />;
  })}<ProjectTicket ticket={futureTicket} /></div></section>;
}
