import { createServer } from 'node:http';
import { createActionsClient } from '@faros/actions-node';

// Run inside an App Studio server runtime with its action environment mounted.
const required = ['FAROS_ACTIONS_BASE_URL', 'FAROS_PROJECT',
  'FAROS_ACTIONS_TOKEN_FILE', 'TABLE_INTEGRATION_ALIAS', 'EXPECTED_TABLE_NAME'];
for (const name of required) {
  if (!process.env[name]) throw new Error(`Missing ${name}`);
}
const faros = createActionsClient();
const table = faros.integration(process.env.TABLE_INTEGRATION_ALIAS);
function verify(envelope, limit) {
  const result = envelope.result;
  const ref = envelope.resourceRef;
  if (envelope.provider !== 'databricks' || envelope.action !== 'query_table' ||
      ref?.resource !== 'tables' || envelope.actionVersion !== 'v1' || ref?.name !== process.env.EXPECTED_TABLE_NAME ||
      ref?.apiVersion !== 'databricks.faros.sh/v1alpha1' || ref?.kind !== 'Table' ||
      result?.actionVersion !== 'v1' || result.tableRef !== process.env.EXPECTED_TABLE_NAME ||
      !Array.isArray(result.columns) || result.columns.length > 64 ||
      !result.columns.every(column => typeof column.name === 'string') ||
      !Array.isArray(result.rows) || result.rows.length > limit ||
      (result.truncated !== undefined && typeof result.truncated !== 'boolean')) {
    throw new Error('Unexpected table response');
  }
  return result;
}
// One bounded discovery request at startup. A failure stops startup.
const probe = verify(await table.invokeEnvelope('query_table/v1', { limit: 1 }), 1);
const columns = probe.columns.map(column => column.name);
if (!columns.length) throw new Error('The imported table has no columns');

export const server = createServer(async (request, response) => {
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('Content-Type', 'application/json');
  if (request.method !== 'GET' || request.url !== '/api/table') {
    response.writeHead(404).end(JSON.stringify({ error: 'not_found' }));
    return;
  }
  try {
    const envelope = await table.invokeEnvelope('query_table/v1', { columns, limit: 5 });
    const result = verify(envelope, 5);
    response.end(JSON.stringify({ ...result, truncated: result.truncated ?? false }));
  } catch (error) {
    // Diagnostic metadata only: never print credentials or returned row values.
    console.error(JSON.stringify({ code: error.code ?? 'verification_failed', requestID: error.requestID }));
    response.writeHead(502).end(JSON.stringify({ error: 'table_query_failed' }));
  }
}).listen(Number(process.env.PORT ?? 3000), '0.0.0.0');
