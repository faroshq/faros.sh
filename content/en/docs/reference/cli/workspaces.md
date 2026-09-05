---
title: Organizations & Workspaces
description: kubectl faros use and connect — switch orgs, workspaces, and edge clusters.
weight: 2
---

Everything you do on a hub happens inside a **workspace**, which belongs to an **organization**. On first login the hub creates a personal organization with a default workspace for you, so the quickstart works without ever thinking about tenancy — but as soon as you're in more than one org or team workspace, these two commands are how you move around. See [Tenancy](/docs/administration/workspaces/) for the underlying model.

## use

`faros use` (aliases: `switch`, `ctx`) selects the active organization and workspace, rewriting the `faros` context's server URL so every subsequent command targets that workspace.

```bash
kubectl faros use                                  # interactive picker (org, then workspace)
kubectl faros use --org acme                       # pick org, then choose workspace interactively
kubectl faros use --org acme --workspace platform  # fully scripted, no TTY needed
```

**Flags:**

| Flag | Description |
|:-----|:------------|
| `--org <name-or-uuid>` | Organization, by display name or UUID. |
| `--workspace <name-or-uuid>` | Workspace, by display name or UUID. |

With no flags you get an interactive picker; it requires a TTY. Providing both flags skips all prompts, which is what you want in scripts and CI.

## connect

`faros connect` (aliases: `ws`, `workspace`) navigates *within* the current workspace — most commonly, into a Kubernetes edge cluster and back:

```bash
kubectl faros connect home-lab     # point kubectl at the home-lab edge cluster
kubectl get nodes                  # talks to home-lab through the hub tunnel
kubectl faros connect :            # return to the hub root (disconnect)
```

`connect` rewrites the server URL of the current context, so everything that reads your kubeconfig (`kubectl`, `helm`, `k9s`, ...) follows.

Under the hood this is kcp's workspace navigation, so all the standard targets work:

| Argument | Effect |
|:---------|:-------|
| `<edge-name>` | Enter the edge's mount under the current workspace. |
| `:` | Jump back to the hub root (disconnect). |
| `..` | Go up one workspace. |
| `.` | Print the current workspace. |
| `-` | Go back to the previous workspace. |
| `~` | Go to your home workspace. |
| `root:...` | Jump to an absolute workspace path. |
| `-i` | Interactive tree browser. |

## use vs connect

- **`use`** switches your *tenancy* context: which org and workspace you operate in. It talks to the hub's REST API and understands display names.
- **`connect`** moves *within* the workspace tree: into an edge cluster, back to root, up and down. It's kubeconfig surgery over kcp workspace paths.

A typical session:

```bash
kubectl faros use --org acme --workspace prod
kubectl faros edge list
kubectl faros connect edge-paris
kubectl get pods -A
kubectl faros connect :
```
