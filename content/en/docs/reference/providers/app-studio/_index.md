---
title: "App Studio API reference"
description: "Resource and interface map, with versioned source definitions."
weight: 90
doc_type: "Reference"
provider: "app-studio"
---

## Prerequisites and scope

Use the workspace where App Studio is enabled. Authenticate with a credential authorized for the requested resource and operation. Inspect your deployed API discovery for the exact schema in your hub.

## Interfaces

`Project`, `Session`, and `Studio` in `ai.faros.sh/v1alpha1`. Project bindings connect repositories, environments, and exact provider resources. Conversations use the provider message API rather than storing every message in a CR.

## Resource schemas

[Resource fields and validation rules](/docs/reference/providers/app-studio/schemas/) are generated from the checked-in schemas, with a downloadable JSON bundle.

## Authoritative definitions

[API definitions](https://github.com/faroshq/faros/blob/main/providers/app-studio/apis/ai/v1alpha1) contain fields and contracts. For Kubernetes-style resources, use `kubectl api-resources` and `kubectl explain RESOURCE` against the intended workspace to inspect the installed schema.

## Related guide

[Databricks integration](/docs/use/app-studio/databricks/). Return to [App Studio](/docs/use/app-studio/) for prerequisites and the provider’s quickstart.
