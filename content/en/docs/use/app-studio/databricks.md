---
title: "Build an application using Databricks data"
description: "Grant a project access to one imported table through a versioned action."
weight: 6
doc_type: "Tutorial"
---

## Prerequisites

Enable **App Studio, Code, Infrastructure, and Databricks** in the same workspace. Complete the [App Studio quickstart](/docs/use/app-studio/quickstart/) and [import a Databricks table](/docs/use/databricks/quickstart/). Use an identity allowed to read that table and configure the project integration.

## Connect the table

1. Open the project’s integrations controls.
2. Select the imported Databricks Table and the available `query_table/v1` action.
3. Review the exact resource and action being granted. Accept consent if the catalog requires it.
4. Save the integration and note its **integration alias**. The alias selects the project binding; it is not the Table resource name.

## Install the server SDK

Use a Node.js server component in your App Studio project. Add the published package through its import alias:

```bash
npm install --save-exact @faros/actions-node@npm:@crwilhit/faros-actions-node@0.1.0
```

The package is published as `@crwilhit/faros-actions-node`; application code imports `@faros/actions-node`. Commit your lockfile. This example uses SDK 0.1.0; confirm compatibility with your deployment before using another version.

## Configure the runtime

The application server needs the action environment provisioned by App Studio:

| Variable | Value |
| --- | --- |
| `FAROS_ACTIONS_BASE_URL` | HTTPS action gateway URL supplied by the runtime |
| `FAROS_PROJECT` | Current project identifier |
| `FAROS_ACTIONS_TOKEN_FILE` | Mounted, refreshed action token file readable by the server |
| `FAROS_ACTIONS_ORG`, `FAROS_ACTIONS_WORKSPACE` | Runtime tenant context, when configured |
| `TABLE_INTEGRATION_ALIAS` | Your saved project integration alias |
| `EXPECTED_TABLE_NAME` | Exact Faros Table resource name from that grant |
| `PORT` | Listening port required by your template; example defaults to 3000 |

Set the last three values in your server component's environment. Keep the alias separate from the Table name. Use the refreshed action token mount, not a bootstrap token or a copied Databricks credential. A plain local `npm start` without the action environment is not sufficient.

## Add the endpoint

Download [server.mjs](/examples/databricks/server.mjs) and [package.json](/examples/databricks/package.json) into a new server component, or adapt the handler into your existing server. The standalone example serves `GET /api/table`. It makes one schema-discovery request at startup with `{ "limit": 1 }`, checks the bound table identity and action version, then queries only discovered column names with a five-row limit. A failed discovery stops startup instead of guessing columns.

```bash
npm install
npm start
```

Run these commands inside the configured application runtime. The endpoint inherits the preview/production access policy: everyone allowed to use the application can call it. Keep the example private and add application-level authorization if different users require different data access.

## Verify the response and preview

From the server runtime, test the endpoint without printing table contents:

```bash
curl --fail --silent http://127.0.0.1:3000/api/table \
  | node --input-type=module -e '
let text = "";
for await (const chunk of process.stdin) text += chunk;
const result = JSON.parse(text);
if (result.actionVersion !== "v1" || !Array.isArray(result.rows) || result.rows.length > 5) process.exit(1);
console.log({ table: result.tableRef, columns: result.columns.length, rows: result.rows.length, truncated: result.truncated });'
```

Adjust the port if your template sets `PORT`. Expect metadata for the granted table, zero to five rows, and a boolean truncation flag. Zero rows can be a valid empty table. HTTP 502 with `table_query_failed` means the handler could not verify/query the binding; inspect the server's error code and request ID.

In the preview, have the UI fetch `/api/table` and render the returned `columns` and `rows`, including an empty state and an error state. Verify real returned values with an authorized test user. An HTTP 200 alone does not prove that the UI renders or protects the data correctly.

## Recovery and cleanup

For `grant_not_found`, `action_not_allowed`, or `binding_revoked`, inspect the project binding and grant. A schema change may require a fresh grant against the current catalog. Do not work around a failed grant with a direct provider credential.

Revoke the integration when access is no longer needed. Revocation does not delete the Databricks table. Next: [publish the application](/docs/use/app-studio/publishing/).

[Implementation reference](https://github.com/faroshq/faros/blob/main/docs/provider-actions.md) · [SDK reference](https://github.com/faroshq/faros/blob/main/provider-sdk/actions-node/README.md).
