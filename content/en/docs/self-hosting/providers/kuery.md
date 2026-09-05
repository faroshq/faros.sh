---
title: "Self-host Kuery"
description: "Deployment prerequisites, verification, and recovery for Kuery."
weight: 10
doc_type: "Guide"
---

## Prerequisites

You need a Kubernetes runtime you administer, Helm, network access from the provider runtime to the hub and advertised virtual-workspace endpoints, and permission to onboard this provider. Use the [common provider flow](/docs/self-hosting/providers/) to obtain the workspace kubeconfig. The examples below use a Secret named `faros-provider-kubeconfig` with data key `kubeconfig`; the generated onboarding command is authoritative for your hub.

## Install

```bash
kubectl create namespace faros-provider-kuery
kubectl --namespace faros-provider-kuery create secret generic faros-provider-kubeconfig \
  --from-file=kubeconfig=./kuery.kubeconfig

helm upgrade --install kuery oci://ghcr.io/faroshq/charts/faros-kuery-provider \
  --namespace faros-provider-kuery \
  --set hub.url=https://faros.example.com \
  --set providerKubeconfig.secretName=faros-provider-kubeconfig \
  --set catalogEntry.enabled=true
```

The chart README contains the matching values table and image coordinates for the deployed source version: [chart instructions](https://github.com/faroshq/faros/blob/main/providers/kuery/deploy/chart/README.md). Replace the placeholder kubeconfig and hub URL; do not put bearer tokens or database URLs directly in a production values file.

## Provider requirements

SQLite is the default and requires the chart PVC; it is not a multi-replica production store. For shared production storage, set `store.driver=postgres`, set `store.dsn` to the connection string, disable `store.persistence.enabled`, and size resources for the number of engaged edges. Review `sync.whitelist` and `sync.blacklist` before enabling inventory sync.

## Verify

Run `kubectl -n faros-provider-kuery get pods` and wait for Ready and a fresh heartbeat. Enable Kuery in a test workspace, connect a disposable edge, and verify engagement, whitelist behavior, and synchronization using the [Kuery quickstart](/docs/use/kuery/quickstart/).

## Recover

For a failed rollout, preserve the SQLite PVC or Postgres data before changing storage settings. Inspect edge engagement and sync logs, restore the original driver/DSN, and verify one edge’s inventory before expanding the fleet.

## Configuration reference

[Chart values](https://github.com/faroshq/faros/blob/main/providers/kuery/deploy/chart/values.yaml) are authoritative for this source baseline. Keep the deployed image and chart versions recorded together.
