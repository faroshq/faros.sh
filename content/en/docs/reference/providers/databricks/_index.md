---
title: "Databricks API reference"
description: "Resource operations, examples, and schema definitions."
weight: 90
doc_type: "Reference"
provider: "databricks"
---

## Prerequisites and scope

Use the workspace where Databricks is enabled. Authenticate with a credential authorized for the requested resource and operation. Inspect your deployed API discovery for the exact schema in your hub.

## Interfaces

Connection, Warehouse, and Table use `databricks.faros.sh/v1alpha1`. `query_table/v1` binds to an exact Table and accepts optional column projections and a row limit from 1 to 100. It is synchronous and read-only. MCP exposes list_tables, describe_table, and query_table when enabled.

## MCP tools

The [aggregate MCP endpoint](/docs/use/ai-assistants/) uses the `databricks__` prefix. These tools operate on tables already imported into the active Faros workspace, subject to its permissions and the upstream Databricks connection.

| Tool | Use it to |
|---|---|
| `list_tables` | Find imported tables and their exact Faros resource names. |
| `describe_table` | Read a table's cached column names and types. |
| `query_table` | Read up to 100 rows, optionally selecting exact column names. |

Pass the exact Table resource name as `tableRef`, not an App Studio integration alias. Querying is a synchronous action and does not create a query resource. Inspect your client's tool discovery for deployed schemas; see the [tool definitions](https://github.com/faroshq/faros/blob/main/providers/databricks/mcpserver/tools.go).

## Resource schemas

[Resource fields and validation rules](/docs/reference/providers/databricks/schemas/) are generated from the checked-in schemas, with a downloadable JSON bundle.

## Inspect tables and query rows

Use an authenticated context for the workspace and verify that the imported Table has refreshed status before querying it.

```sh
kubectl faros use
kubectl api-resources --api-group=databricks.faros.sh
kubectl get connections.databricks.faros.sh,warehouses.databricks.faros.sh,tables.databricks.faros.sh
kubectl explain tables.databricks.faros.sh.spec --api-version=databricks.faros.sh/v1alpha1
kubectl describe table.databricks.faros.sh/<table-resource-name>
```

The versioned MCP action accepts the exact imported Table resource name, not an App Studio alias:

```json
{"actionVersion":"v1","tableRef":"<table-resource-name>","columns":["<column-name>"],"limit":25}
```

Send that object as the `arguments` for `databricks__query_table` after discovering the tool through MCP. It returns `columns`, `rows`, and the echoed action version. `limit` is at most 100 and columns must be exact names; an unavailable action, stale Table schema, or upstream permission failure must be repaired before retrying.

## Authoritative definitions

[API definitions](https://github.com/faroshq/faros/blob/main/docs/provider-actions.md) contain fields and contracts. For Kubernetes-style resources, use `kubectl api-resources` and `kubectl explain RESOURCE` against the intended workspace to inspect the installed schema.

## Related guide

[Application integration](/docs/use/app-studio/databricks/). Return to [Databricks](/docs/use/databricks/) for prerequisites and the provider’s quickstart.
