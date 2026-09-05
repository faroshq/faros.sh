import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { searchDocs } from '../assets/js/docs-search.mjs';
const pages = JSON.parse(readFileSync(process.env.DOCS_BUILD ? `${process.env.DOCS_BUILD}/docs/index.json` : 'public/docs/index.json'));
for (const [query, expected] of [
  ['build publish application', '/docs/use/app-studio/quickstart/'],
  ['schedules', '/docs/use/agents/schedules/'],
  ['add teammate', '/docs/administration/members/'],
  ['self host provider', '/docs/self-hosting/providers/'],
  ['build first provider', '/docs/extend/quickstart/'],
  ['Databricks application', '/docs/use/app-studio/databricks/'],
]) test(`Task discovery: ${query}`, () => {
  assert.ok(searchDocs(pages, query).slice(0, 5).some(page => page.url === expected));
});
test('provider filter never leaks another provider', () => {
  const results = searchDocs(pages, 'query', 'databricks');
  assert.ok(results.length > 0);
  assert.ok(results.every(page => page.provider === 'databricks'));
});
test('empty, punctuation, unmatched, and untrusted strings are safe', () => {
  for (const query of ['', '   ', '?!', 'definitelynotafarostopic', '<script>alert(999999)</script>']) assert.deepEqual(searchDocs(pages, query), []);
});
test('multiword matching is case insensitive', () => {
  assert.deepEqual(searchDocs(pages, 'AI AGENT').map(p => p.url), searchDocs(pages, 'ai agent').map(p => p.url));
});
