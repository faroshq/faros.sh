---
title: "App Studio"
description: "Build and publish applications."
weight: 10
doc_type: "Overview"
provider: "app-studio"
cascade:
  provider: app-studio
---

App Studio brings AI-assisted development into a project with a repository, a development environment, and a path to publishing. Use it to turn an application idea into code you can inspect, preview, and run.

[Get started: build and publish an application](/docs/use/app-studio/quickstart/).

## When to use App Studio

Build a new application with an assistant, continue work across project sessions, or connect an application to data through a provider such as Databricks. A development preview lets you try changes before preparing a production deployment.

## How it fits together

Code connects the project to its repository. Infrastructure supplies the template-based development and production environments. App Studio brings those resources into the application workflow.

## Before you start

App Studio, Code, and Infrastructure enabled; a configured model and a development-capable template. Select the workspace where you intend to create or use resources. [Enable the provider](/docs/use/workspaces/enable-provider/) if needed.

## Availability and permissions

Check your hub’s catalog and deployed versions. Actions are subject to workspace access and provider-specific authorization; connected services also enforce their own permissions.

## Where your data lives

Projects, Sessions, and Studios are workspace resources. Conversations use the provider message store; files and development workloads use the configured runtime and repository.

## Start here

- [Quickstart](/docs/use/app-studio/quickstart/)
- [Troubleshooting](/docs/use/app-studio/troubleshooting/)
- [API reference](/docs/reference/providers/app-studio/)
- [Self-host App Studio](/docs/self-hosting/providers/app-studio/)

[Implementation reference](https://github.com/faroshq/faros/blob/main/providers/app-studio/README.md).
