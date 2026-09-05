---
title: "Edges API reference"
description: "Resource operations, examples, and schema definitions."
weight: 90
doc_type: "Reference"
provider: "edges"
---

## Prerequisites and scope

Use the workspace where Edges is enabled. Authenticate with a credential authorized for the requested resource and operation. Inspect your deployed API discovery for the exact schema in your hub.

## Interfaces

`KubernetesCluster` and `LinuxServer` are connected targets; `Service` exposes an edge application. `Workload` and `Placement` describe deployment and target assignment. The API group is `edges.faros.sh`.

## Resource schemas

[Resource fields and validation rules](/docs/reference/providers/edges/schemas/) are generated from the checked-in schemas, with a downloadable JSON bundle.

## Inspect edge resources

Authenticate the kubeconfig context for the workspace before reading resources. KubernetesCluster, LinuxServer, and Service are cluster-scoped within the selected workspace. Workload and Placement are namespaced; `-A` includes those objects across its namespaces.

```sh
kubectl faros use
kubectl api-resources --api-group=edges.faros.sh
kubectl get kubernetesclusters.edges.faros.sh,linuxservers.edges.faros.sh,services.edges.faros.sh,workloads.edges.faros.sh,placements.edges.faros.sh -A
kubectl explain services.edges.faros.sh.spec --api-version=edges.faros.sh/v1alpha1
```

Use `kubectl describe` on a named object to read conditions and controller events. `Forbidden` is an RBAC/workspace-scope problem; `NotFound` can mean the object is in another namespace or the edge has not been registered. Wait for the resource's reported readiness condition before relying on a Service or Workload endpoint.

## Authoritative definitions

[API definitions](https://github.com/faroshq/faros/blob/main/providers/edges/apis/v1alpha1) contain fields and contracts. For Kubernetes-style resources, use `kubectl api-resources` and `kubectl explain RESOURCE` against the intended workspace to inspect the installed schema.

## Related guide

[Services and workloads](/docs/use/edges/services-workloads/). Return to [Edges](/docs/use/edges/) for prerequisites and the provider’s quickstart.
