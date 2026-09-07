---
title: "The Faros platform"
description: "Manage applications, agents, and infrastructure with isolated workspaces, provider APIs, and MCP tools in the Faros control plane."
layout: marketing-hub
hero:
  eyebrow: "Platform"
  summary: "Faros brings applications, agents, and infrastructure into one control plane. Organize resources in isolated workspaces, add capabilities through providers, and give people and agents access through familiar tools."
  primary:
    label: "Explore the architecture"
    url: "/docs/get-started/what-is-faros/#how-faros-works"
  secondary:
    label: "Try the quickstart"
    url: "/docs/use/edges/quickstart/"
sections:
  - id: "interfaces"
    eyebrow: "Access and automation"
    title: "Work with the tools you already use."
    summary: "Use the portal for everyday work, APIs and controllers for automation, and MCP for agents. Each connects to resources in a Faros workspace."
    cards:
      - kicker: "For people"
        title: "Portal and CLI"
        summary: "Browse and manage resources in the portal. Use kubectl-faros to switch workspaces, connect to edges, open SSH sessions, and configure MCP clients."
        points:
          - "Select an organization and workspace"
          - "Manage resources through provider interfaces"
          - "Connect from your terminal"
        url: "/docs/reference/cli/"
        link_label: "Browse CLI commands"
      - kicker: "For automation"
        title: "APIs and controllers"
        summary: "Providers publish Kubernetes-style APIs into workspaces. Their controllers watch resources and reconcile changes, so you can manage platform capabilities declaratively."
        points:
          - "Declare resources through APIs"
          - "Automate changes with controllers"
          - "Apply workspace permissions"
        url: "/docs/extend/api/"
        link_label: "Read the API model"
      - kicker: "For agents"
        title: "MCP tools"
        summary: "Connect agents to provider tools through a workspace MCP endpoint. The endpoint authenticates with its own service account, which determines access independently of your personal session."
        points:
          - "Discover tools from enabled providers"
          - "Authenticate with an MCPServer service account"
          - "Use tools within the selected workspace"
        url: "/docs/extend/mcp/"
        link_label: "Read the MCP integration guide"
  - id: "capabilities"
    eyebrow: "Provider catalog"
    title: "Choose the providers you need."
    summary: "Faros includes providers for applications, agents, data, and infrastructure. Enable them in a workspace or build a provider for your own systems."
    cards:
      - kicker: "Build and run"
        title: "Applications and code"
        summary: "Deploy applications from templates and connect source repositories. Track application instances, builds, and packages as workspace resources."
        url: "/docs/use/infrastructure/"
        link_label: "Explore application templates"
      - kicker: "AI workflows"
        title: "Agents and App Studio"
        summary: "Run hosted agents with tools and schedules. In App Studio, develop applications with an assistant, a repository, and a live development environment."
        url: "/docs/use/agents/"
        link_label: "Explore hosted agents"
      - kicker: "Operate anywhere"
        title: "Edges and fleet query"
        summary: "Connect Kubernetes clusters and Linux servers through outbound tunnels. Use fleet query to inspect Kubernetes objects and their relationships across connected clusters."
        url: "/docs/use/edges/"
        link_label: "Explore edges"
closing:
  eyebrow: "Go deeper"
  title: "Understand how Faros works."
  summary: "Follow a request through the control plane, or browse the provider catalog to see the APIs, tools, and interfaces available to your workspace."
  primary:
    label: "Read the concepts guide"
    url: "/docs/get-started/what-is-faros/#how-faros-works"
  secondary:
    label: "Browse the provider catalog"
    url: "/docs/use/"
---
