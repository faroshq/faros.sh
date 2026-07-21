---
title: Provider Catalog
description: Reference for the providers that ship with kedge — APIs, tools, and UI surfaces.
weight: 9
---

Eight providers ship in the kedge repo today. Each follows the [standard packaging](/docs/providers/anatomy/): a CatalogEntry, an `init`+`serve` binary, an embedded portal micro-frontend, and a hub heartbeat. This page is the tenant/operator-facing reference; per-provider architecture docs live in the kedge repo under `docs/`.

| Provider | API group | What it gives you |
|:---------|:----------|:------------------|
| [edges](#edges) | `edges.kedge.faros.sh` | Edge connectivity: clusters, servers, services, workloads |
| [infrastructure](#infrastructure) | `infrastructure.kedge.faros.sh` | Application templates and provisioned instances |
| [code](#code) | `code.kedge.faros.sh` | Git repositories, deploy keys, packages |
| [agents](#agents) | `agents.kedge.faros.sh` | Hosted, persistent AI agents |
| [app-studio](#app-studio) | `ai.kedge.faros.sh` | AI project workspaces with live dev environments |
| [kuery](#kuery) | — (query surface) | Fleet-wide object search and impact analysis |
| [databricks](#databricks) | `databricks.kedge.faros.sh` | Databricks warehouse tables as workspace resources |
| [quickstart](#quickstart) | `quickstart.providers.kedge.faros.sh` | Reference/scaffold provider |

## edges

The single privileged provider that owns the whole edge connectivity plane. It terminates agent [revdial tunnels](/docs/providers/connectivity/#the-revdial-reverse-tunnel) in-process (hence single-replica), runs per-edge token/RBAC/lifecycle controllers, and proxies kubectl, SSH, and MCP through the hub.

**Resources:**

- **`KubernetesCluster`** — a managed cluster reachable through the tunnel; status carries the connection state and proxy URL your kubeconfig uses.
- **`LinuxServer`** — a bare-metal/VM Linux host; SSH proxy plus service discovery.
- **`Service`** (short name `edgesvc`) — an HTTP app running next to an agent (Home Assistant, Grafana, Sonarr/Radarr, Jellyfin, Plex, Portainer, Prometheus, AdGuard, Proxmox, Pi-hole, qBittorrent, or `generic`). The provider discovers services, validates credentials, proxies them, and turns them into MCP tools.
- **`Workload`** / **`Placement`** — deploy workloads (simple spec, pod template, or Helm chart rendered hub-side) across kube edges by label selector; the scheduler fans a Workload into per-edge Placements the agent applies.

**MCP:** Kubernetes tools for every connected cluster, SSH tools for servers, plus per-service tools — e.g. `ha_states` / `ha_call_service` for Home Assistant ("open the gates" from an AI agent, end to end). Service credentials are injected provider-side; tokens never reach the agent host.

**Portal:** fleet list with a join wizard, per-edge detail, Services management, and a Workloads marketplace — a card grid that one-click deploys a catalog app via Helm and auto-wires its Service.

## infrastructure

Brokers curated **application templates** into tenant workspaces. Platform admins register `Template`s (backed today by a [kro](https://kro.run) runtime cluster); tenants provision instances — databases, caches, workers, full 3-tier apps — as first-class resources.

**Resources:** `Template` (the catalog entry, including a development block for sandboxes and a data-plane contract for logs/sync/preview) plus **dynamic per-template instance kinds** (`Application`, `Redis`, `Postgres`, ...) added to the APIExport as templates are registered. Bundled templates: application, simple-webapp, cron-job, database, redis-cache, worker.

**MCP:** `list_templates`, `describe_template`, `provision`, `list_instances`, `get_instance`, `delete_instance`.

**Portal:** Templates catalog + Instances view with per-instance dashboard tiles.

Notable: the `application` template exposes apps via **Gateway API** HTTPRoutes (default: Cloudflare Tunnel gateway) with per-app OIDC, and its development mode is what backs App Studio sandboxes.

## code

Source-code management across git hosting backends (GitHub first). "Give me a repo, give me a deploy key" — driven by CRDs, MCP, and a portal UI.

**Resources:** `Connection` (a PAT/OAuth credential to a git host), `Repository`, `RepositoryCommit` (write a provider-stored file bundle as a commit), `RepositoryCheckout` (read a repo tree into a bundle), `DeployKey`, `Collaborator`, `Package` (observed published artifacts), `RepositoryBuildStatus`.

**MCP:** `list_connections`, `list_repositories`, `create_connection`, `create_repository`, `delete_repository`, `commit_files`, `checkout_repository`, `add_deploy_key`, `add_collaborator`, `remove_collaborator`, `build_status`, `rebuild`.

**Portal:** Connections, Repositories, Packages. Generated file contents live in commit bundles, never in CRs.

## agents

A multi-tenant hosting platform for **long-running personal AI agents**. A tenant chats with their agent from the portal or their own channels (Telegram/Slack); agents run schedules and heartbeats on their own clock, notify proactively, keep durable memory, delegate to sub-agents, and use tools.

**Resources:** `Agent` (system prompt, model profiles, autonomy level, tool policy, budgets), `Connection` (GitHub / MCP / web search / HTTP / Telegram / Slack / SMTP credentials, secret- or OAuth-backed), `Schedule` (cron/wakeup/heartbeat), `Trigger` (webhook/channel/email/event), `Run` (one execution, with token/USD usage), `Toolset` (reusable tool bundles).

**Tools agents can use:** delegation, durable memory, self-scheduling, notify/ask (approvals inbox), guarded web fetch/search, any MCP connection (`<connection>__<tool>`), GitHub, and the whole edges tool family — meaning a hosted agent can operate your clusters and Home Assistant out of the box.

**Portal:** agent-first — chat with live tool-call streaming and approval prompts, plus Schedules, Triggers, Channels, Connections, Models, and a cross-agent Inbox.

Requires Postgres. Background runs default to read-only + notify (prompt-injection mitigation); budgets are enforced before every run.

## app-studio

Persistent **AI project workspaces**: named Projects with durable memory (goals/requirements/constraints), a streaming chat assistant using the tenant's own LLM credentials, and — via its `code` and `infrastructure` dependencies — a bound repository and a live development environment with preview, logs, and file sync.

**Resources:** `Project` (display/memory/sharing, repository binding, template binding, environment bindings). Chat messages live in the provider's encrypted Postgres store, not as CRs.

**MCP:** none served — App Studio is an MCP *client*: its assistant calls the hub aggregate endpoint on your behalf, so it picks up every other provider's tools.

**Portal:** project list, chat surface, memory editor, development workbench with live preview.

## kuery

A single query surface over every object across your connected edge clusters — for humans and especially AI agents. One SQL-backed structured query replaces N kubectl round-trips through N tunnels.

**Resources:** none tenant-authored. The provider sets `edgeProxyAccess` and claims read access on edges; its engagement controller watches your Edge objects and keeps background informer syncs running per cluster into its store (SQLite or Postgres).

**MCP:** `kuery_query` (fleet-wide object query) and `kuery_impact` (relationship/impact traversal — "who consumes this Secret; is it safe to rotate?").

**Portal:** a query playground and a relationship-graph view.

## databricks

Exposes imported Databricks SQL Warehouse tables to kedge apps (notably App Studio) as workspace resources plus a query surface.

**Resources:** `Connection` (workspace host + credential), `Warehouse`, `Table` (imported table with column metadata).

**MCP:** `list_tables`, `describe_table`.

**Portal:** Connections, Warehouses, Tables.

## quickstart

The minimal reference provider — the scaffold the others derive from, and the recommended starting point for your own. It registers a CatalogEntry, serves a two-panel demo UI (portal handshake + backend proxy echo), heartbeats, and exports a demo APIExport with a sample `configmaps` claim. No controllers, no MCP, no storage. Copy it, rename it, and start from the [Anatomy guide](/docs/providers/anatomy/).
