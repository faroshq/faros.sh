---
title: "Resource schemas"
description: "Generated fields and validation rules for kuery workspace resources."
weight: 91
doc_type: "Reference"
---

## Compatibility and access

These resource schemas describe provider configuration. Check your deployed API discovery for the schema installed in your hub. Use the intended [workspace context](/docs/reference/cli/resources/) and an identity permitted to read or change the resource. Required fields below are required within their containing object; optional parent objects may be omitted.

[Download complete schemas](/schemas/kuery.json), including nested validation rules and status definitions. This page covers Kubernetes-style resources; provider HTTP actions and runtime behavior are separate contracts. Return to [API reference](/docs/use/kuery/reference/) for those interfaces and related guides.

## SavedView (v1alpha1)

API: `kuery.providers.faros.sh/v1alpha1` · Resource: `savedviews` · Scope: `Namespaced`

[Source schema](https://github.com/faroshq/faros/blob/main/providers/kuery/deploy/chart/files/schemas/savedviews.kuery.providers.faros.sh.yaml)

```bash
kubectl explain savedviews.kuery.providers.faros.sh --api-version=kuery.providers.faros.sh/v1alpha1 --recursive
```

| Field | Type | Required in parent | Description and constraints |
| --- | --- | --- | --- |
| `spec` | object | No | See the downloadable schema. |
| `spec.displayName` | string | No | Human-readable name shown in the portal. maxLength: 128 |
| `spec.description` | string | No | maxLength: 512 |
| `spec.root` | object | No | The object the view is anchored on. Cluster is the faros edge name; empty matches any engaged edge. |
| `spec.root.cluster` | string | No | maxLength: 256 |
| `spec.root.apiGroup` | string | No | maxLength: 256 |
| `spec.root.kind` | string | No | maxLength: 128 |
| `spec.root.namespace` | string | No | maxLength: 63 |
| `spec.root.name` | string | No | maxLength: 253 |
| `spec.relations` | array&#91;string&#93; | No | Kuery relation names to expand from the root (owners, owners+, descendants, descendants+, references, selects, selected-by, events, linked, linked+, grouped). maxItems: 16 |
| `spec.maxDepth` | integer | No | Transitive relation depth cap. minimum: 1; maximum: 20 |
| `status` | object | No | See the downloadable schema. |
| `status.lastOpenedAt` | string | No | See the downloadable schema. |
