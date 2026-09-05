---
title: "Templates and instance lifecycle"
description: "Inspect inputs, credentials, status, and deletion."
weight: 2
doc_type: "Guide"
---

A Template is the available product definition. An Instance is one provisioned use of it. Adding a template does not add a new tenant-facing resource kind.

## Choose a bundled template

Faros includes the following templates. Operators choose which templates to install; this list does not guarantee that all are available in your workspace. Start by listing your installed catalog:

```bash
kubectl get templates.infrastructure.faros.sh
kubectl get templates.infrastructure.faros.sh TEMPLATE-NAME -o yaml
```

Run these commands in the [intended Faros workspace](/docs/reference/cli/resources/), replacing `TEMPLATE-NAME` with a returned name. Review required values, credential references, and exposure before creating an instance.

| Template | Purpose |
|---|---|
| `application` | Frontend, backend, and PostgreSQL behind the platform access gate; access can be public or invite-only. |
| `simple-webapp` | A single-container web application with a URL and development support. |
| `worker` | A background process with development support; no public URL. |
| `cron-job` | A container that runs on a schedule and exits; no public URL. |
| `database` | PostgreSQL with credentials exposed by Secret reference; internal access. |
| `redis-cache` | An internal, ephemeral Redis cache; data does not survive a restart. |
| `browser` | A Playwright MCP browser runtime for agent tools. |
| `searxng` | A SearXNG web-search runtime for agent tools. |
| `universal-coding-sandbox` | A private coding workspace with bounded file and execution operations. |

For `browser` and `searxng`, the manifest declares optional exposure: inspect the installed template and values rather than assuming a public URL. The [template manifests](https://github.com/faroshq/faros/tree/main/providers/infrastructure/install/templates) contain their input contracts and runtime resources. Continue with the [Infrastructure quickstart](/docs/use/infrastructure/quickstart/) to create and verify an instance, or use the [MCP tool inventory](/docs/reference/providers/infrastructure/#mcp-tools).

## Follow a provisioning request

Suppose an assistant provisions a database through the Infrastructure provider. The workspace must have Infrastructure enabled, a database template installed, a configured runtime, and credentials authorized to create instances.

```text
Assistant's MCP client
    |
    v
Hub MCP endpoint — authenticate and resolve workspace
    |
    v
Infrastructure provision tool — create an Instance in that workspace
    |
    v
Provider reconciliation — create runtime resources from the template
    |
    v
Runtime cluster — run the database and report status
```

1. **Discover the contract.** The assistant lists templates, then describes `database` to learn its required inputs and internal exposure. A database is an `Instance` using that template, not a dynamically added `Postgres` API kind.
2. **Authorize the request.** At the aggregate MCP endpoint, the credential belongs to the `MCPServer` service account. It is distinct from the human's browser session. Provider requests carry the resolved workspace and caller credential; the tool must be allowed to create the instance there.
3. **Record desired state.** `infrastructure__provision` creates the `Instance`. Acceptance means the request exists, not that the database is ready.
4. **Reconcile the runtime.** The provider's controllers and operator use their configured credentials and workspace bindings to reconcile the template into runtime resources. The database runs in the configured runtime cluster, not inside the hub.
5. **Verify the result.** Use `infrastructure__get_instance` or inspect the resource's phase and conditions. Follow the template's credential references and connection instructions; an internal database should not be expected to acquire a public URL.

If provisioning fails, use [Infrastructure troubleshooting](/docs/use/infrastructure/instances/#troubleshooting) to distinguish authorization, invalid inputs, and runtime failures. When finished, delete the test instance and verify cleanup using [Credentials and deletion](#credentials-and-deletion).

This flow applies to declarative provisioning. A [Databricks table query](/docs/reference/providers/databricks/#mcp-tools), for example, returns a synchronous result without creating a query resource. See [MCP endpoint identity](/docs/use/ai-assistants/#the-mcpserver-object) and [Infrastructure tools](/docs/reference/providers/infrastructure/#mcp-tools) for the corresponding interfaces.

## Update an instance

1. Select its workspace and inspect the current template, values, phase, and conditions.
2. Change supported fields in `spec.values`. The template selection itself is immutable.
3. Wait for reconciliation, then verify the actual application or runtime output.

A structurally accepted update can still fail template validation. Check status rather than assuming that a successful save changed the runtime.

## Credentials and deletion

Use the credential inputs defined by the template. Do not paste secrets into chat or arbitrary values fields when the template expects a Secret reference.

Deletion is finalizer-driven: the provider removes the runtime resource and associated bridged secrets. If deletion stalls, inspect the condition and operator logs; do not remove finalizers merely to hide a failed cleanup.

Template authors should use [Extend Faros](/docs/extend/templates/). Operators should use [Infrastructure self-hosting](/docs/self-hosting/providers/infrastructure/).

## Inspect and update from the CLI

Use the [provider-resource workflow](/docs/reference/cli/resources/) in the owning workspace. Replace `INSTANCE-NAME` with the intended instance.

```bash
kubectl get instances.infrastructure.faros.sh INSTANCE-NAME -o yaml
kubectl edit instances.infrastructure.faros.sh INSTANCE-NAME
kubectl get instances.infrastructure.faros.sh INSTANCE-NAME --watch
```

Edit only the supported `spec.values` inputs, preserving credential references. Do not change `spec.template` or provider-owned status. Stop the watch with Ctrl-C after checking conditions and verifying the resulting runtime. If the change fails validation, correct the inputs rather than repeatedly restarting the runtime.

## Troubleshooting

### Check workspace and access

Confirm the selected organization/workspace and that the provider is enabled there. Try a read-only operation using the same identity as the failing action. A successful administrator action does not prove another identity has access.

### Diagnose the provider

Inspect Instance phase and conditions, especially input validation. Then check credential references and runtime readiness with the operator. A stuck finalizer requires cleanup investigation, not blind removal.

### Collect useful evidence

Record the resource name, failing step, time, status conditions, and request/run ID where available. Share these with your operator, excluding bearer tokens, credentials, and private application data.

If the provider itself is unavailable, use [Infrastructure self-hosting](/docs/self-hosting/providers/infrastructure/) for operator checks. Once resolved, repeat the verification step in the [quickstart](/docs/use/infrastructure/quickstart/).
