# V1 implementation plan

> Historical implementation plan. The architecture is retained in Visual V2. Current visual tokens and neutral placeholder behavior are documented in `VISUAL_V2_NOTES.md` and implemented in `app/globals.css`; the old V1 visual values below are no longer active.

Read MASTER_BRIEF.md before changing the product or visual direction. This is a local-only Next.js App Router project.

## Files and routes

- `app/`: home, About, Projects, nine dynamic project routes, optional nested Deep Dive routes, loading and not-found states.
- `components/layout/`: persistent language provider, navigation, footer and route transitions.
- `components/home/`: full viewport showreel and interactive About preview.
- `components/projects/`: editorial directory, flexible project template and optional Deep Dive template.
- `components/media/`: reusable viewport-aware video/image/fallback renderer.
- `components/motion/`: consistent reveal system and future experiment extension point.
- `data/`: bilingual interface copy, personal profile, media configuration and typed project records.
- `lib/`: shared content types and helpers.
- `public/media/`: home, portrait and one asset folder per numbered project.
- `public/resume/`: clearly labelled placeholder PDF.

## Reusable components

SiteHeader, SiteFooter, LanguageProvider, TransitionLink, Reveal, Media, Showreel, AboutPreview, ProjectDirectory, ProjectThumbnail, ProjectDetail, ContentSection, Metadata, NextProject and DeepDiveDetail. All disciplines use the same template. Content sections are a discriminated union of text, media, split and technical blocks; optional metadata and deep dives are omitted when absent.

## Data schema

`Localized = { en: string; zh: string }`; `Project` stores id, continuous number, slug, category, bilingual title/summary, optional metadata, thumbnail/hero/preview media, flexible sections, optional deep dives and next project slug. `MediaAsset` stores optional image/video, bilingual alt text and a graphic fallback variant. No missing binary asset is requested by default.

## Initial design tokens

Warm paper #f0efe9; ink #24251f; muted #696b63; rule #cccec4; game violet #6d53ca; architecture charcoal #292b27; video pink #bc416f. Light and dark surface pairs are independent tokens. Sharp corners; 12-column desktop grid; 4-column mobile grid; fluid sans-serif display type and restrained monospace indexing. No large personal-name treatment, initials logo, custom cursor, forced snapping, audio or WebGL.

Motion uses a shared 420ms ease-out reveal, short hover transforms and progressive View Transition support for project images with a fast fallback. Reduced motion disables nonessential movement. Videos attach sources near the viewport and pause when hidden. The silent hero plays once per entry, pauses offscreen and signals the next section without scrolling for the visitor.

## V1 placeholders

Use purpose-built geometric SVG compositions labelled as placeholders, not fabricated project renders. All supplied facts remain distinct from temporary copy. No invented dates, education, contact details or final Deep Dive topics. Actual video files are intentionally absent until supplied.
