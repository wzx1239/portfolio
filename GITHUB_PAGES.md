# GitHub Pages static export (prepared; not deployed)

The current site is build-time data + client interactions. No API routes, server actions, request cookies/headers, ISR, authentication backend or runtime Node.js service are required.

## Build

Use Node >=22.18 and the existing lockfile/dependencies. For a repository site, set the exact repository subpath before building:

```powershell
$env:NEXT_PUBLIC_BASE_PATH='/portfolio'
npm run build:pages
```

For OWNER.github.io or a custom domain rooted at /, leave NEXT_PUBLIC_BASE_PATH empty. The path is compiled into JavaScript: rebuild when changing it. Do not manually add the prefix to Next Link hrefs.

The script builds in a fresh ignored .pages-build-* directory with local junctions to node_modules/public, leaving the development cache and project TypeScript files alone. A fresh out/ directory receives the exported site. For repeated verification without deleting previous artifacts, set PORTFOLIO_PAGES_OUTPUT to a new directory (for example out-next). Build caches remain local and ignored. The current empty deep-dive route template is omitted only from the isolated build; if actual deep dives are later supplied, their existing generateStaticParams is retained automatically.

## Prepared configuration

- Static-only output: export, trailingSlash:true, images.unoptimized:true. Development mode remains unchanged.
- NEXT_PUBLIC_BASE_PATH configures Next basePath and shared publicPath() for native media, downloads, images and software masks. Background SVGs are bundled by the CSS compiler so their URLs also respect the subpath.
- Route-sensitive navigation/Trace logic normalizes the repository prefix and trailing slash. Existing client language/localStorage, Framer Motion, canvas/Trace, passport and HTML MP4 interactions require no server.
- .nojekyll is included in the export and preserved by the deployment artifact's include-hidden-files setting.
- Publish only the exported directory contents through the selected Pages publishing method; do not run next start on GitHub Pages. Directory index.html files provide direct route loads and refreshes without an SPA rewrite. Unknown routes use 404.html.

## Deployment workflow

Repository: wzx1239/portfolio. In Settings > Pages > Build and deployment, select GitHub Actions as Source. Commit and push .github/workflows/deploy-pages.yml and these documentation changes through GitHub Desktop. Pushes to main (or a manual workflow run) build with NEXT_PUBLIC_BASE_PATH=/portfolio using the existing build:pages script, then upload only out/ and deploy that artifact. The site URL is https://wzx1239.github.io/portfolio/. No gh-pages branch, source-directory publishing or next start is required. No remote settings were changed and no deployment was triggered from this local session.

## Verification

Built successfully with a non-root test prefix /portfolio-preview. All nine project pages plus Home/About/Projects/interaction-lab and error/icon outputs were exported (16 HTML files). Served these from a plain local static server with no Next.js runtime or route fallback; direct HTML requests, page refresh, client navigation, Chinese persistence, short MP4 playback, technical toggles, masks/backgrounds and PDF paths were checked. No /_next/image optimization endpoint remains.

All supplied YouTube embeds use the external player and remain compatible with static hosting. The test player loaded, but YouTube requested sign-in/anti-bot verification during this session, so successful playback could not be reconfirmed in the static test. This is an external service restriction, not a missing Node.js feature.

## Media/repository considerations

The current local export is about 567 MB, including retired GIF copies still present locally. GitHub Pages has a 1 GB published-site limit and a soft 100 GB/month bandwidth limit. The unused npc.gif is 112,611,027 bytes, above GitHub's 100 MiB regular Git file limit. All five retired GIFs and generated caches/exports are now ignored; they were not deleted. They should not be force-added to a new repository. If previously tracked, ignore rules alone do not untrack them. Original source files and all active media remain unchanged.

References: https://nextjs.org/docs/app/guides/static-exports ; https://nextjs.org/docs/app/api-reference/config/next-config-js/basePath ; https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits ; https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github
