---
title: Use the CLI
description: Install the Faros CLI and connect to Faros SaaS.
weight: 5
---

The CLI is optional for console-based application and AI-agent tutorials. Use it for terminal workflows and connecting edges. For Faros SaaS, the ordinary path is to install the CLI, then run `faros login` without a hub URL; the plugin form is equivalent as `kubectl faros login`, and both default to `https://console.faros.sh`.

## Prerequisites

Start with the Faros SaaS hub and a compatible CLI version. If your organization uses a [self-hosted hub](/docs/self-hosting/), ask its administrator for the hub URL and supported CLI version.

Install [kubectl](https://kubernetes.io/docs/tasks/tools/) to use the plugin form and Kubernetes examples below.

## Install the CLI

Use one of the installation methods published by the project:

- **Binary:** download the executable for your operating system from the [Faros releases page](https://github.com/faroshq/faros/releases) and put it on your `PATH`. Choose the release selected by your hub administrator for self-hosted installations.
- **Krew:** install the `faros` kubectl plugin with `kubectl krew index add faros https://github.com/faroshq/krew-index.git` followed by `kubectl krew install faros/faros`.
- **Source:** use the repository build below. The current module has local SDK replacements, so use a checkout rather than `go install ...@latest`.

The plugin form uses an executable named `kubectl-faros`, so `kubectl faros` and `faros` are equivalent command surfaces. A release binary can be renamed to `kubectl-faros` if you want the plugin form; use the standalone `faros` command when keeping that filename.

## Build from source

Use the Go version required by the repository’s `go.mod`. Replace `RELEASE_TAG` with the release selected for your hub. Build from the repository so the local provider SDK replacement can resolve:

```bash
git clone https://github.com/faroshq/faros.git
cd faros
git checkout RELEASE_TAG
go build -o ./bin/faros ./cmd/faros
```

Add the checkout's `bin` directory to your `PATH`.

## Verify and log in

```bash
faros --help
faros login
```

The first command should list available commands. The second starts the SaaS login flow and updates your kubeconfig. For a self-hosted hub, pass its URL explicitly: `faros login --hub-url https://hub.example.com`. If you installed the plugin form, use the equivalent `kubectl faros` prefix. See [authentication](/docs/reference/cli/login/) for static-token hubs and credential storage.

If the command is not found, check your executable name and `PATH`. If login fails, verify the hub URL and authentication method with your administrator.

## Next step

[Select your organization and workspace](/docs/reference/cli/workspaces/), then [connect a cluster or server](/docs/use/edges/quickstart/).
