'use client';
import { MotionConfig } from 'framer-motion';
import { LanguageProvider } from './language-provider';
import { NavigationTransitionComplete } from './transition-link';
import type { ReactNode } from 'react';
import { DigitalSurface } from '@/components/trace/digital-surface';
import { motionTiming } from '@/components/motion/tokens';
export function SiteProviders({ children }: { children: ReactNode }) {
  return <LanguageProvider><MotionConfig reducedMotion="user" transition={{ duration: motionTiming.move, ease: motionTiming.ease }}><NavigationTransitionComplete /><DigitalSurface />{children}</MotionConfig></LanguageProvider>;
}
