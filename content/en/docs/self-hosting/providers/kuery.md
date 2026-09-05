---
title: "Self-host Kuery"
description: "Deployment prerequisites, verification, and recovery for Kuery."
weight: 10
doc_type: "Guide"
---

## Install

Follow [the common provider installation flow](/docs/self-hosting/providers/) to obtain a scoped kubeconfig and generated installation commands. Use the [chart instructions](https://github.com/faroshq/faros/blob/main/providers/kuery/deploy/chart/README.md) for required values, Secret keys, and chart coordinates.

## Provider requirements

The default SQLite store uses persistent storage and cannot be scaled by increasing replicas. Review the Postgres option and chart constraints before scaling. Verify edge engagement, whitelist settings, and synchronization before trusting inventory results.

## Verify and recover

Check the configured liveness/readiness probes, registration heartbeat, and pod events. Enable the provider in a test workspace and complete the [Kuery quickstart](/docs/use/kuery/quickstart/).

For a failed upgrade, preserve logs and resource conditions. Restore state with the datastore’s supported procedure and verify credentials, bindings, and schema compatibility before allowing users back in. See [operations and recovery](/docs/self-hosting/operations/).

## Configuration reference

[Chart values](https://github.com/faroshq/faros/blob/main/providers/kuery/deploy/chart/values.yaml) are authoritative for this source baseline. Keep the deployed image and chart versions recorded together.
