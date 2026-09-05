---
title: "Install the hub"
description: "Choose embedded or external kcp and verify the console."
weight: 1
doc_type: "Guide"
---

## Choose a deployment

| Mode | Hub workload | Constraint |
|---|---|---|
| Embedded kcp | StatefulSet | One replica; embedded etcd uses its PVC |
| External kcp | Deployment | Hub replicas can scale; operate kcp and its storage separately |

A hub installation does not install every provider. Install the providers your users need after verifying the hub.

## Prerequisites

Use a Kubernetes cluster you administer, Helm, kubectl, and a reviewed Faros chart version. For public access, configure DNS, TLS, and [ingress](/docs/self-hosting/ingress/). Use development credentials only in an isolated test installation.

## Install a local test hub

This walkthrough creates an isolated kind cluster with embedded kcp. You need Docker running, kind, Helm 3, kubectl, Git, Make, OpenSSL, and the [Faros CLI](/docs/get-started/install/) for terminal login. It builds the hub image from the same revision as the chart, so it does not depend on a published image tag being available.

Clone a separate product checkout, replace `RELEASE_TAG` with your selected Faros release tag, then build the image. Set the Docker platform to match your kind nodes: `linux/arm64` for Apple Silicon or `linux/amd64` for an x86 machine.

```bash
git clone https://github.com/faroshq/faros.git faros-install-source
cd faros-install-source
git checkout RELEASE_TAG
make docker-build-hub VERSION=docs-local DOCKER_PLATFORM=linux/arm64
```

The image build downloads its Go, Node, and container dependencies. Keep this checkout and terminal for the following commands. Choose an unused cluster name; the cluster script reuses a cluster with the same name if one already exists.

```bash
export FAROS_INSTALL_CLUSTER=faros-docs
export FAROS_STATIC_TOKEN="$(openssl rand -hex 32)"
export HUB_IMAGE=ghcr.io/faroshq/faros-hub
export HUB_IMAGE_TAG=docs-local
export HUB_IMAGE_PULL_POLICY=Never
export HUB_KIND_LOAD=true
export HUB_EXTERNAL_URL=https://localhost:9443

bash hack/install/01-kind-cluster.sh
bash hack/install/08-faros-hub-embedded.sh
```

The installer loads your image into kind and waits for `statefulset/faros-hub` in `faros-system`. It enables development mode, static-token authentication, and the embedded console gateway. These settings are for this local test; the installer prints the credential, so keep its output private.

Forward the hub service in a second terminal, leaving that process running:

```bash
kubectl --context kind-faros-docs -n faros-system \
  port-forward service/faros-hub 9443:9443
```

Back in the first terminal, verify health and authenticate:

```bash
curl --fail --insecure https://localhost:9443/healthz
kubectl faros login --hub-url https://localhost:9443 \
  --token "$FAROS_STATIC_TOKEN" --insecure-skip-tls-verify
kubectl faros use
kubectl api-resources
```

The TLS exceptions apply to this localhost test's self-signed certificate. Open `https://localhost:9443`, sign in with the generated token, and select a workspace. Success means the health endpoint responds successfully, the console loads, and the CLI can discover workspace APIs. No providers are installed by these steps; continue with [provider installation](/docs/self-hosting/providers/).

If readiness fails, inspect the hosting cluster explicitly, even after Faros login changes your current kubeconfig context:

```bash
kubectl --context kind-faros-docs -n faros-system get pods,pvc
kubectl --context kind-faros-docs -n faros-system \
  logs statefulset/faros-hub -c hub --tail=100
kubectl --context kind-faros-docs -n faros-system \
  get events --sort-by=.lastTimestamp
```

An image error calls for checking the image tag and kind load; a pending PVC calls for checking storage provisioning. Use [operations and recovery](/docs/self-hosting/operations/) for further diagnosis.

To remove this test installation, stop port-forwarding with Ctrl-C, then delete **only the disposable cluster you created**. This deletes its hub data and all other workloads in that cluster:

```bash
kind delete cluster --name faros-docs
unset FAROS_STATIC_TOKEN
```

