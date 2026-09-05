---
title: "Databricks API reference"
description: "Resource and interface map, with versioned source definitions."
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

Pass the exact Table resource name as `tableRef`, not an App Studio integration alias. Querying is a synchronous action and does not create a query resource. Inspect your client's tool discovery for deployed schemas; see the [versioned tool definitions](https://github.com/faroshq/faros/blob/main/providers/databricks/mcpserver/tools.go).

## Resource schemas

[Resource fields and validation rules](/docs/reference/providers/databricks/schemas/) are generated from the checked-in schemas, with a downloadable JSON bundle.

## Authoritative definitions

[API definitions](https://github.com/faroshq/faros/blob/main/docs/provider-actions.md) contain fields and contracts. For Kubernetes-style resources, use `kubectl api-resources` and `kubectl explain RESOURCE` against the intended workspace to inspect the installed schema.

## Related guide

[Application integration](/docs/use/app-studio/databricks/). Return to [Databricks](/docs/use/databricks/) for prerequisites and the provider’s quickstart.
