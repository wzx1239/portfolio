import assert from 'node:assert/strict';
const origin = process.argv[2] || 'http://127.0.0.1:3000';
const slugs = ['perfect-city', 'vr', 'featherland', 'emergency-refuge', 'architecture-05', 'architecture-06', 'video-07', 'video-08', 'video-09'];
const pages = ['/', '/about', '/projects', ...slugs.map(slug => '/projects/' + slug)];
const checks = await Promise.allSettled(pages.map(async route => {
  const response = await fetch(origin + route);
  assert.equal(response.status, 200, route);
  const html = await response.text();
  assert.ok(html.includes('id="main"'), route + ' has main landmark');
  assert.ok(html.includes('<h1'), route + ' has h1');
  return { route, status: response.status };
}));
for (const result of checks) { if (result.status === 'rejected') throw result.reason; console.log(`${result.value.status} ${result.value.route}`); }
const resume = await fetch(origin + '/resume/zixiao-wang-resume-placeholder.pdf');
assert.equal(resume.status, 200);
assert.ok(resume.headers.get('content-type')?.includes('application/pdf'));
const bytes = Buffer.from(await resume.arrayBuffer());
assert.equal(bytes.subarray(0, 5).toString(), '%PDF-');
const missing = await fetch(origin + '/a-page-that-does-not-exist');
assert.equal(missing.status, 404);
const absentDive = await fetch(origin + '/projects/perfect-city/deep-dive/unconfirmed-topic');
assert.equal(absentDive.status, 404);
console.log('Resume PDF download and 404 behavior verified.');
