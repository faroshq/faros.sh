import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, copyFile, rm } from 'node:fs/promises';
import { execFileSync, fork } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { once } from 'node:events';

// Test the published example against the actual SDK at the documented baseline.
// Set FAROS_PRODUCT_REPO to run this contract test outside the sibling checkout.
const product = process.env.FAROS_PRODUCT_REPO;
for (const mode of ['success', 'denied', 'wrong-table']) {
  test(`Databricks example: ${mode}`, { skip: !product, timeout: 10000 }, async () => {
    const dir = await mkdtemp(join(tmpdir(), 'faros-docs-example-'));
    let child;
    try {
      const sdk = join(dir, 'node_modules/@faros/actions-node');
      await mkdir(sdk, { recursive: true });
      await writeFile(join(sdk, 'package.json'), JSON.stringify({ type: 'module', exports: './index.mjs' }));
      await writeFile(join(sdk, 'index.mjs'), execFileSync('git', ['-C', product, 'show', '0c79ff47:provider-sdk/actions-node/index.mjs']));
      await copyFile(resolve('static/examples/databricks/server.mjs'), join(dir, 'server.mjs'));
      await writeFile(join(dir, 'token'), 'test-only-token');
      await writeFile(join(dir, 'runner.mjs'), `
let calls = 0;
globalThis.fetch = async (url, options) => {
  const input = JSON.parse(options.body);
  if (!String(url).endsWith('/api/projects/test-project/integrations/sales/invoke')) throw Error('Wrong route');
  const envelope = {
    requestID: 'request-test', provider: 'databricks', action: 'query_table', actionVersion: 'v1',
    resourceRef: { name: process.env.TEST_MODE === 'wrong-table' ? 'wrong' : 'orders', apiVersion: 'databricks.faros.sh/v1alpha1', kind: 'Table', resource: 'tables' },
    result: { actionVersion: 'v1', tableRef: 'orders', columns: [{ name: 'order_id', type: 'STRING' }], rows: [{ order_id: 'private-row-value' }] }
  };
  if (++calls > 1 && process.env.TEST_MODE === 'denied') {
    delete envelope.result;
    envelope.error = { code: 'binding_revoked', message: 'Revoked', retryable: false };
  }
  return new Response(JSON.stringify(envelope), { status: envelope.error ? 403 : 200, headers: { 'content-type': 'application/json' } });
};
const { server } = await import('./server.mjs');
if (!server.listening) await new Promise(resolve => server.once('listening', resolve));
process.send({ port: server.address().port });
`);
      child = fork(join(dir, 'runner.mjs'), [], { silent: true, env: { ...process.env,
        FAROS_ACTIONS_BASE_URL: 'https://gateway.example.com', FAROS_PROJECT: 'test-project',
        FAROS_ACTIONS_TOKEN_FILE: join(dir, 'token'), TABLE_INTEGRATION_ALIAS: 'sales',
        EXPECTED_TABLE_NAME: 'orders', PORT: '0', TEST_MODE: mode } });
      let output = '';
      child.stderr.on('data', chunk => { output += chunk; });
      child.stdout.on('data', chunk => { output += chunk; });
      if (mode === 'wrong-table') {
        const [code] = await once(child, 'exit');
        assert.notEqual(code, 0);
        assert.match(output, /Unexpected table response/);
      } else {
        const [{ port }] = await Promise.race([once(child, 'message'), once(child, 'exit').then(() => { throw new Error(output); })]);
        const response = await fetch(`http://127.0.0.1:${port}/api/table`);
        const result = await response.json();
        assert.equal(response.headers.get('cache-control'), 'no-store');
        if (mode === 'success') {
          assert.equal(response.status, 200);
          assert.equal(result.tableRef, 'orders');
          assert.equal(result.truncated, false);
          assert.equal(result.rows.length, 1);
          assert.equal((await fetch(`http://127.0.0.1:${port}/missing`)).status, 404);
        } else {
          assert.equal(response.status, 502);
          assert.deepEqual(result, { error: 'table_query_failed' });
        }
      }
      assert.doesNotMatch(output, /private-row-value|test-only-token/);
    } finally {
      if (child && child.exitCode === null) { child.kill(); await once(child, 'exit'); }
      await rm(dir, { recursive: true, force: true });
    }
  });
}
