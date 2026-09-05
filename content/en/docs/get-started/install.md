---
title: Use the CLI
description: Install the Faros CLI and connect it to your hub.
weight: 5
---

The CLI is optional for console-based application and AI-agent tutorials. Use it for terminal workflows and connecting edges.

## Prerequisites

Ask your administrator for a hub URL and a compatible CLI version. If you do not have a hub, follow [Self-hosting](/docs/self-hosting/). These docs do not establish hosted-service availability.

Install [kubectl](https://kubernetes.io/docs/tasks/tools/) to use the plugin form and Kubernetes examples below.

## Get a compatible binary

Check the [Faros releases page](https://github.com/faroshq/faros/releases) for your operator's selected version and operating system. If that release has no suitable binary, build the matching source revision instead. Do not assume a latest-release asset exists or matches your hub.

Place the executable on your `PATH` as `kubectl-faros` to run `kubectl faros`. A standalone executable named `faros` runs as `faros`; omit the `kubectl` prefix in these docs.

## Build from source

Use the Go version required by the repository’s `go.mod`. Replace `RELEASE_TAG` with the release selected for your hub. Build from the repository so the local provider SDK replacement can resolve:

```bash
git clone https://github.com/faroshq/faros.git
cd faros
git checkout RELEASE_TAG
go build -o ./bin/kubectl-faros ./cmd/faros
```

Add the checkout's `bin` directory to your `PATH`.

## Verify and log in

```bash
kubectl faros --help
kubectl faros login --hub-url https://YOUR-HUB
```

Replace `https://YOUR-HUB` with your hub URL. The first command should list available commands. The second starts the configured login flow and updates your kubeconfig. See [authentication](/docs/reference/cli/login/) for static-token hubs and credential storage.

If the command is not found, check your executable name and `PATH`. If login fails, verify the hub URL and authentication method with your administrator.

## Next step

[Select your organization and workspace](/docs/reference/cli/workspaces/), then [connect a cluster or server](/docs/use/edges/quickstart/).
