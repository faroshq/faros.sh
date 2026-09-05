---
title: CLI Reference
description: Every faros command — authentication, organizations, edges, agents, SSH, MCP.
weight: 20
---

The `faros` CLI is a kubectl plugin (when installed via krew, it's `kubectl faros`; the standalone binary just drops the `kubectl` prefix). All commands below use the `kubectl faros` form.

## Global flags

| Flag | Description |
|:-----|:------------|
| `--kubeconfig <path>` | Path to the kubeconfig to read and write. Defaults to `$KUBECONFIG` or `~/.kube/config`. |

That's the only global flag. Everything else (`--hub-url`, `--token`, `--insecure-skip-tls-verify`, ...) lives on the individual commands that need it. Login always writes to a kubeconfig context named `faros`.

## Command summary

| Command | What it does |
|:--------|:-------------|
| [`login`](/docs/reference/cli/login/) | Authenticate with the hub (OIDC browser flow or static token). |
| [`use`](/docs/reference/cli/workspaces/) | Switch the active organization and workspace (interactive picker or flags). |
| [`connect <edge>`](/docs/reference/cli/workspaces/#connect) | Point your kubeconfig at an edge cluster; `connect :` returns to the hub root. |
| [`edge create <name>`](/docs/reference/cli/edges/) | Register a new edge and print the agent join guide. |
| [`edge list`](/docs/reference/cli/edges/#list) | List all edges with type, phase, and connection status (`list`/`ls` also work top-level). |
| [`edge get <name>`](/docs/reference/cli/edges/#get) | Show details for a specific edge. |
| [`edge join-command <name>`](/docs/reference/cli/edges/#join-command) | Re-print the agent install guide with the join token. |
| [`edge upgrade <name>`](/docs/reference/cli/edges/#upgrade) | Show upgrade instructions when the agent version is behind the CLI. |
| [`edge delete <name>`](/docs/reference/cli/edges/#delete) | Remove an edge. |
| [`kubeconfig edge <name>`](/docs/reference/cli/edges/#kubeconfig) | Generate a kubeconfig that proxies kubectl through the hub. |
| [`agent ...`](/docs/reference/cli/agent/) | Run, install, and upgrade the edge agent (`run`, `join`, `install`, `uninstall`, `upgrade`). |
| [`install`](/docs/reference/cli/agent/#faros-install) | One-shot agent install (systemd unit or Kubernetes manifests) from a join token. |
| [`ssh <name>`](/docs/reference/cli/ssh/) | Open an SSH session (or run a single command) on a server-type edge. |
| [`mcp url`](/docs/reference/cli/mcp/) | Print an MCP endpoint for AI agents (`--mcpserver-name` aggregate or `--edge` per-edge). |
| `apply -f <file>` | Apply a faros resource from a YAML file. |
| `get <resource>` | List `edges`, `workloads`, or `placements` in the current workspace. |
| `version` | Print CLI version, commit, build date, and platform. |
| `dev init` / `dev update` / `dev delete` | Create, upgrade, or tear down a local kind-based dev hub (`init` has alias `create`). |
| `init` | Run an in-process faros hub (server bootstrap — for development, not the CLI workflow). |

Pick a command from the sidebar for the full reference.
