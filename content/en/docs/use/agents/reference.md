---
title: "AI agents API reference"
description: "Resource and interface map, with versioned source definitions."
weight: 90
doc_type: "Reference"
---

## Prerequisites and scope

Use the workspace where AI agents is enabled. Authenticate with a credential authorized for the requested resource and operation. Inspect your deployed API discovery for the exact schema in your hub.

## Interfaces

Agent, connection, schedule, trigger, and toolset configuration use the agents API. Runs are stored in the provider’s database. The invocation API supports creating a run, polling/waiting for its result, and reading output.

## Resource schemas

[Resource fields and validation rules](/docs/use/agents/schemas/) are generated from the checked-in schemas, with a downloadable JSON bundle.

## Authoritative definitions

[API definitions](https://github.com/faroshq/faros/blob/main/providers/agents/apis/v1alpha1) contain fields and contracts. For Kubernetes-style resources, use `kubectl api-resources` and `kubectl explain RESOURCE` against the intended workspace to inspect the installed schema.

## Related guide

[Schedules and triggers](/docs/use/agents/schedules/). Return to [AI agents](/docs/use/agents/) for prerequisites and the provider’s quickstart.
