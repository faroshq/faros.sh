---
title: Quickstart
description: From zero to a connected edge in four commands.
weight: 2
---

This guide takes you from a freshly installed CLI to a working Kubernetes edge that you can drive with `kubectl`. We'll use the hosted hub at `console.faros.sh` so there's nothing to deploy first.

> If you'd rather run your own hub, the same flow works — point `--hub-url` at your hub instead. See [Deploy with Helm](/docs/deploy/helm/).

## 1. Log in

```bash
kubectl faros login
```

This opens a browser for OIDC (the hub URL defaults to `https://console.faros.sh`; pass `--hub-url` for your own hub). After the browser flow finishes, your kubeconfig gets a `faros` context pointing at your personal workspace — every new user gets a personal organization and default workspace automatically.

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

This prints an MCP endpoint URL plus ready-to-paste setup commands for Claude Code, Claude Desktop, and Codex. See [MCP for AI agents](/docs/cli/mcp/) for details.

## Next steps

- **[CLI reference](/docs/cli/)** — every command with flags and examples
- **[Organizations & workspaces](/docs/cli/workspaces/)** — team orgs and switching workspaces
- **[Providers](/docs/providers/catalog/)** — enable application templates, git repos, hosted AI agents, and more
- **[Deploy your own hub](/docs/deploy/helm/)** — move off the hosted hub
