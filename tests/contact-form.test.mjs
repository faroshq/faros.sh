import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';

const script = readFileSync('layouts/_internal/discord_form.html', 'utf8').replace(/<\/?script>/g, '');
function setup(fetch) {
  const nodes = Object.fromEntries(['emailInput', 'messageInput', 'nameInput', 'companyInput', 'contact-form', 'contact-submit-button', 'contact-error', 'contact-success-message'].map(id => [id, {
    value: id === 'companyInput' ? '' : 'Test', disabled: false, hidden: false,
    attrs: {}, label: {}, classList: { remove() {} },
    getAttribute(k) { return this.attrs[k]; }, setAttribute(k, v) { this.attrs[k] = v; },
    removeAttribute(k) { delete this.attrs[k]; }, reportValidity() { return true; },
    querySelector() { return this.label; }, focus() { this.focused = true; },
  }]));
  const context = vm.createContext({ document: { getElementById: id => nodes[id] }, fetch, window: { grecaptcha: {} }, grecaptcha: { getResponse: () => 'test-token' } });
  vm.runInContext(script, context);
  return { nodes, send: () => context.sendContact({ preventDefault() {} }) };
}
test('successful submission accepts an omitted company and focuses confirmation', async () => {
  let body;
  const {nodes, send} = setup(async (_, options) => { body = JSON.parse(options.body); return {ok: true}; });
  await send();
  assert.equal(body.embeds[0].fields[3].value, 'Not provided');
  assert.equal(nodes['contact-form'].hidden, true);
  assert.equal(nodes['contact-success-message'].focused, true);
});
for (const failure of ['network', 'server']) test(`${failure} failure preserves input and allows retry`, async () => {
  const {nodes, send} = setup(async () => { if (failure === 'network') throw Error(); return {ok: false}; });
  await send();
  assert.equal(nodes['contact-error'].hidden, false);
  assert.equal(nodes['messageInput'].value, 'Test');
  assert.equal(nodes['contact-submit-button'].disabled, false);
  assert.equal(nodes['contact-form'].hidden, false);
});
test('a pending request prevents duplicate submissions', async () => {
  let complete, calls = 0;
  const {nodes, send} = setup(() => { calls++; return new Promise(resolve => { complete = resolve; }); });
  const pending = send();
  assert.equal(nodes['contact-submit-button'].label.textContent, 'Sending…');
  await send();
  assert.equal(calls, 1);
  complete({ok: true});
  await pending;
});
