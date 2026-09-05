---
title: "AI agents"
description: "Run assistants with tools, memory, and schedules."
weight: 11
doc_type: "Overview"
provider: "agents"
cascade:
  provider: agents
---

AI agents lets you configure assistants as workspace resources: choose a model, give the agent instructions and tools, and inspect the work it performs. Move from an interactive conversation to scheduled or event-driven tasks after verifying the behavior.

[Get started: create an ai agent](/docs/use/agents/quickstart/).

## When to use AI agents

Use an agent for repeatable tasks that need model reasoning and access to selected tools. Configure memory, approvals, budgets, and connections to suit the task rather than assuming every agent should have the same access.

## How it fits together

Agents use configured model connections and available tools. Infrastructure is optional when a tool or file workspace needs compute. External MCP connections can make additional tools available.

## Before you start

AI agents enabled and a configured model connection. Infrastructure is optional for compute-backed tools and file workspaces. Select the workspace where you intend to create or use resources. [Enable the provider](/docs/use/workspaces/enable-provider/) if needed.

## Availability and permissions

Check your hub’s catalog and deployed versions. Actions are subject to workspace access and provider-specific authorization; connected services also enforce their own permissions.

## Where your data lives

Agent configuration belongs to your workspace. Conversations, runs, and durable memory use the provider’s Postgres store; channel credentials are managed by the provider.

## Start here

- [Quickstart](/docs/use/agents/quickstart/)
- [Troubleshooting](/docs/use/agents/troubleshooting/)
- [API reference](/docs/reference/providers/agents/)
- [Self-host AI agents](/docs/self-hosting/providers/agents/)

[Implementation reference](https://github.com/faroshq/faros/blob/main/providers/agents/README.md).
