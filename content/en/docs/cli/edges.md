---
title: Edges
description: Register, list, inspect, upgrade, and remove edges.
weight: 3
---

An **edge** is anything connected to the hub through a reverse tunnel. There are two types:

| Type | Kind on the hub | Use case |
|:-----|:----------------|:---------|
| `kubernetes` | `KubernetesCluster` | A Kubernetes cluster. Reachable via `kubectl` through the hub. |
| `server` | `LinuxServer` | A plain Linux host (VM, bare metal, Raspberry Pi). Reachable via `kubectl kedge ssh`. |

Both kinds live in the `edges.kedge.faros.sh` API group in your workspace, and edge commands address them uniformly by name.

## create

Register a new edge:

```bash
kubectl kedge edge create <name>                  # kubernetes is the default type
kubectl kedge edge create <name> --type server
```

This creates the edge object in your current workspace, waits for the hub to issue a join token, and prints a full join guide: how to install the CLI on the target, plus the Helm / `kedge agent join` / `kedge agent run` variants pre-filled with hub URL, edge name, type, and token.

**Flags:**

| Flag | Description |
|:-----|:------------|
| `--type` | `kubernetes` (default) or `server`. |
| `--labels key=value,key2=value2` | Labels for the edge. Used for placement and MCP selectors. |

Example:

```bash
kubectl kedge edge create home-lab --labels env=home,region=eu
```

## list

```bash
kubectl kedge edge list        # also: kubectl kedge list / ls
```

Prints a table with NAME, TYPE, PHASE, CONNECTED, AGENT VERSION, and AGE for every edge in the workspace. For machine-readable output, use kubectl against the underlying resources instead:

```bash
kubectl get kubernetesclusters.edges.kedge.faros.sh -o yaml
kubectl get linuxservers.edges.kedge.faros.sh -o yaml
```

## get

```bash
kubectl kedge edge get <name>
```

Shows name, type, phase, connection state, hostname, workspace URL, creation time, and labels.

## join-command

```bash
kubectl kedge edge join-command <name>
```

Re-prints the same join guide as `edge create` — CLI install instructions plus the Helm chart, `kedge agent join` (persistent install), and `kedge agent run` (foreground) variants with the join token filled in. Use it whenever you need to (re)install the agent. Accepts `--insecure-skip-tls-verify` for dev hubs.

## upgrade

```bash
kubectl kedge edge upgrade <name>
```

Compares the edge's reported agent version against your CLI version. If the agent is behind, prints the upgrade instructions for that edge type (Helm upgrade for Kubernetes edges, binary replacement for servers); otherwise reports it's up to date. To actually drive the upgrade from the CLI, see [`agent upgrade`](/docs/cli/agent/#agent-upgrade).

## kubeconfig

For `kubernetes`-type edges, generate a standalone kubeconfig that proxies kubectl through the hub:

```bash
kubectl kedge kubeconfig edge <name> > kc.yaml
kubectl --kubeconfig kc.yaml get nodes
```

The generated kubeconfig (context `<name>-edge`) points at the hub's edge endpoint and reuses your current hub credentials — the hub forwards each request through the agent's reverse tunnel. There are no edge certificates on disk.

**Flags:** `-o, --output <path>` (default stdout), `--insecure-skip-tls-verify`.

To stream into a temporary kubeconfig (handy in scripts):

```bash
kubectl --kubeconfig <(kubectl kedge kubeconfig edge home-lab) get pods -A
```

The lighter alternative — retargeting your *current* context at the edge — is [`kedge connect`](/docs/cli/workspaces/#connect).

## delete

```bash
kubectl kedge edge delete <name>
```

Removes the edge from the hub. The agent on the target will fail its connection and keep retrying; stop it explicitly for a graceful shutdown (`helm uninstall` on the cluster, or `kubectl kedge agent uninstall` / `systemctl stop` on a server).

> `delete` is irreversible. There's no recycle bin — recreate the edge to reconnect.
