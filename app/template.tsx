'use client';
import { useEffect, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { routePath } from '@/lib/public-path';

// A route-local commit signal, not a second loading page or layout wrapper.
export default function Template({ children }: { children: ReactNode }) {
  const path = routePath(usePathname());
  const [mountedPath, setMountedPath] = useState<string | null>(null);
  useEffect(() => { setMountedPath(path); }, [path]);
  return <><span hidden data-trace-route={path} data-trace-mounted={mountedPath === path} />{children}</>;
}
