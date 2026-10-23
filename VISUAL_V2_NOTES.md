# Visual V2

This pass refines the existing website. The nine project records, 01–09 sequence, route structure, language provider, content schema and shared project template are retained. No new packages, media services or deployment have been introduced.

## Visual systems changed

- **Media-first opening:** removed the architectural artwork, large slogan, side labels, decorative index copy and simulated progress sequence. The almost full viewport Hero is now a neutral video placeholder with a small Showreel label. A real MP4 can replace it directly. Navigation is hidden on first entry, appears after leaving the Hero and then stays available. There is no scroll lock.
- **Neutral base:** replaced beige/olive surfaces with neutral white/gray and a neutral dark media surface. Game purple, architecture charcoal and video pink remain small interaction accents. The flat placeholder assets do not suggest a final color palette or depict fabricated projects.
- **Display typography:** stronger sans-serif category headings and continuous numbers, using local Bahnschrift where available and standard sans-serif fallbacks. Body text, titles, project subtitles and metadata remain readable. Repeated tags, redundant category notes, decorative Hero labels and tiny supporting copy were removed or enlarged.
- **Project activation:** desktop images share a baseline. Hover or keyboard focus restores color, scales the image inside its crop, slides the title, moves the number, exchanges the arrow and draws the project/category lines. Only the neighboring arrows soften slightly. Mobile uses viewport activation and immediate one-tap navigation.
- **About preview:** retained the original grid. Pointer movement makes a small bounded shift in the sentence and its line geometry; hovering or focusing the sentence opens the geometry, moves the arrow and extends the underline. Mobile gets a viewport-driven geometric state and touch feedback. The text remains a single replaceable bilingual value.
- **Motion:** shared 180/280/360ms timing and direct easing. Section entry uses short translation and clipping instead of slow opacity fades. Navigation slides in. Shared project image surfaces expand into the actual destination Hero; labels stay out of the shared image snapshot. Cold routes have a bounded fallback and no artificial minimum delay. Modified clicks retain native browser behavior.

## Files that control the result

| Control | File |
| --- | --- |
| Colors, font families, sizes, responsive composition and CSS motion | `app/globals.css` — `:root` tokens and labelled sections |
| JS motion timings and easing | `components/motion/tokens.ts` — mirrored by the CSS timing tokens |
| Section entry | `components/motion/reveal.tsx` |
| Shared Motion configuration | `components/layout/site-providers.tsx` |
| Project hover/focus/mobile activation | `components/projects/project-thumbnail.tsx` + the project activation section in `app/globals.css` |
| Category display and group presentation | `components/projects/project-directory.tsx` + category CSS |
| Image-to-Hero transition | `components/layout/transition-link.tsx` + shared transition CSS |
| Viewport-aware media, neutral fallback, replay handling | `components/media/media.tsx` |
| About typography/geometry interaction | `components/home/about-preview.tsx` + About preview CSS |
| Hero playback and small interface | `components/home/showreel.tsx` |
| Hero media and bilingual labels | `data/site.ts` |
| Replaceable project media paths | existing records in `data/projects.ts` |
| Regenerate neutral placeholders | `scripts/generate-placeholders.mjs` — never generates project artwork |

## Replace the Showreel

1. Add `showreel.mp4` and its poster to `public/media/home/`.
2. In `data/site.ts`, set `site.showreel.video` to `/media/home/showreel.mp4` and `.image` to the poster path.
3. Set `placeholder: false` and write accurate bilingual alt text. The small placeholder label disappears automatically.

The MP4 is muted and inline, plays once per entry, pauses offscreen and restarts on returning. Pause/resume preserves its position; replay restarts it. A real ended event emphasizes the continuation link without forcing a scroll. There is no fake media timer when no MP4 exists. Actual encoding/autoplay compatibility still needs testing with the final file, especially on iOS Safari.

Project thumbnails, heroes and previews keep the same asset folders and existing data fields. Set `placeholder: false` when adding final imagery. Refresh the page after replacing a public asset with the same filename; use Ctrl+F5 if an old cached image remains.

## Local preview

The run command is unchanged: `./start-local.ps1` on this Windows checkout, or `pnpm dev` with Node and pnpm available. During this pass the existing user-owned preview at port 3000 was reused. `PORTFOLIO_BUILD_DIR=.next-v2` was used only to isolate build verification from that running preview; the normal output directory remains `.next`.

## Verification

- TypeScript and the existing content check pass.
- Production build generates the same nine project paths and existing main pages.
- Production HTTP checks pass for Home, About, Projects, all nine projects, the resume PDF and unknown-route behavior.
- At 1440px, each project group's three media elements share the same top coordinate. Keyboard focus activates the matching item, category line, title and arrow. Project opening reaches its named Hero at scroll position 0, with no application console warnings/errors in the fresh verification tab.
- At 390px, all three groups still contain three projects, visible media auto-activates, English/Chinese switching works and a single click opens a project. No horizontal overflow was observed at 390px or 320px.
- The About focus state extends its rule to full width, rotates its line frames and applies the game accent. Reduced-motion behavior is included in CSS and MotionConfig; a full screen-reader audit and final-video testing were not performed.

Screenshots are saved alongside the project as `v2-projects-desktop.png`, `v2-projects-mobile.png` and `v2-about-interaction.png`.
