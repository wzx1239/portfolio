import type { Metadata } from 'next';
import { SiteProviders } from '@/components/layout/site-providers';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { projects } from '@/data/projects';
import { traceBootstrap } from '@/lib/trace-loading-bootstrap';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'Wang Zixiao — Portfolio', template: '%s — Wang Zixiao' },
  description: 'Wang Zixiao — Portfolio / Projects 01–09.',
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // Translation extensions may add attributes to html before React starts.
  // Limit this escape hatch to the root element; descendants still validate.
  return <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning><head><script id="trace-session" dangerouslySetInnerHTML={{ __html: traceBootstrap }} /><noscript><style>{'.trace-loader{display:none!important}'}</style></noscript></head><body><SiteProviders traceEntries={projects.map(project=>({number:project.number,title:project.title.en,path:`/projects/${project.slug}`}))}><SiteHeader />{children}<SiteFooter /></SiteProviders></body></html>;
}
