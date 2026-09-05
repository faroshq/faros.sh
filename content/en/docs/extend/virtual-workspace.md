---
title: Virtual Workspaces
description: How provider controllers see every tenant workspace at once — and the two identity patterns.
weight: 3
---

Your provider's service account is admin **only inside its own workspace** (`root:faros:providers:<name>`). It cannot read tenant workspaces directly — and it never should. Cross-workspace access goes through kcp's **APIExport virtual workspace**: a synthetic API endpoint that presents, in one place, every tenant workspace that has bound your export.

Through the virtual workspace your provider sees, per bound workspace:

- your own exported resources (the ones tenants created), and
- any resources granted by **accepted permission claims** (e.g. the tenant's Secrets, if you claimed them and the tenant accepted).

Nothing else. A tenant that hasn't bound your export is invisible to you. This is the platform's core isolation mechanism, not an optimization.

## Wiring controllers with multicluster-runtime

The `init` bootstrap created an `APIExportEndpointSlice` in your workspace (same name as your export). kcp publishes the virtual-workspace URLs on its status, and the [multicluster-runtime](https://github.com/kcp-dev/multicluster-provider) manager consumes them — each tenant workspace appears as a "cluster" your reconcilers get engaged for:

```go
// Simplified from providers/code/controller_manager.go
provider, _ := apiexport.New(vwConfig, apiexport.Options{})   // off the endpoint slice
mgr, _ := mcmanager.New(vwConfig, provider, manager.Options{})

// Reconcilers are cluster-aware: each request carries the logical cluster.
builder.ControllerManagedBy(mgr).
    For(&codev1alpha1.Repository{}).
    Complete(reconciler)
```

Inside a reconciler, `mcmanager.GetCluster(ctx, clusterName).GetConfig()` hands you a config scoped to that one tenant workspace — this is your *only* legitimate cross-workspace credential.

The shipped providers that run controller managers this way: `code`, `databricks`, `infrastructure`, `edges`. Read `providers/code/controller_manager.go` in the faros repo for the canonical setup.

## The two identity patterns

Every provider access to tenant data falls into one of two contracts. Mixing them up is the most common design mistake.

### Pattern A — service identity (controllers, background sync)

Continuous reconciliation runs as **your provider SA** through the virtual workspace, bounded by binding + accepted claims. Use it for controllers, watches, and background loops. The kuery provider's engagement controller is a good example: it watches tenants' Edge objects via the VW and opens background sync connections per edge.

### Pattern B — caller identity (request-driven endpoints)

For REST/MCP/GraphQL requests arriving through the hub's backend proxy, your provider must **drop its own credential and act as the caller**. The proxy hands you everything you need:

- `Authorization: Bearer <token>` — the caller's token, forwarded as-is.
- `X-Faros-User` — resolved user identity.
- `X-Faros-Tenant` — the caller's workspace path.
- `X-Faros-Cluster` — the workspace's **logical cluster ID**.

Build a per-request client from the caller's token scoped to `X-Faros-Cluster`, so kcp's own RBAC applies to everything you do on their behalf. Every shipped provider has a `tenant/client.go` doing exactly this.

Why the split matters: pattern A lets a buggy request handler at most touch what claims allow; pattern B guarantees a user can never do more through your provider than they could with `kubectl` directly.

## Address by cluster ID, never by path

The number-one footgun: kcp **shards resolve only `/clusters/<logical-cluster-id>`**. Workspace *paths* (`root:faros:tenants:...`) resolve only at the front proxy. Consequences:

- The minted provider kubeconfig points at `/clusters/<your-workspace-id>` — keep that pattern for anything you construct.
- When addressing a tenant's workspace (e.g. a per-cluster GraphQL endpoint), use the ID from `X-Faros-Cluster`, never the `X-Faros-Tenant` path.
- You cannot "re-root" your provider SA kubeconfig at another workspace's `/clusters/<id>` — the token is pinned to your workspace and kcp rejects it. Cross-workspace = virtual workspace, full stop.

## Dynamic APIs

The resource list on your APIExport is merged, not replaced, so a provider can grow its API at runtime. The infrastructure provider does this: each `Template` a platform admin applies adds that template's instance kind (e.g. `Application`, `Redis`, `Postgres`) to the export, and tenants who bound it see the new kind appear in their workspace.
