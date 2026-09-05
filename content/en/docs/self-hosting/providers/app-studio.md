---
title: "Self-host App Studio"
description: "Deployment prerequisites, verification, and recovery for App Studio."
weight: 10
doc_type: "Guide"
---

## Prerequisites

You need a Kubernetes runtime you administer, Helm, network access from the provider runtime to the hub and advertised virtual-workspace endpoints, and permission to onboard this provider. Use the [common provider flow](/docs/self-hosting/providers/) to obtain the workspace kubeconfig. The examples below use a Secret named `faros-provider-kubeconfig` with data key `kubeconfig`; the generated onboarding command is authoritative for your hub.

## Install

```bash
kubectl create namespace faros-provider-app-studio
kubectl --namespace faros-provider-app-studio create secret generic faros-provider-kubeconfig \
  --from-file=kubeconfig=./app-studio.kubeconfig

helm upgrade --install app-studio oci://ghcr.io/faroshq/charts/faros-app-studio-provider \
  --namespace faros-provider-app-studio \
  --set hub.url=https://faros.example.com \
  --set providerKubeconfig.secretName=faros-provider-kubeconfig \
  --set catalogEntry.enabled=true
```

The chart README contains the matching values table and image coordinates for the deployed source version: [chart instructions](https://github.com/faroshq/faros/blob/main/providers/app-studio/deploy/chart/README.md). Replace the placeholder kubeconfig and hub URL; do not put bearer tokens or database URLs directly in a production values file.

## Provider requirements

Use exactly one replica (`replicaCount=1`) because browser ownership is process-local. Configure durable storage with a Secret such as `app-studio-postgres`, key `database-url`, and set `store.databaseURLSecretRef.name=app-studio-postgres`. Set `hub.publicURL` to the browser-reachable hub origin; it may differ from the in-cluster `hub.url`.

## Verify

Run `kubectl -n faros-provider-app-studio get pods` and wait for Ready and a fresh heartbeat. Enable App Studio in a test workspace, verify Code and Infrastructure are enabled, then follow the [App Studio quickstart](/docs/use/app-studio/quickstart/).

## Recover

For a failed upgrade, preserve project and message data, inspect pod events and logs, and restore Postgres before retrying. Keep `replicaCount=1`; verify credentials, provider bindings, and a disposable preview before returning the provider to users.

## Configuration reference

[Chart values](https://github.com/faroshq/faros/blob/main/providers/app-studio/deploy/chart/values.yaml) are authoritative for this source baseline. Keep the deployed image and chart versions recorded together.
