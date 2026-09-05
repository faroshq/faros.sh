---
title: Connect a cluster or server
description: Register an edge and verify access to a Kubernetes cluster or server.
weight: 2
---

This guide takes you from a freshly installed CLI to a working Kubernetes edge that you can drive with `kubectl`. Start with the Faros SaaS hub, with Edges enabled in your workspace and permission to install an agent on the target. Install the [CLI](/docs/get-started/install/) if needed.

If your organization runs a [self-hosted hub](/docs/self-hosting/), use its URL for login instead.

## 1. Log in

```bash
kubectl faros login --hub-url https://YOUR-HUB
```

Replace `https://YOUR-HUB` with your hub URL. This opens a browser for OIDC when configured. After the browser flow finishes, your kubeconfig gets a `faros` context pointing at your personal workspace — every new user gets a personal organization and default workspace automatically.

## 2. Register an edge

An *edge* is anything you want to reach through the hub — a Kubernetes cluster or a plain Linux server. Pick a name and a type:

```bash
# Kubernetes cluster (the default type)
kubectl faros edge create home-lab

# OR — a plain server, accessed via SSH through the hub
kubectl faros edge create my-vps --type server
```

This creates the edge in your workspace, issues a one-time join token, and prints a **join guide**: how to install the CLI on the target plus ready-to-paste install variants — a Helm command for the `faros-agent` chart (Kubernetes), and `faros agent join` / `faros agent run` commands (both types), all pre-filled with the hub URL, edge name, and token.

## 3. Run the agent

Run one of the printed commands on the target. For a Kubernetes cluster the Helm variant is easiest; for a server, `sudo faros agent join ...` installs a systemd service. (Lost the output? `kubectl faros edge join-command home-lab` re-prints it.)

Within a few seconds the agent dials back to the hub. Confirm:

```bash
kubectl faros edge list
```

You should see `CONNECTED true`.

## 4. Use the edge

### Kubernetes edges — kubectl through the hub

Point your current kubeconfig at the edge:

```bash
kubectl faros connect home-lab
kubectl get nodes              # now talking to home-lab via the hub
kubectl faros connect :        # disconnect (back to the hub root)
```

…or generate a separate kubeconfig if you want to keep the current one untouched:

```bash
kubectl faros kubeconfig edge home-lab > kc.yaml
kubectl --kubeconfig kc.yaml get nodes
```

Either way you're talking to the edge cluster as if it were sitting on your desk — through the hub's reverse tunnel.

### Server edges — SSH through the hub

```bash
kubectl faros ssh my-vps              # interactive shell
kubectl faros ssh my-vps -- df -h     # run a single command
```

### Expose your edges to AI agents via MCP

```bash
kubectl faros mcp url --mcpserver-name default
```

This prints an MCP endpoint URL plus ready-to-paste setup commands for Claude Code, Claude Desktop, and Codex. See [MCP for AI agents](/docs/reference/cli/mcp/) for details.

## Next steps

- **[CLI reference](/docs/reference/cli/)** — every command with flags and examples
- **[Organizations & workspaces](/docs/reference/cli/workspaces/)** — team orgs and switching workspaces
- **[Providers](/docs/use/)** — enable application templates, git repos, hosted AI agents, and more
- **[Deploy your own hub](/docs/self-hosting/hub/helm/)** — run the underlying software

## Cleanup

Use the [edge-agent instructions](/docs/reference/cli/agent/) to uninstall the agent on the target, then delete your test edge with `kubectl faros edge delete EDGE-NAME`. Removing the edge removes its Faros access; it does not delete the target machine.
