---
title: "Infrastructure"
description: "Provision and manage template-based resources."
weight: 13
doc_type: "Overview"
provider: "infrastructure"
cascade:
  provider: infrastructure
---

Infrastructure turns reusable templates into environments that people and other providers can request. A template defines the available configuration; an instance records the requested resource and its lifecycle.

[Get started: create your first instance](/docs/use/infrastructure/quickstart/).

## When to use Infrastructure

Use Infrastructure to offer a repeatable environment instead of asking each user to assemble it from scratch. The templates installed by your operator determine the runtimes and configuration you can request.

## How it fits together

App Studio uses Infrastructure for development and production environments. AI agents can use it for compute-backed tools and file workspaces. Template authors define the underlying provisioning behavior.

## Before you start

Infrastructure enabled and a template made available by the platform operator. Select the workspace where you intend to create or use resources. [Enable the provider](/docs/use/enable-provider/) if needed.

## Availability and permissions

Check your hub’s catalog and deployed versions. Actions are subject to workspace access and provider-specific authorization; connected services also enforce their own permissions.

## Where your data lives

Templates describe the catalog. Instances belong to your workspace; the provider provisions workloads in its configured runtime cluster.

## Start here

- [Quickstart](/docs/use/infrastructure/quickstart/)
- [Troubleshooting](/docs/use/infrastructure/troubleshooting/)
- [API reference](/docs/use/infrastructure/reference/)
- [Self-host Infrastructure](/docs/self-hosting/providers/infrastructure/)

[Implementation reference](https://github.com/faroshq/faros/blob/main/providers/infrastructure/apis/v1alpha1/types_instance.go).
