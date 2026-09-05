---
title: Login & Authentication
description: kubectl faros login — OIDC browser flow or static token.
weight: 1
---

`kubectl faros login` authenticates against a hub and writes a kubeconfig context named `faros` with authentication configuration. Use it once per hub; subsequent commands use the saved context.

**Flags:**

| Flag | Description |
|:-----|:------------|
| `--hub-url <url>` | Hub URL. Defaults to `https://console.faros.sh`. `https://` is assumed if you omit the scheme. |
| `--token <token>` | Static bearer token — skips the OIDC browser flow. |
| `-i, --interactive` | After login, run the organization/workspace picker (same as `faros use`). |
| `--insecure-skip-tls-verify` | Skip TLS verification — only for self-signed dev hubs. |

## OIDC (browser flow)

Supply the URL of a hub you can access. The built-in default URL does not establish hosted availability:

```bash
kubectl faros login --hub-url https://hub.example.com
```

What happens:

1. The CLI checks `https://<hub>/healthz` to see whether the hub has OIDC enabled. If not, it tells you to use `--token`.
2. It starts a one-time listener on a random `127.0.0.1` port and opens your browser to the hub's `/auth/authorize` endpoint, passing the callback port and a PKCE code verifier.
3. The hub redirects to its configured OIDC provider (Dex — GitHub, Google, LDAP, ... depending on the hub). After you authorize, the browser is redirected back to `http://127.0.0.1:<port>/callback` and the CLI receives your kubeconfig.
4. The kubeconfig is merged into `$KUBECONFIG` (or `~/.kube/config`) as the `faros` context.

The flow is a PKCE **public client** — there is no client secret anywhere on your machine.

### Token refresh

The kubeconfig doesn't embed a static OIDC token. It uses a kubectl [exec credential plugin](https://kubernetes.io/docs/reference/access-authn-authz/authentication/#client-go-credential-plugins) that runs `faros get-token` behind the scenes: cached ID tokens are reused until they expire, then refreshed with your refresh token. You should rarely need to re-run `login`.

## Static token

For dev hubs or unattended automation, use a pre-shared token instead of OIDC:

```bash
kubectl faros login \
  --hub-url https://hub.example.com \
  --token $(cat token.txt)
```

Add `--insecure-skip-tls-verify` if the hub uses a self-signed certificate.

> See [Static tokens](/docs/self-hosting/static-token/) for how to provision them on the hub side. Each distinct static token maps to its own isolated tenant user on the hub.

## Pick an organization and workspace

After login your context points at your default workspace. To switch:

```bash
kubectl faros use                    # interactive picker
kubectl faros use --org acme --workspace platform
```

See [Organizations & workspaces](/docs/reference/cli/workspaces/).

## Logging out / switching hubs

There is no `logout` command. Deleting a context removes a local connection shortcut; it does **not** delete the kubeconfig user credential, clear the OIDC cache, end your browser session, or revoke a token. Logging in to another hub also does not revoke the previous credentials.

To remove local access, first identify the user entry associated with the context (this prints its name, not its credential):

```bash
kubectl config view -o jsonpath='{.contexts[?(@.name=="faros")].context.user}'
kubectl config delete-context faros
```

Check whether another context uses that user before removing it with `kubectl config delete-user USER-NAME`. Use the same `--kubeconfig` file for all three operations if you supplied one at login.

OIDC credentials are cached separately under `~/.config/faros/tokens/`. Each JSON filename is the first 32 hexadecimal characters of SHA-256 of `issuer URL + newline + client ID`. Remove only the cache file for the identity you intend to disconnect; contexts sharing that issuer/client pair share its cache. Do not print or share these files: they contain tokens. End your identity-provider browser session separately if you want the next login to ask for credentials.

Local deletion is not server-side revocation. For a lost or exposed credential, ask the hub operator to revoke/rotate a static token, or revoke the OIDC session at its issuer. Other copies remain usable until revoked or expired.

To work against two hubs, use separate kubeconfig files via `--kubeconfig` or `$KUBECONFIG`.

## Where credentials live

faros writes to your standard kubeconfig (`$KUBECONFIG` or `~/.kube/config`). OIDC refresh-token state is cached on disk for the exec plugin; static tokens are stored as bearer tokens in the user entry. Treat both as secrets.
