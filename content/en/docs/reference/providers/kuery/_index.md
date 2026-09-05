---
title: "Kuery API reference"
description: "Resource operations, examples, and schema definitions."
weight: 90
doc_type: "Reference"
provider: "kuery"
---

## Prerequisites and scope

Use the workspace where Kuery is enabled. Authenticate with a credential authorized for the requested resource and operation. Inspect your deployed API discovery for the exact schema in your hub.

## Interfaces

Use `POST /services/providers/kuery/api/query` with a structured query. Call the hub backend proxy with the selected organization and workspace UUIDs; the hub supplies `X-Faros-Tenant` and caller identity before the provider handles the request. A direct provider request without that context is rejected. `kuery_query` and `kuery_impact` are the MCP interfaces. Check synchronized kinds and freshness when interpreting results.

## MCP tools

Use [MCP setup](/docs/use/ai-assistants/) to connect a client. The aggregate endpoint prefixes the tool names with `kuery__`.

| Tool | Use it to |
|---|---|
| `kuery_query` | Query synchronized resources across workspace edges, filter by kind, namespace, or labels, project fields, and expand relationships. |
| `kuery_impact` | Inspect an object's upstream dependencies (`impactedBy`), downstream dependents (`impacts`), and associated peers. |

Impact results describe declared relationships such as owner references, selectors, and resource references. They do not trace runtime traffic or prove that no other dependency exists. Check synchronization freshness and permissions when interpreting an empty result. See the [tool definitions](https://github.com/faroshq/faros/blob/main/providers/kuery/mcpserver/tools.go) for inputs and outputs.

## Resource schemas

[Resource fields and validation rules](/docs/reference/providers/kuery/schemas/) are generated from the checked-in schemas, with a downloadable JSON bundle.

## Query synchronized objects

Kuery reads the engaged edges for the authenticated workspace. The hub applies tenant scope from the request credential; never put a tenant identifier in a query to bypass authorization.

Use a [service-account token](/docs/administration/service-accounts/#create-and-verify) for the target workspace and enter it at the hidden prompt below. Obtain organization and workspace UUIDs from Settings or your administrator; use IDs rather than display names. For self-hosting, replace the hub URL. Replace `<namespace>` with a namespace on an engaged Kubernetes edge.

```sh
export FAROS_HUB_URL='https://console.faros.sh'
export FAROS_ORG_UUID='<organization-uuid>'
export FAROS_WORKSPACE_UUID='<workspace-uuid>'
FAROS_TOKEN="$(python3 -c 'import getpass; print(getpass.getpass("Service-account token: "))')"
curl --fail-with-body -X POST "$FAROS_HUB_URL/services/providers/kuery/api/query" \
  -H "X-Faros-Org: $FAROS_ORG_UUID" -H "X-Faros-Workspace: $FAROS_WORKSPACE_UUID" \
  -H "Authorization: Bearer $FAROS_TOKEN" -H 'Content-Type: application/json' \
  --data '{"limit":25,"filter":{"objects":[{"groupKind":{"apiGroup":"apps","kind":"Deployment"},"namespace":"<namespace>"}]},"objects":{"cluster":true,"object":{"metadata":{"name":true},"spec":{"replicas":true}}}}'
```

The response is a JSON `QueryStatus` whose `objects` list contains the projected synchronized objects (and may include `cursor.next` when cursor output is requested). Add `"cursor":true` and pass that opaque value unchanged in `page.cursor` for another page. A 401/403 means the bearer or workspace selection is invalid; an empty result can mean no synchronized object, a stale edge, or insufficient visibility. Check edge freshness and permissions before concluding that nothing exists. For dependency analysis, use `kuery__kuery_impact` with the exact edge, group, kind, namespace, and name; declared relationships do not prove runtime traffic.

## Authoritative definitions

[API definitions](https://github.com/faroshq/faros/blob/main/docs/kuery-query-api.md) contain fields and contracts. For Kubernetes-style resources, use `kubectl api-resources` and `kubectl explain RESOURCE` against the intended workspace to inspect the installed schema.

## Related guide

[Fleet query tutorial](/docs/use/kuery/quickstart/). Return to [Kuery](/docs/use/kuery/) for prerequisites and the provider’s quickstart.
