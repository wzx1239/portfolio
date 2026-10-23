# GitHub Pages project-entry navigation — 2026-10-23

- Static exports use full-document navigation for shared project-entry links (directory, passport and Next Project). The existing shared handler prevented the anchor default and depended on App Router navigation/view-transition completion, which stalled in a plain static production reproduction despite valid exported HTML routes. No covering overlay, nested interactive control or incorrect project href was found.
- Expose NEXT_PUBLIC_STATIC_EXPORT from the existing export configuration. In that mode, use the rendered anchor's complete href (including /portfolio and trailing slash) with location.assign, and disable project-link prefetch. Preserve modified clicks, target handling, keyboard activation, original anchor markup and all hover/Reveal/layout styles. Normal Next development/server mode retains its existing client view transition.
- Build and test the actual /portfolio export through an ordinary static server, without a Next runtime or route-rewrite fallback. Check all nine project destinations with mouse and Tab/Enter. No source content/design changes or remote deployment from this repair session.

# GitHub Pages static-export readiness — 2026-10-23

- Prepare only; no remote repository, deployment workflow, push, publishing or Pages setting change. Preserve content and visual design.
- Add opt-in static configuration (PORTFOLIO_STATIC_EXPORT=1): output:export, trailingSlash:true, images.unoptimized:true; NEXT_PUBLIC_BASE_PATH supplies the repository prefix. Shared publicPath() handles all native public assets/downloads and CSS masks; CSS surface SVGs use bundled relative imports. Next Link handles its own basePath. Normalize route-sensitive pathname checks for both prefix/trailing-slash variants.
- build:pages runs a fresh isolated source build, retaining all nine statically generated project routes and other current pages. There are no actual deep-dive entries; omit only that empty dynamic template in the static build copy to satisfy Next export, keeping the source architecture and future populated generateStaticParams intact. Include .nojekyll; generated caches/exports and five obsolete, unused local GIF copies are ignored.
- Static subpath build succeeded; direct HTML, refresh, client navigation, bilingual persistence, MP4 loops, technical interaction, asset URLs, background SVGs and download addresses checked with a plain local static server. YouTube embeds load independently of Node but currently show an external sign-in/anti-bot gate in verification. Do not claim that gate is a static-export failure or bypass it.
- Local export ~567 MB remains below Pages' 1 GB limit. An unused 112.6 MB npc.gif exceeds regular Git's 100 MiB file limit and is excluded from future commits; no files deleted. See GITHUB_PAGES.md for commands, verification and remaining media/bandwidth considerations.

# Echo technical layer and aligned mechanic introductions — 2026-10-23

- Replace Reveal, Manipulate and Echo player-facing introductions with the latest supplied bilingual wording verbatim. Keep titles, media and all existing Reveal/Manipulate technical copy unchanged.
- Echo now supplies exactly three HOW I MADE IT items: Context-Aware Input / 由空间决定的输入; Voice as Input / 真实声音作为输入; Shared Sound Wave / 统一的声波. Use the supplied English/Chinese paragraphs verbatim; no extra technical facts or Blueprint images.
- Reuse the same shared technical-layer renderer and container-responsive grid, hover/reading-area retention, mobile tap toggle, animation, typography and spacing. Keep the overflow correction intact; the change is shared data only, with no section redesign or unrelated changes.

# Technical-layer responsive overflow correction — 2026-10-23

- Root cause: right-hand panel was positioned beyond the media's box using left:100% plus a gap and a viewport-derived width. At 1800px+ the section is capped at 2000px, but panel sizing still used 100vw, so the combined layout could exceed the actual content container. Positive horizontal reveals could further extend that edge.
- Replace that model with one full-width, min-width:0 showcase grid inside the existing section padding/max-width. With at least 1000 CSS px of available container width and a fine hover pointer, use minmax(0,63fr) / minmax(0,37fr) columns and a responsive gap. Main media/selectors/description/trigger share the left column; the technical layer is a normal right grid item. Opening does not change column or video dimensions.
- Below that usable container width (including scaled/zoomed desktop viewports), use one column with the technical layer below the media. Keep hover/tap behavior in sync by reading the actual CSS layout mode rather than physical monitor size or a separate viewport breakpoint. Keep all children max-width:100%, min-width:0, natural wrapping and native video proportions. No overflow-x hiding, external absolute panel, viewport-width subtraction or off-container hover bridge.
- Use bounded sticky reading content within its own column and an inward-only stagger. Preserve copy, interaction grammar, selectors, typography and all unrelated sections. This replaces earlier four-sevenths/viewport-based showcase and technical-column width rules.
- Verified expanded Reveal at 390, 900, 1024, 1280, 1440, 1920, 2560 and 3200 CSS px: document scrollWidth equals clientWidth, 16:10 media remains unchanged on expansion, and selector edges remain aligned. Check Manipulate and bilingual layout as well.

# Manipulate engineering and editorial typography — 2026-10-23

- Add the supplied four bilingual Manipulate implementation items verbatim: Configurable Links, Data-Driven Paths, Constant Speed, Safe State. Reuse the same shared Reveal technical-layer interaction/component; keep Echo and Narrative Systems without technical layers.
- Introduce global responsive tokens in globals.css: --type-body (17–19), --type-description (18–20), --type-technical (15–17), --type-label (13–14), --type-mechanic (22–26), --project-section-title-size (28–38), --type-project-title (44–88). Update shared prose, chapter headings, project titles, metadata, selectors, captions, links and technical text. Keep navigation restrained and original PDF diagram lettering/source coordinates untouched.
- Increase line heights and caption/metadata spacing as needed. Technical reading column retains video size and uses a viewport-bounded sticky reading area with overflow for short screens; extend its non-flow positioning track so all four larger items remain readable from the trigger without moving the media.
- Passport uses readable 15–17px body and 13–14px labels rather than old 8–12px overrides. Enlarge the physical spread/grid area, give labels and school/date rows explicit room, permit 60px+ stamp title tracks, and stack resume information as necessary. On the homepage retain the viewport-aware book-width cap so existing scroll opening still activates where it fits; smaller screens keep the existing stacked layout. Do not scale text down to conceal overflow.
- Checked Home, About, Projects, game, architecture and film pages on desktop/mobile; preserve page structures, image/video proportions, interactions, copy and bilingual behavior.

# Reveal engineering layer — 2026-10-23

- Add HOW I MADE IT + / 实现方式 + below only Reveal's description. Use exactly the four supplied bilingual engineering headings and paragraphs in shared project data. No additional technical copy or Blueprint images. Manipulate, Echo and Narrative Systems have no implementation layer.
- Desktop fine-pointer hover (1100px+) reveals an unboxed, secondary panel in the unused space right of the existing video. Absolute positioning preserves video size/position. Use quick fade, 10px slide and restrained 35ms item stagger. Keep the layer open while traversing the showcase and the 32px gap into the panel; close on leaving the overall interaction area, keyboard blur or Escape.
- Tablet/mobile uses button tap toggle and inline content below the Reveal description. Native button, aria-expanded/controls, unique IDs and hidden/inert collapsed content support keyboard and assistive technology. Respect reduced-motion transitions; preserve all video/scroll/selector/bilingual behavior. Switching selectors closes the engineering layer.

# Confirmed YouTube mappings and Film titles — 2026-10-23

- Align Full Walkthrough → N-fd3z5WQHk; Featherland Full Walkthrough → 0zdtmL9Ovvc; Film 08 Full Film → ku3XhjsHEHE; Film 09 Full Film → NTZ97Ch854g (new user-supplied ID).
- Film 08 title is Ironic Shaxi; Film 09 title is A Renting Story. Use supplied titles in both language modes until Chinese titles are provided. Keep numbering, slugs, metadata and all Hero/preview/thumbnail assets unchanged.
- Reuse the shared lazy, non-autoplay, native-controls YouTube section renderer with responsive 16:9. All four embeds verified with advancing playback. After runtime-reference audit, removed only public/media/projects/02-vr/walkthrough.mp4, 03-featherland/walkthrough.mp4, 08-video-08/film08.mp4 and 09-video-09/film09.mp4. Original source materials, Hero/preview clips, posters and thumbnails remain untouched.

# Project 01 YouTube long-form videos — 2026-10-23

