---
title: "Provider Actions and assistant skills"
description: "Publish callable actions and distribute guidance without conflating permissions."
weight: 9
doc_type: "Guide"
---

Provider Actions declare versioned operations, input/output schemas, limits, consent, and the exact bound resource type in a CatalogEntry. Applications receive grants to specific resources and invoke actions under workload identity.

The reviewed implementation supports synchronous actions; Databricks `query_table/v1` is the implemented action described in these guides. Do not advertise unsupported execution or idempotency modes.

## Publish an action

An action is a catalog declaration, not a provider URL exposed to the
application. The declaration names the resource type that will be bound and
keeps the request and response bounded. This is the relevant shape of the
Databricks action:

```yaml
actions:
  - id: query_table/v1
    displayName: Query table
    description: Run a bounded read-only query against an imported Databricks table.
    boundResource:
      apiVersion: databricks.faros.sh/v1alpha1
      kind: Table
      resource: tables
    inputSchema:
      type: object
      properties:
        columns:
          type: array
          maxItems: 64
          items: {type: string}
        limit:
          type: integer
          minimum: 1
          maximum: 100
      additionalProperties: false
    executionMode: sync
    readOnly: true
    risk: low
    idempotency: inherent
    limits:
      timeoutSeconds: 45
      maxInputBytes: 8192
      maxOutputBytes: 65536
      maxResultItems: 100
    consent:
      required: false
```

The complete declaration also includes the output schema and a schema digest.
The hub validates and canonicalizes both schemas, then App Studio pins the
digest when a project grant is created. A changed schema therefore requires a
fresh grant verification.

## Grant one exact resource

A project integration grants an action to one resource identity. For example,
the `sales` integration can be bound to the imported Table named
`order-history`:

```yaml
name: sales
provider: databricks
kind: providerReference
resourceRef:
  apiVersion: databricks.faros.sh/v1alpha1
  kind: Table
  resource: tables
  name: order-history
allowedActions:
  - name: query_table
    version: v1
    schemaDigest: sha256:<catalog-digest>
```

The integration alias (`sales`) selects the project grant in the SDK. It is
not the Table name or `tableRef`; the grant supplies that binding. Keep the
resource identity out of browser input, and never let a caller replace it
with a provider URL, credentials, or an arbitrary `resourceRef`.

## Invoke from a server

Generated applications use the server-only SDK. If your project does not already include it, install the published package under the stable import alias:

```bash
npm install @faros/actions-node@npm:@crwilhit/faros-actions-node@0.1.0
```

Configure the three environment variables below in the application server using its Faros workload identity; never expose the token file to browser code. The gateway verifies that the
grant is present and not revoked, re-checks the live catalog digest, and
forwards the request to the provider action route. The application supplies
only action input:

```js
import { createActionsClient } from '@faros/actions-node';

const faros = createActionsClient({
  baseURL: process.env.FAROS_ACTIONS_BASE_URL,
  project: process.env.FAROS_PROJECT,
  tokenFile: process.env.FAROS_ACTIONS_TOKEN_FILE,
});

const result = await faros.integration('sales').invoke('query_table/v1', {
  columns: ['order_id', 'total'],
  limit: 25,
});
```

The column names must come from the bound Table's current schema. The action
returns a bounded result containing the action version, bound table reference,
column metadata, rows, and an optional `truncated` flag. Use
`invokeEnvelope` when the application needs the complete response envelope,
including request and binding metadata.

## Prove denied access

Run the same invocation with a caller that has no active project grant, or
after revoking the `sales` grant. It must be rejected; the caller cannot select
another Table by changing the input. At the provider boundary, authorization
requires both visibility (`get`) on the exact `tables/order-history` resource
and the action verb grant (`create` on `tables/query_table`) for the caller.
This gives you a useful negative test alongside the successful invocation:

1. Grant `query_table/v1` to `order-history` and verify one bounded read.
2. Revoke that grant, then repeat the unchanged server call and verify it is
   rejected.
3. Restore the grant only after a fresh catalog and schema-digest check.

Provider failures are typed. Application code should branch on the SDK's
`ProviderActionError` code and `retryable` value rather than infer retry
behavior from an HTTP status. For example, an unknown column is
`schema_projection_invalid` and is not retryable.

Assistant skills distribute instructions and supporting resources. They do not confer action grants or tool authority. Test skill distribution separately from action authorization.

Verify catalog validation, exact resource binding, denied access, revocation, schema changes, and bounded results before publishing an action.

[Action contract](https://github.com/faroshq/faros/blob/main/docs/provider-actions.md) · [Application SDK](https://github.com/faroshq/faros/blob/main/provider-sdk/actions-node/README.md) · [App integration tutorial](/docs/use/app-studio/databricks/).
