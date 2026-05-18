---
title: Edges
description: Register, list, inspect, and remove edges.
weight: 2
---

An **edge** is anything connected to the hub through a reverse tunnel. There are two types:

| Type | Use case |
|:-----|:---------|
| `kubernetes` | A Kubernetes cluster. Reachable via `kubectl` through the hub. |
| `server` | A plain Linux host (VM, bare metal, Raspberry Pi). Reachable via `kubectl kedge ssh`. |

## create

Register a new edge:

```bash
kubectl kedge edge create <name> --type kubernetes
kubectl kedge edge create <name> --type server
```

This creates an `Edge` object in your workspace and issues a one-time join token. The token expires once consumed — you'll need a new one if you re-deploy the agent.

**Flags:**

| Flag | Description |
|:-----|:------------|
| `--type` | `kubernetes` or `server`. Required. |
| `--label key=value` | Add a label. Repeatable. Used for placement selectors. |
| `--description "..."` | Free-text description shown in `edge list`. |

Examples:

```bash
kubectl kedge edge create home-lab \
  --type kubernetes \
  --label env=home --label region=eu

kubectl kedge edge create my-vps \
  --type server \
  --description "Hetzner CX22 in Helsinki"
```

## list

```bash
kubectl kedge edge list
```

Shows every edge in your workspace with its type, ready state, and connection status. Use `-o yaml` or `-o json` for machine-readable output.

## get

```bash
kubectl kedge edge get <name>
```

Shows the full status: connection state, agent version, last heartbeat, labels, and any condition messages.

## join-command

```bash
kubectl kedge edge join-command <name>
```

Prints the command(s) to install and start the agent on the target. The exact form depends on `--type`:

- **Kubernetes** — a `helm upgrade --install` command for the `kedge-agent` chart, pre-populated with hub URL, edge name, and one-time token.
- **Server** — a `curl ... | sh` one-liner (or the equivalent `kedge agent join` invocation) that installs a systemd unit.

The join token is single-use and short-lived. If you mis-paste, just re-run `join-command` to get a fresh one.

## kubeconfig

For `kubernetes`-type edges, generate a kubeconfig that proxies kubectl through the hub:

```bash
kubectl kedge kubeconfig edge <name> > kc.yaml
kubectl --kubeconfig kc.yaml get nodes
```

The generated kubeconfig points at the hub's edge-proxy endpoint — the hub forwards each request through the agent's reverse tunnel. There are no certs on disk for the edge; auth happens via your hub bearer token.

To stream into a temporary kubeconfig (handy in scripts):

```bash
kubectl --kubeconfig <(kubectl kedge kubeconfig edge home-lab) get pods -A
```

## delete

```bash
kubectl kedge edge delete <name>
```

Removes the edge from the hub. The agent on the target will eventually fail its heartbeat and exit; if you want a graceful shutdown, stop the agent first (e.g. `helm uninstall kedge-agent` on the cluster, or `systemctl stop kedge-agent` on a server).

> `delete` is irreversible. There's no recycle bin — recreate the edge to reconnect.
