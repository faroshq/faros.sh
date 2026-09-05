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

For `browser` and `searxng`, the manifest declares optional exposure: inspect the installed template and values rather than assuming a public URL. The [template manifests](https://github.com/faroshq/faros/tree/main/providers/infrastructure/install/templates) contain their input contracts and runtime resources. Continue with the [Infrastructure quickstart](/docs/use/infrastructure/quickstart/) to create and verify an instance, or use the [MCP tool inventory](/docs/use/infrastructure/reference/#mcp-tools).

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
