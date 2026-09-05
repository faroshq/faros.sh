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
| `--edge <edge-name>` | **Per-edge Kubernetes** — an endpoint scoped to one Kubernetes edge. Server/Linux edges do not have a per-edge MCP URL; use the aggregate endpoint for Linux/SSH tools. |

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

# Per-edge Kubernetes (served by the edges provider)
https://<hub>/services/providers/edges/agent/<cluster>/apis/edges.faros.sh/v1alpha1/kubernetesclusters/<edge>/mcp
```

`<cluster>` is your workspace's logical cluster ID — the CLI derives it from your kubeconfig, so you never construct these by hand.

## Adding to Claude Code

Paste the printed `claude mcp add` line straight into your shell:

```bash
claude mcp list        # confirm it's registered
```

For Claude Desktop, add the printed JSON snippet under `mcpServers` in `claude_desktop_config.json` and restart the app. For Codex, use the printed `codex mcp add` line. If the target is a Linux/server edge, use `--mcpserver-name` and let the aggregate endpoint expose its SSH tools; `--edge` accepts Kubernetes edges only.

## The MCPServer object

The aggregate endpoint is backed by an `MCPServer` custom resource (`faros.sh/v1alpha1`) in your workspace; the hub creates one named `default` in every new workspace. The current resource supports a display name, client instructions, and a `readOnly` hint. It does not currently have an edge label-selector field. Use separate named servers when you need distinct client-facing instructions:

```bash
kubectl get mcpservers.faros.sh
```

```yaml
apiVersion: faros.sh/v1alpha1
kind: MCPServer
metadata:
  name: audit
spec:
  displayName: Read-only audit assistant
  readOnly: true
  instructions: Ask before any operation that could change production state.
```

Apply it in the selected workspace, then obtain its endpoint with `kubectl faros mcp url --mcpserver-name audit`.

Check provisioning and tool discovery without printing the token:

```bash
kubectl get mcpserver audit -o jsonpath='{.status.phase}{"\n"}{.status.conditions[*].message}{"\n"}'
kubectl get mcpserver audit -o jsonpath='{range .status.federatedProviders[*]}{.name}{" reachable="}{.reachable}{"\n"}{end}'
```

Authentication for the aggregate endpoint uses a long-lived service-account token minted per MCPServer (referenced from `status.tokenSecretRef`) rather than your personal OIDC token — so long-running MCP connections don't break when your browser token expires.

## What tools are exposed

The aggregate endpoint federates tools from two sources:

- **Edges**: Kubernetes tools (via [kubernetes-mcp-server](https://github.com/containers/kubernetes-mcp-server)) for every connected Kubernetes edge, Linux/SSH tools for server edges, and per-service tools for any [`Service`](/docs/use/edges/) the edges provider has discovered (e.g. `ha_call_service` for Home Assistant).
- **Providers**: every enabled provider that exposes MCP contributes its tools, namespaced as `<provider>__<tool>` — e.g. `code__create_repository`, `kuery__kuery_query`, `infrastructure__provision`.

## Authentication and scoping

The aggregate endpoint uses its MCPServer service-account credential. Do not assume that it is identical to your personal session’s effective permissions. Before handing an endpoint to an assistant, inspect the endpoint's `status.federatedProviders`, verify an allowed operation and a denied operation, and treat `readOnly` as a client/tooling hint. The current hub implementation provisions a broad placeholder role for the MCP service account, so `readOnly: true` is not a server-side authorization boundary; keep sensitive endpoints private and follow the [service accounts](/docs/administration/service-accounts/) guidance.

To rotate an MCP credential, delete the `MCPServer` and recreate it with the same or a new name. Its owned ServiceAccount, token Secret, and binding are garbage-collected with the resource; wait for the replacement to reach `Ready` and update the client with a newly generated `mcp url` command. Revoke the old client configuration immediately after the replacement is working.
