---
title: "Edges"
description: "Connect clusters, servers, and services."
weight: 12
doc_type: "Overview"
provider: "edges"
cascade:
  provider: edges
---

Edges connects existing Kubernetes clusters, servers, and services to Faros. An agent on the target initiates an outbound connection to the hub, giving you a shared route to infrastructure that may live in different networks.

[Get started: connect a cluster or server](/docs/use/edges/quickstart/).

## When to use Edges

Use Edges when you need kubectl access to a connected cluster, SSH access to a server, or access to a service through the hub. You keep the target infrastructure and install the agent needed to connect it.

## How it fits together

Edges supplies connectivity. Kuery can use connected Kubernetes clusters for fleet queries, while clients and tools use the interfaces exposed by your deployment.

## Before you start

Edges enabled; permission to register an edge and install an agent on the target. Select the workspace where you intend to create or use resources. [Enable the provider](/docs/use/workspaces/enable-provider/) if needed.

## Availability and permissions

Check your hub’s catalog and deployed versions. Actions are subject to workspace access and provider-specific authorization; connected services also enforce their own permissions.

## Where your data lives

Edge resources belong to your workspace. Workloads run on connected targets; service credentials are resolved by the provider.

## Start here

- [Quickstart](/docs/use/edges/quickstart/)
- [Troubleshooting](/docs/use/edges/troubleshooting/)
- [API reference](/docs/reference/providers/edges/)
- [Self-host Edges](/docs/self-hosting/providers/edges/)

[Implementation reference](https://github.com/faroshq/faros/blob/main/providers/edges/README.md).
