---
title: "AI agents API reference"
description: "Resource operations, examples, and schema definitions."
weight: 90
doc_type: "Reference"
provider: "agents"
---

## Prerequisites and scope

Use the workspace where AI agents is enabled. Authenticate with a credential authorized for the requested resource and operation. Inspect your deployed API discovery for the exact schema in your hub. For HTTP calls, use the hub backend proxy at `/services/providers/agents/`; the hub resolves the workspace from the organization and workspace UUID headers and injects the verified tenant context. Do not call a provider pod directly or send `X-Railgrid-Tenant`/`X-Railgrid-Cluster` yourself.

## Interfaces

Agent, connection, schedule, trigger, and toolset configuration use the agents API. Runs are stored in the provider’s database. The invocation API supports creating a run, polling/waiting for its result, and reading output.

## Resource schemas

[Resource fields and validation rules](/docs/reference/providers/agents/schemas/) are generated from the checked-in schemas, with a downloadable JSON bundle.

## Inspect resources and invoke an agent

Use an authenticated workspace context for resource reads. The API invocation route uses the same workspace authorization and accepts a JSON body with required `task`; `wait` is optional and capped at 120 seconds.

```sh
kubectl railgrid use
kubectl api-resources --api-group=agents.railgrid.ai
kubectl get agents.agents.railgrid.ai,connections.agents.railgrid.ai,schedules.agents.railgrid.ai,triggers.agents.railgrid.ai
kubectl explain agents.agents.railgrid.ai.spec --api-version=agents.railgrid.ai/v1alpha1
```

Use a [service-account token](/docs/administration/service-accounts/#create-and-verify) issued in the target workspace with permission for this operation. Enter it at the hidden prompt below. For self-hosting, replace the hub URL with your organization’s URL.

```sh
# Use organization/workspace UUIDs from Settings or your administrator.
# These are identifiers, not display names.
export RAILGRID_HUB_URL='https://console.faros.sh'
export RAILGRID_ORG_UUID='<organization-uuid>'
export RAILGRID_WORKSPACE_UUID='<workspace-uuid>'
RAILGRID_TOKEN="$(python3 -c 'import getpass; print(getpass.getpass("Service-account token: "))')"
curl --fail-with-body -X POST "$RAILGRID_HUB_URL/services/providers/agents/api/agents/<agent-name>/runs" \
  -H "X-Railgrid-Org: $RAILGRID_ORG_UUID" -H "X-Railgrid-Workspace: $RAILGRID_WORKSPACE_UUID" \
  -H "Authorization: Bearer $RAILGRID_TOKEN" -H 'Content-Type: application/json' \
  --data '{"task":"Summarize the current workspace status","wait":0,"idempotencyKey":"<unique-retry-key>"}'
```

The response is JSON containing `runId` and `phase` (`pending` or `running` for an accepted asynchronous request). When an inline wait settles within the 120-second cap, it can also include `run` with the full run detail and output. Poll the result, or wait for settlement, with the returned ID:

```sh
curl --fail-with-body -H "Authorization: Bearer $RAILGRID_TOKEN" \
  -H "X-Railgrid-Org: $RAILGRID_ORG_UUID" -H "X-Railgrid-Workspace: $RAILGRID_WORKSPACE_UUID" \
  "$RAILGRID_HUB_URL/services/providers/agents/api/runs/<run-id>/wait"
```

A repeated request with the same non-empty idempotency key in the same workspace reuses the existing run. A 401/403 is an authentication, missing proxy context, or workspace authorization failure; a 404 usually means the agent or run is outside the caller's workspace. The `/wait` response returns the run detail when it settles, or the current run when its long-poll timeout expires. A timeout does not cancel the detached run—poll the run ID.

## Authoritative definitions

[API definitions](https://github.com/railgrid/railgrid/blob/main/providers/agents/apis/v1alpha1) contain fields and contracts. For Kubernetes-style resources, use `kubectl api-resources` and `kubectl explain RESOURCE` against the intended workspace to inspect the installed schema.

## Related guide

[Schedules and triggers](/docs/use/agents/schedules/). Return to [AI agents](/docs/use/agents/) for prerequisites and the provider’s quickstart.
