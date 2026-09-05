---
title: "Edges API reference"
description: "Resource and interface map, with versioned source definitions."
weight: 90
doc_type: "Reference"
---

## Prerequisites and scope

Use the workspace where Edges is enabled. Authenticate with a credential authorized for the requested resource and operation. Inspect your deployed API discovery for the exact schema in your hub.

## Interfaces

`KubernetesCluster` and `LinuxServer` are connected targets; `Service` exposes an edge application. `Workload` and `Placement` describe deployment and target assignment. The API group is `edges.faros.sh`.

## Resource schemas

[Resource fields and validation rules](/docs/use/edges/schemas/) are generated from the checked-in schemas, with a downloadable JSON bundle.

## Authoritative definitions

[API definitions](https://github.com/faroshq/faros/blob/main/providers/edges/apis/v1alpha1) contain fields and contracts. For Kubernetes-style resources, use `kubectl api-resources` and `kubectl explain RESOURCE` against the intended workspace to inspect the installed schema.

## Related guide

[Services and workloads](/docs/use/edges/services-workloads/). Return to [Edges](/docs/use/edges/) for prerequisites and the provider’s quickstart.
