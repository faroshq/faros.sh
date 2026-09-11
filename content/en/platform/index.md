---
title: "The Faros Platform — Build on Your Company’s Systems"
description: "Give teams a shared foundation for AI-built apps and agents. Connect company data, tools, and infrastructure with Faros workspaces and extensible providers."
layout: marketing-hub
hero:
  eyebrow: "Platform"
  headline: "A shared foundation for AI-built apps and agents."
  summary: "Connect company data, tools, and infrastructure. Make those capabilities available in workspaces where teams can build and publish applications, run agents, and put your company’s systems to work."
  primary:
    label: "Request a demo"
    url: "/contact/"
  secondary:
    label: "Read the app-building guide"
    url: "/docs/use/app-studio/quickstart/"
sections:
  - id: "reuse"
    eyebrow: "From company data to working apps"
    title: "One company connection. A starting point for more apps."
    summary: "Make a Databricks table available in a workspace. A team connects its project, asks App Studio to build a dashboard, and reviews the result before publishing."
    body: "Another project can use the same imported table through its own access grant. The underlying connection is reused; access is assigned to each application."
    primary:
      label: "See the data-to-app guide"
      url: "/docs/use/app-studio/databricks/"
  - id: "teams"
    eyebrow: "For platform teams and builders"
    title: "Make company data, tools, and environments available."
    summary: "Your platform team configures the connections, templates, and capabilities available in each workspace. Teams use them to build applications and run recurring AI tasks."
    comparison:
      label: "What platform teams provide and how teams use it"
      headers:
        - "Platform teams provide"
        - "Teams use it to"
      rows:
        - resource: "Data connections and service integrations"
          outcome: "Build apps using company resources"
        - resource: "Development and runtime templates"
          outcome: "Preview and publish applications"
        - resource: "Workspace capabilities and available tools"
          outcome: "Configure agents for recurring tasks"
    primary:
      label: "Explore apps and agents"
      url: "/docs/use/"
  - id: "providers"
    eyebrow: "Extend the foundation"
    title: "Connect your own services through providers."
    summary: "Bring an internal service into Faros and make it available to the workspaces that need it. Providers can supply resource APIs, portal interfaces, tools for AI assistants, and actions that applications can call. Your team implements the service integration; Faros supplies the framework for making it available."
    primary:
      label: "Explore provider development"
      url: "/developers/"
  - id: "deployment"
    eyebrow: "Deployment and operations"
    title: "Choose where Faros runs and who operates it."
    summary: "Run Faros yourself or talk to us about a Faros-operated control plane. Choose where providers and workloads run to fit your company’s infrastructure and operating requirements."
    cards:
      - title: "Operate Faros yourself"
        summary: "Deploy the open-source platform on your Kubernetes infrastructure. Your team manages configuration, upgrades, storage, and operations."
        url: "/docs/self-hosting/"
        link_label: "Explore self-hosting"
      - title: "Bring your own providers"
        summary: "Operate providers that connect to your company’s services and infrastructure. Register them with Faros and make their capabilities available to selected workspaces."
        url: "/docs/self-hosting/providers/"
        link_label: "Explore provider hosting"
      - title: "Work with the Faros team"
        summary: "Discuss a hosted control plane, deployment help, or an initial rollout. Start with the applications your teams want to build and the systems they need to use."
        url: "/contact/"
        link_label: "Discuss deployment options"
closing:
  eyebrow: "Get started"
  title: "Bring your first use case."
  summary: "Tell us what your teams want to build and which company systems they need. We’ll discuss the integrations, deployment, and setup involved."
  primary:
    label: "Request a demo"
    url: "/contact/"
  secondary:
    label: "Explore the architecture"
    url: "/docs/get-started/what-is-faros/#how-faros-works"
---
