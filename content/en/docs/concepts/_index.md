---
title: "How Faros fits together"
description: "Understand workspaces, providers, identities, and execution."
weight: 6
doc_type: "Concept"
---

## Organizations and workspaces

An organization groups people and workspaces. A workspace is a Kubernetes-style logical API boundary with its own resources and enabled provider APIs. Select it before operating on resources. Human access depends on membership and authorization; a user can belong to more than one workspace.

## Providers and runtimes

Providers publish APIs and optional UI, controllers, and tools. Enabling binds their API into a workspace. The provider service and the actual runtime may operate in different clusters. A resource in the control plane describes work; it is not necessarily where that work executes.

## Identity and access

Human sessions, automation service accounts, provider controllers, edge agents, and MCPServer credentials are different principals. Verify the identity used at each boundary. A workspace URL alone is not an authorization policy.

## Resources, actions, and streams

Declarative resources express desired state and controllers reconcile it. Direct actions perform bounded requests; streams carry logs, terminals, or other live traffic. Not every action creates an auditable, reversible resource object.

## Edges and MCP

An edge agent connects outward to the hub; provider routing carries traffic to the target. MCP exposes enabled tools to compatible assistants, subject to the endpoint credential and provider authorization.

## Follow a provisioning request

Suppose an assistant provisions a database through the Infrastructure provider. The workspace must have Infrastructure enabled, a database template installed, a configured runtime, and credentials authorized to create instances.

```text
Assistant's MCP client
    |
    v
Hub MCP endpoint — authenticate and resolve workspace
    |
    v
Infrastructure provision tool — create an Instance in that workspace
    |
    v
Provider reconciliation — create runtime resources from the template
    |
    v
Runtime cluster — run the database and report status
```

1. **Discover the contract.** The assistant lists templates, then describes `database` to learn its required inputs and internal exposure. A database is an `Instance` using that template, not a dynamically added `Postgres` API kind.
2. **Authorize the request.** At the aggregate MCP endpoint, the credential belongs to the `MCPServer` service account. It is distinct from the human's browser session. Provider requests carry the resolved workspace and caller credential; the tool must be allowed to create the instance there.
3. **Record desired state.** `infrastructure__provision` creates the `Instance`. Acceptance means the request exists, not that the database is ready.
4. **Reconcile the runtime.** The provider's controllers and operator use their configured credentials and workspace bindings to reconcile the template into runtime resources. The database runs in the configured runtime cluster, not inside the hub.
5. **Verify the result.** Use `infrastructure__get_instance` or inspect the resource's phase and conditions. Follow the template's credential references and connection instructions; an internal database should not be expected to acquire a public URL.

If provisioning fails, use [Infrastructure troubleshooting](/docs/use/infrastructure/troubleshooting/) to distinguish authorization, invalid inputs, and runtime failures. When finished, delete the test instance and verify cleanup using the [instance lifecycle guide](/docs/use/infrastructure/instances/).

This flow applies to declarative provisioning. A [Databricks table query](/docs/use/databricks/reference/#mcp-tools), for example, returns a synchronous result without creating a query resource. See [MCP endpoint identity](/docs/use/mcp/#the-mcpserver-object) and [Infrastructure tools](/docs/use/infrastructure/reference/#mcp-tools) for the corresponding interfaces.

## Glossary

- **Hub:** the shared control-plane service.
- **Provider:** a capability registered with the hub.
- **Workspace:** the logical API context for resources and access.
- **Instance:** one provisioned Infrastructure template.
- **Edge agent:** the daemon connecting a target cluster or server.
- **AI agent:** an assistant with a model, tools, and optional background work.

Next: [choose a task](/docs/get-started/first-task/) or [manage workspace access](/docs/administration/).
