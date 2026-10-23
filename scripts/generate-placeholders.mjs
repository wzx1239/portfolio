import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

// Neutral media only: no illustrative scenes or fabricated project renders.
const neutral = (dark = false) => `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000"><rect width="1600" height="1000" fill="${dark ? '#191a1e' : '#e6e7eb'}"/></svg>`;
const save = async (file, content) => {
  const destination = path.join(process.cwd(), 'public', file);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, content);
};
await save('media/home/showreel-placeholder.svg', neutral(true));
await save('media/about/portrait-placeholder.svg', neutral());
const slugs = ['perfect-city', 'vr', 'featherland', 'emergency-refuge', 'architecture-05', 'architecture-06', 'video-07', 'video-08', 'video-09'];
for (const [index, slug] of slugs.entries()) {
  const number = String(index + 1).padStart(2, '0');
  for (const kind of ['thumbnail', 'hero', 'detail']) await save(`media/projects/${number}-${slug}/${kind}-placeholder.svg`, neutral());
  await save(`media/projects/${number}-${slug}/ASSETS.md`, `# ${number} / ${slug}\n\nNeutral media placeholders only. These are not project artworks.\n\nAdd thumbnail.webp, hero.webp, detail-01.webp and optional preview.mp4. Update the matching seed in data/projects.ts and set placeholder: false. No empty video file is provided.\n`);
}
console.log('Updated home, portrait and 27 project placeholders to neutral media surfaces.');
