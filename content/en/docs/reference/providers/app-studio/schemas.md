---
title: "Resource schemas"
description: "Generated fields and validation rules for app-studio workspace resources."
weight: 91
doc_type: "Reference"
provider: "app-studio"
---

## Compatibility and access

These resource schemas describe provider configuration. Check your deployed API discovery for the schema installed in your hub. Use the intended [workspace context](/docs/reference/cli/resources/) and an identity permitted to read or change the resource. Required fields below are required within their containing object; optional parent objects may be omitted.

[Download complete schemas](/schemas/app-studio.json), including nested validation rules and status definitions. This page covers Kubernetes-style resources; provider HTTP actions and runtime behavior are separate contracts. Return to [API reference](/docs/reference/providers/app-studio/) for those interfaces and related guides.

## Project (v1alpha1)

API: `ai.faros.sh/v1alpha1` · Resource: `projects` · Scope: `Cluster`

[Source schema](https://github.com/faroshq/faros/blob/main/providers/app-studio/deploy/chart/files/schemas/projects.ai.faros.sh.yaml)

```bash
kubectl explain projects.ai.faros.sh --api-version=ai.faros.sh/v1alpha1 --recursive
```

| Field | Type | Required in parent | Description and constraints |
| --- | --- | --- | --- |
| `spec` | object | No | ProjectSpec defines user-authored Project state. |
| `spec.description` | string | No | Description is a short project summary. maxLength: 2048 |
| `spec.displayName` | string | Yes | DisplayName is the human-readable project title. minLength: 1; maxLength: 128 |
| `spec.environments` | array&#91;object&#93; | No | Environments describe provider-backed runtime capabilities for this Project. App Studio owns the binding contract; providers own runtime implementation details. |
| `spec.environments[].autoDeploy` | boolean | No | AutoDeploy marks artifact environments that should deploy automatically. |
| `spec.environments[].bindings` | array&#91;object&#93; | No | Bindings connect this environment to provider capabilities. |
| `spec.environments[].bindings[].allowedActions` | array&#91;object&#93; | No | AllowedActions is the versioned allow-list for non-owning provider references. Owning providerResource bindings may leave this empty; the integration gateway requires an explicitly declared action before it forwards a call. |
| `spec.environments[].bindings[].allowedActions[].grantedAt` | string | No | GrantedAt is the server time at which the catalog-backed grant was verified. Clients cannot set or replace this audit value. |
| `spec.environments[].bindings[].allowedActions[].grantedBy` | string | No | GrantedBy is the authenticated caller recorded by the server when the action grant is verified against the provider catalog. Clients cannot set or replace this audit value. |
| `spec.environments[].bindings[].allowedActions[].name` | string | Yes | Name is the provider-neutral action name (for example query_table). minLength: 1; maxLength: 63 |
| `spec.environments[].bindings[].allowedActions[].revoked` | boolean | No | Revoked disables this action without removing the integration binding, allowing an operator to retain the audit history while closing access. |
| `spec.environments[].bindings[].allowedActions[].revokedAt` | string | No | RevokedAt is the server time at which the active action grant was revoked. Clients cannot set or replace this audit value. |
| `spec.environments[].bindings[].allowedActions[].revokedBy` | string | No | RevokedBy is the authenticated caller recorded by the server when an active action grant is revoked. Clients cannot set or replace this audit value. |
| `spec.environments[].bindings[].allowedActions[].schemaDigest` | string | Yes | SchemaDigest identifies the exact provider action schema that the caller reviewed and consented to. Digests are immutable action-catalog content addresses; digest-less grants are never accepted. minLength: 71; maxLength: 71; pattern: "^sha256:&#91;a-f0-9&#93;{64}$" |
| `spec.environments[].bindings[].allowedActions[].version` | string | Yes | Version identifies the versioned action contract (for example v1). minLength: 1; maxLength: 32 |
| `spec.environments[].bindings[].kind` | string | Yes | enum: &#91;"providerResource", "providerReference"&#93; |
| `spec.environments[].bindings[].name` | string | Yes | minLength: 1; maxLength: 63 |
| `spec.environments[].bindings[].provider` | string | Yes | minLength: 1; maxLength: 63 |
| `spec.environments[].bindings[].resourceRef` | object | No | See the downloadable schema. |
| `spec.environments[].bindings[].resourceRef.apiVersion` | string | No | See the downloadable schema. |
| `spec.environments[].bindings[].resourceRef.kind` | string | No | See the downloadable schema. |
| `spec.environments[].bindings[].resourceRef.name` | string | No | See the downloadable schema. |
| `spec.environments[].bindings[].resourceRef.resource` | string | No | See the downloadable schema. |
| `spec.environments[].bindings[].values` | object | No | Values is provider-owned configuration. App Studio treats it as an opaque contract payload. |
| `spec.environments[].mode` | string | No | Mode distinguishes artifact-based environments from live development runtimes. Empty means artifact for backward compatibility. |
| `spec.environments[].name` | string | Yes | Name is a stable environment identifier such as development or test. minLength: 1; maxLength: 63 |
| `spec.environments[].promotion` | string | No | Promotion controls how changes move into this environment. |
| `spec.memory` | object | No | Memory stores durable context the AI should consider for this project. It is edited explicitly through the API in the MVP. |
| `spec.memory.constraints` | array&#91;string&#93; | No | See the downloadable schema. |
| `spec.memory.goals` | array&#91;string&#93; | No | See the downloadable schema. |
| `spec.memory.requirements` | array&#91;string&#93; | No | See the downloadable schema. |
| `spec.repository` | object | No | Repository records the Code provider repository backing this Project. |
| `spec.repository.adopted` | boolean | No | Adopted marks a binding built from an EXISTING Repository CR (repository import). The Project reconciler creates the Repository CR for non-adopted bindings only — an adopted repository is never (re)created on the project's behalf. |
| `spec.repository.connectionRef` | string | No | ConnectionRef names the Code provider Connection used by the Repository. maxLength: 253 |
| `spec.repository.name` | string | No | Name is the repository name on the git host. maxLength: 253 |
| `spec.repository.repositoryRef` | string | Yes | RepositoryRef names the Repository resource in the same workspace. minLength: 1; maxLength: 253 |
| `spec.sharing` | object | No | Sharing captures App Studio access policy intent for previews and published apps. Empty policies are interpreted as private. |
| `spec.sharing.preview` | object | No | Preview controls who may access the mutable development preview. Private requires platform sign-in and workspace access; public allows anyone with the URL. The legacy shared value is normalized to private by App Studio. |
| `spec.sharing.preview.mode` | string | No | Mode is the requested preview visibility. Empty means private. enum: &#91;"private", "public"&#93; |
| `spec.sharing.publishing` | object | No | Publishing controls who may access published app instances once the publishing runtime exists. |
| `spec.sharing.publishing.mode` | string | No | Mode is the requested visibility for this channel. Empty means private. enum: &#91;"private", "shared", "public"&#93; |
| `spec.template` | object | No | Template names the infrastructure Template whose instance backs this Project's development environment (docs/app-studio-template-sandboxes.md). When set, the development binding is generated from the Template's instanceCRD with farosMode: development, and file sync routes per the Template's declared development components. Empty means the project has no development environment yet — one must be selected before any development runtime surface (sync, preview, logs) works. |
| `spec.template.name` | string | Yes | Name is the Template's catalog name (e.g. "application"). minLength: 1; maxLength: 253 |
| `status` | object | No | ProjectStatus defines the observed Project state. |
| `status.environments` | array&#91;object&#93; | No | Environments reports provider-observed environment state. |
| `status.environments[].bindings` | array&#91;object&#93; | No | See the downloadable schema. |
| `status.environments[].bindings[].name` | string | No | See the downloadable schema. |
| `status.environments[].bindings[].outputs` | object | No | See the downloadable schema. |
| `status.environments[].bindings[].phase` | string | No | See the downloadable schema. |
| `status.environments[].bindings[].previewURL` | string | No | See the downloadable schema. |
| `status.environments[].bindings[].provider` | string | No | See the downloadable schema. |
| `status.environments[].bindings[].url` | string | No | See the downloadable schema. |
| `status.environments[].mode` | string | No | See the downloadable schema. |
| `status.environments[].name` | string | No | See the downloadable schema. |
| `status.environments[].phase` | string | No | See the downloadable schema. |
| `status.phase` | string | No | Phase is Ready for MVP-created Projects. |
| `status.updatedAt` | string | No | UpdatedAt reflects the latest API mutation affecting metadata or memory. |

## Session (v1alpha1)

API: `ai.faros.sh/v1alpha1` · Resource: `sessions` · Scope: `Cluster`

[Source schema](https://github.com/faroshq/faros/blob/main/providers/app-studio/deploy/chart/files/schemas/sessions.ai.faros.sh.yaml)

```bash
kubectl explain sessions.ai.faros.sh --api-version=ai.faros.sh/v1alpha1 --recursive
```

| Field | Type | Required in parent | Description and constraints |
| --- | --- | --- | --- |
| `spec` | object | Yes | See the downloadable schema. |
| `spec.actorID` | string | No | ActorID records the user the thread belongs to. |
| `spec.projectRef` | string | Yes | ProjectRef names the Project this conversation belongs to. minLength: 1 |
| `spec.threadID` | string | Yes | ThreadID is the store's thread identifier this Session projects. minLength: 1 |
| `status` | object | No | See the downloadable schema. |
| `status.activeTurnID` | string | No | ActiveTurnID is the in-flight turn, empty when idle. |
| `status.activeTurnStatus` | string | No | ActiveTurnStatus is the in-flight turn's state. |
| `status.phase` | string | No | Phase mirrors the thread status (active, archived). |
| `status.title` | string | No | Title is the thread's display title. |
| `status.updatedAt` | string | No | UpdatedAt is the thread's last store update the mirror observed. |

## Studio (v1alpha1)

API: `ai.faros.sh/v1alpha1` · Resource: `studios` · Scope: `Cluster`

[Source schema](https://github.com/faroshq/faros/blob/main/providers/app-studio/deploy/chart/files/schemas/studios.ai.faros.sh.yaml)

```bash
kubectl explain studios.ai.faros.sh --api-version=ai.faros.sh/v1alpha1 --recursive
```

| Field | Type | Required in parent | Description and constraints |
| --- | --- | --- | --- |
| `spec` | object | No | See the downloadable schema. |
| `spec.browser` | object | No | Browser configures the workspace's shared headless browser, used for development-preview inspection. One Playwright instance for the whole workspace, provisioned through the infrastructure provider exactly like Search — no per-project browser, and app-studio owns no browser image. |
| `spec.browser.disabled` | boolean | No | Disabled turns preview browser inspection off for this workspace. |
| `spec.browser.resourceRef` | object | No | ResourceRef is the fully-resolved instance the reconciler creates, written by the API from the browser Template's instanceCRD. Same self-contained contract as StudioSearch.ResourceRef. |
| `spec.browser.resourceRef.apiVersion` | string | No | See the downloadable schema. |
| `spec.browser.resourceRef.kind` | string | No | See the downloadable schema. |
| `spec.browser.resourceRef.name` | string | No | See the downloadable schema. |
| `spec.browser.resourceRef.resource` | string | No | See the downloadable schema. |
| `spec.browser.size` | string | No | Size is the browser's memory bucket, passed to the template. enum: &#91;"small", "medium", "large"&#93; |
| `spec.search` | object | No | Search configures the workspace's web-search backend. |
| `spec.search.disabled` | boolean | No | Disabled turns web search off for every project in this workspace. |
| `spec.search.resourceRef` | object | No | ResourceRef is the fully-resolved instance the reconciler creates, written by the API from the searxng Template's instanceCRD. The reconciler never reads Templates itself — they ride virtual storage with their own identity, so a self-contained spec keeps the control loop dependency-free (the same contract Project bindings use). |
| `spec.search.resourceRef.apiVersion` | string | No | See the downloadable schema. |
| `spec.search.resourceRef.kind` | string | No | See the downloadable schema. |
| `spec.search.resourceRef.name` | string | No | See the downloadable schema. |
| `spec.search.resourceRef.resource` | string | No | See the downloadable schema. |
| `spec.search.size` | string | No | Size is the backend's memory bucket, passed to the template. enum: &#91;"small", "medium", "large"&#93; |
| `status` | object | No | See the downloadable schema. |
| `status.browser` | object | No | Browser reports the shared headless browser backend. |
| `status.browser.instance` | string | No | Instance names the backing infrastructure instance. |
| `status.browser.phase` | string | No | Phase is Ready, Pending, or Disabled. |
| `status.browser.reason` | string | No | Reason explains a non-Ready phase. |
| `status.browser.resource` | string | No | Resource is the instance's plural resource. |
| `status.phase` | string | No | Phase is Ready when every enabled service is Ready. |
| `status.search` | object | No | Search reports the shared search backend. |
| `status.search.instance` | string | No | Instance names the backing infrastructure instance. |
| `status.search.phase` | string | No | Phase is Ready, Pending, or Disabled. |
| `status.search.reason` | string | No | Reason explains a non-Ready phase. |
| `status.search.resource` | string | No | Resource is the instance's plural resource. |
| `status.updatedAt` | string | No | UpdatedAt is the last status transition the reconciler observed. |
