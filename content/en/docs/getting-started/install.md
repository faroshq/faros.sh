---
title: Install
description: Install the faros CLI on macOS, Linux, or Windows.
weight: 1
---

The `faros` CLI talks to a hub from your laptop. It's a single Go binary; pick whichever install method fits your workflow.

## Prerequisites

- `kubectl` — [install guide](https://kubernetes.io/docs/tasks/tools/)
- A hub URL — either the hosted hub at `https://console.faros.sh` or one you deploy yourself

## Install via krew (recommended)

[krew](https://krew.sigs.k8s.io/) is the kubectl plugin manager. Once you've installed it, add the Faros plugin index and install `faros`:

```bash
kubectl krew index add faros https://github.com/faroshq/krew-index.git
kubectl krew install faros/faros
```

Now `kubectl faros` is available everywhere:

```bash
kubectl faros --help
```

To upgrade later:

```bash
kubectl krew upgrade
```

## Install a release binary

Download a prebuilt binary from the [releases page](https://github.com/faroshq/faros/releases) and put it in your `$PATH`.

```bash
# macOS / Linux example — adjust version and arch
curl -L https://github.com/faroshq/faros/releases/latest/download/faros-darwin-arm64 \
  -o /usr/local/bin/faros
chmod +x /usr/local/bin/faros
```

Both `faros ...` and `kubectl faros ...` work — kubectl auto-discovers any `kubectl-*` plugin on your `$PATH`. The docs use `kubectl faros` everywhere; if you prefer the standalone binary, drop the `kubectl` prefix.

## Install from source

```bash
go install github.com/faroshq/faros/cmd/faros@latest
```

This requires Go 1.25+ and puts the binary in `$GOBIN` (usually `~/go/bin`).

## Verify

```bash
kubectl faros version
```

You should see something like:

```
faros v0.x.x  (go1.25.x  darwin/arm64)
```

## Next: log in

Head to the [Quickstart](/docs/getting-started/quickstart/) to register your first edge.
