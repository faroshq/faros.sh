---
title: Static Tokens
description: Pre-shared bearer tokens — the simplest way to secure a personal hub.
weight: 1
---

A **static token** is a pre-shared bearer token. No identity provider, no callback URLs, no client configuration — just a string both sides agree on.

Each distinct token becomes its **own isolated user** on the hub, with its own personal organization and workspace. A static token is admin *within its own tenant* — it is **not** a platform-wide admin credential unless you also list its identity in `hub.adminUsers`.

Static tokens are the right choice for:

- A single-user home lab
- Quick dev / test deployments
- CI/CD pipelines
- Bootstrapping a hub before you set up OIDC

## 1. Generate a token

```bash
openssl rand -hex 32
```

Save the output somewhere safe (password manager, encrypted file) — anyone who has it can act as that user.

## 2. Configure the hub

The Helm value is a **list** — you can issue several tokens, and each maps to a separate tenant user:

```yaml
hub:
  hubExternalURL: "https://hub.example.com"
  staticAuthTokens:
    - "<token-for-you>"
    - "<token-for-ci>"

# No idp section needed
```

Apply:

```bash
helm upgrade --install faros oci://ghcr.io/faroshq/charts/faros-hub \
  -f values.yaml \
  --namespace faros-system \
  --create-namespace
```

Or pass tokens directly to the binary in non-Helm setups (the flag is repeatable):

```bash
faros-hub \
  --static-auth-token=<token-one> \
  --static-auth-token=<token-two> \
  --hub-external-url=https://localhost:9443
```

## 3. Log in with the token

```bash
kubectl faros login \
  --hub-url https://hub.example.com \
  --token <your-token>
```

Add `--insecure-skip-tls-verify` if the hub uses a self-signed certificate. This writes a kubeconfig context named `faros` with the token embedded.

## 4. Verify

```bash
kubectl faros edge list
```

## Rotating a token

Static tokens don't auto-rotate. To rotate: generate a new token, replace it in `staticAuthTokens`, `helm upgrade`, and re-run `login --token` wherever the old one was used. Note that a *new* token is a *new* user with a fresh personal workspace — for rotation-without-migration keep this in mind, or use OIDC/service accounts where identity and credential are separate.

## Security notes

- A token is the full identity of its user — treat it like a password. Store it in a password manager or an encrypted secrets store; don't commit values files containing tokens.
- Scope by issuing separate tokens per purpose (you, CI, a teammate) instead of sharing one — each gets its own isolated tenant, and you can revoke them individually.
- Platform-admin powers (provider onboarding, admin API) require the identity to be listed in `hub.adminUsers` — static tokens don't get this implicitly.
- For multi-user scenarios with real names and revocation, switch to [OIDC](/docs/security/oidc/).
