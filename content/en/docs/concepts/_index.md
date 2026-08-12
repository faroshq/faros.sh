---
title: Concepts
description: The OS model behind faros — workspaces, providers, MCP, and edges, and how a request flows through them.
weight: 5
---

faros borrows its shape from operating systems, because the problem is the same one: many actors, shared resources, and a hard need for isolation that doesn't depend on everyone behaving.

Four primitives carry the whole system.

## 1. Workspaces — the isolation boundary

A **workspace** is a [kcp](https://kcp.io) logical cluster: a full Kubernetes-style API surface with its own resources, RBAC, and quota, addressable at a path.

```
root:faros:tenants:<org>:<workspace>       ← where your resources live
root:faros:providers:<name>                ← a provider's own workspace
root:faros:system:providers                ← platform registry objects
```

Two things follow from this that don't follow from a "namespace + filter" design:

- **Isolation is structural.** A credential is issued *for a workspace*. Anything outside it isn't denied so much as unaddressable — there is no path from that token to those objects.
- **The API surface differs per workspace.** Which kinds exist in your workspace depends on which providers you've enabled. Enabling a provider binds its API in (via a kcp `APIBinding`); disabling it takes the kinds away.

Every user gets a personal organization and a default workspace on first login. Teams get org workspaces with members and roles — see [Security & tenancy](/docs/security/).

## 2. Providers — the drivers

Everything above the kernel is a **provider**: a standalone service with its own binary, pod, chart, and release cycle. The hub knows nothing about what a provider does; it only knows how to host one.

A provider plugs in through five optional sockets:

| Socket | What it gives the tenant |
|:-------|:-------------------------|
| **API** | Custom resources published as a kcp `APIExport` and bound into tenant workspaces |
| **Controllers** | Reconcilers that watch those resources across *every* tenant at once, through the export's [virtual workspace](/docs/providers/virtual-workspace/) |
| **Backend** | Any HTTP surface (REST, GraphQL, WebSocket, MCP) reverse-proxied at `/services/providers/<name>/*` with hub-verified identity headers |
| **Portal UI** | A Web Component micro-frontend mounted at `/providers/<name>` — no iframes, shared theme |
| **MCP tools** | Tools federated into the tenant's single aggregate MCP endpoint |

The ones that ship in the box — edges, application templates, code, agents, kuery and friends — use exactly the same contract a third-party provider uses. There is no privileged internal path. See the [catalog](/docs/providers/catalog/) for what's included, or [Building providers](/docs/providers/) to write one.

## 3. MCP — the syscall interface

Each tenant gets **one MCP endpoint** that federates the tools of every enabled provider, namespaced `<provider>__<tool>` — `infrastructure__provision`, `code__create_repository`, `kuery__kuery_query`.

```bash
kubectl faros mcp url --mcpserver-name default
```

The important property isn't federation, it's **derivation**: a tool call is executed as the caller, against the caller's workspace, under the same RBAC that governs the API. There is no gateway service account with broader rights, and no second policy surface where a tool's permissions could drift from the resource's.

That's what makes handing an agent an MCP URL a bounded act rather than a leap of faith. Narrow it further by minting a [service account](/docs/security/tenancy/#service-accounts) with fewer rights and handing over *its* token.

## 4. Edges — the I/O layer

An **edge** is something real you want to reach: a Kubernetes cluster, a VM, a bare-metal host, a Raspberry Pi in a cupboard. The agent you run there dials **out** to the hub and holds a reverse tunnel open ([revdial](/docs/providers/connectivity/#the-revdial-reverse-tunnel)).

Consequences:

- The hub is the only component that needs a public address.
- `kubectl` and `ssh` ride the existing outbound tunnel — no VPN, no inbound firewall rule, no port forwarding.
- Apps sitting beside an agent (Home Assistant, Grafana, a Jellyfin box) can be discovered, proxied, and exposed as tools, with credentials injected provider-side so tokens never land on the agent host.

## How a request flows

Provisioning a database from an AI agent, end to end:

```
  claude ──► MCP endpoint ──► hub ──────────────► infrastructure provider
             (workspace-      authenticates,      creates a Postgres CR in
              scoped token)   resolves workspace,  YOUR workspace
                              strips/injects
                              X-Faros-* headers
                                     │
                                     ▼
                        provider controller (watching every
                        tenant via the virtual workspace)
                                     │
                                     ▼
                        runtime cluster reconciles the instance,
                        publishes an HTTPRoute, wires OIDC
                                     │
                                     ▼
                        status lands back on the CR you can
                        kubectl get, diff, and delete
```

Nothing in that path is special-cased for AI. The agent used the same API, the same RBAC, and the same audit trail a human or a CI job would have used — which is the entire point.

## What faros is not

- **Not a portal or catalog.** Portals describe infrastructure that something else runs. faros runs it; the UI is a view over live resources.
- **Not an agent framework.** You can host agents on it (the [agents provider](/docs/providers/catalog/#agents) does exactly that), but faros is the platform they operate, not the loop they think in.
- **Not a Kubernetes distribution.** It's a control plane above whatever clusters you already have, wherever they are.

## Where to next

- **[Quickstart](/docs/getting-started/quickstart/)** — boot it and attach an edge.
- **[Security & tenancy](/docs/security/)** — orgs, workspaces, service accounts, OIDC.
- **[Provider catalog](/docs/providers/catalog/)** — what ships in the box.
- **[Building providers](/docs/providers/)** — write your own driver.
