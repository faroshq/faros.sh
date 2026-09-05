---
title: "Self-host Edges"
description: "Deployment prerequisites, verification, and recovery for Edges."
weight: 10
doc_type: "Guide"
---

## Prerequisites

You need a Kubernetes runtime you administer, Helm, network access from the provider runtime to the hub and advertised virtual-workspace endpoints, and permission to onboard this provider. Use the [common provider flow](/docs/self-hosting/providers/) to obtain the workspace kubeconfig. The examples below use a Secret named `faros-provider-kubeconfig` with data key `kubeconfig`; the generated onboarding command is authoritative for your hub.

## Install

```bash
kubectl create namespace faros-provider-edges
kubectl --namespace faros-provider-edges create secret generic faros-provider-kubeconfig \
  --from-file=kubeconfig=./edges.kubeconfig

helm upgrade --install edges oci://ghcr.io/faroshq/charts/faros-edges-provider \
  --namespace faros-provider-edges \
  --set hub.url=https://faros.example.com \
  --set providerKubeconfig.secretName=faros-provider-kubeconfig \
  --set catalogEntry.enabled=true
```

The chart README contains the matching values table and image coordinates for the deployed source version: [chart instructions](https://github.com/faroshq/faros/blob/main/providers/edges/deploy/chart/README.md). Replace the placeholder kubeconfig and hub URL; do not put bearer tokens or database URLs directly in a production values file.

## Provider requirements

Keep the default one replica unless you have verified the Lease registry and pod-to-pod relay path. If scaling, preserve `internalPort` and the provider workspace credential; agents connect to one replica and other replicas relay to its owner. Configure `hub.externalURL` when agents cannot reach the internal hub URL.

## Verify

Run `kubectl -n faros-provider-edges get pods` and wait for Ready and a fresh heartbeat. Enable Edges in a test workspace, connect one disposable agent, and verify reconnect plus kubectl/SSH after a pod restart using the [Edges quickstart](/docs/use/edges/quickstart/).

## Recover

For a failed upgrade, preserve agent join state and inspect Lease/relay logs before deleting pods. Roll back the chart/image, verify the internal listener is reachable between replicas, and reconnect one test agent before restoring normal traffic.

## Configuration reference

[Chart values](https://github.com/faroshq/faros/blob/main/providers/edges/deploy/chart/values.yaml) are authoritative for this source baseline. Keep the deployed image and chart versions recorded together.
