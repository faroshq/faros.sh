---
title: "Self-host App Studio"
description: "Deployment prerequisites, verification, and recovery for App Studio."
weight: 10
doc_type: "Guide"
---

## Install

Follow [the common provider installation flow](/docs/self-hosting/providers/) to obtain a scoped kubeconfig and generated installation commands. Use the [chart instructions](https://github.com/faroshq/faros/blob/main/providers/app-studio/deploy/chart/README.md) for required values, Secret keys, and chart coordinates.

## Provider requirements

Configure durable Postgres message storage and retain its encryption keys. Review project file persistence and repository recovery. The reviewed chart requires one replica because browser ownership is process-local. Configure the public hub URL for private preview authorization. Verify Code and Infrastructure bindings before creating a project.

## Verify and recover

Check the configured liveness/readiness probes, registration heartbeat, and pod events. Enable the provider in a test workspace and complete the [App Studio quickstart](/docs/use/app-studio/quickstart/).

For a failed upgrade, preserve logs and resource conditions. Restore state with the datastore’s supported procedure and verify credentials, bindings, and schema compatibility before allowing users back in. See [operations and recovery](/docs/self-hosting/operations/).

## Configuration reference

[Chart values](https://github.com/faroshq/faros/blob/main/providers/app-studio/deploy/chart/values.yaml) are authoritative for this source baseline. Keep the deployed image and chart versions recorded together.
