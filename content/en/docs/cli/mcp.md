---
title: MCP for AI Agents
description: Expose all your clusters as a single Model Context Protocol server.
weight: 4
---

kedge exposes every Kubernetes-type edge in your workspace as a single [Model Context Protocol](https://modelcontextprotocol.io) (MCP) server. AI coding assistants — Claude Code, Claude Desktop, Cursor, anything that speaks MCP — can list pods, describe deployments, apply manifests, and more, across all your clusters at once, with no per-cluster configuration.

## Get the URL

```bash
kubectl kedge mcp url --name default
```

Output:

```
https://console.faros.sh/services/mcp/root:kedge:user-default/apis/kedge.faros.sh/v1alpha1/kubernetesmcps/default/mcp

To add this MCP server to Claude Code:
  claude mcp add --transport http kedge \
    "https://console.faros.sh/services/mcp/.../mcp" \
    -H "Authorization: Bearer <your-token>"

To add to Claude Desktop (claude_desktop_config.json):
  {
    "mcpServers": {
      "kedge": {
        "url": "https://console.faros.sh/services/mcp/.../mcp",
        "headers": { "Authorization": "Bearer <your-token>" }
      }
    }
  }
```

Copy the URL and the bearer token; that's everything the MCP client needs.

## Adding to Claude Code

Paste the printed `claude mcp add` line straight into your shell. From then on, Claude Code can call MCP tools that read and write Kubernetes resources across every connected cluster.

```bash
claude mcp list                            # confirm it's registered
claude mcp tools kedge | head             # see what's exposed
```

## Adding to Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or the equivalent path on your platform, add the snippet from the CLI output under `mcpServers`, and restart Claude Desktop.

## Per-edge MCP

The default `--name default` MCP aggregates *all* connected `kubernetes`-type edges. To get an MCP scoped to a single edge:

```bash
kubectl kedge mcp url --edge home-lab
```

The hub creates a separate per-edge MCP virtual workspace and prints its URL.

## Filtering which edges are aggregated

The default MCP is backed by a `Kubernetes` custom resource in your workspace. It has a label selector:

```yaml
apiVersion: kedge.faros.sh/v1alpha1
kind: Kubernetes
metadata:
  name: default
spec:
  edgeSelector:
    matchLabels:
      env: prod
```

Empty selector = all connected kubernetes edges. Add labels to your edges (`kubectl kedge edge create ... --label env=prod`) and the MCP only sees the matching subset.

Edit the object the usual way:

```bash
kubectl --context kedge edit kubernetes.kedge.faros.sh/default
```

## How the hub serves MCP

When an MCP client connects:

1. The hub's MCP virtual-workspace handler validates the bearer token.
2. It lists all `Edge` objects in the workspace, filters to `type: kubernetes` + `connected: true` + the label selector on the `Kubernetes` object.
3. It builds a multi-edge provider that dials each matching edge over its revdial tunnel.
4. It hands the connection to [`kubernetes-mcp-server`](https://github.com/kagent-dev/kmcp), which implements the MCP protocol and translates tool calls into Kubernetes API calls against each edge.

You don't have to deploy anything on the edges — the existing tunnel is reused.

## Authentication

The bearer token printed by `mcp url` is your hub token. Anything it can do via `kubectl --context kedge`, the MCP can do. If you want to restrict an AI agent, create a separate token-bound user (static-token only) or a separate OIDC identity with narrower RBAC, log in as that user, then call `mcp url` to get a scoped token.
