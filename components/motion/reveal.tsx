'use client';
import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { motionTiming } from './tokens';
export function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return <motion.div className={className} initial={false} whileInView={reduce ? {} : { y: [16, 0], clipPath: ['inset(0 0 12% 0)', 'inset(0 0 0% 0)'] }} viewport={{ once: true, amount: .12 }} transition={{ duration: motionTiming.reveal, ease: motionTiming.ease, delay }}>{children}</motion.div>;
}
