import { publicPath } from '@/lib/public-path';
// Shared monochrome asset registry. Unknown software intentionally has no fallback.
export const softwareLogos: Record<string, { file: string; scale: number }> = {
  'Unreal Engine': { file: 'unrealengine', scale: 1 },
  Rhino: { file: 'rhinoceros', scale: 1 },
  Blender: { file: 'blender', scale: 1.04 },
  Codex: { file: 'openai', scale: 1 },
  'Claude Code': { file: 'claude', scale: 1 },
  Figma: { file: 'figma', scale: 1.04 },
  GitHub: { file: 'github', scale: 1 },
  'Adobe Creative Cloud': { file: 'adobecreativecloud', scale: 1 },
  Photoshop: { file: 'adobephotoshop', scale: .86 },
  'Adobe Photoshop': { file: 'adobephotoshop', scale: .86 },
  'Adobe Illustrator': { file: 'adobeillustrator', scale: .86 },
  'Adobe InDesign': { file: 'adobeindesign', scale: .86 },
  'D5 Render': { file: 'd5render.png', scale: 1.25 },
  'Premiere Pro': { file: 'adobepremierepro', scale: .86 },
  'Adobe Premiere Pro': { file: 'adobepremierepro', scale: .86 },
  'Adobe Substance 3D': { file: 'adobesubstance3d', scale: .86 },
  'Adobe Substance 3D Designer': { file: 'adobesubstance3ddesigner', scale: .86 },
  'After Effects': { file: 'adobeaftereffects', scale: .86 },
};
export const softwareLogoPath = (file: string) => publicPath(`/media/about/icons/${/\.(svg|png)$/.test(file) ? file : `${file}.svg`}`)!;
