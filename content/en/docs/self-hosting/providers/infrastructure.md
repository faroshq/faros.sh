---
title: "Self-host Infrastructure"
description: "Deployment prerequisites, verification, and recovery for Infrastructure."
weight: 10
doc_type: "Guide"
---

## Prerequisites

You need a Kubernetes runtime you administer, Helm, network access from the provider runtime to the hub and advertised virtual-workspace endpoints, and permission to onboard this provider. Use the [common provider flow](/docs/self-hosting/providers/) to obtain the workspace kubeconfig. The examples below use a Secret named `faros-provider-kubeconfig` with data key `kubeconfig`; the generated onboarding command is authoritative for your hub.

## Install

```bash
kubectl create namespace faros-provider-infrastructure
kubectl --namespace faros-provider-infrastructure create secret generic faros-provider-kubeconfig \
  --from-file=kubeconfig=./infrastructure.kubeconfig

helm upgrade --install infrastructure oci://ghcr.io/faroshq/charts/faros-infrastructure-provider \
  --namespace faros-provider-infrastructure \
  --set hub.url=https://faros.example.com \
  --set providerKubeconfig.secretName=faros-provider-kubeconfig \
  --set catalogEntry.enabled=true
```

The chart README contains the matching values table and image coordinates for the deployed source version: [chart instructions](https://github.com/faroshq/faros/blob/main/providers/infrastructure/deploy/chart/README.md). Replace the placeholder kubeconfig and hub URL; do not put bearer tokens or database URLs directly in a production values file.

## Provider requirements

The provider needs a central kro kubeconfig when templates broker runtime resources. Prefer `centralKro.kubeconfigSecretRef` in production; the chart’s inline `centralKro.kubeconfig` is for development. If using self-bootstrap, set `bootstrap.enabled=true` and choose `bootstrap.kubeconfigSource=hubMinted` or `supplied` according to who owns the workspace credential. Review the cluster-level permissions before enabling application templates.

## Verify

Run `kubectl -n faros-provider-infrastructure get pods` and wait for Ready and a fresh heartbeat. Enable Infrastructure in a test workspace, list the Template catalog, and create one disposable flattened `Instance` using the [Infrastructure quickstart](/docs/use/infrastructure/quickstart/).

## Recover

For a failed upgrade, preserve both hub control-plane resources and runtime objects. Inspect kro and provider events, restore the central-kro credential or bootstrap Secret, then verify the Template catalog and one disposable Instance before resuming user workloads.

## Configuration reference

[Chart values](https://github.com/faroshq/faros/blob/main/providers/infrastructure/deploy/chart/values.yaml) are authoritative for this source baseline. Keep the deployed image and chart versions recorded together.
