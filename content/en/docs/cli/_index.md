---
title: CLI Reference
description: Every kedge command — authentication, edges, kubeconfigs, SSH, MCP.
weight: 20
---

The `kedge` CLI is a kubectl plugin (when installed via krew, it's `kubectl kedge`; the standalone binary just drops the `kubectl` prefix). All commands below use the `kubectl kedge` form.

## Global flags

| Flag | Description |
|:-----|:------------|
| `--hub-url <url>` | URL of the hub. Required for `login`. Saved in kubeconfig after the first login. |
| `--token <token>` | Bearer token (used with `--hub-url` instead of OIDC). |
| `--insecure-skip-tls-verify` | Skip TLS verification — only for self-signed dev hubs. |
| `--context <name>` | Kubeconfig context to operate against. Defaults to `kedge`. |
| `-v` / `--verbose` | Verbose output. |

## Command summary

| Command | What it does |
|:--------|:-------------|
| [`login`](/docs/cli/login/) | Authenticate with the hub (OIDC browser flow or static token). |
| [`whoami`](/docs/cli/login/#whoami) | Show who you're logged in as. |
| [`edge create <name>`](/docs/cli/edges/) | Register a new edge in the hub. |
| [`edge list`](/docs/cli/edges/#list) | List all edges and their connection status. |
| [`edge get <name>`](/docs/cli/edges/#get) | Show details for a specific edge. |
| [`edge join-command <name>`](/docs/cli/edges/#join-command) | Print the agent install command with the join token. |
| [`edge delete <name>`](/docs/cli/edges/#delete) | Remove an edge. |
| [`kubeconfig edge <name>`](/docs/cli/edges/#kubeconfig) | Generate a kubeconfig that proxies kubectl through the hub. |
| [`ssh <name>`](/docs/cli/ssh/) | Open an SSH session (or run a single command) on a server-mode edge. |
| [`mcp url`](/docs/cli/mcp/) | Print the multi-cluster MCP endpoint for AI agents. |
| `agent run` | Start the agent as a foreground process (used inside container images). |
| `agent join` | Install the agent as a persistent service (systemd or k8s Deployment). |
| `dev create` | Create a local dev environment (two kind clusters). |
| `dev delete` | Tear down the dev environment. |

Pick a command from the sidebar for the full reference.