- Confirmed by user: Full Walkthrough uses 3dZkd4wj6pA; Artefact uses VUbjO20mz9M. The other supplied IDs are assigned to their confirmed projects in the later mapping decision above.
- Use shared YouTube iframe embeds (youtube.com/embed/ID) in the existing chapter positions. Mount near the viewport using IntersectionObserver (400px margin), plus iframe loading=lazy; preserve responsive 16:9, full content width, square corners, black surface, zero border/padding. No autoplay; retain normal YouTube controls/fullscreen and strict-origin-when-cross-origin referrer policy.
- Remove the two local long-form video paths from runtime project data. Keep their existing poster records. Preserve Hero, thumbnail/preview assets and all five locally hosted MP4 system demonstrations. No downloaded YouTube video copies.
- Confirmed both embeds play (Artefact 480.041s, Full Walkthrough 857.421s). After zero runtime-reference audit, removed only public/media/projects/01-perfect-city/artefact.mp4 and walkthrough.mp4. Original source files remain untouched; Hero/preview, five short MP4 loops and all posters/thumbnails remain.

# Project 01 MP4 demonstrations — 2026-10-23

- Replace five showcase GIFs with byte-identical supplied MP4s: trace/trace.mp4 → trace-reveal.mp4; platform/platform.mp4 → trace-manipulate.mp4; echo/echo.mp4 → trace-echo.mp4; npc(1)/npc(1).mp4 → npc.mp4; inventory/inventory.mp4 → inventory.mp4. Copy into public/media/projects/01-perfect-city/ and use normal public URLs only. Original source files remain untouched; no chat attachments.
- All five are 1728×1080 (16:10). Shared showcase videos autoplay muted, loop, play inline without native controls, width:100% / height:auto. Pause inactive/offscreen videos. Preserve selector interaction/crossfade, shared sizing/alignment, approved text and static thumbnail JPEGs. No crop or forced ratio on main videos.
- Runtime reference audit found the five superseded GIF website copies unused (historic brief mentions only). Cleanup was attempted for those exact files and two completed isolated build directories (.next-lab-check, .next-project-hierarchy), but automatic command approval rejected deletion even after explicit filesystem permission was granted. Therefore no old media/cache was deleted in this pass. Do not treat these old GIFs as active runtime dependencies.
- Keep all Hero, preview, Artefact, Full Walkthrough, source/PDF material, thumbnails, current .next, other caches of uncertain use, package/config files and node_modules unchanged.

# Trace introduction removal — 2026-10-23

- Remove the introductory sentence below Core Mechanic — Trace in both languages. Keep the chapter title, media selector, active application titles/descriptions and all other content unchanged.

# Showcase caption simplification — 2026-10-23

- Remove the small number/logic-path line above the active explanation in both shared gameplay showcases (for example 03 / TRACE → PERCEIVE / EXPAND). Keep selector numbers/names, active titles, descriptions, media and all interactions unchanged.

# Project chapter edge alignment — 2026-10-23

- Align chapter titles, divider starts and their media to the same left page content gutter. Artefact uses the full available content width within that gutter, removing its media-only full-bleed offset so its title and video share a left edge. Keep its native video ratio, playback and chapter typography; preserve both gameplay showcase widths and other content.

# Gameplay showcase size refinement — 2026-10-23

- Both Core Mechanic and Narrative Systems viewers now use 57.142857vw (four sevenths of viewport width), refining the previous 60vw size. Retain shared left alignment, identical main/selector dimensions, native media proportions and switching behavior. At 700px and below, use 100% of available content width inside the existing margins.

# Shared left-aligned gameplay showcases — 2026-10-23

- Narrative Systems now reuses the Trace showcase component: one native-ratio main GIF, matching thumbnail selectors below, and only the active explanation. Default Dialogue; second selector Inventory. Preserve all approved bilingual copy and section order.
- Both chapters align to the page's left content gutter, including heading, viewer, selectors and description. Share the same responsive 640px maximum viewer width and native 16:10 media proportions. Use the same three-slot thumbnail grid so both chapters' selectors have identical dimensions; Narrative occupies the first two slots without placeholder content. Shrink within content margins on narrow screens with the existing shared thumbnail ratios/gaps.
- Extract npc-thumb.jpg and inventory-thumb.jpg from the existing GIFs. Only selectors may crop. Main GIFs remain uncropped. Each showcase has an independent active state and unique description ID; do not change other sections.

# Project 01 Narrative Systems — 2026-10-22

- Add Narrative Systems / 叙事系统 immediately after Core Mechanic — Trace and before existing Implementation. Keep Artefact, Trace showcase, Full Walkthrough and other sections unchanged.
- Two concise, media-first columns: 01 Dialogue — Uncover the World / 对话——了解世界, then 02 Inventory — Collect the Story / 背包——收集故事. Use the user-supplied English/Chinese descriptions exactly. Stack on mobile; no cards, generic icons or HUD decoration.
- The requested G drive is unavailable in this environment. Located both new files in the existing C:/A-future？/Portfolio/porjects/01 The perfect city source folder. Copy byte-identically into public/media/projects/01-perfect-city/npc.gif and inventory.gif; reference only normal public URLs in shared project data. Do not embed source media in the conversation.
- Preserve each original 1024×640 GIF uncropped with width:100% / height:auto, lazy loading, no fixed-ratio box or letterboxing. Center the two-column chapter on the content grid, max width 1024px, with compact captions. Original GIFs total about 208 MB; preserve supplied assets.

# Hydration boundaries / passport material — 2026-10-22

- Tolerate translation-extension attributes on html with root-only suppressHydrationWarning. Keep all descendant hydration validation and the existing language provider unchanged.
- Passport spread SSR and first client render use exactly --paper-rx:0.000deg. AboutContent marks its own spread ready only in its mount effect. DigitalSurface must only write tilt/light custom properties to locally hydrated, ready spreads, preventing an earlier global effect from mutating streamed server DOM. Preserve all pointer, scroll/opening, bilingual and visual behavior.

# Trace showcase alignment and filmstrip — 2026-10-22

- Align the Trace chapter heading/introduction, main viewer, selector strip and description to one centered 640px column. Keep all existing interaction, approved copy and other sections unchanged.
- Use a Steam-inspired horizontal filmstrip directly below the viewer (8px separation): three equal-width actual gameplay thumbnails span exactly the viewer width, with 8px gaps (6px mobile). Thumbnail cropping is allowed: 2.6:1 desktop, 2:1 mobile. Align numbers/names and active underlines to each thumbnail edge. Retain restrained opacity/underline indication, no cards or colored decoration.
- Main GIF remains native 512×320 ratio and uncropped. Size controls now live on .section-mechanic in app/globals.css: --trace-media-width, --trace-selector-ratio, --trace-selector-gap. The thumbnail widths follow the equal three-column grid; this supersedes the earlier fixed selector widths.

# Project 01 single interactive Trace showcase — 2026-10-22

- Replace only the existing three Trace rows with one centered native-ratio GIF viewer, default Reveal. Use a horizontal row of three compact buttons with still frames extracted from the supplied GIFs: 01 Reveal, 02 Manipulate, 03 Echo. Show the matching approved explanation below, one language and one application at a time.
- Selectors update the viewer, explanation and subtle active underline/opacity. Use a 140ms media crossfade, keep the previous image visible until the requested GIF has loaded, support native keyboard button activation and respect reduced motion for transitions. No new icons, cards, colored buttons or game HUD styling.
- Logic labels: TRACE → PERCEIVE; TRACE → AFFECT; TRACE → PERCEIVE / EXPAND (Chinese equivalents). Existing approved introduction, titles and bodies remain unchanged.
- All showcase sizing is scoped in app/globals.css under .trace-showcase: --trace-media-width (640px), --trace-selector-width (108px), --trace-selector-gap (20px; 12px on mobile). Viewer and stills retain the source 512×320 proportions, no cropping or forced 16:9. Mobile fits inside the content margins with three easy-to-tap selectors.
- Keep the accepted page order, Overview, Artefact, Full Walkthrough, other content, navigation, background, global Trace and other projects unchanged. This supersedes previous Trace row/large-sequence layouts.

# Project 01 reading order and compact Trace visuals — 2026-10-22

- Move Full Walkthrough to the end of Project 01 narrative content, immediately before the shared software marquee. Final order: Hero → Overview → Artefact → Core Mechanic — Trace → existing Implementation / later content → Full Walkthrough → Software Marquee → Next Project. Preserve all existing footage, controls, anchors and copy.
- Trace examples use one consistent image-left / text-right row each on desktop. Cap GIF width at its native 512px, retain 512×320 proportions without cropping, and align the three image edges and caption columns. At 800px and below, stack image above caption. Retain all supplied wording and the unified mechanic sequence. This supersedes the earlier full-width GIF presentation.

# Project 01 Artefact and Trace chapter — 2026-10-22

