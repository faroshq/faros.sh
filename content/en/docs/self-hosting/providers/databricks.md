---
title: "Self-host Databricks"
description: "Deployment prerequisites, verification, and recovery for Databricks."
weight: 10
doc_type: "Guide"
---

## Install

Follow [the common provider installation flow](/docs/self-hosting/providers/) to obtain a scoped kubeconfig and generated installation commands. Use the [chart instructions](https://github.com/faroshq/faros/blob/main/providers/databricks/deploy/chart/README.md) for required values, Secret keys, and chart coordinates.

## Provider requirements

Configure the provider kubeconfig and bootstrap ownership. With the required controller mode, readiness remains unavailable until dependencies are usable. Verify Connection, Warehouse, and Table conditions and a bounded query after installation.

## Verify and recover

Check the configured liveness/readiness probes, registration heartbeat, and pod events. Enable the provider in a test workspace and complete the [Databricks quickstart](/docs/use/databricks/quickstart/).

For a failed upgrade, preserve logs and resource conditions. Restore state with the datastore’s supported procedure and verify credentials, bindings, and schema compatibility before allowing users back in. See [operations and recovery](/docs/self-hosting/operations/).

## Configuration reference

[Chart values](https://github.com/faroshq/faros/blob/main/providers/databricks/deploy/chart/values.yaml) are authoritative for this source baseline. Keep the deployed image and chart versions recorded together.
