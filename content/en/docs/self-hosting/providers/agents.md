---
title: "Self-host AI agents"
description: "Deployment prerequisites, verification, and recovery for AI agents."
weight: 10
doc_type: "Guide"
---

## Prerequisites

You need a Kubernetes runtime you administer, Helm, network access from the provider runtime to the hub and advertised virtual-workspace endpoints, and permission to onboard this provider. Use the [common provider flow](/docs/self-hosting/providers/) to obtain the workspace kubeconfig. The examples below use a Secret named `faros-provider-kubeconfig` with data key `kubeconfig`; the generated onboarding command is authoritative for your hub.

## Install

```bash
kubectl create namespace faros-provider-agents
kubectl --namespace faros-provider-agents create secret generic faros-provider-kubeconfig \
  --from-file=kubeconfig=./agents.kubeconfig

helm upgrade --install agents oci://ghcr.io/faroshq/charts/faros-agents-provider \
  --namespace faros-provider-agents \
  --set hub.url=https://faros.example.com \
  --set providerKubeconfig.secretName=faros-provider-kubeconfig \
  --set catalogEntry.enabled=true
```

The chart README contains the matching values table and image coordinates for the deployed source version: [chart instructions](https://github.com/faroshq/faros/blob/main/providers/agents/deploy/chart/README.md). Replace the placeholder kubeconfig and hub URL; do not put bearer tokens or database URLs directly in a production values file.

## Provider requirements

Postgres is required for durable conversations, runs, and memory. Create a Secret named `agents-postgres` with key `database-url`, then set `store.databaseURLSecretRef.name=agents-postgres` and leave `store.inMemoryStore=false`. Add `envFromSecret` when the provider needs model or channel credentials.

## Verify

Run `kubectl -n faros-provider-agents get pods` and wait for Ready, then confirm a fresh catalog heartbeat in the hub. Enable Agents in a test workspace and follow the [AI agents quickstart](/docs/use/agents/quickstart/).

## Recover

If a rollout fails, keep the previous chart/image and inspect pod events and provider logs before changing the database. Restore Postgres from its supported backup, verify the Secret key and schema compatibility, then re-enable scheduled work.

## Configuration reference

[Chart values](https://github.com/faroshq/faros/blob/main/providers/agents/deploy/chart/values.yaml) are authoritative for this source baseline. Keep the deployed image and chart versions recorded together.
