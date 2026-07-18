---
title: Anatomy & Lifecycle
description: The Provider and CatalogEntry objects, the init bootstrap, heartbeats, and the Enable flow.
weight: 1
---

A provider's life involves two kcp objects and one bootstrap step, with clear ownership:

| Piece | Created by | Lives in | Purpose |
|:------|:-----------|:---------|:--------|
| `Provider` (`admin.kedge.faros.sh/v1alpha1`) | platform admin | `root:kedge:system:providers` | Provisions the provider workspace, service account, and kubeconfig |
| provider `init` subcommand | your binary (initContainer) | runs against your workspace | Creates schemas, APIExport, endpoint slice, bind grant, CatalogEntry |
| `CatalogEntry` (`providers.kedge.faros.sh/v1alpha1`) | your `init` step | `root:kedge:providers:<name>` | Routing, UI/backend URLs, Enable-dialog metadata |

## Step 1 — the admin applies a `Provider`

This is `provider.yaml` in every in-repo provider, and it's tiny — the name is the identity:

```yaml
apiVersion: admin.kedge.faros.sh/v1alpha1
kind: Provider
metadata:
  name: quickstart
spec:
  displayName: "Quickstart"
```

Optional spec fields: `secretName` (override the kubeconfig Secret name, default `<name>-kubeconfig`) and `serverURLOverride` (override the API-server URL baked into the minted kubeconfig).

The hub's provider reconciler then, idempotently:

1. Creates the workspace `root:kedge:providers:<name>` with the restricted `provider` workspace type and waits for it to be ready.
2. Creates a `default` namespace, a ServiceAccount named `provider`, and a ClusterRoleBinding granting it **cluster-admin inside that workspace only**.
3. Mints a long-lived service-account token and builds a kubeconfig whose server is `<hub-url>/clusters/<logical-cluster-id>` — the cluster **ID**, not the workspace path (kcp shards only resolve IDs).
4. Writes the kubeconfig into the Secret `<name>-kubeconfig` in `root:kedge:system:providers`, and sets `status.workspacePath`, `status.workspaceCluster`, `status.secretRef`, and the `Ready` condition.

> **Deleting a `Provider` is a full teardown.** A finalizer deletes the workspace — cascading the APIExport, schemas, and CatalogEntry — plus the kubeconfig Secret. Tenant `APIBinding`s pointing at the export break. Don't delete a Provider whose API tenants still use.

The `provider` workspace type is deliberately restricted: it can't create child workspaces, and its only default binding is `providers.kedge.faros.sh` — just enough for the provider to self-register its `CatalogEntry`.

## Step 2 — your `init` subcommand bootstraps the API

Your Deployment runs an initContainer with `args: ["init"]` and the minted kubeconfig mounted (`KEDGE_PROVIDER_KUBECONFIG=/var/run/secrets/kedge/kedge-provider-kubeconfig`). The kedge provider SDK's `install.Bootstrap` then runs, idempotently and in order:

1. **Apply schemas** — every `*.yaml` in `KEDGE_SCHEMAS_DIR` (default `/etc/kedge/schemas`, baked into your image) is applied as an `APIResourceSchema`.
2. **Apply the APIExport** — referencing those schemas plus your permission claims. Resource lists are *merged*, not clobbered, so controllers that add entries at runtime coexist with `init`.
3. **Ensure an `APIExportEndpointSlice`** — this is what your controllers consume to reach the virtual workspace.
4. **Apply the bind grant** — a ClusterRole/Binding named `kedge:providers:bind:<export>` letting `system:authenticated` create APIBindings to your export. Without it, every tenant Enable fails with a 403.
5. **Self-register the `CatalogEntry`** — from the file at `KEDGE_CATALOGENTRY_FILE` (the Helm chart renders your `manifest.yaml` into a ConfigMap).

Because the kubeconfig Secret mount is non-optional, the pod simply blocks until the hub has provisioned it — natural ordering, no operator choreography.

## The `CatalogEntry` (manifest.yaml)

