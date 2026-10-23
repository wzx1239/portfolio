import type { Metadata } from 'next';
import { InteractionLab } from '@/components/interaction-lab/interaction-lab';
import './lab.css';

export const metadata: Metadata = {
  title: 'Interaction Lab',
  description: 'Three isolated project-browsing interaction studies.',
  robots: { index: false, follow: false },
};

export default function InteractionLabPage() {
  return <InteractionLab />;
}
