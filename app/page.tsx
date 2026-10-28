import { TicketScrollSequence } from './ticket-prototype/ticket-scroll-sequence';
import { AboutContent } from '@/components/about-content';
import { TicketCollection } from './ticket-prototype/ticket-collection';
import '@/components/home/passport-opening.css';

export default function Home() {
  return <main id="main">
    <TicketScrollSequence passport={<AboutContent embedded />}><TicketCollection /></TicketScrollSequence>
  </main>;
}
