import type { NextConfig } from 'next';
const staticExport = process.env.PORTFOLIO_STATIC_EXPORT === '1';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
if (basePath && (!basePath.startsWith('/') || basePath.endsWith('/') || !/^\/[A-Za-z0-9._-]+$/.test(basePath))) throw new Error('Use an empty base path or /repository-name without a trailing slash.');
const nextConfig: NextConfig = {
  ...(staticExport ? { output: 'export' as const, trailingSlash: true, images: { unoptimized: true } } : {}),
  basePath,
  // Keep build verification isolated from a running local preview.
  distDir: process.env.PORTFOLIO_BUILD_DIR || '.next',
  poweredByHeader: false,
  devIndicators: false,
  experimental: { cpus: 1, staticGenerationMaxConcurrency: 1 },
};
export default nextConfig;
