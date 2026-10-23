import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProject, projects } from '@/data/projects';
import { DeepDiveDetail } from '@/components/projects/deep-dive-detail';
type Props = { params: Promise<{ slug: string; topic: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => projects.flatMap(project => project.deepDives.map(dive => ({ slug: project.slug, topic: dive.slug })));
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, topic } = await params;
  const dive = getProject(slug)?.deepDives.find(d => d.slug === topic);
  return dive ? { title: dive.title.en, description: dive.summary.en } : {};
}
export default async function DeepDivePage({ params }: Props) {
  const { slug, topic } = await params;
  const project = getProject(slug);
  const dive = project?.deepDives.find(d => d.slug === topic);
  if (!project || !dive) notFound();
  return <DeepDiveDetail project={project} dive={dive} />;
}
