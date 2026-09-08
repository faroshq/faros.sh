import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const source = await readFile(new URL('../static/js/circuit-pulse.js', import.meta.url), 'utf8');

class Node {
  constructor({ className = '', id = '' } = {}) {
    this.id = id;
    this.className = className;
    this.classList = { contains: value => value === className };
    this.attributes = {};
    this.style = {};
    this.hidden = false;
    this.listeners = new Map();
    this.children = [];
  }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  getAttribute(name) { return this.attributes[name]; }
  append(...children) { this.children.push(...children); }
  addEventListener(name, listener) {
    const listeners = this.listeners.get(name) || [];
    listeners.push(listener);
    this.listeners.set(name, listeners);
  }
  dispatch(name, event = {}) {
    for (const listener of this.listeners.get(name) || []) listener({ type: name, target: this, ...event });
  }
  querySelector() { return null; }
  querySelectorAll() { return []; }
}

function image(theme, { currentSrc = '', complete = false, naturalWidth = 0 } = {}) {
  const node = new Node();
  node.parentElement = { dataset: { artTheme: theme } };
  node.dataset = { src: `/images/${theme}.webp`, srcset: `/images/${theme}-3840.webp 3840w` };
  node.currentSrc = currentSrc;
  node.complete = complete;
  node.naturalWidth = naturalWidth;
  node.fetchPriority = '';
  let assigned = [];
  Object.defineProperty(node, 'assignedSources', { get: () => assigned });
  Object.defineProperty(node, 'src', {
    get: () => node.currentSrc,
    set: value => { assigned.push(value); node.currentSrc = value; },
  });
  Object.defineProperty(node, 'srcset', {
    get: () => node.dataset.srcset,
    set: value => { node.dataset.srcset = value; },
  });
  return node;
}

function bootHero() {
  const root = new Node();
  root.dataset = { studyTheme: 'dark', motion: 'on' };
  const body = new Node({ className: 'cl-material-motion' });
  const circuit = new Node();
  const hero = new Node();
  const dark = image('dark', { currentSrc: '/images/dark-3840.webp', complete: true, naturalWidth: 1000 });
  const light = image('light');
  hero.querySelector = selector => {
    const match = selector.match(/data-art-theme="(dark|light)"/);
    return match ? (match[1] === 'dark' ? dark : light) : selector === '.cl-circuit' ? circuit : null;
  };
  hero.querySelectorAll = selector => selector === '.cl-picture img' ? [dark, light] : [];
  const windowListeners = new Map();
  let createdOverlay;
  const document = {
    body,
    documentElement: root,
    hidden: false,
    querySelector: selector => selector === '.cl-hero-art' ? hero : null,
    createElement: tag => {
      if (tag === 'img') {
        createdOverlay = image('overlay');
        return createdOverlay;
      }
      return new Node();
    },
    createElementNS: () => new Node(),
    addEventListener() {},
  };
  const window = {
    addEventListener(name, listener) { windowListeners.set(name, listener); },
    dispatch(name) { windowListeners.get(name)?.({ type: name }); },
  };
  const context = vm.createContext({
    document, window, location: { pathname: '/' },
    matchMedia: () => ({ matches: false, addEventListener() {} }),
    requestAnimationFrame: callback => { callback(); return 1; },
    MutationObserver: class {}, ResizeObserver: class {}, IntersectionObserver: class {},
  });
  vm.runInContext(source, context, { filename: 'circuit-pulse.js' });
  const emission = hero.children.find(child => child.className === 'cp-emission');
  const overlay = createdOverlay || emission.children[0];
  return { root, dark, light, hero, emission, overlay, window };
}

test('hero overlay waits for the selected responsive image and reuses currentSrc', () => {
  const state = bootHero();
  assert.equal(state.dark.assignedSources.length, 0);
  assert.equal(state.light.assignedSources.length, 0);
  assert.equal(state.emission.hidden, true);
  assert.equal(state.overlay.assignedSources.length, 1);
  assert.equal(state.overlay.fetchPriority, 'low');
  assert.equal(state.overlay.assignedSources[0], '/images/dark-3840.webp');

  state.overlay.complete = false;
  state.overlay.naturalWidth = 0;
  state.overlay.currentSrc = '';
  state.overlay.dispatch('load');
  assert.equal(state.emission.hidden, true);

  state.overlay.complete = true;
  state.overlay.naturalWidth = 1000;
  state.overlay.currentSrc = '/images/dark-3840.webp';
  state.overlay.dispatch('load');
  assert.equal(state.emission.hidden, false);
  assert.equal(state.overlay.assignedSources.length, 1);
  state.overlay.dispatch('load');
  assert.equal(state.overlay.assignedSources.length, 1);
});

test('late load from the old theme cannot reveal the overlay after a theme switch', () => {
  const state = bootHero();
  state.root.dataset.studyTheme = 'light';
  state.window.dispatch('faros:theme-change');
  assert.equal(state.emission.hidden, true);

  state.dark.dispatch('load');
  assert.equal(state.emission.hidden, true);

  state.light.complete = true;
  state.light.naturalWidth = 1200;
  state.light.currentSrc = '/images/light-2560.webp';
  state.light.dispatch('load');
  assert.equal(state.emission.hidden, true);
  state.overlay.complete = true;
  state.overlay.naturalWidth = 1200;
  state.overlay.currentSrc = '/images/light-2560.webp';
  state.overlay.dispatch('load');
  assert.equal(state.emission.hidden, false);
  assert.equal(state.overlay.assignedSources.at(-1), '/images/light-2560.webp');
});

