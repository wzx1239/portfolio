import assert from 'node:assert/strict';
import fs from 'node:fs';
import { registerHooks } from 'node:module';

// Node 22.18+ strips types. Resolve the same @/ content aliases used by Next.
registerHooks({ resolve(specifier, context, nextResolve) {
  if (specifier.startsWith('@/')) return nextResolve(new URL('../' + specifier.slice(2) + '.ts', import.meta.url).href, context);
  return nextResolve(specifier, context);
} });
const { projects } = await import('../data/projects.ts');
const { site, copy } = await import('../data/site.ts');
const { softwareLogos, softwareLogoPath } = await import('../data/software.ts');
assert.equal(projects.length, 9);
assert.equal(new Set(projects.map(p => p.slug)).size, 9);
for (const category of ['game', 'architecture', 'video']) assert.equal(projects.filter(p => p.category === category).length, 3);
function localized(value, name) { assert.ok(value?.en && value?.zh, `Missing translation: ${name}`); }
function media(asset) { localized(asset.alt, 'media.alt'); if (asset.image?.startsWith('/')) assert.ok(fs.existsSync('public' + asset.image), `Missing asset ${asset.image}`); }
for (const [index, project] of projects.entries()) {
  assert.equal(project.number, String(index + 1).padStart(2, '0'));
  assert.equal(project.nextProject, projects[(index + 1) % projects.length].slug);
  for (const key of ['title', 'subtitle', 'summary']) localized(project[key], `${project.slug}.${key}`);
  media(project.thumbnail); media(project.hero);
  if(project.originalPdf)assert.equal(fs.readFileSync('public'+project.originalPdf.src).subarray(0,5).toString(),'%PDF-',`Invalid original PDF: ${project.slug}`);
  for (const section of project.sections) {
    localized(section.title, section.id);
    if (section.body) localized(section.body, section.id + '.body');
    if (section.media) media(section.media);
    if (section.youtube) assert.match(section.youtube, /^[A-Za-z0-9_-]{11}$/, `Invalid YouTube ID: ${section.id}`);
    for (const step of section.steps ?? []) {
      localized(step.title, step.id); localized(step.body, step.id);
      for (const item of step.implementation ?? []) { localized(item.heading, step.id + '.implementation.heading'); localized(item.body, step.id + '.implementation.body'); }
      assert.ok(step.video.endsWith('.mp4'), `Showcase requires MP4: ${step.id}`);
      for (const path of [step.video, step.thumbnail]) assert.ok(fs.existsSync('public' + path), `Missing showcase media ${path}`);
    }
    if (section.deepDiveSlug) assert.ok(project.deepDives.some(d => d.slug === section.deepDiveSlug));
  }
  for (const field of project.metadata) {
    localized(field.label, 'metadata.label'); localized(field.value, 'metadata.value');
    for(const text of Object.values(field.value))assert.ok(text.trim() && !/^(?:TBD|待补充|待定)$/i.test(text.trim()),`Empty Overview field: ${project.slug}`);
    assert.ok(!/\b(tools?|software)\b|工具|软件/i.test(field.label.en+' '+field.label.zh), `Software belongs only in the shared end marquee: ${project.slug}`);
    assert.ok(['Discipline','Role','Team / Time'].includes(field.label.en),`Overview must use only the three shared groups: ${project.slug}`);
  }
  for (const name of project.software ?? []) {
    const logo=softwareLogos[name];
    if(logo)assert.ok(fs.existsSync('public'+softwareLogoPath(logo.file)),`Missing software logo: ${name}`);
  }
  if (project.architecture) {
    assert.equal(project.category, 'architecture');
    assert.ok(!project.hero.placeholder && project.hero.image?.endsWith('/hero.webp'));
    if (project.architecture.original) {
      assert.equal(project.architecture.sections.length, 0);
      const originalNames = { '04':'refuge', '05':'garbage', '06':'workspace' };
      const sourcePages = JSON.parse(fs.readFileSync(`data/${originalNames[project.number]}-original.json`,'utf8'));
      const expectedPages = { '04':[2,3,4,5,6,7,8], '05':[2,3,4,5,6], '06':[2,3,4,5] };
      assert.deepEqual(sourcePages.map(page => page.page), expectedPages[project.number]);
      for (const page of sourcePages) {
        assert.ok(fs.existsSync('public' + page.src));
        for (const row of page.text) { localized(row, 'original source text'); assert.ok(Number.isFinite(row.x) && Number.isFinite(row.y)); }
      }
    } else assert.ok(project.architecture.sections.length >= 8);
    const ids = project.architecture.sections.map(section => section.id);
    assert.equal(new Set(ids).size, ids.length);
    for (const section of project.architecture.sections) {
      localized(section.title, section.id);
      for (const paragraph of section.paragraphs ?? []) localized(paragraph, section.id);
      for (const fact of section.facts ?? []) { localized(fact.label, section.id); localized(fact.value, section.id); }
      for (const visual of section.visuals) {
        localized(visual.caption, section.id);
        assert.ok(visual.width > 0 && visual.height > 0);
        assert.ok(fs.existsSync('public' + visual.src), `Missing drawing ${visual.src}`);
      }
    }
  }
}
for (const [key, value] of Object.entries(copy)) localized(value, key);
media(site.showreel); media(site.portrait);
assert.ok(fs.readFileSync('public' + site.resume).subarray(0, 5).toString() === '%PDF-');
console.log('Content verified: 9 routes, 3 categories, 01–09 sequence, bilingual content, optional fields, media paths and resume PDF.');
