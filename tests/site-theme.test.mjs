import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const source = await readFile(new URL('../static/js/site-theme.js', import.meta.url), 'utf8');

function boot(values = {}, { matches = false, blocked = false } = {}) {
  const listeners = new Map();
  const systemListeners = new Set();
  const store = new Map(Object.entries(values));
  const root = {
    dataset: {},
    style: {},
    classList: {
      values: new Set(),
      toggle(name, enabled) {
        if (enabled) this.values.add(name);
        else this.values.delete(name);
      },
      contains(name) { return this.values.has(name); },
    },
  };
  const system = {
    matches,
    addEventListener(type, listener) {
      if (type === 'change') systemListeners.add(listener);
    },
    setMatches(next) {
      this.matches = next;
      for (const listener of systemListeners) listener({ matches: next });
    },
  };
  const localStorage = {
    getItem(key) {
      if (blocked) throw new Error('storage blocked');
      return store.has(key) ? store.get(key) : null;
    },
    setItem(key, value) {
      if (blocked) throw new Error('storage blocked');
      store.set(key, String(value));
    },
  };
  const window = {
    dispatchEvent(event) {
      for (const listener of listeners.get(event.type) || []) listener(event);
    },
    addEventListener(type, listener) {
      const current = listeners.get(type) || [];
      current.push(listener);
      listeners.set(type, current);
    },
    CustomEvent: class CustomEvent {
      constructor(type) { this.type = type; }
    },
  };
  const context = vm.createContext({
    CustomEvent: class CustomEvent {
      constructor(type) { this.type = type; }
    },
    document: { documentElement: root },
    localStorage,
    matchMedia: () => system,
    window,
  });
  vm.runInContext(source, context, { filename: 'site-theme.js' });
  return { root, system, store, window, theme: context.window.FarosTheme };
}

test('migration chooses the first valid preference and resolves the theme', () => {
  for (const [values, expected] of [
    [{ 'faros-theme': 'light', 'faros-connected-theme': 'dark', 'faros-docs-theme': 'system' }, ['light', 'light']],
    [{ 'faros-theme': 'invalid', 'faros-connected-theme': 'dark', 'faros-docs-theme': 'light' }, ['dark', 'dark']],
    [{ 'faros-connected-theme': 'system', 'faros-docs-theme': 'light' }, ['system', 'light']],
    [{ 'faros-docs-theme': 'light' }, ['light', 'light']],
    [{}, ['dark', 'dark']],
  ]) {
    const { root } = boot(values);
    assert.deepEqual([root.dataset.themePreference, root.dataset.studyTheme], expected);
  }
});

test('explicit dark stays dark when the operating system changes', () => {
  const state = boot({ 'faros-theme': 'dark' }, { matches: false });
  state.system.setMatches(true);
  assert.equal(state.root.dataset.themePreference, 'dark');
  assert.equal(state.root.dataset.studyTheme, 'dark');
  assert.equal(state.root.classList.contains('dark'), true);
});

test('system preference follows operating-system changes', () => {
  const state = boot({ 'faros-theme': 'system' }, { matches: false });
  assert.equal(state.root.dataset.studyTheme, 'light');
  state.system.setMatches(true);
  assert.equal(state.root.dataset.studyTheme, 'dark');
  assert.equal(state.root.classList.contains('dark'), true);
  state.system.setMatches(false);
  assert.equal(state.root.dataset.studyTheme, 'light');
  assert.equal(state.root.classList.contains('dark'), false);
});

test('set accepts only valid preferences and synchronizes the canonical key', () => {
  const state = boot();
  state.theme.set('light');
  assert.equal(state.store.get('faros-theme'), 'light');
  assert.equal(state.root.dataset.themePreference, 'light');
  assert.equal(state.root.style.colorScheme, 'light');
  state.theme.set('invalid');
  assert.equal(state.root.dataset.themePreference, 'light');
});

test('storage events apply a new preference and reset cleared state to dark', () => {
  const state = boot({ 'faros-theme': 'light' });
  state.window.dispatchEvent({ type: 'storage', key: 'faros-theme', newValue: 'system' });
  assert.equal(state.root.dataset.themePreference, 'system');
  state.window.dispatchEvent({ type: 'storage', key: 'faros-theme', newValue: null });
  assert.equal(state.root.dataset.themePreference, 'dark');
  assert.equal(state.root.dataset.studyTheme, 'dark');
  state.window.dispatchEvent({ type: 'storage', key: 'other-key', newValue: 'light' });
  assert.equal(state.root.dataset.themePreference, 'dark');
});

test('theme still renders when storage is unavailable', () => {
  const state = boot({}, { blocked: true, matches: true });
  assert.equal(state.root.dataset.themePreference, 'dark');
  assert.equal(state.root.dataset.studyTheme, 'dark');
  assert.equal(state.root.classList.contains('dark'), true);
  assert.doesNotThrow(() => state.theme.set('system'));
  assert.equal(state.root.dataset.themePreference, 'system');
  assert.equal(state.root.dataset.studyTheme, 'dark');
});
