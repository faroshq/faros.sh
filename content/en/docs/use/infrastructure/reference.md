---
title: "Infrastructure API reference"
description: "Resource and interface map, with versioned source definitions."
weight: 90
doc_type: "Reference"
---

## Prerequisites and scope

Use the workspace where Infrastructure is enabled. Authenticate with a credential authorized for the requested resource and operation. Inspect your deployed API discovery for the exact schema in your hub.

## Interfaces

`Template` and `Instance` use `infrastructure.faros.sh/v1alpha1`. Set `Instance.spec.template` to the template name and put template inputs in `spec.values`. The template is immutable. Inspect conditions after every update; validation occurs during reconciliation.

## MCP tools

Connect through [MCP setup](/docs/use/mcp/). The aggregate endpoint prefixes these names with `infrastructure__`. Tool availability depends on provider enablement and the endpoint credential's workspace permissions; use your client's tool discovery for the deployed input schemas.

| Tool | Use it to |
|---|---|
| `list_templates` | Discover the workspace catalog, optionally filtered by category or cloud. |
| `describe_template` | Inspect input schemas, prerequisites, outputs, exposure, and development support before provisioning. |
| `provision` | Create an `Instance` from a template and its values; reconciliation follows asynchronously. |
| `list_instances` | List instances in the caller's workspace. |
| `get_instance` | Inspect phase, conditions, and child-resource status. |
| `update_instance` | Merge-patch supported values in place; immutable inputs are rejected. |
| `delete_instance` | Request instance deletion and associated cleanup. |
| `dev_sync` | Push files into a development instance, respecting template component paths. |
| `dev_logs` | Read a development component's server logs. |
| `dev_restart` | Restart a development component's server process. |

The development tools require a development-capable template, an instance created with `values.farosMode="development"`, and a configured provider data plane. Internal instances do not get a public URL; inspect the template's exposure before waiting for one. Definitions: [catalog and lifecycle tools](https://github.com/faroshq/faros/blob/main/providers/infrastructure/mcpserver/tools.go), [development tools](https://github.com/faroshq/faros/blob/main/providers/infrastructure/mcpserver/tools_dev.go).

## Resource schemas

[Resource fields and validation rules](/docs/use/infrastructure/schemas/) are generated from the checked-in schemas, with a downloadable JSON bundle.

## Authoritative definitions

[API definitions](https://github.com/faroshq/faros/blob/main/providers/infrastructure/apis/v1alpha1) contain fields and contracts. For Kubernetes-style resources, use `kubectl api-resources` and `kubectl explain RESOURCE` against the intended workspace to inspect the installed schema.

## Related guide

[Instance lifecycle](/docs/use/infrastructure/instances/). Return to [Infrastructure](/docs/use/infrastructure/) for prerequisites and the provider’s quickstart.
