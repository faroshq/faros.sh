---
title: RBAC & Security
description: What a provider may touch, bind grants, claim acceptance, and the isolation contracts.
weight: 5
---

faros's provider security model is small enough to hold in your head. Four principals, four boundaries:

| Principal | May touch |
|:----------|:----------|
| Provider SA (`provider` in your workspace) | Everything **inside your own workspace**; tenant data only through the virtual workspace, bounded by bindings + accepted claims |
| Tenant user | Their own workspaces (they're cluster-admin there); your API once bound |
| The hub | Everything — it provisions workspaces and mediates Enable/Disable with its admin client |
| Edge agents | Only their per-edge SA in the provider's plane |

## Your service account

Provisioning (from the `Provider` object) creates a ServiceAccount `provider` in your workspace's `default` namespace with a ClusterRoleBinding to cluster-admin — **scoped to that one logical cluster**. kcp SA tokens are pinned to their cluster (the cluster name is in the token claims), so the credential physically can't be replayed against another workspace.

The contract every shipped provider follows, and yours should too:

- **No admin or root kcp client, ever.** If you find yourself wanting one, the design is wrong.
- Controllers and background work: provider SA through the **virtual workspace** ([pattern A](/docs/extend/virtual-workspace/#the-two-identity-patterns)).
- Request handling: the **caller's token**, scoped to the caller's cluster ([pattern B](/docs/extend/virtual-workspace/#the-two-identity-patterns)) — so kcp RBAC, not your code, is the authorization boundary.

## Bind grants

Tenants need permission to bind your export. `init` creates it: a ClusterRole/ClusterRoleBinding pair `faros:providers:bind:<export-name>` in your workspace granting the `bind` verb on your APIExport to `system:authenticated`. Any authenticated faros user may bind — the platform admin gates *which providers exist* at onboarding time, and each tenant gates *whether to enable* per workspace.

## Permission claims and acceptance

Claims are declared by you, enforced by kcp, and accepted by tenants:

- The Enable dialog lists every claim; on accept, the hub writes them onto the `APIBinding` with the **verbs taken from your declaration** — the API is server-side, so a tenant can't grant you more than you asked for, and you can't get more than they accepted.
- `tenantScoped: true` claims are bounded to the tenant's own workspace and auto-acceptable. Anything else requires the platform-admin override annotation (`faros.sh/accept-untrusted-claims`) — treat that as a red flag in review.
- Claims on `*.faros.sh` groups need the claimed export's `identityHash` (admin-supplied at deploy time); built-in Kubernetes types don't.

## Enable-time RBAC

Enable/Disable runs through the hub's REST API (`POST /api/orgs/{org}/workspaces/{ws}/providers/{name}/enable`) with membership checks, and the hub creates the `APIBinding` using its own admin client. Two extras happen at Enable when declared:

- **Dependencies** — if your CatalogEntry lists `dependencies`, the hub refuses (409) until they're enabled in that workspace.
- **`edgeProxyAccess`** — the hub grants your provider SA (as a cluster-qualified subject) the `proxy` verb on `edges.faros.sh` resources in the tenant workspace. Disable always removes the grant.

## Anti-spoofing

The backend proxy **strips inbound `X-Faros-*` headers** before injecting verified values. Corollaries for your code:

- Trust `X-Faros-User` / `X-Faros-Tenant` / `X-Faros-Cluster` only on traffic that arrived through the hub proxy.
- Don't expose your backend on any other network path (keep the Service ClusterIP; no Ingress of your own for the proxied surface).
- Never log or persist the forwarded bearer token.

## Provider isolation

Rules that keep the ecosystem composable — violating them couples releases and breaks tenancy:

1. **No credentials into another provider's backend, database, or runtime cluster.** Reach other providers only through their published APIs, as the caller.
2. **No hardcoded provider URLs.** Discover endpoints from resource status (like the edges `status.URL`) or go through the hub.
3. **Your data plane is yours alone.** If others need it, publish it as CR subresources so access is authorized by binding + caller identity.

## Deletion is destructive

Deleting a `Provider` object tears down the whole workspace — export, schemas, CatalogEntry, SA — and strands tenant bindings. There is no soft-delete. Removing a provider from a deployment should start with tenants disabling it, then the admin deleting the `Provider` last.
