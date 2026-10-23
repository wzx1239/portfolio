# Zixiao Wang / Portfolio — Visual V2

A local, bilingual portfolio for games, architecture and moving-image work. Start with **MASTER_BRIEF.md** and **VISUAL_V2_BRIEF.md** before making product or design decisions. **ARCHITECTURE.md** records the original structure. **VISUAL_V2_NOTES.md** describes the current visual controls. V2 preserves the nine projects, routes, language provider and content schema.

## Run locally

The dependencies are already installed in this checkout. On this Windows computer:

```powershell
cd "C:\Users\25228\Documents\Codex\2026-10-15\files-pasted-by-the-user-you\outputs\portfolio"
.\start-local.ps1
```

Open **http://127.0.0.1:3000**. If port 3000 is occupied, Next prints the available port. Stop with Ctrl+C. The launcher also finds the bundled Codex Node runtime when Node is not on your normal PATH.

Standard commands, on a computer with Node 24 LTS and pnpm:

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm typecheck
pnpm check:content
pnpm build
pnpm start
```

Node >=22.18 is required by the content-check script. The project uses stable packages resolved from the npm `latest` tags during setup; exact versions are recorded in package.json and pnpm-lock.yaml. No hosting, account, database or external image service is needed. Avoid running two development servers for this same checkout.

## Structure

```text
app/                     Routes, global CSS, loading/error/404
  about/                 Full About page
  projects/              Complete project directory
    [slug]/              Shared project detail page
      deep-dive/[topic]/ Optional deeper pages
components/
  layout/                Language, header/footer, route transition
  home/                  Showreel, About preview
  media/                 Images, lazy video, graceful fallbacks
  motion/                Shared reveal and future experiment slot
  projects/              Index, thumbnails, sections, details
data/
  projects.ts            All 9 bilingual project records
  site.ts                Profile, UI copy and home/About assets
lib/types.ts             Content schema
public/media/            Replaceable local SVG placeholders
public/resume/           Downloadable placeholder PDF
scripts/                 Content checks, placeholder generation
```

## Replace content and assets

| What | Where to edit |
| --- | --- |
| Homepage showreel | Put `showreel.mp4` and a poster in `public/media/home/`. Update `site.showreel.video` and `.image` in `data/site.ts`; set `placeholder: false`. This removes the small placeholder label, leaving footage dominant. There is no large Hero slogan. |
| Project thumbnails | Each folder is `public/media/projects/NN-slug/`. Update each project's `thumbnail.image` in `data/projects.ts`. Final images can be WebP, JPG, AVIF or PNG. Set `placeholder: false` for final assets. |
| Hover / mobile preview videos | Add `preview.mp4` inside the relevant project folder and set `previewVideo` on that project. There is no fake/empty MP4 file to replace. |
| Project hero | Update `hero.image`, optional `hero.video`, and bilingual alt text. |
| Project information | `data/projects.ts`: edit the matching record in `seeds`. Each record accepts titles, summaries, tags, optional metadata, thumbnail, hero, previewVideo, sections and deepDives. The map supplies V1 defaults for omitted fields and derives the 01–09 next-project sequence. |
| English / Chinese | `data/site.ts` and `data/projects.ts`. Every editable string uses `l('English', '中文')`. No duplicated page components. The toggle updates the document language and remembers the choice when browser storage is available. |
| Portrait | Replace `public/media/about/portrait-placeholder.svg`, or update `site.portrait.image` and alt text in `data/site.ts`. |
| Resume | Replace `public/resume/zixiao-wang-resume-placeholder.pdf`, or update `site.resume` in `data/site.ts`. The current download is a real one-page PDF clearly marked as a placeholder. |
| Contact / education / skills | Profile values in `data/site.ts`; education placeholder in `copy.educationPending`. Empty email/phone stay as visible placeholders without broken contact links. Skills are explicitly provisional. |
| Colors / type / spacing | CSS variables at the top of `app/globals.css`. Light and dark surface pairs and three category accents can change independently. System sans-serif fonts keep local startup independent of font services. |

Asset folders: `01-perfect-city`, `02-vr`, `03-featherland`, `04-emergency-refuge`, `05-architecture-05`, `06-architecture-06`, `07-video-07`, `08-video-08`, `09-video-09`. V2 placeholders are flat neutral media surfaces with a small interface label, and do not depict project work. `node scripts/generate-placeholders.mjs` regenerates them; do not run it over replaced placeholder filenames you want to preserve.

## Flexible project sections

All disciplines share one template. Each section supports `kind: 'media' | 'split' | 'text' | 'technical'`, bilingual title/body, an optional media asset and an optional `deepDiveSlug`. Metadata is an array: omit unknown fields instead of storing empty values. `technical` can show selected implementation materials without making process dominate the page. Add new image and text sections by editing data, rather than duplicating page components.

For example, add these optional fields to the matching project record in `seeds` when its real assets are ready (write accurate English/Chinese alt text for the image):

```ts
thumbnail: {
  image: '/media/projects/01-perfect-city/thumbnail.webp',
  alt: l('Describe the final image here', '在此描述最终图像'),
  variant: 1,
  placeholder: false,
},
previewVideo: '/media/projects/01-perfect-city/preview.mp4',
```

`hero`, `sections`, `metadata` and `deepDives` work the same way as per-project overrides. An empty `sections` or `deepDives` array cleanly suppresses those sections; omitted fields retain V1 defaults.

To enable a future Deep Dive, add `{ slug, title, summary, sections }` to that project's `deepDives` array. Link to its slug from a section's `deepDiveSlug`. The route `/projects/{slug}/deep-dive/{topic}` and template already exist. Empty arrays produce no links; invalid topics return 404. No final topic has been invented.

## Interaction and accessibility

- Normal scrolling throughout; no scroll lock or forced snapping. Once the opening hero is left, navigation stays available.
- A final Hero video plays once per entry and uses its real ended event. Completion emphasizes the continuation link without moving the visitor. Returning restarts the reel; pause/resume preserves playback position. The neutral placeholder has no fake timeline, invented animation sequence or inactive player button.
- Videos are silent, inline, lazy and viewport-aware. Project loops pause offscreen or when the tab is hidden. Browser autoplay rejection retains the poster. Actual MP4 behavior should be verified again with final encodings on iOS/Safari.
- Desktop hover restores thumbnail color, crops/scales media, slides the title, activates the number, arrow and category line, and plays an available preview. Touch devices activate previews by visibility; one tap opens the project. The three desktop images share a baseline.
- Project image surfaces use progressive View Transitions when supported, with native navigation fallback. The snapshot waits for the actual destination Hero instead of a route loading boundary, bounded to 900ms for cold routes. There is no artificial minimum wait; the shared image movement lasts 360ms.
- Reduced-motion users receive still media and simplified navigation. Focus rings, semantic links/headings, alt text and a skip link are included.
- Initial media loading has a real readiness-driven short graphic state. There is no fake percentage or forced loading delay.

## Next priorities

1. Add the real homepage reel and the strongest final images for 01, 03 and 04.
2. Refine the positioning sentence, personal introduction, education, contact details and real resume.
3. Add concise final-work chapters and evidence of the Unreal mechanics contribution to The Perfect City.
4. Select projects 05–09, then provide bilingual titles, context and metadata.
5. Test final encoded videos on mobile Safari, choose final typography/surface direction, and add confirmed Deep Dive topics.

This milestone remains local-only. The V1 media is intentionally placeholder material; it is not a final job application portfolio yet.