- Artefact now spans the full page width, with its chapter title aligned to the content gutter. This supersedes its earlier split presentation. Keep native video proportions, existing controls, audio and fullscreen control; never crop or force viewport height.
- Order: Hero → Overview → Artefact → Full Walkthrough → Core Mechanic — Trace → existing Implementation / later content → shared Software Marquee → Next Project.
- Trace is one core mechanic: perceive hidden information (Reveal), affect the environment (Manipulate), and return to perception adapted to darkness (Echo). Use only the supplied bilingual introduction and descriptions, with restrained branch labels and three sequential large visuals; no cards, feature columns or competing flowchart.
- Shared project data references trace-reveal.gif (Trace1b.gif), trace-manipulate.gif (Trace2.gif), trace-echo.gif (Trace3.gif) under public/media/projects/01-perfect-city/. Preserve original 512×320 frames and animation, render width:100% / height:auto, no crop or hover effects. Lazy-load originals; source GIFs total approximately 92 MB and retain their supplied resolution.
- Preserve Overview, Full Walkthrough, later content, global Trace, passport, background, navigation and other project layouts.

# Designer logo correction and Architecture original PDF downloads — 2026-10-22

- Game 01 uses Adobe Substance 3D Designer (Ds), replacing the generic Substance suite S icon/software entry. Use Adobe's official Designer vectors in the existing monochrome shared marquee style; retain all other software facts and marquee behavior.
- Add the supplied Emergency Refuge.pdf, New “Garbage” City.pdf and The Ideal Workspace.pdf as byte-identical public downloads for projects 04, 05 and 06 respectively. Keep all existing diagrams, page structure and content unchanged.
- Beside each Architecture project H1, show Download original PDF / 下载原版 PDF, using a same-origin download link and the original filename. Keep it visually secondary, inherit the local project text color, and allow wrapping on small screens. Other projects receive no PDF link.

# Three-group Overview refinement — 2026-10-22

- Overview exposes only Discipline / 领域, Role / 职责 and Team / Time / 团队 / 时间. Remove Contribution and software/tools from every Overview, and omit unavailable/TBD groups. Combine supplied team and time into one value with “ · ”; never create separate Team and Time columns.
- Desktop (901px+) uses one three-column row: Discipline left, Role middle, Team / Time right, including Architecture Overviews. Do not render empty placeholder fields. Smaller layouts retain responsive wrapping.
- 01: Third-person Narrative Adventure Game / 第三人称叙事冒险游戏; Game Designer · Programmer / 策划 · 程序员; 3-person Project · 2026.03–2026.09 / 3人项目 · 2026.03–2026.09.
- 02: VR Game / VR 游戏; Game Designer · Programmer / 策划 · 程序员; 6-person Project · 2026.02–2026.03 / 6人项目 · 2026.02–2026.03.
- 03: 2.5D Metroidvania Game / 2.5D 类银河恶魔城游戏; Programmer / 程序员; 5-person Project · 2025.12–2026.01 / 5人项目 · 2025.12–2026.01.
- Dali Shaxi Workshop keeps its established category (Video / 影像); Role Team Leader / 组长; Team / Time 4-person Project · 2023.07–2023.08 / 4人项目 · 2023.07–2023.08. Use existing category as discipline fallback, never invent a new discipline.
- Keep underlying source-supported Architecture records intact; the Overview projection selects only the same three groups, using existing category and supplied date where needed. Do not change original diagrams or other project content. Software remains in the existing end marquee; preserve caption, content order and chapter styling.

# Project metadata and chapter hierarchy — 2026-10-22

- Project 01 Overview: Discipline = Third-person Narrative Adventure Game / 第三人称叙事冒险游戏; Role = Game Designer · Programmer / 策划 · 程序员; Contribution = Core Mechanic Design · 95% Game Implementation / 核心机制设计 · 95% 游戏实现; Team = 3-person Project / 3人项目; Time = 2026.03–2026.09. Preserve its existing Overview caption verbatim.
- Project 01 order: Hero → Overview → existing Artefact (experience anchor, existing artefact.mp4 and poster) → Full Walkthrough (selected-work anchor, existing walkthrough.mp4) → remaining content → shared SoftwareMarquee → Next Project. Preserve video playback/sizing and existing split presentation of Artefact.
- Shared ContentSection chapter titles use --project-section-title-size, clearly smaller than the project H1, aligned to the left content gutter. Remove the empty eyebrow grid cell responsible for offset titles. Keep chapter whitespace, no decorative title box/accent. Original architecture PDF diagram lettering remains untouched.
- Project 02 Align: Discipline VR Game / VR 游戏; Role Game Designer · Programmer / 策划 · 程序员; Team 6-person Project / 6人项目; Time 2026.02–2026.03. No supplied contribution field.
- Project 03 Featherland: Discipline 2.5D Metroidvania Game / 2.5D 类银河恶魔城游戏; Role Programmer / 程序员; Team 5-person Project / 5人项目; Time 2025.12–2026.01. No supplied contribution field.
- Existing Shaxi media is Project 08 (source Ironic ShaXi.mp4). Title Dali Shaxi Workshop / 大理沙溪工作坊; Role Team Leader / 组长; Team 4-person Project / 4人项目; Time 2023.07–2023.08. Preserve video-08 and its established category/media; add no discipline claim.
- Shared Overview labels/order: Discipline / 领域, Role / 项目角色, Contribution / 个人贡献, Team / 团队, Time / 时间. Render only supplied nonempty values, omit TBD fields and software/tools. Normalize existing Date to Time and Role to 项目角色; retain other source-supported architecture facts and values. Software stays exclusively in the existing end marquee.

# Overview information and shared software / Project 01 — 2026-10-22

- Project 01 personal contribution is exactly “Core Mechanic Design · 95% Game Implementation” / “核心机制设计 · 95% 游戏实现”. Preserve all other project copy and content.
- All project Overview metadata contains project information, optional discipline and relevant supplied contribution only. Remove Tools/Software fields from the shared metadata assembly; keep project-specific software in the dedicated software array, never infer additional contributions or software.
- Project 01 software: Unreal Engine, Blender, Rhino, Adobe Substance 3D, Adobe Premiere Pro. Use the existing Film-standard SoftwareMarquee near the end, immediately before Next Project. Logos only, existing monochrome mask treatment, optical sizing, spacing, seamless motion and hover behavior; no Game-specific component or styling.
- Substance 3D uses Adobe's official suite icon, converted to a monochrome alpha mask using the original vector shapes. Adobe Premiere Pro aliases the existing shared Premiere Pro logo. Preserve all other project software lists, page layout, routing, Trace, passport and video sizing.

# Dark fluid digital environment — 2026-10-21

- Replace the global light-grey film with deep charcoal / blue-black digital space. Base RGB 23/26/33, fine monochrome grain, broad low-contrast variation and barely perceptible desaturated cool undertones. No recognizable physical material, colorful gradient, glow or new UI copy.
- Global foreground/rule colors adapt for dark-surface readability without typography or structural changes. Preserve the passport's warm paper, dark ink/logos, shape, stamps, layout and opening; add only a restrained environmental shadow.
- Architecture 04 retains its local original black project surface; 05/06 retain local white project surfaces and exact diagram geometry. Remove their body/header/footer-wide color overrides so the global environment and navigation remain dark.
- Existing Trace still uses motion-driven connected memory, subtle refraction/grain displacement, diffusion, inertia and 1.4–2 second recovery. Signed tonal disturbance is restrained by tonalStrength; no additive white/cyan/purple light trail. Retain shared Trace→Reveal, all preview behavior and video sizing rules.
- Smoothly settle material visibility, darkness and Trace strength by media/passport viewport coverage and homepage opening progress. Keep showreel/large media quiet, calm the surface around an open passport, and reduce every project-detail route. Stop rendering once motion and the short state transition settle.
- Colors/material controls live in app/globals.css: --digital-r/g/b, --digital-grain, --digital-variation, --digital-cool. Trace controls live in trace-settings.ts: intensity, tonalStrength, refraction. Shader surface uses the same CSS controls. Static procedural SVG layers provide a lightweight fallback on touch, reduced motion, unavailable WebGL or context loss.
- No changes to copy, routing, numbering, project content/structure, passport geometry, navigation behavior, fonts, bilingual behavior, normal native-ratio videos or fixed-frame preview videos.

# Passport / thumbnail preview frame correction — 2026-10-21

