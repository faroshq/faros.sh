import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const source = await readFile(new URL('../static/js/connected-theme.js', import.meta.url), 'utf8');

function boot({ decode = () => Promise.resolve() } = {}) {
  const root = {
    dataset: { themePreference: 'system', studyTheme: 'light' },
    style: {},
    classList: { toggle() {} },
  };
  const listeners = new Map();
  const themeListeners = new Map();
  const choices = ['light', 'dark', 'system'].map(value => ({
    dataset: { themeChoice: value },
    attributes: {},
    listeners: {},
    setAttribute(name, value) { this.attributes[name] = String(value); },
    removeAttribute(name) { delete this.attributes[name]; },
    addEventListener(name, listener) { this.listeners[name] = listener; },
    focus() {},
  }));
  const themeButton = {
    attributes: {},
    setAttribute(name, value) { this.attributes[name] = String(value); },
    removeAttribute(name) { delete this.attributes[name]; },
    focus() {},
  };
  const picker = {
    open: true,
    hidden: true,
    listeners: {},
    querySelector(selector) { return selector === '.cl-theme-toggle' ? themeButton : null; },
    querySelectorAll() { return choices; },
    addEventListener(name, listener) { this.listeners[name] = listener; },
    contains() { return true; },
  };
  const images = [{ loading: 'lazy', decode }];
  const calls = [];
  const window = {
    FarosTheme: {
      set(next) {
        calls.push(next);
        root.dataset.themePreference = next;
        root.dataset.studyTheme = next === 'system' ? 'light' : next;
        this.preference = next;
      },
      resolve(next) { return next === 'system' ? 'light' : next; },
    },
    addEventListener(name, listener) {
      const current = themeListeners.get(name) || [];
      current.push(listener);
      themeListeners.set(name, current);
    },
    dispatchEvent(event) {
      for (const listener of themeListeners.get(event.type) || []) listener(event);
    },
  };
  const document = {
    documentElement: root,
    hidden: false,
    activeElement: null,
    querySelector(selector) {
      if (selector === '.cl-theme-picker') return picker;
      return null;
    },
    querySelectorAll(selector) {
      if (selector.includes('[data-art-theme=')) return images;
      return [];
    },
    addEventListener(name, listener) { listeners.set(name, listener); },
  };
  const localStorage = { getItem() { return null; }, setItem() {} };
  const reduced = { matches: false, addEventListener() {} };
  const context = vm.createContext({
    document,
    localStorage,
    matchMedia: () => reduced,
    window,
  });
  vm.runInContext(source, context, { filename: 'connected-theme.js' });
  return { choices, picker, themeButton, calls, root };
}

const wait = () => new Promise(resolve => setTimeout(resolve, 25));

test('theme switches promptly when companion image decoding stalls and rapid choices keep order', async () => {
  const state = boot({ decode: () => new Promise(() => {}) });
  state.choices.find(choice => choice.dataset.themeChoice === 'light').listeners.click();
  state.choices.find(choice => choice.dataset.themeChoice === 'dark').listeners.click();
  await wait();

  assert.deepEqual(state.calls, ['light', 'dark']);
  assert.equal(state.root.dataset.themePreference, 'dark');
  assert.notEqual(state.themeButton.attributes['aria-busy'], 'true');
  assert.equal(state.choices.some(choice => choice.attributes['aria-disabled'] === 'true'), false);
});

test('theme switches promptly when companion image decoding rejects', async () => {
  const state = boot({ decode: () => Promise.reject(new Error('decode failed')) });
  state.choices.find(choice => choice.dataset.themeChoice === 'light').listeners.click();
  await wait();

  assert.deepEqual(state.calls, ['light']);
  assert.equal(state.root.dataset.themePreference, 'light');
  assert.notEqual(state.themeButton.attributes['aria-busy'], 'true');
  assert.equal(state.choices.some(choice => choice.attributes['aria-disabled'] === 'true'), false);
});