function bootConnector() {
  const root = new Node();
  root.dataset = { studyTheme: 'dark', motion: 'on' };
  const body = new Node({ className: 'cl-material-motion' });
  const tabs = new Node();
  const selected = new Node({ id: 'workflow-tab-one' });
  selected.getBoundingClientRect = () => ({ left: 100, width: 80, bottom: 40 });
  tabs.querySelector = selector => selector === '[aria-selected=true]' ? selected : null;
  const slot = new Node();
  slot.getBoundingClientRect = () => ({ left: 300, width: 120, top: 240 });
  const showcase = new Node();
  showcase.getBoundingClientRect = () => ({ left: 0, width: 600, top: 0 });
  showcase.querySelector = selector => selector.includes('.cl-workflow-panel') ? slot : null;
  let intersectionCallback;
  let animation;
  const frames = [];
  const windowListeners = new Map();
  const mutationCallbacks = new Map();
  const reduced = { matches: false, listener: null, addEventListener(name, listener) { if (name === 'change') this.listener = listener; } };
  const document = {
    body, documentElement: root, hidden: false,
    querySelector: selector => selector === '.cl-workflow-inner' ? showcase : selector === '.cl-workflow-tabs' ? tabs : null,
    createElement: () => new Node(),
    createElementNS: () => {
      const node = new Node();
      node.animate = () => {
        animation = { cancelCount: 0, cancel() { this.cancelCount += 1; } };
        return animation;
      };
      return node;
    },
    addEventListener(name, listener) { windowListeners.set(`document:${name}`, listener); },
    dispatch(name) { windowListeners.get(`document:${name}`)?.({ type: name }); },
  };
  const window = {
    addEventListener(name, listener) { windowListeners.set(name, listener); },
    dispatch(name) { windowListeners.get(name)?.({ type: name }); },
  };
  window.ResizeObserver = class { observe() {} };
  window.IntersectionObserver = class { constructor(callback) { intersectionCallback = callback; } observe() {} };
  const context = vm.createContext({
    document, window, location: { pathname: '/' },
    matchMedia: () => reduced,
    requestAnimationFrame: callback => { frames.push(callback); return frames.length; },
    MutationObserver: class {
      constructor(callback) { this.callback = callback; }
      observe(target) { mutationCallbacks.set(target, this.callback); }
    },
    ResizeObserver: class { observe() {} },
    IntersectionObserver: class { constructor(callback) { intersectionCallback = callback; } observe() {} },
  });
  vm.runInContext(source, context, { filename: 'circuit-pulse.js' });
  const connector = showcase.children[0];
  return {
    root, tabs, selected, showcase, connector, frames,
    animation: () => animation,
    mutate: () => mutationCallbacks.get(tabs)?.(),
    mutateRoot: () => mutationCallbacks.get(root)?.(),
    intersect: isIntersecting => intersectionCallback([{ isIntersecting }]),
    window, document, reduced,
  };
}

test('connector measures geometry and transmits once on entry', () => {
  const state = bootConnector();
  assert.equal(state.frames.length, 1);
  state.frames.shift()();
  state.intersect(true);
  assert.equal(state.frames.length, 1);
  state.frames.shift()();
  assert.equal(state.connector.attributes.viewBox, '0 0 600 200');
  assert.match(state.connector.children[0].attributes.d, /^M140 0V97/);
  assert.equal(state.animation()?.cancelCount, 0);
  state.intersect(true);
  assert.equal(state.animation()?.cancelCount, 0);
});

test('tab changes cancel the active transfer and motion gates prevent restart', () => {
  const state = bootConnector();
  state.frames.shift()();
  state.intersect(true);
  state.frames.shift()();
  const first = state.animation();
  state.selected.id = 'workflow-tab-two';
  state.mutate();
  state.frames.shift()();
  assert.equal(first.cancelCount, 1);
  const second = state.animation();
  assert.notEqual(second, first);

  state.root.dataset.motion = 'off';
  state.mutateRoot();
  assert.equal(first.cancelCount, 1);
  assert.equal(second.cancelCount, 1);
  assert.equal(state.animation(), second);
  state.root.dataset.motion = 'on';
  state.intersect(true);
  assert.equal(state.animation(), second);
  assert.equal(second.cancelCount, 1);
});

for (const [name, disable] of [
  ['hidden document', state => { state.document.hidden = true; state.document.dispatch('visibilitychange'); }],
  ['reduced motion', state => { state.reduced.matches = true; state.reduced.listener({ matches: true }); }],
  ['offscreen showcase', state => state.intersect(false)],
]) {
  test(`${name} cancels an active transfer and prevents tab selection from restarting it`, () => {
    const state = bootConnector();
    state.frames.shift()();
    state.intersect(true);
    state.frames.shift()();
    const active = state.animation();
    disable(state);
    assert.equal(active.cancelCount, 1);
    state.selected.id = 'workflow-tab-two';
    state.mutate();
    state.frames.shift()();
    assert.equal(state.animation(), active);
    assert.equal(active.cancelCount, 1);
  });
}
