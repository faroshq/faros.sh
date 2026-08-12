---
title: MCP for AI Agents
description: Expose your clusters and servers as Model Context Protocol servers.
weight: 6
---

faros exposes your edges as [Model Context Protocol](https://modelcontextprotocol.io) (MCP) servers. AI coding assistants — Claude Code, Claude Desktop, Codex, Cursor, anything that speaks MCP — can list pods, describe deployments, run commands, and (with the edges provider's service catalog) even control apps like Home Assistant across all your edges at once.

There are two endpoint shapes:

| Flag | Scope |
|:-----|:------|
| `--mcpserver-name <name>` | **Aggregate** — one endpoint spanning all matching edges: Kubernetes tools, Linux/SSH tools, and a `list_targets` tool to enumerate them. Backed by an `MCPServer` object in your workspace (one named `default` is created for you). |
| `--edge <edge-name>` | **Per-edge** — an endpoint scoped to a single edge. |

Exactly one of the two flags is required.

## Get the URL

```bash
kubectl faros mcp url --mcpserver-name default
```

This prints the endpoint URL plus ready-to-paste setup snippets for Claude Code (`claude mcp add`), Claude Desktop (`claude_desktop_config.json`), and Codex (`codex mcp add`), with your bearer token filled in.

The URL shapes look like this:

```
# Aggregate (MCPServer object)
https://<hub>/services/mcpserver/<cluster>/apis/faros.sh/v1alpha1/mcpservers/<name>/mcp

# Per-edge (served by the edges provider)
https://<hub>/services/providers/edges/agent/<cluster>/apis/edges.faros.sh/v1alpha1/kubernetesclusters/<edge>/mcp
```

`<cluster>` is your workspace's logical cluster ID — the CLI derives it from your kubeconfig, so you never construct these by hand.

## Adding to Claude Code

Paste the printed `claude mcp add` line straight into your shell:

```bash
claude mcp list        # confirm it's registered
```

For Claude Desktop, add the printed JSON snippet under `mcpServers` in `claude_desktop_config.json` and restart the app. For Codex, use the printed `codex mcp add` line.

## The MCPServer object

The aggregate endpoint is backed by an `MCPServer` custom resource (`faros.sh/v1alpha1`) in your workspace; the hub creates one named `default` in every new workspace. It aggregates all connected edges and can filter them with a label selector — label your edges at creation time (`kubectl faros edge create ... --labels env=prod`) and scope the MCP to the matching subset:

```bash
kubectl get mcpservers.faros.sh
kubectl edit mcpserver default
```

Authentication for the aggregate endpoint uses a long-lived service-account token minted per MCPServer (referenced from `status.tokenSecretRef`) rather than your personal OIDC token — so long-running MCP connections don't break when your browser token expires.

## What tools are exposed

The aggregate endpoint federates tools from two sources:

- **Edges**: Kubernetes tools (via [kubernetes-mcp-server](https://github.com/containers/kubernetes-mcp-server)) for every connected Kubernetes edge, Linux/SSH tools for server edges, and per-service tools for any [`Service`](/docs/providers/catalog/#edges) the edges provider has discovered (e.g. `ha_call_service` for Home Assistant).
- **Providers**: every enabled provider that exposes MCP contributes its tools, namespaced as `<provider>__<tool>` — e.g. `code__create_repository`, `kuery__kuery_query`, `infrastructure__provision`.

## Authentication and scoping

The token printed by `mcp url` carries the same access you have in the workspace. To hand an AI agent narrower access, create a workspace [service account](/docs/security/tenancy/#service-accounts), fetch its token, and use that instead.
