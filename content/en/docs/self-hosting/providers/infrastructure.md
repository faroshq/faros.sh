---
title: "Self-host Infrastructure"
description: "Deployment prerequisites, verification, and recovery for Infrastructure."
weight: 10
doc_type: "Guide"
---

## Install

Follow [the common provider installation flow](/docs/self-hosting/providers/) to obtain a scoped kubeconfig and generated installation commands. Use the [chart instructions](https://github.com/faroshq/faros/blob/main/providers/infrastructure/deploy/chart/README.md) for required values, Secret keys, and chart coordinates.

## Provider requirements

The recommended operator manages kro and the provider serving deployment. Review its cluster-level permissions and target runtime before installation. Back up both control-plane resources and runtime/application data. Verify the Template catalog and create a disposable Instance after changes.

## Verify and recover

Check the configured liveness/readiness probes, registration heartbeat, and pod events. Enable the provider in a test workspace and complete the [Infrastructure quickstart](/docs/use/infrastructure/quickstart/).

For a failed upgrade, preserve logs and resource conditions. Restore state with the datastore’s supported procedure and verify credentials, bindings, and schema compatibility before allowing users back in. See [operations and recovery](/docs/self-hosting/hub/operations/).

## Configuration reference

[Chart values](https://github.com/faroshq/faros/blob/main/providers/infrastructure/deploy/chart/values.yaml) are authoritative for this source baseline. Keep the deployed image and chart versions recorded together.
