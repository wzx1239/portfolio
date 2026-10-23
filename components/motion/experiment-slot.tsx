import type { ReactNode } from 'react';
// An isolated extension point for an optional future experiment.
export function ExperimentSlot({ children }: { children?: ReactNode }) {
  return children ? <aside className="experiment-slot">{children}</aside> : null;
}
