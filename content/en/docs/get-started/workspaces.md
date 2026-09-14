---
title: "Find your workspace and navigate the console"
description: "Know where you are working before creating resources."
weight: 4
doc_type: "Guide"
---

An organization groups people and workspaces. A workspace is a Kubernetes-style logical API boundary with its own resources and enabled provider APIs. Select it before operating on resources. Human access depends on membership and authorization; a user can belong to more than one workspace.

A provider adds a capability such as App Studio or Edges. Enabling a provider binds its APIs into the selected workspace.

Read [how Faros works](/docs/get-started/what-is-faros/#how-faros-works) for runtime boundaries, [service accounts and credentials](/docs/administration/service-accounts/) for identity details, or [Administration](/docs/administration/) to create and manage team access.

## Navigate the console

Use the Faros SaaS hub. If your organization self-hosts Faros, use its hub URL and sign-in method instead.

1. Sign in to the console.
2. Use the organization and workspace switcher to select where you want to work.
3. Open **Providers** to inspect the catalog and enabled capabilities.
4. Open an enabled provider to use its resources. If it is unavailable, check [provider enablement](/docs/use/workspaces/enable-provider/).

![The workspace switcher shows where you are working and lists the workspaces in the current organization.](/images/docs/console/workspace-switcher.webp)

![The dashboard summarizes each enabled provider in the active workspace.](/images/docs/console/dashboard.webp)

### Verify your context

Before creating or deleting a resource, check the selected organization and workspace. Changing workspaces changes which resources, providers, and permissions are available.

![The account menu shows your identity and organization, and links to CLI setup, MCP access, and settings.](/images/docs/console/account-menu.webp)

If a provider appears empty, check the workspace first. For missing permissions, ask a workspace administrator rather than creating another credential.

Next: [choose your first task](/docs/get-started/#choose-your-first-task).
