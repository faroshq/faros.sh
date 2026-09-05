---
title: "Self-host Databricks"
description: "Deployment prerequisites, verification, and recovery for Databricks."
weight: 10
doc_type: "Guide"
---

## Prerequisites

You need a Kubernetes runtime you administer, Helm, network access from the provider runtime to the hub and advertised virtual-workspace endpoints, and permission to onboard this provider. Use the [common provider flow](/docs/self-hosting/providers/) to obtain the workspace kubeconfig. The examples below use a Secret named `faros-provider-kubeconfig` with data key `kubeconfig`; the generated onboarding command is authoritative for your hub.

## Install

```bash
kubectl create namespace faros-provider-databricks
kubectl --namespace faros-provider-databricks create secret generic faros-provider-kubeconfig \
  --from-file=kubeconfig=./databricks.kubeconfig

helm upgrade --install databricks oci://ghcr.io/faroshq/charts/faros-databricks-provider \
  --namespace faros-provider-databricks \
  --set hub.url=https://faros.example.com \
  --set providerKubeconfig.secretName=faros-provider-kubeconfig \
  --set catalogEntry.enabled=true
```

The chart README contains the matching values table and image coordinates for the deployed source version: [chart instructions](https://github.com/faroshq/faros/blob/main/providers/databricks/deploy/chart/README.md). Replace the placeholder kubeconfig and hub URL; do not put bearer tokens or database URLs directly in a production values file.

## Provider requirements

Use `controller.mode=required` for production so Connection → Warehouse → Table dependencies gate readiness. The default `bootstrap.enabled=true` and `bootstrap.mode=init` uses the provider kubeconfig Secret and applies the CatalogEntry; use `bootstrap.mode=external` only when a separate operator or GitOps process owns bootstrap.

## Verify

Run `kubectl -n faros-provider-databricks get pods` and inspect `/readyz` through the provider Service. In a test workspace, confirm Connection, Warehouse, and Table conditions, run one bounded query, and follow the [Databricks quickstart](/docs/use/databricks/quickstart/).

## Recover

For a failed rollout, first check controller events and dependency conditions. Do not switch to `rest-only` as a recovery shortcut unless that mode is intentional; restore the bootstrap Secret or external bootstrap resource, then verify the heartbeat and a bounded query.

## Configuration reference

[Chart values](https://github.com/faroshq/faros/blob/main/providers/databricks/deploy/chart/values.yaml) are authoritative for this source baseline. Keep the deployed image and chart versions recorded together.
