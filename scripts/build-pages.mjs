import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, renameSync, symlinkSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { registerHooks } from 'node:module';
registerHooks({ resolve(specifier, context, nextResolve) {
  if (specifier.startsWith('@/')) return nextResolve(new URL('../' + specifier.slice(2) + '.ts', import.meta.url).href, context);
  return nextResolve(specifier, context);
} });
const { projects } = await import('../data/projects.ts');
const root = process.cwd();
const output = resolve(process.env.PORTFOLIO_PAGES_OUTPUT || 'out');
if (existsSync(output)) throw new Error('Output already exists. Choose a fresh PORTFOLIO_PAGES_OUTPUT directory to avoid stale files.');
const stage = mkdtempSync(join(root, '.pages-build-'));
for (const folder of ['app', 'components', 'data', 'lib']) {
  cpSync(join(root, folder), join(stage, folder), { recursive: true, filter: source => !(folder === 'app' && !projects.some(p => p.deepDives.length) && source === join(root, 'app/projects/[slug]/deep-dive')) });
}
for (const file of readdirSync(root).filter(name => /^(?:next\.config\.|postcss\.config\.|tsconfig\.json$|next-env\.d\.ts$|package\.json$|pnpm-lock\.yaml$)/.test(name))) cpSync(join(root,file),join(stage,file));
for (const folder of ['node_modules','public']) symlinkSync(join(root,folder),join(stage,folder),'junction');
const result = spawnSync(process.execPath, [join(root,'node_modules/next/dist/bin/next'), 'build', '--webpack'], {
  cwd: stage, stdio: 'inherit', env: { ...process.env, PORTFOLIO_STATIC_EXPORT: '1', PORTFOLIO_BUILD_DIR: '.next', UV_THREADPOOL_SIZE: '1' },
});
if (result.status !== 0) process.exit(result.status ?? 1);
mkdirSync(resolve(output, '..'), { recursive: true });
renameSync(join(stage,'out'), output);
writeFileSync(join(output,'.portfolio-pages-output'),'Generated static portfolio export.\n');
console.log(`Static export ready: ${output}`);
console.log(`Isolated build cache retained: ${stage}`);