- Preview videos inside Passport stamps and project thumbnails are an explicit exception to intrinsic video sizing. The existing designed thumbnail frame and stamp grid always own their dimensions; metadata loading, playback and return to the image must cause no geometry change.
- Layer preview video absolutely in the same media box as the thumbnail, with width:100%, height:100%, object-fit:cover and overflow:hidden. Remove metadata-driven native-preview layout overrides. Preserve existing stamp size, border, spacing, rotation, typography, 3×3 layout and Trace/Reveal behavior.
- Normal Project Page videos retain width:100%, height:auto and uncropped original proportions. This overrides only the preview portion of the earlier native video rule.

# Trace residual memory / production completion — 2026-10-21

- Complete the existing digital surface; no lab route or unrelated design/copy/video/layout changes. Motion deposits a connected, bounded history of up to 40 organic path segments, replacing the short 12-position buffer and single moving Reveal mask.
- Shared TraceMemory drives both GPU surface displacement and project Reveal masks. Old positions remain after passage, drift slightly, expand softly, fade and recover fully in 1.4–2 seconds. A stationary pointer creates no new ambient disturbance; slow movement is almost invisible and fast movement has stronger, wider, stretched response.
- Preserve normal system cursor, existing hover activation and muted looping previews, direct project links, passport geometry and scroll opening. Reveal progressively uncovers recent explored areas; sustained hover/keyboard/touch access may activate the existing preview without a circular spotlight.
- Keep ambient Trace normal on open background, nearly absent over passport/media, reduced on every project detail route and strongly reduced when large media dominates. Retain tiny independent passport tilt/material response only.
- Fixed-size uniform buffers; capped 30fps/750k pixels; no pointer-triggered React rerenders or DOM particles. Project masks are bounded SVG image data, updated only while their visible field is active/recovering. Clean up listeners, observers, GPU resources and animation frames.
- Touch/coarse pointers and reduced motion disable ambient residual motion. With no WebGL or context loss, retain static digital surface; Reveal uses the same CPU path memory and SVG masks independently of GPU availability. Narrow desktop has local Reveal input fallback.
- Controls: trace-settings.ts size/intensity/decay/fastDecay/velocitySensitivity/refraction/diffusion/inertia; reveal-settings.ts traceWidth/strength/distortionStrength. No permanent cursor blob, obvious brush, colored layer, smoke or circles.

# Native video proportions / site-wide — 2026-10-21

- Every video owns its container height through its intrinsic dimensions: display:block; width:100%; height:auto. Control only width/max-width for smaller presentations. No fixed ratio, conflicting height, padding, cropping, cover/contain fitting or mismatch borders around video.
- Apply this to the shared Media component, project Heroes, full films/walkthroughs/Artefact, future Architecture videos, showreel and Reveal previews. Reveal preview wrappers adopt the video's natural height when metadata is available; keep the existing Reveal interaction and image-only layout.
- Project video Hero captions follow the native video in normal flow so the entire frame remains visible. Preserve playback controls, visibility pausing and reduced-motion behavior. Metadata may load before playback to establish intrinsic geometry.

# The Perfect City / Project Caption — 2026-10-21

- Replace The Perfect City's shared project summary with the user-supplied Project Caption verbatim in English, with its corresponding Chinese translation. Preserve Trace as the mechanic name.
- Approved English: The Perfect City is a third-person narrative adventure set millions of years ahead in Diaspar, Earth’s last city, where a central system controls everything. Players use Trace to expose surveillance and erased histories. Inspired by the science fiction novel The City and the Stars, the project explores technology, curiosity, privacy and freedom.
- Match this update by project title. Retain The Perfect City's existing 01 numbering and perfect-city route; do not renumber projects or change Emergency Refuge.

# 05 / 06 original diagram composition — 2026-10-20

- Apply the original-composition method to 05 New "Garbage" City and 06 The Ideal Workspace, with white detail-page surfaces. Keep each existing Project Overview treatment and cover information.
- Restore source pages 2–6 for 05 and 2–5 for 06, in exactly their original order. All diagrams, drawings, images, connections, relative positions and scales remain as supplied. Do not split, reorder or redesign their compositions.
- Delete the previous added/paraphrased narrative, headings and captions for 05/06. Rebuild original PDF text as positioned HTML, with Chinese translation through the existing language switch. Do not add or editorially correct PDF content.
- Preserve original spelling, numbers, project-internal page labels, source discrepancies and annotations. Recover malformed extraction characters only by checking the visible source glyphs. Unreadable image-baked micro-text remains in its original image rather than guessed.
- 04 remains black; 05/06 are white. Scope color changes to their detail pages; no changes to other project records, homepage/passport structure or navigation functionality.

# 04 Emergency Refuge / original diagram composition — 2026-10-20

- Replace the previous 04 editorial layout with a black detail page. Keep the existing Project Overview treatment; do not apply this change to 05/06 or other projects.
- After the cover/overview, preserve PDF pages 2–8 in their original order, with every diagram group, scale relationship and connection in its original position. This explicitly supersedes the previous crop/reordering strategy for 04 only.
- Remove all previously added or paraphrased 04 headings, captions and narrative. Use the PDF's English wording verbatim, retaining original numbers, spellings and labels; Chinese is translation only, not new content.
- Rebuild extractable PDF text in HTML at source coordinates. Preserve affine label orientations and render text-free drawing layers. Transcribe legible raster diagram labels where reliable; do not guess illegible micro-labels or alter drawing geometry.
- Retain original cover image and existing Project Overview data. No additional conceptual explanation, new project facts, invented captions or overlay effects.

# Architecture PDF integration — 2026-10-20

- Final order: 04 Emergency Refuge / 应急庇护所; 05 New "Garbage" City / 新“垃圾”城市; 06 The Ideal Workspace / 理想工作空间. Preserve existing slugs and shared project data/routing.
- The individual 04.pdf, 05.pdf and 06.pdf are the sole architecture sources. Retain verified copies under reference/architecture with descriptive names. Do not seek a combined portfolio or separate source images.
- Each first-page main image defines the Hero. Extract the image only; recreate the cover introduction, subtitle, dates, location, academic/team status, instructor and contributions as bilingual HTML using the existing language state. Normalize source portfolio numbers 03 and 02 to website 05 and 06.
- Recompose meaningful PDF visual units into varied-width scroll narratives. Preserve connected technical compositions and original architectural content; never stack whole PDF boards or invent hidden image layers. Drawing annotations may remain in English, while editable body text is translated.
- 04: hypothetical climate context → concept → Dryas systemic biomimicry → energy/megastructure → WFC slots, modules and rules → experiments → developed aggregation → construction/plans → final environment.
- 05: Cairo/Mokattam/Zabbaleen research → timeline → macro strategy → waste, roads and public space → residential/shop/school/hospital units → four recycling factories → final urban view. Retain exact two-person team/contribution facts.
- 06: site/users → massing → design development → plans/spatial organization → interiors → section → construction/facade → courtyard experience.
- Existing Trace remains quiet around large media. Keep Reveal selective on shared project thumbnails, with no fabricated technical layers. Large drawings support inspection at full resolution.
- End each architecture page with a final visual, existing logo-only Software Marquee, then Next Project. Only PDF-supported software may enter project data. Do not infer software for 05/06; unsupported empty lists produce no logo strip.
- Do not change homepage/passport structure, navigation, or Game/Film records. No new claims or marketing copy.

# Projects 01–03 supplied videos — 2026-10-20

- Project 02 / Align: supplied 02 hero.mp4 becomes the silent looping Hero, Reveal preview and extracted thumbnail; 02完整过程.mp4 fills the existing selected-work section with native controls and audio.
- Project 03 / Featherland: supplied 03hero.mp4 becomes the silent looping Hero, Reveal preview and extracted thumbnail; 03完整过程.mp4 fills selected-work with native controls and audio.
- Project 01 / The Perfect City: 01完整过程.mp4 fills selected-work; 01Artefact.mp4 fills the existing experience media section, labeled Artefact. Retain the current Hero, thumbnail, preview and technical section.
- Preserve source files, original aspect ratios and complete timelines. Full videos use manual playback with audio; convert HEVC Artefact to H.264 for browser compatibility. No new software facts, biography, project claims, routes or layout redesign.

# Film 07 Hero replacement — 2026-10-19

- Latest 07hero.mp4 from 10月19日(5) replaces Film 07's silent looping Hero and Reveal preview source. Keep the existing thumbnail, full film, software facts, routes and layout unchanged.

# Film 09 supplied media — 2026-10-19

