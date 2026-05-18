---
title: Quickstart
description: From zero to a connected edge in four commands.
weight: 2
---

This guide takes you from a freshly installed CLI to a working Kubernetes edge that you can drive with `kubectl`. We'll use the hosted hub at `console.faros.sh` so there's nothing to deploy first.

> If you'd rather run your own hub, the same flow works — point `--hub-url` at your hub instead. See [Deploy with Helm](/docs/deploy/helm/).

## 1. Log in

```bash
kubectl kedge login --hub-url https://console.faros.sh
```

This opens a browser for OIDC. After the browser flow finishes, your kubeconfig gets a `kedge` context with your bearer token embedded.

Verify it works:

```bash
kubectl kedge whoami
```

## 2. Register an edge

An *edge* is anything you want to reach through the hub — a Kubernetes cluster or a plain Linux server. Pick a name and a type:

```bash
# Kubernetes cluster
kubectl kedge edge create home-lab --type kubernetes

# OR — a plain server, accessed via SSH through the hub
kubectl kedge edge create my-vps --type server
```

This creates an `Edge` object in your workspace on the hub and issues a one-time join token.

## 3. Run the agent

Get the install command for the agent (it includes the join token):

```bash
kubectl kedge edge join-command home-lab
```

The output looks like this:

```
# Kubernetes edges — apply on the target cluster:
helm upgrade --install kedge-agent oci://ghcr.io/faroshq/charts/kedge-agent \
  --namespace kedge-system --create-namespace \
  --set agent.edgeName=home-lab \
  --set agent.hub.url=https://console.faros.sh \
  --set agent.hub.token=<one-time-token>

# Server edges — run on the target host:
curl -L https://console.faros.sh/install/agent.sh | sh -s -- \
  --edge-name my-vps --token <one-time-token>
```

Run the printed command on the target. Within a few seconds the agent dials back to the hub.

Confirm the edge is connected:

```bash
kubectl kedge edge list
```

You should see `Ready=True`.

## 4. Use the edge

### Kubernetes edges — kubectl through the hub

Get a kubeconfig that proxies through the hub:

```bash
kubectl kedge kubeconfig edge home-lab > kc.yaml
kubectl --kubeconfig kc.yaml get nodes
```

You're now talking to the edge cluster as if it were sitting on your desk — through the hub's reverse tunnel.

### Server edges — SSH through the hub

```bash
kubectl kedge ssh my-vps              # interactive shell
kubectl kedge ssh my-vps -- df -h     # run a single command
```

### Expose all clusters to AI agents via MCP

```bash
kubectl kedge mcp url --name default
```

This prints an MCP endpoint URL plus a ready-to-paste setup command for Claude Code / Cursor. See [MCP for AI agents](/docs/cli/mcp/) for details.

## Next steps

- **[CLI reference](/docs/cli/)** — every command with flags and examples
- **[Security](/docs/security/)** — switch from OIDC to a static token (or vice versa)
- **[Deploy your own hub](/docs/deploy/helm/)** — move off the hosted hub
