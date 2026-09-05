---
title: "Resource schemas"
description: "Generated fields and validation rules for databricks workspace resources."
weight: 91
doc_type: "Reference"
provider: "databricks"
---

## Compatibility and access

These resource schemas describe provider configuration. Check your deployed API discovery for the schema installed in your hub. Use the intended [workspace context](/docs/reference/cli/resources/) and an identity permitted to read or change the resource. Required fields below are required within their containing object; optional parent objects may be omitted.

[Download complete schemas](/schemas/databricks.json), including nested validation rules and status definitions. This page covers Kubernetes-style resources; provider HTTP actions and runtime behavior are separate contracts. Return to [API reference](/docs/reference/providers/databricks/) for those interfaces and related guides.

## Connection (v1alpha1)

API: `databricks.faros.sh/v1alpha1` · Resource: `connections` · Scope: `Cluster`

[Source schema](https://github.com/faroshq/faros/blob/main/providers/databricks/deploy/chart/files/schemas/connections.databricks.faros.sh.yaml)

```bash
kubectl explain connections.databricks.faros.sh --api-version=databricks.faros.sh/v1alpha1 --recursive
```

| Field | Type | Required in parent | Description and constraints |
| --- | --- | --- | --- |
| `spec` | object | Yes | See the downloadable schema. |
| `spec.authType` | string | Yes | AuthType selects the credential model. PAT is the only supported model. enum: &#91;"pat"&#93; |
| `spec.host` | string | Yes | Host is the Databricks workspace host, e.g. https://dbc-xyz.cloud.databricks.com. minLength: 1; maxLength: 2048; pattern: "^https://&#91;A-Za-z0-9.-&#93;+(:&#91;0-9&#93;+)?/?$" |
| `spec.secretRef` | object | Yes | SecretRef points at tenant workspace credential/federation config. |
| `spec.secretRef.key` | string | No | Key is the optional key holding credential material. Defaults depend on the auth type. |
| `spec.secretRef.name` | string | Yes | Name is the Secret name in the tenant workspace. minLength: 1 |
| `spec.secretRef.namespace` | string | No | Namespace is the Secret namespace in the tenant workspace. Defaults to default. |
| `status` | object | No | See the downloadable schema. |
| `status.conditions` | array&#91;object&#93; | No | See the downloadable schema. |
| `status.conditions[].lastTransitionTime` | string | Yes | lastTransitionTime is the last time the condition transitioned from one status to another. This should be when the underlying condition changed. If that is not known, then using the time when the API field changed is acceptable. |
| `status.conditions[].message` | string | Yes | message is a human readable message indicating details about the transition. This may be an empty string. maxLength: 32768 |
| `status.conditions[].observedGeneration` | integer | No | observedGeneration represents the .metadata.generation that the condition was set based upon. For instance, if .metadata.generation is currently 12, but the .status.conditions&#91;x&#93;.observedGeneration is 9, the condition is out of date with respect to the current state of the instance. minimum: 0 |
| `status.conditions[].reason` | string | Yes | reason contains a programmatic identifier indicating the reason for the condition's last transition. Producers of specific condition types may define expected values and meanings for this field, and whether the values are considered a guaranteed API. The value should be a CamelCase string. This field may not be empty. minLength: 1; maxLength: 1024; pattern: "^&#91;A-Za-z&#93;(&#91;A-Za-z0-9_,:&#93;*&#91;A-Za-z0-9_&#93;)?$" |
| `status.conditions[].status` | string | Yes | status of the condition, one of True, False, Unknown. enum: &#91;"True", "False", "Unknown"&#93; |
| `status.conditions[].type` | string | Yes | type of condition in CamelCase or in foo.example.com/CamelCase. maxLength: 316; pattern: "^(&#91;a-z0-9&#93;(&#91;-a-z0-9&#93;*&#91;a-z0-9&#93;)?(&#92;&#92;.&#91;a-z0-9&#93;(&#91;-a-z0-9&#93;*&#91;a-z0-9&#93;)?)*/)?((&#91;A-Za-z0-9&#93;&#91;-A-Za-z0-9_.&#93;*)?&#91;A-Za-z0-9&#93;)$" |
| `status.observedGeneration` | integer | No | See the downloadable schema. |
| `status.workspaceID` | string | No | See the downloadable schema. |

## Table (v1alpha1)

API: `databricks.faros.sh/v1alpha1` · Resource: `tables` · Scope: `Cluster`

[Source schema](https://github.com/faroshq/faros/blob/main/providers/databricks/deploy/chart/files/schemas/tables.databricks.faros.sh.yaml)

```bash
kubectl explain tables.databricks.faros.sh --api-version=databricks.faros.sh/v1alpha1 --recursive
```

| Field | Type | Required in parent | Description and constraints |
| --- | --- | --- | --- |
| `spec` | object | Yes | See the downloadable schema. |
| `spec.catalog` | string | Yes | minLength: 1; maxLength: 255; pattern: "^&#91;^&#92;&#92;p{Cc}&#93;+$" |
| `spec.connectionRef` | string | Yes | minLength: 1; maxLength: 253 |
| `spec.schema` | string | Yes | minLength: 1; maxLength: 255; pattern: "^&#91;^&#92;&#92;p{Cc}&#93;+$" |
| `spec.table` | string | Yes | minLength: 1; maxLength: 255; pattern: "^&#91;^&#92;&#92;p{Cc}&#93;+$" |
| `spec.warehouseRef` | string | Yes | minLength: 1; maxLength: 253 |
| `status` | object | No | See the downloadable schema. |
| `status.columns` | array&#91;object&#93; | No | Columns caches schema for App Studio authoring. It never stores row data. maxItems: 64 |
| `status.columns[].comment` | string | No | maxLength: 4096 |
| `status.columns[].name` | string | Yes | minLength: 1; maxLength: 255; pattern: "^&#91;^&#92;&#92;p{Cc}&#93;+$" |
| `status.columns[].nullable` | boolean | No | See the downloadable schema. |
| `status.columns[].type` | string | Yes | minLength: 1; maxLength: 1024; pattern: "^&#91;^&#92;&#92;p{Cc}&#93;+$" |
| `status.conditions` | array&#91;object&#93; | No | See the downloadable schema. |
| `status.conditions[].lastTransitionTime` | string | Yes | lastTransitionTime is the last time the condition transitioned from one status to another. This should be when the underlying condition changed. If that is not known, then using the time when the API field changed is acceptable. |
| `status.conditions[].message` | string | Yes | message is a human readable message indicating details about the transition. This may be an empty string. maxLength: 32768 |
| `status.conditions[].observedGeneration` | integer | No | observedGeneration represents the .metadata.generation that the condition was set based upon. For instance, if .metadata.generation is currently 12, but the .status.conditions&#91;x&#93;.observedGeneration is 9, the condition is out of date with respect to the current state of the instance. minimum: 0 |
| `status.conditions[].reason` | string | Yes | reason contains a programmatic identifier indicating the reason for the condition's last transition. Producers of specific condition types may define expected values and meanings for this field, and whether the values are considered a guaranteed API. The value should be a CamelCase string. This field may not be empty. minLength: 1; maxLength: 1024; pattern: "^&#91;A-Za-z&#93;(&#91;A-Za-z0-9_,:&#93;*&#91;A-Za-z0-9_&#93;)?$" |
| `status.conditions[].status` | string | Yes | status of the condition, one of True, False, Unknown. enum: &#91;"True", "False", "Unknown"&#93; |
| `status.conditions[].type` | string | Yes | type of condition in CamelCase or in foo.example.com/CamelCase. maxLength: 316; pattern: "^(&#91;a-z0-9&#93;(&#91;-a-z0-9&#93;*&#91;a-z0-9&#93;)?(&#92;&#92;.&#91;a-z0-9&#93;(&#91;-a-z0-9&#93;*&#91;a-z0-9&#93;)?)*/)?((&#91;A-Za-z0-9&#93;&#91;-A-Za-z0-9_.&#93;*)?&#91;A-Za-z0-9&#93;)$" |
| `status.observedGeneration` | integer | No | See the downloadable schema. |
| `status.refreshedAt` | string | No | See the downloadable schema. |

## Warehouse (v1alpha1)

API: `databricks.faros.sh/v1alpha1` · Resource: `warehouses` · Scope: `Cluster`

[Source schema](https://github.com/faroshq/faros/blob/main/providers/databricks/deploy/chart/files/schemas/warehouses.databricks.faros.sh.yaml)

```bash
kubectl explain warehouses.databricks.faros.sh --api-version=databricks.faros.sh/v1alpha1 --recursive
```

| Field | Type | Required in parent | Description and constraints |
| --- | --- | --- | --- |
| `spec` | object | Yes | See the downloadable schema. |
| `spec.connectionRef` | string | Yes | minLength: 1; maxLength: 253 |
| `spec.warehouseID` | string | Yes | minLength: 1; maxLength: 255; pattern: "^&#91;^&#92;&#92;p{Cc}&#93;+$" |
| `status` | object | No | See the downloadable schema. |
| `status.conditions` | array&#91;object&#93; | No | See the downloadable schema. |
| `status.conditions[].lastTransitionTime` | string | Yes | lastTransitionTime is the last time the condition transitioned from one status to another. This should be when the underlying condition changed. If that is not known, then using the time when the API field changed is acceptable. |
| `status.conditions[].message` | string | Yes | message is a human readable message indicating details about the transition. This may be an empty string. maxLength: 32768 |
| `status.conditions[].observedGeneration` | integer | No | observedGeneration represents the .metadata.generation that the condition was set based upon. For instance, if .metadata.generation is currently 12, but the .status.conditions&#91;x&#93;.observedGeneration is 9, the condition is out of date with respect to the current state of the instance. minimum: 0 |
| `status.conditions[].reason` | string | Yes | reason contains a programmatic identifier indicating the reason for the condition's last transition. Producers of specific condition types may define expected values and meanings for this field, and whether the values are considered a guaranteed API. The value should be a CamelCase string. This field may not be empty. minLength: 1; maxLength: 1024; pattern: "^&#91;A-Za-z&#93;(&#91;A-Za-z0-9_,:&#93;*&#91;A-Za-z0-9_&#93;)?$" |
| `status.conditions[].status` | string | Yes | status of the condition, one of True, False, Unknown. enum: &#91;"True", "False", "Unknown"&#93; |
| `status.conditions[].type` | string | Yes | type of condition in CamelCase or in foo.example.com/CamelCase. maxLength: 316; pattern: "^(&#91;a-z0-9&#93;(&#91;-a-z0-9&#93;*&#91;a-z0-9&#93;)?(&#92;&#92;.&#91;a-z0-9&#93;(&#91;-a-z0-9&#93;*&#91;a-z0-9&#93;)?)*/)?((&#91;A-Za-z0-9&#93;&#91;-A-Za-z0-9_.&#93;*)?&#91;A-Za-z0-9&#93;)$" |
| `status.observedGeneration` | integer | No | See the downloadable schema. |
| `status.state` | string | No | See the downloadable schema. |