- Latest 09hero.mp4 from 10月19日(3) replaces Film 09's silent looping Hero and Reveal preview source. Use supplied 10月19日(1)-封面.jpg as the shared project/stamp cover. The complete 09.mp4 film remains unchanged, with native controls and original audio.
- Keep video-09, current titles, existing layout and interactions; do not infer software or project facts. Preserve source files and the full film's original 3:2 image without cropping.

# Film 08 supplied media — 2026-10-19

- Keep the supplied 10月19日-封面.jpg as Film 08's shared project/stamp thumbnail.
- Latest 08hero.mp4 from 10月19日(4) replaces Film 08's silent looping Hero and Reveal preview source; Ironic ShaXi.mp4 remains the complete film with native controls and retained audio.
- Keep the video-08 route, existing titles, layout and interactions. Do not infer software or other project facts from the files. Preserve source files; serve browser-compatible H.264 copies with fast-start metadata and poster frames.

# Digital surface and global Trace — latest override, 2026-10-17

- Physical exploration leaves stamps; digital exploration leaves traces. Express this through existing production interactions only, without explanatory UI copy or a new lab route.
- Replace all OSB/wood-chip material with a quiet light cool-grey digital film: fine grain, subtle irregular tonal variation, no recognizable physical material or gradient-wallpaper treatment. Media remains the main source of color.
- Desktop background Trace is broad, soft, organic, speed-sensitive refraction/grain displacement with a residual that recovers in roughly 1–2 seconds. System cursor remains unchanged. No glow, particles, smoke, circles, HUD or decorative UI.
- One bounded GPU surface uses a fixed 12-slot buffer; render only during pointer disturbance/recovery, limit resolution and frame rate, stop when hidden or scrolling without active traces. Disable on touch/coarse pointers and reduced motion; use static CSS fallback if WebGL is unavailable or lost.
- Production Reveal Field uses the same organic boundary language and receives desktop pointer approach/velocity from the shared Trace input. Preserve original-color discovery, activation, muted preview, direct links and keyboard/touch access. No blanket effects on all imagery.
- Approved passport layout, typography, contents and scroll opening remain intact. Only a sub-degree independent paper tilt and low-contrast paper light response are added.
- Large project/showreel media substantially suppresses global Trace intensity. The effect always remains behind page contents.
- Pointer explores; hover/approach discovers; reveal uncovers; click enters; scroll travels. These words are principles and must not appear as new interface copy.
- Supersedes previous wood/steel backgrounds and strictly separate background/Reveal interactions.

# Shared Software Marquee and Film 07 — latest override, 2026-10-17

- Every Project Page mounts the shared full-width Software Marquee near the end, directly before Next Project. Only render available logos explicitly listed in that project's software array; unknown/missing assets are omitted, never replaced by text. An empty supported-logo list renders no empty strip.
- Logos only: no visible software names, text labels, brand colors or surrounding cards. Keep screen-reader labels. One near-black system, balanced optical sizes, generous equal gaps and a seamless continuous horizontal loop; individual hovered marks may darken / grow slightly. Respect reduced motion with a static strip.
- Film 07 software is explicitly Photoshop, Blender, Premiere Pro, After Effects. Existing project software facts may be represented in the new software list; do not infer software for other projects.
- Film 07 supplied hero.mp4 is the project's silent looping Hero and short preview source; supplied film07.mp4 is the complete film in its existing content section, with user-operated native controls and retained audio. Preserve original source files and the existing video-07 route/title. No unrelated page redesign or copy changes.

# Identity edge alignment — latest refinement, 2026-10-16

- The portrait/name column and four-field information column share top and bottom edges. Distribute the four fields within the shared row height, including when Chinese copy is shorter.
- Major labels use their natural text width plus a small 7px gap before the major value; remove the fixed-width empty label track.

# Collected-stamp and identity refinement — latest override, 2026-10-16

- Put the name below the portrait stamp. Align birth date, phone, email and English proficiency on shared label/value tracks alongside it.
- Render each school and its dates on the same row. Move The Bartlett School of Architecture / 巴特莱特建筑学院 into parentheses after Cinematic and Videogame Architecture / 电影和电子游戏建筑.
- Skills heading is Skills / 技能; omit / Tools and / 工具. Align the resume link and its download note by their text baselines.
- Project stamps now have restrained individual rotations and size differences, with a few folded corners. This supersedes the strictly unrotated stamp treatment; preserve the underlying 3×3 grid and Reveal Field.
- Keep the corrected passport proportions, wood background, original project media, routes and homepage opening timeline.

# Global chipboard background — latest override, 2026-10-16

- Replace the global brushed-steel base with matte, pale warm natural chipboard / oriented-strand-board texture. Recognizable irregular wood flakes, restrained contrast and readable dark typography.
- Apply the same material to body, navigation, footer and existing base-surface panels. No metal reflection or pointer highlight remains active.
- Keep project imagery/videos in their original colors, pink passport paper, all existing layouts and interactions. Use a locally stored, reusable optimized texture tile.
- This supersedes earlier steel-background and metal-response decisions.

# Projects directory labels — latest override, 2026-10-16

- Directory title is Projects / 项目. Remove the INDEX / 01—09 eyebrow and small (09) beside the large heading.
- English category labels on the directory and its category jump links are Video Game, Architecture and Film. Keep the existing Chinese translations, category IDs, project titles, routes and 01–09 project numbers.

# Passport detail cleanup — latest override, 2026-10-16

- Portrait uses the same cream paper backing and perforated stamp edge as the project stamps. Keep it secondary and preserve identity alignment.
- Display the Adobe suite label as Adobe Creative; retain its existing Creative Cloud logo.
- Remove the Resume / TBD (简历 / TBD) line from the passport. Keep the download link and work/project-experience download note. The final PDF asset remains pending.
- Remove the 01–09 range from the project-index panel heading; retain the individual project stamp numbers.

# Passport alignment refinement — 2026-10-16

- Align portrait and identity facts as one block: photo top aligns with name label, photo bottom with birth-date value. Keep name/date labels on one vertical text edge.
- Keep each school and its year immediately together; remove space-between distribution and fixed school row heights. Align education column headings and major labels.
- Lay tool groups out in aligned rows with a shared category-label track and four equal icon/name columns. Keep all logos near-black. Use the available left-page height for these rows and keep the resume near the page bottom, avoiding a large unused lower block.
- Keep corrected passport proportions, scroll/opening animation, stamp grid, Reveal Field and all supplied content.

# Passport corrections — latest override, 2026-10-16

- Correct physical geometry: CLOSED = portrait 88:125 (width/height 0.704), OPEN = two portrait leaves side-by-side, 176:125 (1.408). Use ratios, never literal mm. Keep rounded cover and page edges. This corrects the previous reversed dimensions.
- About Languages contains only English — IELTS 7.0, working proficiency (retain the existing Chinese translation of that English proficiency statement). Remove Chinese from the listed languages, without changing the site language switch.
- Passport typography, labels/values, dates, education, tool groups and icons share explicit alignment tracks and spacing. The 3×3 stamp grid has equal gaps, aligned media/title/number edges and no casual resting rotations. Retain perforated stamp character and existing Reveal Field interactions.
- All tool marks use recognizable vector silhouettes in one near-black grayscale system, with equal optical boxes and aligned labels. No native brand colors or weak pale-grey marks.
- Preserve homepage scroll timeline and opening transforms, project interactions, metal material, routes and project pages. Preserve all other About facts and copy.

# Homepage sequence — latest override, 2026-10-16

- One ordinary-scroll timeline controls Showreel recession, closed booklet arrival and physical hinge opening. Upward scrolling reverses the same progress, without snapping, wheel interception, autoplay choreography or an open-state latch.
- Closed portrait leaf ratio 88:125 (0.704:1); open spread 176:125 (1.408:1). Reflow content into two portrait pages. Rounded physical cover/page edges supersede the sharp-corner rule for the booklet only. Preserve all About facts.
- Fully open content retains Reveal Field, original colors, silent Hero previews and clickable stamps. Preserve project-entry architecture for a future shared-media transition; no project-page redesign in this pass.
- Dark irregular brushed steel keeps broad soft reflections, with reduced pointer feedback over the passport; no circular cursor spotlight.
- Narrow/short screens use a simpler scroll arrival and readable open pages; reduced motion uses normal-flow Showreel and open content. No new copy.

# Current decisions — 2026-10-16 (take precedence over earlier drafts)

