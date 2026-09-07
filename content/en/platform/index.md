---
title: "The Faros platform"
description: "How Faros combines isolated workspaces, extensible providers, workspace-scoped MCP tools, and outbound-connected edges in one control plane."
layout: marketing-hub
hero:
  eyebrow: "Platform"
  summary: "Faros gives developers, agents, and platform teams one resource model for building and operating systems. Its core primitives stay the same whether you use the hosted service or run the open-source control plane yourself."
  primary:
    label: "Explore the architecture"
    url: "/docs/get-started/what-is-faros/#how-faros-works"
  secondary:
    label: "Follow the quickstart"
    url: "/docs/use/edges/quickstart/"
sections:
  - id: "interfaces"
    eyebrow: "One resource model"
    title: "Different interfaces reach the same live resources."
    summary: "The portal, command line, APIs, controllers, and MCP are interfaces over the platform—not separate inventories with separate policy."
    cards:
      - kicker: "For people"
        title: "Portal and CLI"
        summary: "Developers can discover and operate resources through the portal or use kubectl-faros for workspace, edge, SSH, and MCP workflows."
        points:
          - "Workspace-aware commands"
          - "Live provider surfaces"
          - "The same resources visible through APIs"
        url: "/docs/reference/cli/"
        link_label: "Browse CLI commands"
      - kicker: "For automation"
        title: "APIs and controllers"
        summary: "Providers publish Kubernetes-style APIs into tenant workspaces and reconcile resources across those workspaces through virtual workspaces."
        points:
          - "APIExport and APIBinding"
          - "Provider-owned reconciliation"
          - "Workspace-scoped identity"
        url: "/docs/extend/api/"
        link_label: "Read the API model"
      - kicker: "For agents"
        title: "MCP tools"
        summary: "Agents can use provider tools through one endpoint while staying inside the caller's workspace permissions. Narrow service accounts can reduce that scope further."
        points:
          - "Federated provider tools"
          - "Caller-derived authorization"
          - "No separate gateway policy model"
        url: "/docs/extend/mcp/"
        link_label: "Build MCP tools"
  - id: "capabilities"
    eyebrow: "Provider catalog"
    title: "Start with capabilities that already ship."
    summary: "The repository includes providers for edge connectivity, application templates, code, hosted agents, App Studio, fleet query, Databricks resources, and a quickstart provider scaffold."
    cards:
      - kicker: "Build and run"
        title: "Applications and code"
        summary: "Provision application templates as workspace resources, connect source repositories, and keep build and package state visible to the platform."
        url: "/docs/use/infrastructure/"
        link_label: "See application capabilities"
      - kicker: "AI workflows"
        title: "Agents and App Studio"
        summary: "Run persistent hosted agents or use project workspaces that combine an assistant, a repository, and a live development environment."
        url: "/docs/use/agents/"
        link_label: "See agent capabilities"
      - kicker: "Operate anywhere"
        title: "Edges and fleet query"
        summary: "Reach Kubernetes clusters and Linux servers through outbound tunnels, then query objects and relationships across connected clusters."
        url: "/docs/use/edges/"
        link_label: "See edge capabilities"
closing:
  eyebrow: "Go deeper"
  title: "See the platform as resources, requests, and reconciliation."
  summary: "The concepts guide traces a complete request through Faros. The provider catalog shows the capabilities available in the repository today."
  primary:
    label: "Read the concepts guide"
    url: "/docs/get-started/what-is-faros/#how-faros-works"
  secondary:
    label: "Browse the provider catalog"
    url: "/docs/use/"
---
