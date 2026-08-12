---
title: Building Providers
description: Write a driver for the platform OS — APIs, controllers, UI, proxies, and MCP.
weight: 50
---

A **provider** is a driver for the platform: how you teach faros a new capability without forking the hub. Everything above the [four kernel primitives](/docs/concepts/) ships as one — edge management, application templates, git repositories, AI agents, fleet-wide query — all built on the same contract a third-party provider uses. There is no privileged internal path.

A provider is a **standalone service**: its own binary, its own pod, its own Helm chart, its own release cycle. It plugs into the hub through five optional surfaces:

1. **An API** — custom resources published as a kcp `APIExport` that tenants bind into their workspaces. For most providers this is the heart of the integration.
2. **Controllers** — reconcilers that watch the provider's resources *across every tenant workspace at once* through the export's [virtual workspace](/docs/providers/virtual-workspace/).
3. **A backend** — any HTTP surface (REST, GraphQL, WebSocket, MCP) the hub reverse-proxies at `/services/providers/<name>/*` with verified identity headers.
4. **A portal UI** — a Web Component micro-frontend the portal mounts at `/providers/<name>` — no iframes, shared theme.
5. **MCP tools** — a `/mcp` endpoint on the backend; the hub federates every provider's tools into one aggregate MCP server for AI agents.

A minimal provider (the in-repo [`quickstart`](https://github.com/faroshq/faros/tree/main/providers/quickstart)) is a single Go binary with `init` and `serve` subcommands, an embedded frontend, and two small YAML files.

## The moving parts

```
                        kcp workspace tree
   root:faros:providers:<name>      ← your workspace: APIExport, schemas, SA
   root:faros:system:providers      ← Provider + CatalogEntry objects, kubeconfig Secret
   root:faros:tenants:<org>:<ws>    ← tenants; APIBinding pulls your API in

   ┌──────────┐   /ui/providers/<name>/*        ┌────────────────┐
   │  portal  │ ──────────────────────────────► │                │
   └──────────┘                                 │   faros hub    │
   ┌──────────┐   /services/providers/<name>/*  │  (UI + backend │      ┌───────────────┐
   │ CLI / AI │ ──────────────────────────────► │    proxies)    │ ───► │ your provider │
   └──────────┘                                 └────────────────┘      │      pod      │
                                                                        └──────┬────────┘
                                     APIExport virtual workspace               │
                                     (see tenant resources cross-workspace) ◄──┘
```

Two small YAML objects wire a provider in:

- **`Provider`** (`admin.faros.sh`) — applied by the platform admin. The hub provisions your workspace at `root:faros:providers:<name>`, a service account with admin rights *inside that workspace only*, and a kubeconfig Secret your pod mounts.
- **`CatalogEntry`** (`providers.faros.sh`) — self-registered by your `init` step. Declares display metadata, UI/backend URLs, and which APIExport tenants bind. It drives the portal catalog, the Enable dialog, and the hub's proxies.

Your binary's **`init`** subcommand (running as an initContainer with the minted kubeconfig) creates the API surface itself: `APIResourceSchema`s, the `APIExport`, an `APIExportEndpointSlice`, and the bind grant. The hub provisions infrastructure; you own your API.

## When to write a provider

You want a provider when you have a vertical slice that should be:

- **Discoverable** — a card in the catalog, separately enable-able per workspace.
- **Tenant-scoped** — resources each tenant manages in their own workspace, reconciled by your controllers.
- **Independently shipped** — your repo, your image, your release cadence; the hub doesn't rebuild when you do.

If you just need a button on an existing page, patch the portal. Providers exist to draw boundaries that would otherwise grow into a monolith.

## The guides

Read them roughly in order — each builds on the previous:

- **[Anatomy & lifecycle](/docs/providers/anatomy/)** — the `Provider` / `CatalogEntry` objects, the `init` bootstrap, heartbeats, and the tenant Enable flow.
- **[Defining the API](/docs/providers/api/)** — APIResourceSchemas, the APIExport, permission claims, versioning.
- **[Virtual workspaces](/docs/providers/virtual-workspace/)** — how your controllers see all tenant workspaces at once, and the two access patterns (service identity vs. caller identity).
- **[Connectivity & proxies](/docs/providers/connectivity/)** — the UI and backend proxies, identity headers, the revdial reverse tunnel, and data-plane subresources.
- **[RBAC & security](/docs/providers/rbac/)** — what your SA can touch, bind grants, claim acceptance, and the isolation rules every provider must follow.
- **[Building the UI](/docs/providers/ui/)** — the custom-element contract, `farosContext`, navigation, and asset serving.
- **[MCP integration](/docs/providers/mcp/)** — exposing tools to AI agents through the hub's aggregate endpoint.
- **[Packaging & deployment](/docs/providers/deploy/)** — the Helm chart shape, environment variables, Docker image, and publishing.
- **[Provider catalog](/docs/providers/catalog/)** — reference for the providers that ship with faros today.
