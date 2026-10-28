'use client';
import { MotionConfig } from 'framer-motion';
import { LanguageProvider } from './language-provider';
import { TraceLoading, type TraceEntry } from '@/components/trace/trace-loading';
import type { ReactNode } from 'react';
import { DigitalSurface } from '@/components/trace/digital-surface';
import { motionTiming } from '@/components/motion/tokens';
export function SiteProviders({ children, traceEntries }: { children: ReactNode; traceEntries: TraceEntry[] }) {
  return <LanguageProvider><MotionConfig reducedMotion="user" transition={{ duration: motionTiming.move, ease: motionTiming.ease }}><DigitalSurface />{children}<TraceLoading entries={traceEntries} /></MotionConfig></LanguageProvider>;
}
