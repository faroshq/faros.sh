---
title: "Self-host Edges"
description: "Deployment prerequisites, verification, and recovery for Edges."
weight: 10
doc_type: "Guide"
---

## Install

Follow [the common provider installation flow](/docs/self-hosting/providers/) to obtain a scoped kubeconfig and generated installation commands. Use the [chart instructions](https://github.com/faroshq/faros/blob/main/providers/edges/deploy/chart/README.md) for required values, Secret keys, and chart coordinates.

## Provider requirements

The chart defaults to one replica but supports Lease-based tunnel ownership and replica-to-replica relay. Preserve the chart’s internal relay wiring and provider credential configuration when scaling. Verify that an agent reconnects and kubectl/SSH still work after a pod restart.

## Verify and recover

Check the configured liveness/readiness probes, registration heartbeat, and pod events. Enable the provider in a test workspace and complete the [Edges quickstart](/docs/use/edges/quickstart/).

For a failed upgrade, preserve logs and resource conditions. Restore state with the datastore’s supported procedure and verify credentials, bindings, and schema compatibility before allowing users back in. See [operations and recovery](/docs/self-hosting/hub/operations/).

## Configuration reference

[Chart values](https://github.com/faroshq/faros/blob/main/providers/edges/deploy/chart/values.yaml) are authoritative for this source baseline. Keep the deployed image and chart versions recorded together.
