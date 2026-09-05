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

The `init` bootstrap must create an `APIExportEndpointSlice` in your provider workspace. By convention its name is the APIExport name; pass that exact name to the multicluster provider. kcp publishes the virtual-workspace URLs on the slice status, and the [multicluster-runtime](https://github.com/kcp-dev/multicluster-provider) manager consumes them — each tenant workspace appears as a "cluster" your reconcilers get engaged for. The provider must have a usable `*rest.Config`, the endpoint-slice name, and a scheme containing its API types before constructing the manager:

```go
// Simplified from providers/code/controller_manager.go
const endpointSliceName = "<your-api-export-name>"
scheme := yourscheme.NewScheme()

// Ensure this slice during init/startup, before constructing the provider.
// install.EnsureAPIExportEndpointSlice(ctx, vwConfig, workspacePath)

provider, err := apiexport.New(vwConfig, endpointSliceName, apiexport.Options{Scheme: scheme})
if err != nil {
    return fmt.Errorf("creating APIExport multicluster provider: %w", err)
}
mgr, err := mcmanager.New(vwConfig, provider, manager.Options{Scheme: scheme})
if err != nil {
    return fmt.Errorf("creating multicluster manager: %w", err)
}

// Reconcilers are cluster-aware: each request carries the logical cluster.
builder.ControllerManagedBy(mgr).
    For(&codev1alpha1.Repository{}).
    Complete(reconciler)
```

Inside a reconciler, obtain the engaged cluster from the manager and handle an unavailable cluster before using its configuration. This fragment assumes `mgr`, `ctx`, and the request's logical `clusterName` are already available; `mcmulticluster` is the multicluster-runtime package alias:

```go
cl, err := mgr.GetCluster(ctx, mcmulticluster.ClusterName(clusterName))
if err != nil {
    return fmt.Errorf("getting engaged cluster: %w", err)
}
tenantConfig := cl.GetConfig()
// Use tenantConfig for this cluster's controller work.
```

Keep that configuration scoped to the current reconciliation; do not reuse it for another tenant.

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

Build a per-request client from the caller's token scoped to `X-Faros-Cluster`, so kcp's own RBAC applies to everything you do on their behalf. Code, Databricks, and Infrastructure demonstrate this pattern in their `tenant/client.go` files. Other providers have different request-client wiring; check their authentication path explicitly.

Using the provider service identity in a request handler can give a caller access they do not hold personally. A caller-scoped client lets kcp enforce that caller’s resource permissions; the handler must still authorize any operations performed outside that client.

## Address by cluster ID, never by path

The number-one footgun: kcp **shards resolve only `/clusters/<logical-cluster-id>`**. Workspace *paths* (`root:faros:tenants:...`) resolve only at the front proxy. Consequences:

- The minted provider kubeconfig points at `/clusters/<your-workspace-id>` — keep that pattern for anything you construct.
- When addressing a tenant's workspace (e.g. a per-cluster GraphQL endpoint), use the ID from `X-Faros-Cluster`, never the `X-Faros-Tenant` path.
- You cannot "re-root" your provider SA kubeconfig at another workspace's `/clusters/<id>` — the token is pinned to your workspace and kcp rejects it. Cross-workspace = virtual workspace, full stop.

## Dynamic APIs

The resource list on your APIExport is merged, not replaced, so a provider can grow its API at runtime. Do not confuse that with the infrastructure provider's flattened tenant API: it permanently exports `templates.infrastructure.faros.sh` (`Template`) and `instances.infrastructure.faros.sh` (`Instance`). Each `Instance` names its product in `spec.template`; applying another catalog `Template` does not add a new tenant-facing kind, change the APIExport resource list, or change binding claims. See the [flattened Instance design](https://github.com/faroshq/faros/blob/main/docs/infrastructure-flattened-instances.md) before designing an infrastructure integration.
