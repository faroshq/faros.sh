---
title: "Self-host Code"
description: "Deployment prerequisites, verification, and recovery for Code."
weight: 10
doc_type: "Guide"
---

Install one Code provider into a Kubernetes cluster you administer, then enable it in a test workspace. These steps use the Code chart included in the product repository. Image registry availability must be confirmed for your deployment.

## Prerequisites

- An existing hub and permission to onboard a provider through **Providers → Self-Hosting**.
- The scoped Code provider kubeconfig downloaded during onboarding as `code.kubeconfig`.
- A hosting cluster context, Helm, kubectl, and a StorageClass able to provision the default 1 GiB bundle volume.
- Network routes between hub and provider endpoints, and from the provider to the hub/kcp endpoints in its kubeconfig and GitHub.
- A product checkout at the reviewed revision and a matching Code image available to your cluster.

The hosting context runs pods and Secrets. The provider kubeconfig addresses a Faros provider workspace; never use it as the Helm hosting context.

## Prepare credentials and values

Run from the product repository root. Replace `HOSTING-CONTEXT` with your hosting cluster context in every command:

```bash
kubectl --context HOSTING-CONTEXT create namespace faros-provider-code
kubectl --context HOSTING-CONTEXT --namespace faros-provider-code \
  create secret generic faros-provider-kubeconfig \
  --from-file=kubeconfig=./code.kubeconfig
```

The Secret data key must be `kubeconfig`. Keep the downloaded file private and out of source control. If the namespace or Secret already exists, inspect it before updating; do not replace an active provider's credentials blindly.

Create `code-values.yaml`, replacing the hub URL and image tag with your reachable hub and verified image version:

```yaml
hub:
  url: https://hub.example.com
providerKubeconfig:
  secretName: faros-provider-kubeconfig
image:
  repository: ghcr.io/faroshq/faros-code-provider
  tag: REPLACE_WITH_VERIFIED_IMAGE_TAG
replicaCount: 1
catalogEntry:
  enabled: true
bundleStore:
  persistence:
    enabled: true
    size: 1Gi
githubOAuth:
  enabled: false
```

This configuration uses the portal's personal-access-token connection flow. OAuth is optional and needs its own client Secret, callback URL, and explicit portal origin. Keep one replica unless you supply shared bundle storage. Do not switch to `emptyDir` to hide a failed persistent-volume setup.

## Render and install

```bash
helm template code ./providers/code/deploy/chart \
  --namespace faros-provider-code --values code-values.yaml > /tmp/code-rendered.yaml
helm upgrade --install code ./providers/code/deploy/chart \
  --kube-context HOSTING-CONTEXT --namespace faros-provider-code \
  --values code-values.yaml --wait --timeout 5m
kubectl --context HOSTING-CONTEXT --namespace faros-provider-code \
  get pods,pvc -l app.kubernetes.io/instance=code
```

Review the rendered resources before installing. The chart initializes the API schema and applies its CatalogEntry through the provider kubeconfig into kcp; the CatalogEntry is not a hosting-cluster resource.

## Verify the full connection

1. Check that the bundle PVC is bound and the provider pod is ready.
2. Check registration and heartbeat in the hub. A healthy pod alone does not verify hub-to-provider routing.
3. [Enable Code](/docs/use/enable-provider/) in a disposable workspace.
4. Complete the [Code quickstart](/docs/use/code/quickstart/) with a test repository and confirm that its status is readable using the same workspace identity.

## Diagnose an installation failure

| Symptom | Check | Fix |
| --- | --- | --- |
| Init container fails | Provider kubeconfig Secret and provider-workspace access | Correct the `kubeconfig` key and scoped credential; check reachable kcp endpoints |
| PVC stays Pending | StorageClass and hosting-cluster events | Provision compatible persistent storage before retrying |
| ImagePullBackOff | Image tag, registry access, pod events | Supply the matching published or operator-built image |
| CreateContainerConfigError | Referenced Secrets, including any heartbeat token reference | Create the intended Secret or remove an unused optional reference |
| Pod ready, hub unavailable | Catalog endpoints, heartbeat, DNS and TLS routing | Repair the failing network direction; do not disable TLS verification as a production fix |

```bash
kubectl --context HOSTING-CONTEXT --namespace faros-provider-code get events --sort-by=.lastTimestamp
kubectl --context HOSTING-CONTEXT --namespace faros-provider-code \
  logs -l app.kubernetes.io/instance=code --all-containers=true --tail=100
```

Redact credentials and private repository details before sharing diagnostics.

## Remove the test installation

Remove test resources and workspace bindings before retiring the provider registration. Review upstream repository deletion policies first. Then uninstall the release:

```bash
helm uninstall code --kube-context HOSTING-CONTEXT --namespace faros-provider-code
```

Inspect retained PVCs and credential Secrets separately. Back up required bundle data before deleting storage; Helm uninstall is not a repository backup. Follow [operations and recovery](/docs/self-hosting/operations/) for an existing shared provider.

[Chart values](https://github.com/faroshq/faros/blob/main/providers/code/deploy/chart/values.yaml). *Chart rendering can be checked locally; a live installation walkthrough is still pending.*
