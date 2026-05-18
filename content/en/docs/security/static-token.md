---
title: Static Tokens
description: Pre-shared bearer tokens — the simplest way to secure a personal hub.
weight: 1
---

A **static token** is a pre-shared bearer token that grants full admin access to the hub. No identity provider, no callback URLs, no client configuration — just one string both sides agree on.

It's the right choice for:

- A single-user home lab
- Quick dev / test deployments
- CI/CD pipelines
- Bootstrapping a hub before you set up OIDC

## 1. Generate a token

```bash
openssl rand -hex 32
```

Save the output somewhere safe (password manager, encrypted file). It's the only credential — anyone who has it is admin.

## 2. Configure the hub

Add the token to your Helm values:

```yaml
hub:
  hubExternalURL: "https://hub.example.com"
  devMode: true              # Skips OIDC issuer TLS verification — only set with static tokens, never with real OIDC
  staticAuthToken: "<your-generated-token>"

# No idp section needed
```

Apply:

```bash
helm upgrade --install kedge oci://ghcr.io/faroshq/charts/kedge-hub \
  -f values.yaml \
  --namespace kedge-system \
  --create-namespace
```

You can also pass the token directly to the binary in non-Helm setups:

```bash
kedge-hub \
  --static-auth-token=<your-generated-token> \
  --hub-external-url=https://localhost:9443 \
  --dev-mode
```

## 3. Log in with the token

```bash
kubectl kedge login \
  --hub-url https://hub.example.com \
  --token <your-generated-token>
```

Add `--insecure-skip-tls-verify` if the hub is using a self-signed certificate.

This writes a kubeconfig context named `kedge` with the token embedded as a bearer token.

## 4. Verify

```bash
kubectl --context kedge get namespaces
kubectl kedge edge list
```

## Rotating the token

Static tokens don't auto-rotate. To rotate manually:

1. Generate a new token.
2. Update `hub.staticAuthToken` in your Helm values.
3. `helm upgrade` — the hub picks up the new token.
4. Re-run `kubectl kedge login --token <new-token>` on every machine that talks to the hub.

The old token is invalidated as soon as the new one is in place.

## Security notes

- The token grants **full admin access** to the hub. Treat it like a root password.
- Store it in a password manager or an encrypted secrets store (1Password, Bitwarden, sealed-secrets, sops, Vault).
- Don't commit `values.yaml` containing the token to a public repo. Use a values file outside Git, or store the token in a `Secret` and reference it via `valueFrom` in your own deployment process.
- Rotate periodically — there's no expiry built in.
- For multi-user scenarios, switch to [OIDC](/docs/security/oidc/) so each user has their own identity and you can revoke individuals without bouncing everyone.
