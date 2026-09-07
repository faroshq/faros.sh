import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const source = await readFile(new URL('../static/js/hero-art.js', import.meta.url), 'utf8');
function boot(theme) {
  const requests = [];
  const root = { dataset: { studyTheme: theme } };
  const events = new Map();
  const images = ['dark', 'light'].map(theme => ({
    parentElement: { dataset: { artTheme: theme } },
    dataset: { src: `${theme}.webp`, srcset: `${theme}-1536.webp 1536w, ${theme}-3840.webp 3840w` },
    sizes: '100vw',
    events: new Map(),
    addEventListener(name, fn) { this.events.set(name, fn); },
    set src(value) { requests.push({ theme, url: value, priority: this.fetchPriority, srcset: this.srcset, sizes: this.sizes }); },
  }));
  vm.runInNewContext(source, {
    document: { documentElement: root, currentScript: { closest: () => ({ querySelectorAll: () => images }) } },
    window: { addEventListener: (name, fn) => events.set(name, fn) },
  });
  return { images, requests, switchTo(theme) { root.dataset.studyTheme = theme; events.get('faros:theme-change')(); } };
}

for (const theme of ['light', 'dark']) {
  test(`${theme} starts alone at high priority, then warms the companion after load`, () => {
    const state = boot(theme);
    assert.equal(state.requests.length, 1);
    assert.equal(state.requests[0].theme, theme);
    assert.equal(state.requests[0].priority, 'high');
    assert.match(state.requests[0].srcset, /3840w/);
    assert.equal(state.requests[0].sizes, '100vw');
    state.images.find(img => img.parentElement.dataset.artTheme === theme).events.get('load')();
    assert.equal(state.requests.length, 2);
    assert.notEqual(state.requests[1].theme, theme);
    assert.equal(state.requests[1].priority, 'low');
  });
}

test('initial failure still releases the companion', () => {
  const state = boot('dark');
  state.images[0].events.get('error')();
  assert.equal(state.requests.length, 2);
  assert.equal(state.requests[1].theme, 'light');
});

test('early theme switching starts the requested image without waiting or duplicate loads', () => {
  const state = boot('dark');
  state.switchTo('light');
  assert.equal(state.requests.length, 2);
  assert.equal(state.requests[1].priority, 'high');
  assert.equal(state.images[0].fetchPriority, 'low');
  state.images[0].events.get('load')();
  assert.equal(state.images[1].fetchPriority, 'high');
  state.switchTo('dark');
  state.switchTo('light');
  assert.equal(state.requests.length, 2);
});

test('selecting a companion already warming upgrades its priority', () => {
  const state = boot('dark');
  state.images[0].events.get('load')();
  assert.equal(state.images[1].fetchPriority, 'low');
  state.switchTo('light');
  assert.equal(state.images[1].fetchPriority, 'high');
  assert.equal(state.requests.length, 2);
});
