import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const root = process.env.DOCS_BUILD || 'public';
const html = route => readFileSync(`${root}${route}index.html`, 'utf8');
const nav = JSON.parse(readFileSync('data/docs.json', 'utf8'));
const index = JSON.parse(readFileSync(`${root}/docs/index.json`, 'utf8'));

test('top navigation exposes areas rather than individual guides', () => {
  const page = html('/docs/use/');
  for (const slug of ['get-started', 'administration', 'extend']) {
    assert.ok(!page.includes(`popovertarget="docs-nav-${slug}"`));
  }
  const menu = page.match(/<div id="docs-nav-use"[\s\S]*?<\/nav>/)[0];
  assert.ok(menu.includes('/docs/use/workspaces/'));
  assert.ok(menu.includes('/docs/use/ai-assistants/'));
  assert.ok(!menu.includes('/docs/use/workspaces/enable-provider/'));
  for (const provider of nav.providers) assert.ok(menu.includes(`/docs/use/${provider.slug}/`));
});

test('provider APIs belong to Reference and retain provider search identity', () => {
  for (const provider of nav.providers) {
    const route = `/docs/reference/providers/${provider.slug}/`;
    const page = html(route);
    assert.match(page, /popovertarget="docs-nav-reference"[^>]*data-current="true"/);
    assert.doesNotMatch(page, /popovertarget="docs-nav-use"[^>]*data-current="true"/);
    assert.ok(page.includes(`${route}schemas/`));
    assert.ok(page.includes(`/docs/use/${provider.slug}/`));
    for (const suffix of ['', 'schemas/']) assert.equal(index.find(p => p.url === route + suffix)?.provider, provider.slug);
    assert.ok(!index.some(p => p.url === `/docs/use/${provider.slug}/reference/`));
  }
});

test('grouped sidebar links keep user guides and APIs connected', () => {
  const page = html('/docs/use/app-studio/quickstart/');
  assert.ok(page.includes('Getting started'));
  assert.ok(page.includes('/docs/reference/providers/app-studio/'));
  assert.ok(page.includes('/docs/reference/providers/app-studio/schemas/'));
  assert.ok(page.includes('docs-page-rail'));
  const hub = html('/docs/self-hosting/hub/authentication/');
  for (const label of ['Installation', 'Authentication', 'Networking', 'Operations']) assert.ok(hub.includes(label));
});

test('sidebar groups follow the curated task structure', () => {
  const expected = {
    '/docs/get-started/': ['Introduction', 'First steps', 'CLI setup'],
    '/docs/administration/': ['Organizations and access', 'Provider management'],
    '/docs/extend/': ['Getting started', 'APIs and authorization', 'UI, templates, and tools', 'Connectivity and deployment'],
    '/docs/self-hosting/hub/': ['Installation', 'Authentication', 'Networking', 'Operations'],
  };
  for (const [route, groups] of Object.entries(expected)) {
    assert.deepEqual(nav.sidebars.find(s => s.root === route).groups.map(g => g.title), groups);
  }
});

test('section overviews retain both navigation and article tools', () => {
  for (const area of nav.primary) {
    const page = html(`/docs/${area.slug}/`);
    assert.ok(page.includes('faros-docs-sidebar'));
    assert.ok(page.includes('docs-page-rail'));
  }
});
