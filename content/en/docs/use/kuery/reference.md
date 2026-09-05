---
title: "Kuery API reference"
description: "Resource and interface map, with versioned source definitions."
weight: 90
doc_type: "Reference"
---

## Prerequisites and scope

Use the workspace where Kuery is enabled. Authenticate with a credential authorized for the requested resource and operation. Inspect your deployed API discovery for the exact schema in your hub.

## Interfaces

Use `POST /services/providers/kuery/api/query` with a structured query. The provider enforces tenant scope. `kuery_query` and `kuery_impact` are the MCP interfaces. Check synchronized kinds and freshness when interpreting results.

## MCP tools

Use [MCP setup](/docs/use/mcp/) to connect a client. The aggregate endpoint prefixes the tool names with `kuery__`.

| Tool | Use it to |
|---|---|
| `kuery_query` | Query synchronized resources across workspace edges, filter by kind, namespace, or labels, project fields, and expand relationships. |
| `kuery_impact` | Inspect an object's upstream dependencies (`impactedBy`), downstream dependents (`impacts`), and associated peers. |

Impact results describe declared relationships such as owner references, selectors, and resource references. They do not trace runtime traffic or prove that no other dependency exists. Check synchronization freshness and permissions when interpreting an empty result. See the [versioned tool definitions](https://github.com/faroshq/faros/blob/main/providers/kuery/mcpserver/tools.go) for inputs and outputs.

## Resource schemas

[Resource fields and validation rules](/docs/use/kuery/schemas/) are generated from the checked-in schemas, with a downloadable JSON bundle.

## Authoritative definitions

[API definitions](https://github.com/faroshq/faros/blob/main/docs/kuery-query-api.md) contain fields and contracts. For Kubernetes-style resources, use `kubectl api-resources` and `kubectl explain RESOURCE` against the intended workspace to inspect the installed schema.

## Related guide

[Fleet query tutorial](/docs/use/kuery/quickstart/). Return to [Kuery](/docs/use/kuery/) for prerequisites and the provider’s quickstart.
