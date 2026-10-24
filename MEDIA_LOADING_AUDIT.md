# Media loading audit — 2026-10-24

No media was compressed, replaced, deleted or visually edited. No deployment configuration changed.

## Loading changes

- Previously the shared Media component attached every video URL and poster at render with preload=metadata, including Film 07's below-the-fold full film. Pausing offscreen did not prevent metadata/poster requests.
- Previously Project 01 attached all five Trace/Narrative demonstration URLs and posters immediately, including inactive selectors. All requested metadata regardless of scroll position.
- Shared non-Hero videos now attach URLs/posters within 400px of the viewport. Project 01 attaches only the selected demonstration at that distance; other demonstrations wait for selection. Playback still requires actual visibility. Native video controls, muted loops, selectors and crossfades are unchanged.
- Hero/priority videos retain immediate metadata loading and their existing playback. New future clips absent from the dimensions registry retain metadata loading so their intrinsic size can be discovered.
- Projects/About preview videos already mounted only on Reveal engagement. Keep that gate and use preload=none so mounting a paused preview does not itself request metadata. Playback still starts on the existing hover/focus/mobile engagement.
- Existing images already use loading=lazy except priority Hero images; retain those settings. Existing YouTube embeds already mount within 400px with loading=lazy and remain unchanged.

## Stability and compatibility

data/video-dimensions.json records the actual native width/height of the current local MP4s, read from their MP4 track headers without decoding or modifying them. Shared video elements use these attributes even before a URL is attached. Showcase elements retain their existing width/height attributes. No new placeholder UI, fixed 16:9 rule or cropping was added. Update a registry entry if its source clip is later replaced with different dimensions.

Public URLs still pass through publicPath(), including /portfolio in static builds. No browser filesystem access or runtime server is required.

## Local browser verification

- Project 01 at the top: only Hero MP4 requested. Scrolling to Trace requests Reveal only; selecting Manipulate requests that video; Echo/Dialogue/Inventory remain unrequested until needed. The main viewer height is identical before/after loading.
- Film 07 full film: no initial src, attaches near viewport with metadata only, stays paused with native controls, native 16:9 height unchanged after loading.
- Projects and About: zero idle MP4 requests, one corresponding request after hover, thumbnail width/height unchanged.
- TypeScript verification passed. These are request/geometry checks, not a claim of a measured improvement in public-network load time.

## Candidates for a separate compression pass

Sizes below are whole-file MiB (1 MiB = 1,048,576 bytes), not necessarily initial network transfer. Paths are relative to public/media/projects/.

| Active file | MiB |
| --- | ---: |
| 01-perfect-city/trace-reveal.mp4 | 27.64 |
| 01-perfect-city/trace-echo.mp4 | 27.56 |
| 01-perfect-city/npc.mp4 | 22.02 |
| 01-perfect-city/trace-manipulate.mp4 | 21.40 |
| 01-perfect-city/inventory.mp4 | 21.34 |
| 07-video-07/film07.mp4 | 19.05 |
| 02-vr/hero.mp4 | 8.85 |
| 03-featherland/hero.mp4 | 7.88 |
| 07-video-07/hero-v2.mp4 | 6.94 |
| 08-video-08/hero-v2.mp4 | 6.24 |
| 09-video-09/hero-v2.mp4 | 6.04 |
| 01-perfect-city/hero.mp4 | 5.94 |

Architecture drawings reach 1.45 MiB each (04 original/page-8.webp and page-6.webp); 05 original/page-2.webp is 1.38 MiB. The 05 Hero image is 1.10 MiB. Existing lazy loading limits offscreen requests, but these remain full-resolution images.

The retired, unreferenced local GIFs remain untouched: npc.gif 107.39 MiB, inventory.gif 90.50 MiB, trace-manipulate.gif 42.08 MiB, trace-reveal.gif 30.33 MiB, trace-echo.gif 15.23 MiB. They are not loaded by the five demonstrations and are already ignored by Git; their local disk size is not a current initial-load bottleneck.

## Remaining bottlenecks

Above-the-fold Hero playback still downloads video data immediately as required by the current experience; the 02/03 Heroes are the largest active Hero clips. Static export serves original-resolution images (no runtime Next image optimizer), so mobile devices still receive those original bytes. Large demonstration loops/full Film 07 still cost bandwidth when played, and YouTube has its own player/network overhead when approached. This change defers work rather than reducing media file sizes or JavaScript/hydration costs.
