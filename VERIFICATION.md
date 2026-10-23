# V1 verification

Verified locally on Windows on 2026-10-15. This is a local-only milestone.

## Passed

- TypeScript: `node node_modules/typescript/bin/tsc --noEmit`.
- Production build: `node node_modules/next/dist/bin/next build`; all nine project paths prerendered successfully, alongside Home, About and Projects.
- Content: `node scripts/check-content.mjs`; nine unique slugs, three entries per category, continuous 01-09 sequence, looping next-project sequence, bilingual fields, local media paths, metadata and real placeholder PDF signature.
- HTTP against the production server: `node scripts/check-routes.mjs`; Home, About, Projects and all nine project pages return 200. Unknown pages and unconfirmed Deep Dive topics return 404. Resume download returns application/pdf and a valid PDF header.
- Browser at 1440 x 900: full viewport home composition, hidden initial navigation, introduction/directory anchors, project detail and next-project navigation. Project 01 -> 02 opens at scroll position 0. All ten home images loaded. No horizontal overflow or application console errors in the final production page.
- Browser at 390 x 844: project hero, About and full Projects Directory. Nine projects remain directly accessible in three groups of three, with no horizontal overflow. Chinese/English switching and Chinese language persistence after refresh were observed.
- Resume PDF: rendered with Poppler and visually inspected; one page, clearly marked as a placeholder.

## Implementation checks and remaining verification

Reduced-motion CSS and MotionConfig are included; keyboard navigation uses native links/buttons, visible focus states and a skip link. The system cursor and normal scrolling are preserved. These were inspected in source; no full screen-reader audit was performed.

Final project videos and imagery were not supplied. Video autoplay, once-per-entry hero playback, offscreen pause, looping project media and lazy preview loading are implemented, but must be tested with final encoded video assets, particularly on iOS/Safari. The V1 uses SVG compositions and a short CSS motion sequence rather than fabricated project footage. Deep Dive routes are implemented, but no final topics have been added.

The build uses a single prerender worker to reduce Windows filesystem contention. Stop the dev server before a production build on this machine if Windows reports a transient EPERM while writing generated segments.
