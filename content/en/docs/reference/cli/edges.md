---
title: Edges
description: Register, list, inspect, upgrade, and remove edges.
weight: 3
---

An **edge** is anything connected to the hub through a reverse tunnel. There are two types:

| Type | Kind on the hub | Use case |
|:-----|:----------------|:---------|
| `kubernetes` | `KubernetesCluster` | A Kubernetes cluster. Reachable via `kubectl` through the hub. |
| `server` | `LinuxServer` | A plain Linux host (VM, bare metal, Raspberry Pi). Reachable via `kubectl faros ssh`. |

Both kinds live in the `edges.faros.sh` API group in your workspace, and edge commands address them uniformly by name.

## create

Register a new edge:

```bash
kubectl faros edge create REPLACE_WITH_NAME                  # kubernetes is the default type
kubectl faros edge create REPLACE_WITH_NAME --type server
```

This creates the edge object in your current workspace, waits for the hub to issue a join token, and prints a full join guide: how to install the CLI on the target, plus the Helm / `faros agent join` / `faros agent run` variants pre-filled with hub URL, edge name, type, and token.

**Flags:**

| Flag | Description |
|:-----|:------------|
| `--type` | `kubernetes` (default) or `server`. |
| `--labels key=value,key2=value2` | Labels for the edge. Used for placement and MCP selectors. |

Example:

```bash
kubectl faros edge create home-lab --labels env=home,region=eu
```

## list

```bash
kubectl faros edge list        # also: kubectl faros list / ls
```

Prints a table with NAME, TYPE, PHASE, CONNECTED, AGENT VERSION, and AGE for every edge in the workspace. For machine-readable output, use kubectl against the underlying resources instead:

```bash
kubectl get kubernetesclusters.edges.faros.sh -o yaml
kubectl get linuxservers.edges.faros.sh -o yaml
```

## get

```bash
kubectl faros edge get REPLACE_WITH_NAME
```

Shows name, type, phase, connection state, hostname, workspace URL, creation time, and labels.

## join-command

```bash
kubectl faros edge join-command REPLACE_WITH_NAME
```

Re-prints the same join guide as `edge create` — CLI install instructions plus the Helm chart, `faros agent join` (persistent install), and `faros agent run` (foreground) variants with the join token filled in. Use it whenever you need to (re)install the agent. Accepts `--insecure-skip-tls-verify` for dev hubs.

## upgrade

```bash
kubectl faros edge upgrade REPLACE_WITH_NAME
```

Compares the edge's reported agent version against your CLI version. If the agent is behind, prints the upgrade instructions for that edge type (Helm upgrade for Kubernetes edges, binary replacement for servers); otherwise reports it's up to date. To actually drive the upgrade from the CLI, see [`agent upgrade`](/docs/reference/cli/agent/#agent-upgrade).

## kubeconfig

For `kubernetes`-type edges, generate a standalone kubeconfig that proxies kubectl through the hub:

```bash
kubectl faros kubeconfig edge REPLACE_WITH_NAME > kc.yaml
kubectl --kubeconfig kc.yaml get nodes
```

The generated kubeconfig (context `<name>-edge`) points at the hub's edge endpoint and reuses your current hub credentials — the hub forwards each request through the agent's reverse tunnel. There are no edge certificates on disk.

**Flags:** `-o, --output <path>` (default stdout), `--insecure-skip-tls-verify`.

To stream into a temporary kubeconfig (handy in scripts):

```bash
kubectl --kubeconfig <(kubectl faros kubeconfig edge home-lab) get pods -A
```

The lighter alternative — retargeting your *current* context at the edge — is [`faros connect`](/docs/reference/cli/workspaces/#connect).

## delete

```bash
kubectl faros edge delete REPLACE_WITH_NAME
```

Removes the edge from the hub. The agent on the target will fail its connection and keep retrying; stop it explicitly for a graceful shutdown (`helm uninstall` on the cluster, or `kubectl faros agent uninstall` / `systemctl stop` on a server).

> `delete` is irreversible. There's no recycle bin — recreate the edge to reconnect.
