import type { Metadata } from 'next';
import { ProjectDirectory } from '@/components/projects/project-directory';
export const metadata: Metadata = { title: 'Projects' };
export default function Projects() { return <main id="main"><ProjectDirectory standalone /></main>; }