The full shape, from the quickstart provider:

```yaml
apiVersion: providers.kedge.faros.sh/v1alpha1
kind: CatalogEntry
metadata:
  name: quickstart
spec:
  displayName: "Quickstart"
  description: "Reference provider demonstrating the kedge plugin surface."
  vendor: "kedge"
  version: "0.1.0"
  category: "Demo"
  iconURL: "/ui/providers/quickstart/icon.svg"
  ui:
    url: "http://quickstart.kedge.svc.cluster.local:8081"
    indexPath: "/"
  backend:
    url: "http://quickstart.kedge.svc.cluster.local:8081"
    healthPath: "/healthz"
  apiExport:
    name: "quickstart.providers.kedge.faros.sh"
    permissionClaims:
      - resource: configmaps
        verbs: [get, list, watch]
        tenantScoped: true
```

Field reference:

| Field | Meaning |
|:------|:--------|
| `displayName` (required), `description`, `vendor`, `version` | Catalog card metadata. |
| `category` | Side-nav grouping in the portal. |
| `iconURL` | Portal-relative icon path, served through the UI proxy. |
| `dependencies[].name` | Providers that must already be enabled in a workspace; Enable returns 409 otherwise. |
| `ui.url` | Your UI origin. The hub reverse-proxies `/ui/providers/<name>/*` here; the portal loads `main.js` from it as a custom element. |
| `ui.children[]` | Sub-navigation items (`{displayName, builtinRoute}`); your element reads the active child from `kedgeContext.subPath`. |
| `backend.url` (+ `healthPath`) | Your API origin. Proxied at `/services/providers/<name>/*`; health checked at `healthPath` (default `/healthz`). |
| `apiExport.name` | The export tenants bind. The export itself is created by `init` — this is a reference, not a definition. |
| `apiExport.permissionClaims[]` | Mirror of the claims on your export, used to render the Enable dialog. |
| `edgeProxyAccess` | If true, enabling also grants your provider SA the `proxy` verb on edges in the tenant workspace — for background connections to edge clusters (kuery uses this). |

> Older drafts had inline `schemas[].body` on the CatalogEntry — that's gone. Schemas ship in your image and are applied by `init`.

## Step 3 — registration, heartbeat, readiness

The hub watches `CatalogEntry` objects across all provider workspaces and mirrors them into an in-memory registry that drives `/api/providers`, the portal nav, the proxies, and MCP federation.

Your serve process **heartbeats** the hub every 30 seconds: `POST /api/providers/<name>/heartbeat` with `{"version": "...", "status": "..."}`. Heartbeats have a 90-second TTL. A provider is **Ready** when its endpoints parse and its heartbeat is fresh (a provider that has never heartbeated is given the benefit of the doubt; once it beats, it must keep beating). Not-Ready means the UI proxy serves 503 and the provider drops out of MCP federation.

## Step 4 — the tenant clicks Enable

Enabling happens through the hub's REST API (the portal calls it for you):

```
POST /api/orgs/{org}/workspaces/{ws}/providers/{name}/enable
```

The hub checks the caller's workspace membership, then creates an `APIBinding` in the tenant workspace pointing at your export. Accepted permission claims come from the dialog, but the *verbs* always come from your declared claims — a tenant can't escalate what you asked for. Disable deletes the binding (kcp then removes the bound resources from the workspace).

From that moment your resources are ordinary objects in the tenant workspace — `kubectl get greetings` just works — and your controllers see them through the [virtual workspace](/docs/providers/virtual-workspace/).

## The whole lifecycle at a glance

1. Admin applies `Provider` → hub provisions workspace + SA + kubeconfig Secret.
2. Helm installs your chart → initContainer `init` creates schemas, export, slice, bind grant, CatalogEntry.
3. Serve container starts, heartbeats → registry marks you Ready; you appear in the catalog.
4. Tenant clicks Enable → APIBinding created in their workspace.
5. Tenant creates your resources; your controllers reconcile them; your UI, backend, and MCP tools light up for that workspace.
