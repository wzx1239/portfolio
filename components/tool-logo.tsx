import type { CSSProperties } from 'react';
import { softwareLogos, softwareLogoPath } from '@/data/software';
export function ToolLogo({ name }: { name: string }) {
  const logo = softwareLogos[name];
  if (!logo) return null;
  return <span className="tool-logo" aria-hidden="true" style={{ '--tool-mark': `url('${softwareLogoPath(logo.file)}')` } as CSSProperties} />;
}
