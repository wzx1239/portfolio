import type { Metadata } from 'next';
import { TicketCollection } from './ticket-collection';
export const metadata: Metadata = { title: 'Project Ticket Prototypes', robots: { index: false, follow: false } };
export default function TicketPrototypePage() {
  return <main id="main"><TicketCollection /></main>;
}
