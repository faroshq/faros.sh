---
title: "Self-host AI agents"
description: "Deployment prerequisites, verification, and recovery for AI agents."
weight: 10
doc_type: "Guide"
---

## Install

Follow [the common provider installation flow](/docs/self-hosting/providers/) to obtain a scoped kubeconfig and generated installation commands. Use the [chart instructions](https://github.com/faroshq/faros/blob/main/providers/agents/deploy/chart/README.md) for required values, Secret keys, and chart coordinates.

## Provider requirements

Configure Postgres using `store.databaseURLSecretRef`. Retain conversation, run, and memory data according to your policy. Infrastructure is optional for compute-backed tools. During recovery, inspect scheduled work before re-enabling it to avoid unintended repeats.

## Verify and recover

Check the configured liveness/readiness probes, registration heartbeat, and pod events. Enable the provider in a test workspace and complete the [AI agents quickstart](/docs/use/agents/quickstart/).

For a failed upgrade, preserve logs and resource conditions. Restore state with the datastore’s supported procedure and verify credentials, bindings, and schema compatibility before allowing users back in. See [operations and recovery](/docs/self-hosting/operations/).

## Configuration reference

[Chart values](https://github.com/faroshq/faros/blob/main/providers/agents/deploy/chart/values.yaml) are authoritative for this source baseline. Keep the deployed image and chart versions recorded together.