- Homepage flow: Hero Showreel → scroll-opening Passport/About with project stamps. Remove the homepage About teaser and repeated Projects Directory. Keep /about and /projects; top navigation always links to those dedicated routes.
- Homepage booklet starts closed and unfolds through perspective, hinge rotation and changing shadows as ordinary vertical scrolling brings it into view. No scroll hijacking or snapping. Once open, personal details, project Reveal Field, muted previews and links work normally. /about displays the same composition already open. Reduced motion provides the open static composition.
- Use two portrait pages side-by-side at an open spread ratio of 1.408:1, keeping information readable and the portrait secondary. Remove the external 01–09 label above the booklet; the internal index remains.
- Strengthen the global steel background: darker neutral grey, irregular vertical grain, richer diffuse reflections and restrained pointer-responsive highlight movement. Avoid uniform stripes, mirror chrome and sci-fi styling. Keep all material effects behind content and off project media.
- Dates, indices and small metadata labels use clean sans-serif typography throughout; no monospace/pixel styling.
- Central project titles: 01 = The Perfect City (完美之城), 02 = Align (Align). Retain all existing slugs and numbering. Development-lab fixtures should read the same project titles.
- Passport tool marks use one unified monochrome treatment. VISUAL / 2D shows only Adobe Creative Cloud; do not list the six individual Adobe software marks in this view. Preserve the recognizable original logo shapes.

