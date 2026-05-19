---
title: Login & Authentication
description: kubectl kedge login — OIDC browser flow or static token.
weight: 1
---

`kubectl kedge login` authenticates against a hub and writes a kubeconfig context (`kedge` by default) with the resulting token embedded. Use it once per hub; subsequent commands use the saved context.

## OIDC (browser flow)

`--hub-url` defaults to the hosted hub at `https://console.faros.sh`, so for the hosted experience you can omit it entirely:

```bash
kubectl kedge login
```

Or point at a self-hosted hub:

```bash
kubectl kedge login --hub-url https://hub.example.com
```

This:

1. Opens your browser to the hub's `/auth` endpoint.
2. The hub redirects to its configured OIDC provider (the hosted hub uses GitHub).
3. After you authorize, the browser is redirected back; the CLI receives the token over a one-time local listener.
4. Your kubeconfig gets a `kedge` context with that token.

## Static token

For dev hubs or unattended automation, use a pre-shared token instead of OIDC:

```bash
kubectl kedge login \
  --hub-url https://hub.example.com \
  --token $(cat token.txt)
```

Add `--insecure-skip-tls-verify` if the hub uses a self-signed certificate.

> See [Static tokens](/docs/security/static-token/) for how to provision them on the hub side.

## Switching hubs

You can log in to multiple hubs. Each one is stored under its own kubeconfig context:

```bash
kubectl kedge login --hub-url https://hub-a.example.com --context hub-a
kubectl kedge login --hub-url https://hub-b.example.com --context hub-b

kubectl kedge --context hub-a edge list
```

Switch the default context with `kubectl config use-context hub-a`.

## Logout

```bash
kubectl kedge logout
```

Removes the saved token from your kubeconfig. The context itself stays so you can `login` again later without retyping the URL.

## whoami

Check who you're authenticated as on the current hub:

```bash
kubectl kedge whoami
```

Shows the username, email (for OIDC), workspace, and hub URL.

## Where credentials live

kedge writes to your standard kubeconfig (`$KUBECONFIG` or `~/.kube/config`). The token is stored as a bearer token in the user entry — no separate keychain, no cookie store. Treat the kubeconfig file as a secret.
