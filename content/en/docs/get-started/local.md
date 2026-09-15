---
title: "Run Railgrid locally"
description: "Create a self-contained hub, providers, and edge on your laptop with railgrid dev init."
weight: 3
doc_type: "Guide"
---

`railgrid dev init` builds a complete Railgrid environment in one [kind](https://kind.sigs.k8s.io/) cluster on your machine. It runs the hub, the default providers, and an agent that joins the same cluster as an edge. Nothing is exposed to the internet, and you can delete it with one command. You need the Railgrid CLI first; [install the CLI](/docs/get-started/install/) if you have not already.

Use it to evaluate Railgrid, follow the tutorials offline, or develop against a hub you control. The command is in preview, and it is not a production installation. For a hub that other people use, see [Self-hosting](/docs/self-hosting/).

## Prerequisites

| Tool | Why |
|:-----|:----|
| [Docker](https://docs.docker.com/get-docker/) | Runs the kind cluster. It must be running before you start. |
| [kind](https://kind.sigs.k8s.io/docs/user/quick-start/#installation) | Creates the local Kubernetes cluster. |
| [kubectl](https://kubernetes.io/docs/tasks/tools/) | Reaches the cluster and the edge. |
| [Railgrid CLI](/docs/get-started/install/) | Creates the environment and logs in to it. |

[Helm](https://helm.sh/docs/intro/install/) is only needed to connect extra clusters by hand. `railgrid dev init` installs the hub, provider, and agent charts itself.

## Create the environment

```bash
railgrid dev init
```

The first run downloads the charts and container images. The command works through these stages and prints each one:

1. Creates the `railgrid-hub` kind cluster, or reuses it if it already exists.
2. Installs cert-manager and a local certificate authority, then the hub Helm chart.
3. Installs Envoy Gateway to serve published apps under `*.apps.127.0.0.1.sslip.io`.
4. Onboards and installs each provider into the `railgrid-providers` namespace. AI agents and App Studio each get their own Postgres.
5. Enables every provider in the `default` workspace of the dev user's personal organization.
6. Joins the cluster to the hub as the edge `local`, and waits until it is Ready.

It ends with a summary like this:

```text
railgrid dev environment is ready!

Configuration:
  Hub cluster kubeconfig: railgrid-hub.kubeconfig
  railgrid server URL: https://console.127.0.0.1.sslip.io:9443
  railgrid UI URL:     https://console.127.0.0.1.sslip.io:9443/ui
  Published apps:   https://<app>.apps.127.0.0.1.sslip.io:10443
  Static auth token: dev-token
  Dev CA:           railgrid-hub-ca.crt (signs the hub and app certificates)
  Providers (namespace railgrid-providers): edges, infrastructure, code, agents, app-studio
  Edge "local": this kind cluster, agent in namespace railgrid-agent
```

A few things to know about that summary:

- **The hub URL** resolves through public DNS. Every `*.127.0.0.1.sslip.io` name points to `127.0.0.1`, so there is nothing to add to `/etc/hosts`.
- **`railgrid-hub.kubeconfig` and `railgrid-hub-ca.crt`** are written to the current directory. The first reaches the kind cluster directly. The second is the dev certificate authority that signs the hub and app certificates.
- **The static token `dev-token`** is how you sign in. That is fine on a laptop and nowhere else.

Running `railgrid dev init` again is safe. It reuses the existing cluster, reapplies the charts, and skips the edge and agent if they already exist.

Common variations:

| Command | Effect |
|:--------|:-------|
| `railgrid dev init --providers edges,quickstart` | Install only the providers you list. App Studio always brings Infrastructure along. |
| `railgrid dev init --providers "" --with-edge=false` | Hub only, with no providers and no edge. |
| `railgrid dev init --worker-count 1` | Add plain kind clusters for connecting more edges by hand. |
| `railgrid dev init --hub-https-port 9444` | Serve the hub on another host port when 9443 is taken. Use that port in the hub URL. |
| `railgrid dev init --chart-version 0.1.31` | Pin the hub chart. `--provider-chart-version` pins the provider charts. |

The [`railgrid dev init` reference](/docs/reference/cli/commands/dev-init/) lists every flag, including local chart paths for developing Railgrid itself.

## Log in

```bash
railgrid login --hub-url https://console.127.0.0.1.sslip.io:9443 --insecure-skip-tls-verify --token dev-token
railgrid use
```

`railgrid use` makes an organization and workspace active. Pick the `default` workspace in the personal organization named after the static-token user; that is where the providers and the `local` edge were enabled.

To use the console, open `https://console.127.0.0.1.sslip.io:9443/ui`, accept the self-signed certificate, and paste `dev-token` on the sign-in page.

![The local hub's sign-in page accepts the static token.](/images/docs/console/login.webp)

## Verify

```bash
railgrid edge list                                   # local shows Ready
railgrid edge get local                              # details for the edge
railgrid edge kubeconfig local > local.kubeconfig
kubectl --kubeconfig local.kubeconfig get nodes   # reaches the kind cluster through the hub
```

Expected result: `local` is Ready and `kubectl` lists the kind node. The request goes through the hub, which authorizes it as you in the workspace.

## Connect an AI assistant

The local hub's certificate is signed by the dev certificate authority, so the client has to trust `railgrid-hub-ca.crt`:

```bash
railgrid mcp claude --ca-file railgrid-hub-ca.crt
NODE_EXTRA_CA_CERTS=$PWD/railgrid-hub-ca.crt claude
```

For Codex, run `railgrid mcp codex --ca-file railgrid-hub-ca.crt` and start Codex with the `CODEX_CA_CERTIFICATE` line it prints. For any other client, `railgrid mcp url --mcpserver-name default` prints the endpoint and configuration snippets. Install the Railgrid skill with `railgrid skills install` so the assistant knows the workflows; see [AI assistants and MCP](/docs/use/ai-assistants/).

## Apps, models, and GitHub

- **Published apps** are served at `https://<app>.apps.127.0.0.1.sslip.io:10443` through a gateway in the cluster, with the same self-signed certificate.
- **Model credentials** for AI agents and App Studio are created per workspace in the console under **Models**.
- **GitHub sign-in** for the Code provider needs `GITHUB_OAUTH_CLIENT_ID` and `GITHUB_OAUTH_CLIENT_SECRET` set when you run `railgrid dev init`. Register `https://console.127.0.0.1.sslip.io:9443/services/providers/code/oauth/github/callback` as the OAuth App's callback. Without them, add a GitHub token as a connection in the console.

## Update and clean up

```bash
railgrid dev update    # upgrade the hub release in the existing environment
railgrid dev delete    # remove the environment
```

Pass `railgrid dev delete` the same `--worker-count` you used at creation so the extra clusters are removed too.

To inspect the kind cluster itself rather than going through the hub, point kubectl at the kubeconfig the command wrote:

```bash
export KUBECONFIG=$PWD/railgrid-hub.kubeconfig
kubectl get pods -A
```

## Troubleshooting

- **Docker is not running.** Start Docker and run `railgrid dev init` again.
- **Port 9443 is already in use.** Delete the previous environment with `railgrid dev delete`, or pick another port with `--hub-https-port` and use it in the hub URL.
- **`railgrid login` says OIDC is not configured.** The local hub uses a static token. Pass `--token dev-token`.
- **The `local` edge never becomes Ready.** Follow the agent logs with `kubectl --kubeconfig railgrid-hub.kubeconfig -n railgrid-agent logs deploy/railgrid-agent -f`, and the edges provider with `kubectl --kubeconfig railgrid-hub.kubeconfig -n railgrid-providers logs deploy/edges -f`.
- **Provider onboarding fails.** Check pod health with `kubectl --kubeconfig railgrid-hub.kubeconfig get pods -A`, then read the failing provider's logs in the `railgrid-providers` namespace. `--with-dex` disables token login, so it also skips providers and the edge.
- **The App Studio preview panel stays on "Preview is getting ready".** The embedded preview does not load in the local environment. Open the development instance's URL from **Application Templates → Instances** instead; it signs you in through the hub.

## Next steps

- [Choose your first task](/docs/get-started/#choose-your-first-task). The default providers cover the first-task tutorials.
- [Install a hub](/docs/self-hosting/hub/helm/) with TLS, OIDC, and ingress when other people need access.
