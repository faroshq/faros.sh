---
title: "What is Faros?"
description: "Understand what Faros brings together, when to use it, and how to get started."
weight: 1
doc_type: "Concept"
---

Faros is an open-source control plane for applications, AI agents, and infrastructure. It brings capabilities such as application development, GitHub repositories, compute environments, and connected clusters into shared workspaces. People and automation can work with those resources through the console, CLI, APIs, and MCP tools.

These docs are for people building applications and agents, teams managing infrastructure, and operators providing a platform for others. You can begin with a single capability; you do not need to understand or enable every provider.

## Get started with Faros

Choose a task that matches what you want to accomplish:

- [Build and publish an application](/docs/use/app-studio/quickstart/): create a project, work with an assistant, test a preview, and prepare a deployment.
- [Create an AI agent](/docs/use/agents/quickstart/): configure a model and instructions, then verify the first response.
- [Connect a cluster or server](/docs/use/edges/quickstart/): register an edge and verify access through the hub.

These tutorials assume access to a hub. Your administrator can confirm the providers, connections, and permissions available in your workspace. If you are responsible for installing Faros, start with [Self-hosting](/docs/self-hosting/).

## When to use Faros

Faros is useful when a task crosses the boundaries between application code, AI tools, and the systems they use. For example, you might want to build an application against an existing data source, give an agent access to selected tools, or inspect resources across connected Kubernetes clusters.

| What you need | How Faros helps | Where to begin |
| --- | --- | --- |
| Develop an application with an AI assistant | App Studio connects project conversations to repositories, development environments, previews, and publishing workflows. | [App Studio](/docs/use/app-studio/) |
| Run repeatable work with an agent | Configure instructions and tools, inspect runs, and add schedules or triggers when the task works. | [AI agents](/docs/use/agents/) |
| Reach infrastructure from a shared entry point | Edge agents connect outward to the hub; use those connections to access clusters, servers, and services. | [Edges](/docs/use/edges/) |
| Offer reusable environments to a team | Templates define the resources people can request; instances track the resulting environments. | [Infrastructure](/docs/use/infrastructure/) |
| Combine capabilities without giving every user every permission | Organize people and resources in workspaces, then configure membership, provider access, and service credentials. | [Administration](/docs/administration/) |

Faros coordinates these systems; repositories still live in GitHub, source tables remain in Databricks, and workloads run in the configured infrastructure. Each provider overview explains its dependencies and data storage.

## How Faros works

The **hub** is the shared control plane. It handles identity and workspace routing and connects requests to the providers installed by an operator.

An **organization** groups people and workspaces. A **workspace** is the context in which you create resources and use enabled capabilities. Selecting the intended workspace matters whether you are using the console, a CLI command, or an agent.

A **provider** adds a capability: its resource APIs, controllers, and, where implemented, console views and MCP tools. Providers can be enabled independently. App Studio, for example, uses Code and Infrastructure to connect application work to repositories and runtime environments. Edges connects existing clusters and servers through an agent that initiates an outbound connection to the hub.

Read [organizations, workspaces, and providers](/docs/get-started/workspaces/) for an introduction to these boundaries, or [Concepts](/docs/concepts/) for the shared platform model.

## Choose how you work

Use the **console** for interactive application and agent workflows. Use the **CLI** for terminal workflows, workspace selection, and edge connectivity. Connect an **external AI assistant through MCP** when you want it to discover and use tools exposed by your enabled providers. Each interface operates with its configured identity and authorization; connecting an assistant does not grant it unrestricted access.

Operators install and run the hub and providers. Provider authors extend the platform with new APIs, interfaces, and tools. These responsibilities have separate guides under [Self-hosting](/docs/self-hosting/) and [Extend Faros](/docs/extend/).

## Next steps

[Complete your first task](/docs/get-started/first-task/), [browse the available capabilities](/docs/use/), or follow [an application workflow using Databricks data](/docs/use/app-studio/databricks/) to see multiple providers working together.
