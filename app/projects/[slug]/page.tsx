import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProject, projects } from '@/data/projects';
import { ProjectDetail } from '@/components/projects/project-detail';
type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => projects.map(project => ({ slug: project.slug }));
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProject((await params).slug);
  return project ? { title: `${project.number} / ${project.title.en}`, description: project.summary.en } : {};
}
export default async function Project({ params }: Props) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  return <ProjectDetail project={project} />;
}
