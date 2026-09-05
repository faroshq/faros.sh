---
title: "Query your fleet and inspect impact"
description: "Use connected Kubernetes edges as a searchable inventory."
weight: 1
doc_type: "Tutorial"
---

## Prerequisites

Enable **Edges** and **Kuery** in the same workspace, with a connected Kubernetes edge. The provider must have its required edge access. Allow time for synchronization before expecting query results.

1. Open Kuery in the selected workspace.
2. Inspect fleet inventory and select an edge, resource kind, or namespace.
3. Open a resource’s impact view to inspect its declared relationships.
4. Compare an expected object against the live edge when freshness matters.

For API clients, the query endpoint accepts a structured query rather than free-form SQL. A Deployment inventory query is:

```json
{
  "filter": {"objects": [{"groupKind": {"kind": "Deployment"}}]},
  "objects": {"cluster": true}
}
```

## Submit the query from a terminal

Save the JSON above as `query.json`. Use a valid human-session bearer token and the organization/workspace UUIDs for the intended Faros workspace. These are UUIDs, not display names; obtain them from your console context or administrator. `curl` does not inherit the workspace selected by `kubectl faros use`.

Set `FAROS_HUB_URL`, `FAROS_ORG_UUID`, and `FAROS_WORKSPACE_UUID` to those values. Supply `FAROS_TOKEN` securely in your local environment; do not paste the token into shell history or shared output.

```bash
curl --fail-with-body --silent --show-error \
  "${FAROS_HUB_URL}/services/providers/kuery/api/query" \
  -H "Authorization: Bearer ${FAROS_TOKEN}" \
  -H "X-Faros-Org: ${FAROS_ORG_UUID}" \
  -H "X-Faros-Workspace: ${FAROS_WORKSPACE_UUID}" \
  -H "Content-Type: application/json" \
  --data-binary @query.json
```

The response is a query result with `objects`; an empty collection may indicate filtering or synchronization state. A 401/403 is an authentication or workspace-access problem, not an empty fleet. Do not supply `X-Faros-Tenant`: the hub establishes the provider's tenant scope. Do not assume a service-account token has the same provider-proxy support as a human session.

Delete the test query file when no longer needed and unset `FAROS_TOKEN` after use. Queries do not deploy or change fleet workloads.

## Interpret results carefully

An empty result may mean the cluster has not synchronized, the kind is excluded by the sync whitelist, or the filter does not match. A dependency graph describes observed relationships; it does not prove that deleting or changing a resource is safe.

Queries do not create workloads, so no workload cleanup is needed for this guide. Next: [query reference and freshness](/docs/use/kuery/reference/).