- Preserve existing routes, shared project data architecture, EN / 中文, continuous 01–09, project structure, sharp corners, grid and Reveal Field. Keep /interaction-lab as an unlinked development reference. Do not redesign individual Project Pages.
- Global base background: light neutral silver-grey, matte stainless steel with fine vertical brushed grain. Use lightweight procedural CSS; no chrome, mirror or sci-fi treatment. Apply texture to background surfaces only; project images/videos retain their original colors and receive no metal filter. Reveal Field remains the chosen interaction.
- About refinement: present a compact, independent open passport booklet, centered on the silver site background, with distinct paper pages, a cover edge, page frames and a central fold. Left page contains personal details, education and tools; right page collects projects 01–09 as actual postage-stamp-shaped media objects with fine perforated edges. This supersedes the earlier flat full-width record layout and restriction on postage edges. Use the real project imagery, never invented stamp illustrations, official seals, signatures or document details. Keep the portrait small and secondary. Mobile stacks the booklet pages while preserving their paper edges and all content.
- Right-side project marks reuse real project thumbnails, number, title and Reveal Field: rest → pointer reveal → activation → muted looping available hero preview → click into existing project route. Missing media uses neutral placeholders. Projects dominate the portrait.
- Global copy rule: never invent slogans, biographies, project meanings, positioning statements or poetic/marketing copy. Only display user-provided factual content or neutral functional labels. Unprovided content must be TBD, empty, or omitted. This supersedes all earlier instructions to invent sensible draft copy. Remove existing invented copy throughout the site, including homepage, directory, footer and project descriptions; preserve factual project details supplied by the user.
- Name: 王紫霄 / Wang Zixiao. Date of birth: 2002.04.16. Phone: +86 150-3378-9009. Email: zixiao.wang0416@outlook.com. Phone and email must be clickable. Languages: English — IELTS 7.0, working proficiency only; omit Chinese from this field.
- Undergraduate: Xi'an Jiaotong-Liverpool University / 西交利物浦大学, 2020–2022; University of Liverpool / 利物浦大学, 2022–2024. Major: Architecture / 建筑.
- Postgraduate: University College London / 伦敦大学学院, 2025.09–2026.09; The Bartlett School of Architecture / 巴特莱特建筑学院. Major: Cinematic and Videogame Architecture / 电影和电子游戏建筑.
- Tools, grouped exactly: GAME / 3D / TECH — Unreal Engine, Rhino, Blender. AI / PRODUCT / COLLABORATION — Codex, Claude Code, Figma, GitHub. VISUAL / 2D — Adobe Creative Cloud (a single suite mark representing the supplied Adobe tools). Do not add inferred skills.
- About finish: warm muted peach-pink paper (#dfbdad), matching the warm dusty-pink passport reference, with warm brown-grey rules and cover edges; lightly worn outer booklet edges and dashed section dividers. Align all text and keep the information and skill layout compact.
- About tools use transparent silhouette cutouts of the logos from the supplied reference, with readable names beneath, preserving the three exact groups. Do not show rectangular paper-texture crops around the logos. Keep equal optical size and aligned baselines.
- Use the supplied outdoor photo as a half-body crop in the identification-photo slot; preserve the original source and keep the photo smaller than project stamps. Beside the PDF link display: 工作经历和项目经历可下载完整版。 / Download the full version for work and project experience. The final resume PDF is still pending and its TBD label must remain until replaced.
- The final resume is still pending. The Perfect City hero footage is already supplied and is not the homepage personal showreel. Do not invent unavailable project titles or media.

---

> Historical brief follows. Current decisions above supersede conflicting placeholder content, visual treatment and About requirements. Read `VISUAL_V2_BRIEF.md` for unchanged V2 guidance.

You are helping me build my personal portfolio website from scratch.

This is primarily a job-search portfolio. I am targeting Game AI Product Manager roles, while also applying to some visual / creative roles.

My background combines architecture, game design, interactive experience design, Unreal Engine development, and an interest in AI products.

The website should communicate this within the first 30 seconds:

> She has a background in both architecture and games. She has strong visual judgment, but she also thinks logically and understands systems.

Logic and clarity are slightly more important than pure visual spectacle.

---

# 1. Your first task

Create a complete local portfolio website project from scratch.

Before implementation, create a file in the project root called:

`MASTER_BRIEF.md`

Copy the requirements from this prompt into that file in a clean, structured format.

Treat `MASTER_BRIEF.md` as the design and product source of truth for this website.

When making future design or development decisions, check this file first.

Then build the first working version of the website.

I want the first version to already feel like a designed portfolio website, not a wireframe.

It should have:

- complete site architecture
- responsive layouts
- visual design system
- core animations
- project interactions
- placeholder media
- all 9 project routes
- About page
- project detail page system
- English / Chinese language system

Actual project content, images, videos, and copy will be gradually replaced later.

Do NOT wait for all final assets before building.

---

# 2. Technical direction

Choose a modern stack that is easy to maintain and works well with Codex.

Preferred starting stack:

- Next.js
- TypeScript
- Tailwind CSS
- Framer Motion

Use the current stable versions when creating the project.

Do NOT introduce Three.js or heavy WebGL dependencies in the first version unless absolutely necessary.

The website needs motion, but it does not need to become a WebGL demo.

Architecture should be modular and easy to edit later.

Project information should be data-driven rather than hard-coded repeatedly into components.

Create reusable components where appropriate.

The first milestone only needs to run locally.

Do NOT spend time on:

- GitHub deployment
- custom domain
- production hosting
- CMS
- analytics
- database
- authentication

These can come later.

---

# 3. Overall creative direction

The website should feel:

- young
- lively
- creative
- experimental
- visually intelligent
- playful without being childish
- structured underneath the experimentation

It should NOT look like:

- a generic UX portfolio template
- a corporate portfolio
- a standard architecture portfolio
- a gaming HUD
- a cyberpunk interface
- a cute sticker website
- an over-designed WebGL experiment
- an AI-generated website template

The site should feel like a personal creator's website rather than a standard job application template.

However, recruiter usability is extremely important.

A recruiter should immediately understand where the projects are and how to navigate the site.

The basic principle is:

**creative presentation + very clear information architecture**

---

# 4. Visual philosophy

The projects themselves should remain the visual focus.

The website UI should support the work rather than overpower it.

Use:

- strong image composition
- experimental typography
- motion
- geometric graphic elements
- thin lines
- frames
- grids
- numbering
- index-like labels
- coordinate / annotation-inspired details when appropriate

Avoid:

- stickers
- doodles
- cute icons
- decorative illustrations
- excessive gradients
- fake futuristic HUD graphics

The visual system may borrow slightly from architectural drawings, indexing systems, editorial layouts, and interactive media interfaces, but should never become literal architectural drafting graphics.

---

# 5. Alignment and layout

Experimental does NOT mean randomly misaligned.

Visual alignment is important.

Use a strong underlying grid.

Elements may move, scale, crop, or animate, but their resting layout should feel intentional and aligned.

Default image corners should be square / sharp.

Avoid excessive rounded cards.

Special exceptions are allowed only when they have a clear purpose.

---

# 6. Density

Use a mixed rhythm.

Visual sections:

- large
- immersive
- sometimes full-bleed
- image/video dominant

Information sections:

- more whitespace
- restrained typography
- easy to scan

Do not make every section equally dense.

---

# 7. Typography

Use sans-serif typography.

English and Chinese may use different font families if needed, but they should feel visually compatible.

Typography can become experimental in:

- category names
- section titles
- project numbers
- decorative labels
- navigation transitions

Examples of acceptable experimentation:

- vertical text
- edge-aligned text
- rotated labels
- oversized category typography
- text crossing layout boundaries
- unusual title placement

But body copy and project information must remain highly readable.

Do not use my name as a giant typographic motif.

My name is:

Zixiao Wang

It should appear where identity is necessary, but it should NOT dominate the website visually.

Do not create a personal initials logo.

---

# 8. Color system

Do not lock the entire website into either dark mode or light mode yet.

The final background direction will be decided after real project assets are added.

Create the color system so it can support both light and dark sections.

Project category identities:

Game = purple  
Architecture = black / neutral dark  
Video = pink

IMPORTANT:

These colors should NOT divide the homepage into three giant colored zones.

The default Projects Directory should feel visually unified and restrained.

Category colors should appear more subtly through:

- labels
- lines
- hover states
- transitions
- small graphic elements
- active states

The projects should still feel like they belong to one portfolio.

Use CSS variables / design tokens so colors can easily be changed later.

---

# 9. Site architecture

Main structure:

Home

About

Projects

Project Detail Pages

Optional Deep Dive Pages

The main navigation should contain:

EN · 中文

About

Projects

Do NOT add Resume as a top-level navigation item.

Resume download belongs inside About.

---

# 10. Language system

The website needs:

English  
Chinese

Default language:

English

Do NOT display both languages simultaneously.

Use a language toggle:

EN · 中文

Build the content architecture so all text can easily have English and Chinese versions later.

For placeholder content, write sensible temporary English and Chinese copy.

Do not duplicate entire page components for each language.

Use a centralized content/data structure.

---

# 11. Homepage structure

Homepage sequence:

01 Hero Showreel

02 About Preview

03 Projects Directory

The page uses normal continuous scrolling.

Do NOT use forced full-page scroll snapping.

---

# 12. Hero Showreel

The first screen is a full-screen personal showreel.

The showreel will eventually combine footage from multiple projects:

- Diaspar / The Perfect City
- VR work
- Featherland
- architecture work
- video work

For now use a replaceable placeholder video/media area.

Important behavior:

- full viewport
- video dominant
- silent
- autoplay when possible
- plays once while visible
- user can scroll past it at any time
- NEVER lock scrolling
- when the video finishes, smoothly encourage / transition the page toward the About Preview
- if the user scrolls back to the Hero later, restart the showreel from the beginning
- when Hero is no longer active, stop/pause unnecessary playback

Do not display my name prominently over the showreel.

Navigation should initially be hidden during the opening Hero.

Once the user leaves the Hero, navigation appears and remains accessible.

Respect browser autoplay limitations.

---

# 13. About Preview

Immediately after the showreel, show a short About Preview.

The main element should be one short personal positioning sentence.

Do NOT simply write:

Game Designer / Architect / AI Product Manager

The sentence should eventually communicate my way of thinking and cross-disciplinary background in a more personal way.

For now use placeholder copy clearly marked for replacement.

The About Preview should have a small interactive quality.

Possible future interaction directions include:

- mouse-responsive typography
- hover words revealing project imagery
- draggable geometric element
- subtle reveal interaction

Do NOT over-engineer this yet.

Build a lightweight interaction that can later be replaced.

Clicking / interacting with the About Preview should provide a clear route to the full About page.

---

# 14. Full About page

Create an independent About page.

It should eventually contain:

- personal photo
- short introduction
- Skills
- Education
- Resume download
- Email
- Phone

Do NOT create a large Work Experience / Internship / Exhibition section.

Skills should support at least two groups:

Capabilities

Tools

Example structure only:

Capabilities
- Game Design
- Interactive Experience Design
- Spatial Design
- System Thinking
- Prototyping
- Visual Communication
- AI-assisted workflows

Tools
- Unreal Engine
- Rhino
- Grasshopper
- Blender
- Adobe tools
- Figma
- etc.

These are placeholders and will be edited later.

Create a visible:

Download Resume PDF

button/link.

Use a placeholder resume file/path for now and make replacement easy.

Use a placeholder portrait.

Contact information should use obvious placeholders rather than invented information.

---

# 15. Projects Directory

The Projects section should NOT feel like a conventional card grid.

It should feel more editorial and designed.

However, visual alignment remains important.

There are three categories, displayed vertically on the same page:

GAME

ARCHITECTURE

VIDEO

Do NOT require users to click a category before seeing its projects.

All three categories should be visible by scrolling down the Projects Directory.

Each category contains exactly three projects.

All three projects within a category should be visible together rather than revealed one-by-one through scrolling.

Images are the primary element.

Project titles and numbers are secondary.

---

# 16. Project numbering

Use continuous numbering across categories.

GAME

01 Diaspar / The Perfect City

02 VR Project

03 Featherland


ARCHITECTURE

04 Emergency Refuge

05 TBD Architecture Project

06 TBD Architecture Project


VIDEO

07 TBD Video Project

08 TBD Video Project

09 TBD Video Project

Do not restart numbering inside each category.

The 01–09 system should become part of the visual identity.

---

# 17. Project thumbnails

Project imagery should dominate.

Default thumbnail state:

Use a restrained unified visual treatment / filter so projects with very different visual styles still feel coherent together.

On desktop hover:

- restore / reveal original color
- allow a short muted video preview where available
- introduce subtle motion
- reveal supporting project information

On mobile:

There is no hover.

Translate the interaction intelligently into touch behavior.

Do NOT require double-tapping simply to open a project.

Possible mobile behavior:

- preview activates when sufficiently visible in viewport
- project remains directly tappable

Choose the cleanest implementation.

Video previews must be muted.

Avoid loading every preview video simultaneously.

Use lazy loading / viewport-aware behavior.

---

# 18. Project transitions

When opening a project, use a meaningful but restrained transition.

Preferred direction:

the selected project image expands / transforms naturally into the Project Hero.

A shared-element-like visual transition is desirable.

Do not make navigation slow just to show animation.

If a simpler transition performs better, prioritize usability.

---

# 19. Project page base template

All 9 projects use one flexible base template.

Do NOT create three completely different templates for Game / Architecture / Video.

The base template should support flexible content blocks so different disciplines can still be presented appropriately.

Suggested structure:

PROJECT HERO

↓

PROJECT INFO

↓

PROJECT CONTENT SECTIONS

↓

OPTIONAL TECHNICAL / DEVELOPMENT SECTION

↓

OPTIONAL DEEP DIVE LINKS

↓

NEXT PROJECT

---

# 20. Project Hero

First screen:

full-screen project image or video

+

small / restrained project title

The media is the hero.

Do NOT use an enormous project title that competes with the work.

Project title should remain clearly readable but visually secondary.

---

# 21. Project Info

Immediately after the Hero, show concise project metadata.

Support fields such as:

Role

Year

Type

Tools

Team

Duration

Not every project needs every field.

The data model should allow fields to be omitted cleanly.

Do NOT force empty metadata onto the page.

---

# 22. Project content

The page should be a continuous long-form page with clear chapters.

It should sit between:

a long scrolling page

and

a structured case study.

Use clear section headings, but do not make the project feel like a slide deck.

Support both:

image + short text layouts

and

independent text paragraphs between visual sections.

Different projects can use different combinations.

Visual content should remain dominant.

---

# 23. Final work vs process

Prioritize finished work.

The main project pages should mostly show:

- final game footage
- final renders
- final environments
- final architectural images
- final videos
- strong visual outputs

Do NOT fill the page with process documentation.

For relevant projects, allow one dedicated section such as:

TECHNICAL

DEVELOPMENT

SYSTEM

IMPLEMENTATION

This section may contain:

- Unreal Blueprint screenshots
- system diagrams
- flow diagrams
- development logic
- selected process material

This is especially relevant to Diaspar / The Perfect City.

It should be optional for other projects.

---

# 24. Project media behavior

Project videos embedded inside pages should generally:

- autoplay when visible
- be muted
- loop
- behave like visual media rather than traditional video players

Use sensible accessibility and browser behavior.

Pause videos when they are far outside the viewport where practical.

Use poster images/placeholders.

Performance matters.

---

# 25. Deep Dive system

Some projects may contain separate Deep Dive pages.

A Deep Dive is NOT required for every project.

The Perfect City may eventually contain several.

Other projects may contain zero.

Deep Dive topics are currently TBD.

Do not invent the final topics.

Create the routing/data architecture so a project section can optionally contain:

Deep Dive →

or

Explore System →

which opens a separate page containing more detailed text, diagrams, imagery, or technical explanation.

This allows the main project page to remain visually concise while deeper information remains available.

---

# 26. Next Project navigation

At the bottom of every project page, include:

Next Project →

Include the next project's:

- number
- name
- visual preview where appropriate

The sequence should follow 01 → 09.

For project 09, loop back to 01 or provide a clear return to Projects.

Choose whichever feels more natural in the implementation.

---

# 27. Motion system

Motion is important to this portfolio.

Use motion for:

- scroll reveals
- image movement
- typography movement
- hover previews
- page transitions
- project transitions
- category interaction
- About Preview interaction

But establish a consistent motion language.

Do not animate everything independently.

Prefer motion that responds to:

- scroll
- hover
- viewport entry
- navigation state
- content hierarchy

The website should feel alive, not chaotic.

---

# 28. Scrolling

Use normal continuous scrolling.

Smooth scrolling is acceptable if implemented responsibly.

Do NOT create mandatory screen-by-screen snapping.

Do NOT hijack the user's scroll aggressively.

---

# 29. Cursor

Keep the normal system cursor.

Do NOT replace it with a custom cursor.

Interactive elements may react through:

- scale
- movement
- underline
- preview media
- labels
- graphic responses

But preserve normal cursor usability.

---

# 30. Optional game-like interaction

The website may eventually contain a small optional game-like interaction / Easter egg.

This is NOT part of the primary navigation.

It must NEVER block recruiters from accessing content.

Conceptually, it may borrow from the exploration / reveal / Trace logic of The Perfect City:

discover

scan

reveal

activate

But do NOT build a literal mini-game yet.

For V1, prepare the component architecture so a future experimental interaction can be added without restructuring the site.

A very subtle Easter egg placeholder is acceptable.

---

# 31. Loading experience

Create a dedicated loading experience for initial media loading.

Direction:

experimental graphic design

NOT:

game loading screen

Keep it short and restrained.

It should not become a second intro sequence.

Use simple geometry / lines / percentage / indexing if appropriate.

Do not artificially delay loading just to show the loader.

---

# 32. Mobile

Mobile is important.

Do not simply remove every interesting interaction on mobile.

Preserve the core character of the website.

Translate desktop behaviors intelligently:

hover → viewport/touch behavior

mouse interaction → touch interaction

large experimental typography → responsive composition

full-screen media → mobile-safe media

Prioritize:

- readability
- tap targets
- loading performance
- project discovery

The mobile site should feel intentionally designed, not like a compressed desktop site.

---

# 33. Audio

No background music.

No UI sound effects.

Showreel is silent.

Preview videos are silent.

Embedded looping media should be muted.

---

# 34. Performance

This will eventually be a media-heavy portfolio.

Build with performance in mind from the beginning.

Use:

- lazy loading
- responsive images
- optimized image components where appropriate
- video poster frames
- viewport-aware video playback
- sensible preloading
- reusable media components

Do not load all nine project videos immediately on page load.

Avoid huge JavaScript dependencies without a clear reason.

---

# 35. Accessibility

Experimental design should not destroy usability.

Include:

- semantic HTML
- keyboard-accessible navigation
- visible focus states
- alt-text architecture
- reduced-motion support
- sufficient text contrast
- sensible heading hierarchy

For:

`prefers-reduced-motion: reduce`

disable or simplify non-essential movement.

---

# 36. Content architecture

Create a centralized project data structure.

For example, each project should be able to store:

id

number

slug

category

titleEN

titleZH

subtitleEN

subtitleZH

year

role

tools

team

heroMedia

thumbnail

previewVideo

metadata

sections

technicalSection

deepDives

nextProject

Do not treat this exact schema as mandatory if you can design a cleaner TypeScript structure.

The important requirement is:

I should be able to update project information later without rewriting page components.

---

# 37. Placeholder strategy

Many final assets are not ready.

Do not invent fake polished projects.

Use intentional placeholders.

Create a clear asset structure, for example:

/public/media/home/

/public/media/projects/01-perfect-city/

/public/media/projects/02-vr/

/public/media/projects/03-featherland/

etc.

Provide obvious filenames such as:

hero-placeholder.jpg

thumbnail-placeholder.jpg

preview-placeholder.mp4

Replace these with CSS/gradient/neutral placeholder blocks if actual placeholder binary media is unnecessary.

The website must not break when optional media is missing.

Create graceful fallbacks.

---

# 38. Current project list

Use this initial data:

01
Diaspar / The Perfect City
Category: Game

This is the most important project.

It is an Unreal Engine interactive architecture / game project adapted from Arthur C. Clarke's The City and the Stars.

The project combines:

- environment design
- narrative
- game mechanics
- Unreal Engine implementation
- interaction systems
- spatial experience

I implemented most of the Unreal Engine mechanics.

Do not write a long final case study yet.


02
VR Project
Category: Game

Content TBD.


03
Featherland
Category: Game

2.5D Metroidvania project.

Content TBD.


04
Emergency Refuge
Category: Architecture

Future extreme-cold shelter project involving architectural systems, Grasshopper / WFC and Unreal Engine visualization.

Content TBD.


05
Architecture Project
Category: Architecture

TBD.


06
Architecture Project
Category: Architecture

TBD.


07
Video Project
Category: Video

TBD.


08
Video Project
Category: Video

TBD.


09
Video Project
Category: Video

TBD.

---

# 39. Reference direction

The overall portfolio direction should be closer to a personal creative portfolio than a corporate portfolio.

A useful conceptual reference is the balance between:

- playful personal creator website
- clear game designer portfolio
- editorial image-led portfolio

I especially like websites that feel:

- light
- personal
- unconventional
- easy to explore
- project-image driven

I do NOT want complexity simply for the sake of showing frontend engineering skill.

This website represents my work.

The website itself should not overshadow the work.

---

# 40. Important design tension

Maintain this tension deliberately:

PLAYFUL
but
LOGICAL

EXPERIMENTAL
but
ALIGNED

VISUAL
but
EASY TO SCAN

YOUNG
but
PROFESSIONAL

DYNAMIC
but
FAST

PERSONAL
but
NOT SELF-INDULGENT

This is one of the most important parts of the brief.

---

# 41. Development quality

Do not put the entire site into one giant component.

Create a sensible architecture.

Possible structure:

components/

components/layout/

components/home/

components/projects/

components/media/

components/motion/

data/

lib/

app/

You may improve this structure.

Keep code readable.

Avoid premature abstraction.

Do not create complicated state management unless needed.

Add comments only where the implementation is not self-explanatory.

---

# 42. V1 success criteria

V1 is successful when I can run the website locally and experience:

1. a polished full-screen Showreel opening
2. transition into About Preview
3. working navigation
4. English / Chinese switching
5. complete Projects Directory
6. all 9 project entries
7. hover / preview behavior
8. working project routes
9. reusable Project Page template
10. working About page
11. placeholder Resume download
12. project-to-project navigation
13. responsive mobile version
14. meaningful motion
15. basic loading experience
16. clear placeholder asset system
17. architecture ready for future Deep Dive pages

It should already visually resemble a real portfolio website.

Do not stop at scaffolding.

---

# 43. What is intentionally TBD

Do NOT block development because these are unknown:

- final showreel video
- final portrait
- final resume PDF
- final About copy
- final positioning sentence
- exact fonts
- exact background color
- exact purple / pink values
- Architecture projects 05–06
- Video projects 07–09
- full project copy
- final project metadata
- final Deep Dive topics
- final project images
- final preview videos
- custom domain

Build the system so these can be replaced later.

---

# 44. Before coding

Before implementing:

1. Read this entire brief.
2. Create `MASTER_BRIEF.md`.
3. Propose the file/folder architecture.
4. Identify the reusable component system.
5. Define the project data schema.
6. Define the initial design tokens.
7. Then implement.

Do not repeatedly ask me about details explicitly marked TBD.

When a minor design decision is unspecified, make a strong reasonable design decision consistent with this brief instead of stopping development.

Only ask me when a decision would materially change the architecture or creative direction.

---

# 45. After implementation

When the first version is working, give me:

1. exact command to run the site locally
2. short explanation of the project structure
3. where I replace the homepage showreel
4. where I replace project thumbnails
5. where I replace project preview videos
6. where I edit project information
7. where I edit English / Chinese text
8. where I replace my portrait
9. where I replace my resume
10. a short list of the next highest-priority improvements

Do not start deployment yet.

Build the local V1 first.
