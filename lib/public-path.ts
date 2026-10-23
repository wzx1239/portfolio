// Next Link handles basePath itself; public media and native download links do not.
export function publicPath(path: string | undefined): string | undefined {
  if (!path || !path.startsWith('/') || path.startsWith('//')) return path;
  const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return base && !path.startsWith(base + '/') ? base + path : path;
}
export function routePath(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const local = base && (path === base || path.startsWith(base + '/')) ? path.slice(base.length) : path;
  return local.replace(/\/+$/, '') || '/';
}