If you selected another cluster name, substitute it in all context and cleanup commands. Source: [cluster creation](https://github.com/faroshq/faros/blob/main/hack/install/01-kind-cluster.sh), [embedded installation](https://github.com/faroshq/faros/blob/main/hack/install/08-faros-hub-embedded.sh), and [image build](https://github.com/faroshq/faros/blob/main/deploy/Dockerfile.hub).

## Configure a shared installation

For an existing hosting cluster, prepare DNS, [ingress and TLS](/docs/self-hosting/ingress/), and [OIDC](/docs/self-hosting/oidc/) first. Use a reviewed chart checkout and a corresponding hub image available to your cluster. The example below is a configuration starting point; substitute your own hostname, identity provider, administrator, TLS Secret, and image tag.

Save this as `hub-values.yaml`. The TLS Secret must exist in the release namespace and contain a certificate covering the hub hostname. This example keeps one embedded-kcp replica and its persistent storage.

```yaml
image:
  hub:
    repository: ghcr.io/faroshq/faros-hub
    tag: YOUR_VERIFIED_IMAGE_TAG
replicaCount: 1
hub:
  hubExternalURL: https://hub.example.com
  devMode: false
  embeddedGraphQL: true
  staticAuthTokens: []
  disableTokenLogin: true
  adminUsers:
    - admin@example.com
  tls:
    existingSecret: faros-hub-tls
    selfSigned:
      enabled: false
idp:
  issuerURL: https://idp.example.com
  clientID: faros
persistence:
  size: 10Gi
```

Set `adminUsers` to identities as resolved by your authentication setup. Review storage capacity and your backup procedure before using this hub for durable work. From the product checkout, render the chart before installing it into the intended hosting cluster:

```bash
helm template faros-hub ./deploy/charts/faros-hub \
  --namespace faros-system --values hub-values.yaml
helm upgrade --install faros-hub ./deploy/charts/faros-hub \
  --kube-context HOSTING_CONTEXT \
  --namespace faros-system --create-namespace \
  --values hub-values.yaml --wait --timeout 15m
```

Replace `HOSTING_CONTEXT` with the hosting cluster's kubeconfig context. A successful Helm rollout verifies workload readiness; complete the authentication and workspace checks below before giving users access. If it fails, inspect logs and events using [hosting-cluster diagnostics](/docs/self-hosting/operations/#inspect-the-hosting-cluster-from-the-cli).

### Use external kcp

For multiple hub replicas, operate external kcp and its storage separately. The [external-kcp recipe](https://github.com/faroshq/faros/blob/main/docs/install-external-kcp.md) covers its additional components. Supply a front-proxy kubeconfig whose server address and certificate are reachable and trusted from the hub pods. Put it in a Secret in the hub namespace with the key `admin.kubeconfig`:

```bash
kubectl --context HOSTING_CONTEXT -n faros-system create secret generic faros-kcp \
  --from-file=admin.kubeconfig=/PATH/TO/FRONT-PROXY.kubeconfig
```

Create the namespace first if it does not exist. Protect this kubeconfig as an administrative credential. For a **new** external-kcp installation, add these values to your configuration before installing:

```yaml
replicaCount: 2
kcp:
  embedded:
    enabled: false
  external:
    enabled: true
    existingSecret: faros-kcp
```

This selects a Deployment. Changing these flags on an existing embedded installation does not migrate its data; treat that as a separate storage and control-plane migration.

### Settings to review

| Setting | Why it matters |
|---|---|
| `hub.hubExternalURL` | Client-facing origin used by hub flows; match DNS and TLS. |
| `hub.embeddedGraphQL` | Enables the console's GraphQL gateway. |
| `hub.adminUsers` | Selects platform administrators; empty disables the admin surface. |
| `idp.issuerURL`, `idp.clientID` | Must agree with your OIDC provider and client registration. |
| `hub.tls.existingSecret` | Supplies the hub's serving certificate. |
| `persistence.size` | Embedded-kcp PVC capacity; plan storage and backups. |
| `kcp.external.existingSecret` | Supplies the external front-proxy kubeconfig. |
| `replicaCount` | Greater than one requires external kcp. |
| `image.hub.tag` | Pins the deployed image; verify compatibility with the chart. |

For defaults and additional settings, use the [chart values file](https://github.com/faroshq/faros/blob/main/deploy/charts/faros-hub/values.yaml).

## Installation sources

The product repo includes executable installation recipes for both modes. Use the recipe and chart from the same revision:

- [Embedded kcp installation](https://github.com/faroshq/faros/blob/main/docs/install-embedded-kcp.md)
- [External kcp installation](https://github.com/faroshq/faros/blob/main/docs/install-external-kcp.md)

Set `hub.hubExternalURL` to the URL clients will use. Enable `hub.embeddedGraphQL` when using the console. Set `hub.adminUsers` to the intended platform administrators; an empty list disables the admin surface. Configure [OIDC](/docs/self-hosting/oidc/) or [static tokens](/docs/self-hosting/static-token/) as appropriate.

Wait for hub readiness, authenticate against its URL, and verify the console and workspace API. Check the actual pod names with `kubectl get pods -n YOUR_NAMESPACE`; the current chart’s serving container is named `hub`, with embedded kcp in-process.

## Verify the installation from the terminal

Use the explicit hosting-cluster context to inspect the discovered workload and serving container. Follow [hosting-cluster diagnostics](/docs/self-hosting/operations/#inspect-the-hosting-cluster-from-the-cli) for pod, rollout, and event commands.

Then use your local CLI to verify the Faros-facing endpoint:

```bash
kubectl faros login --hub-url https://YOUR-HUB
kubectl faros use
kubectl api-resources
```

For static-token deployments, follow [login authentication](/docs/reference/cli/login/) instead of expecting a browser flow. Success means authentication works, the intended workspace is selectable, and its APIs are discoverable. Install/enable a provider and complete its quickstart to verify the provider path as well.

## Next steps

[Install providers](/docs/self-hosting/providers/), then review [operations and recovery](/docs/self-hosting/operations/). For the complete configuration, use the [chart values](https://github.com/faroshq/faros/blob/main/deploy/charts/faros-hub/values.yaml).
