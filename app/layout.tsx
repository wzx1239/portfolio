import type { Metadata } from 'next';
import { SiteProviders } from '@/components/layout/site-providers';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'Wang Zixiao — Portfolio', template: '%s — Wang Zixiao' },
  description: 'Wang Zixiao — Portfolio / Projects 01–09.',
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // Translation extensions may add attributes to html before React starts.
  // Limit this escape hatch to the root element; descendants still validate.
  return <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning><body><SiteProviders><SiteHeader />{children}<SiteFooter /></SiteProviders></body></html>;
}
