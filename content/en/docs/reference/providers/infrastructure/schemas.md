---
title: "Resource schemas"
description: "Generated fields and validation rules for infrastructure workspace resources."
weight: 91
doc_type: "Reference"
provider: "infrastructure"
---

## Compatibility and access

Generated from [product commit `6f341b4e6d35`](https://github.com/faroshq/faros/commit/6f341b4e6d356dd28d1a90ec65e220b98a9bbb96). This is a source snapshot, not a guarantee that your deployment runs this version.

These resource schemas describe provider configuration. Check your deployed API discovery for the schema installed in your hub. Use the intended [workspace context](/docs/reference/cli/resources/) and an identity permitted to read or change the resource. Required fields below are required within their containing object; optional parent objects may be omitted.

[Download complete schemas](/schemas/infrastructure.json), including nested validation rules and status definitions. This page covers Kubernetes-style resources; provider HTTP actions and runtime behavior are separate contracts. Return to [API reference](/docs/reference/providers/infrastructure/) for those interfaces and related guides.

## Instance (v1alpha1)

API: `infrastructure.faros.sh/v1alpha1` · Resource: `instances` · Scope: `Cluster`

[Source schema](https://github.com/faroshq/faros/blob/6f341b4e6d356dd28d1a90ec65e220b98a9bbb96/providers/infrastructure/install/crds/infrastructure.faros.sh_instances.yaml)

```bash
kubectl explain instances.infrastructure.faros.sh --api-version=infrastructure.faros.sh/v1alpha1 --recursive
```

| Field | Type | Required in parent | Description and constraints |
| --- | --- | --- | --- |
| `spec` | object | Yes | InstanceSpec is the desired state. |
| `spec.template` | string | Yes | Template names the catalog Template this instance is provisioned from (Template.metadata.name in the provider workspace, discoverable through the read-only templates catalog). Immutable: changing the product of a live instance would strand the old backend state, so it is a delete + recreate. minLength: 1; maxLength: 253; pattern: "^&#91;a-z0-9&#93;(&#91;-a-z0-9&#93;*&#91;a-z0-9&#93;)?$" |
| `spec.values` | object | No | Values is the template-shaped input — exactly the object Template.spec.schema describes, the same payload that used to be the whole spec of the retired per-template kinds. The platform-reserved fields (farosMode, farosActions*, plus controller-stamped fields like expose.fqdn, farosCluster, credentialsSecretName) live in here too, so "spec" in template schemas, RGD ${schema.spec.*} expressions, and view definitions all keep meaning this object. The apiserver preserves it verbatim; the instance controller validates it against the Template's schema and reports violations on the Ready condition. |
| `status` | object | No | InstanceStatus is the observed state: a platform-guaranteed baseline plus whatever the template's backend projects. The struct only types the baseline — backend-projected fields (url, runtimeNamespace, components, outputs, controlSecretRef, …) are preserved as unknown fields, exactly as the retired per-template CRDs did, so a template's status contract is still authored in its RGD statusMapping and not here. |
| `status.conditions` | array&#91;object&#93; | No | Conditions carries both provider-owned conditions (Valid, OIDCConfigured) and conditions mirrored from the runtime kro instance (Ready, ResourcesReady, …). The shape is deliberately looser than metav1.Condition because mirrored backend conditions may omit reason. |
| `status.conditions[].lastTransitionTime` | string | No | No description supplied by the source schema. |
| `status.conditions[].message` | string | No | No description supplied by the source schema. |
| `status.conditions[].observedGeneration` | integer | No | No description supplied by the source schema. |
| `status.conditions[].reason` | string | No | No description supplied by the source schema. |
| `status.conditions[].status` | string | Yes | No description supplied by the source schema. |
| `status.conditions[].type` | string | Yes | No description supplied by the source schema. |
| `status.farosNetworkPhase` | string | No | NetworkPhase is the controller-owned runtime network phase. It is mirrored from the runtime Instance only after the runtime reports Ready; callers must not use spec.values as an execution-readiness signal. |
| `status.message` | string | No | Message carries human-readable detail for the current phase. |
| `status.observedGeneration` | integer | No | ObservedGeneration mirrors metadata.generation last reconciled by the instance controller. |
| `status.phase` | string | No | Phase is the coarse lifecycle summary (Pending / Ready / Failed), derived from conditions for consumers that want one word. |
| `status.template` | string | No | Template echoes spec.template as resolved at last reconcile. |
| `status.templateVersion` | string | No | TemplateVersion is the Template.spec.version the instance was last reconciled against. |

## Template (v1alpha1)

API: `infrastructure.faros.sh/v1alpha1` · Resource: `templates` · Scope: `Cluster`

[Source schema](https://github.com/faroshq/faros/blob/6f341b4e6d356dd28d1a90ec65e220b98a9bbb96/providers/infrastructure/install/crds/infrastructure.faros.sh_templates.yaml)

```bash
kubectl explain templates.infrastructure.faros.sh --api-version=infrastructure.faros.sh/v1alpha1 --recursive
```

| Field | Type | Required in parent | Description and constraints |
| --- | --- | --- | --- |
| `spec` | object | Yes | TemplateSpec is the desired state. |
| `spec.agent` | object | No | Agent is operational guidance for AI agents that discover this template via MCP — what it provisions, when to choose it, prerequisites, and where its outputs (URL, DB connection Secret, …) land. It complements the human-facing displayName/description (which target the portal UI) and is not rendered in the form. |
| `spec.agent.outputs` | array&#91;string&#93; | No | Outputs describe where the provisioned instance's results land so an agent can discover and wire them — e.g. "status.url: public app URL", "Secret &lt;name&gt;-db-credentials key 'uri': postgres:// connection string". One output per entry. |
| `spec.agent.prerequisites` | array&#91;string&#93; | No | Prerequisites the caller must satisfy BEFORE provisioning — e.g. a cloud-credentials Secret in the tenant's default namespace carrying specific keys. One human-readable requirement per entry. |
| `spec.agent.usage` | string | No | Usage is markdown guidance for an agent: what this template provisions, when to choose it, how the result is exposed (URLs/ingress/auth), and how to operate it after provisioning. The primary, free-form field; the structured fields below call out the most actionable specifics. maxLength: 8192 |
| `spec.backend` | string | Yes | Backend names the registered backend implementation that reconciles instances of this template. The Template controller validates the backend is registered at admission time (PR A scope: validation lives in the controller; future PR moves it to a webhook). Today only "kro" and "stub" are expected; the seam supports terraform, cloud, etc. maxLength: 64; pattern: "^&#91;a-z&#93;&#91;a-z0-9-&#93;*$" |
| `spec.backendConfig` | object | No | BackendConfig is opaque to the platform; only the named backend interprets it. For "kro" it's a resource graph (equivalent to an RGD's resources + statusMapping); for a hypothetical "terraform" backend it would be a module ref and variable mapping. Stored as raw JSON to keep the API surface stable as backends evolve. |
| `spec.category` | string | No | Category groups templates in the catalog (e.g. "Databases", "Workloads", "Storage"). Empty puts the template under an "Other" bucket. maxLength: 64 |
| `spec.dataPlane` | object | No | DataPlane optionally declares the live data-plane verbs this template's instances expose — log streaming, a service proxy, sync/restart control — and how each resolves to a runtime Service/Secret/port from the instance's status. The infrastructure provider serves these as subresources on the instance (e.g. sandboxrunners/&lt;name&gt;/log) so consumers reach a workload's data plane without holding a credential to the runtime cluster themselves. Empty means the template's instances expose no data plane. See docs/app-studio-runtime-decoupling.md for the end-to-end design. |
| `spec.dataPlane.components` | object | No | Components maps a component name to that component's own verb set, served as …/&lt;resource&gt;/&lt;name&gt;/components/&lt;component&gt;/&lt;verb&gt;. Used by multi-tier templates so a caller can sync the backend and restart the frontend independently. Component names should match the template's spec.development components where both are declared. Every endpoint resolves and is namespace-confined exactly like an instance-level one. |
| `spec.dataPlane.endpoints` | object | No | Endpoints maps an instance-level verb name — the subresource the provider serves, e.g. "log", "proxy", "sync", "restart", "status" — to how it resolves. At least one of Endpoints and Components must be non-empty when DataPlane is set. |
| `spec.dataPlane.runtimeNamespacePath` | string | No | RuntimeNamespacePath is the status dot-path to the namespace the backend owns for this instance (e.g. "status.runtimeNamespace"). Every Service and Secret a data-plane verb resolves to MUST live in this namespace; the resolver rejects refs that point elsewhere. Required when any endpoint proxies to the runtime cluster (i.e. anything but a FromStatus endpoint). maxLength: 256 |
| `spec.dataPlane.tokenSecretPath` | string | No | TokenSecretPath is an optional status dot-path to a {name, namespace} object naming the Secret whose "token" key the provider injects as the X-Sandbox-Control-Token header on upstream requests (the per-instance control token). Empty means no token header is added. The named Secret is confined to RuntimeNamespacePath like every other ref. maxLength: 256 |
| `spec.description` | string | No | Description is one to three sentences shown beneath the display name in catalog cards. maxLength: 2048 |
| `spec.development` | object | No | Development optionally declares how instances of this template run in development mode: which graph components can be hot-swapped to platform-managed dev images with a hot-reload agent, where each component's source lives in the project workspace, and how each reloads. A template with a Development block can have instances provisioned with farosMode: development (the platform-reserved instance spec field the Template controller injects); templates without one are production-only. See docs/app-studio-template-sandboxes.md for the end-to-end design. |
| `spec.development.build` | object | No | Build optionally declares the repository-owned GitHub Actions workflow that builds this template's production images. App Studio observes and dispatches this workflow; it never authors or rewrites it. Absence means the template declares no CI workflow. |
| `spec.development.build.workflowPath` | string | Yes | WorkflowPath is a repository-relative GitHub Actions workflow path. It must live directly under .github/workflows and end in .yml or .yaml. maxLength: 256; pattern: "^&#92;&#92;.github/workflows/&#91;^/&#93;+&#92;&#92;.ya?ml$" |
| `spec.development.components` | object | Yes | Components maps a component name to its development behavior. Each key MUST name a workload resource the template's graph emits (by the backend's component→resource naming convention, e.g. "frontend" names the graph resource with id "frontend"). Components not listed here run exactly as declared in production mode — a dev sandbox keeps its real database. Keys must match ^&#91;a-z&#93;&#91;a-z0-9-&#93;*$. ONE NAME RULE (see TemplateDevelopmentComponent.WorkspacePath): a component's directory must be its own name, so agents, sync routing, and data-plane verbs all address it by one word. |
| `spec.development.idleTimeoutSeconds` | integer | No | IdleTimeoutSeconds is the maximum period without an authorized data-plane request before a development instance is deleted. Zero disables the limit. Activity is recorded on the runtime CR by the provider's runtime credential, never by the workload pod or caller. minimum: 0; maximum: 604800 |
| `spec.development.maxLifetimeSeconds` | integer | No | MaxLifetimeSeconds is the hard wall-clock lifetime for a development instance. Zero disables the limit; platform sandbox templates set a finite value so abandoned runs are deleted by the Instance controller and their runtime resources pass through normal finalizer cleanup. minimum: 0; maximum: 604800 |
| `spec.development.providerActions` | boolean | No | ProviderActions controls whether the development pod receives the short-lived setup token used by the optional Provider Actions bridge. It defaults to true for backwards compatibility with existing development templates. A coding-only sandbox should set it to false so none of its containers receive a projected ServiceAccount token. |
| `spec.development.scaffold` | object | No | Scaffold optionally names starter code for a fresh project built on this template. Its layout MUST match the components' workspacePaths and it SHOULD ship CI workflows that build each component's production image, with the owned workflow declared by Build (see docs/app-studio-template-sandboxes.md §4.1a). Consumed by App Studio at project bootstrap; opaque to the infrastructure provider. |
| `spec.development.scaffold.ref` | string | No | Ref pins a branch or tag. Empty means the repository default branch. maxLength: 128 |
| `spec.development.scaffold.repository` | string | Yes | Repository is the git URL of the scaffold. maxLength: 2048 |
| `spec.displayName` | string | No | DisplayName is the human-readable name surfaced in the portal catalog. Empty falls back to metadata.name. maxLength: 128 |
| `spec.exposure` | string | No | Exposure declares whether instances of this template are reachable from outside the platform. It is a statement ABOUT the resource graph, not a switch that changes it — the graph still has to carry (or not carry) the HTTPRoute. Declaring it lets every caller stop guessing: the portal and the MCP tools can say "this has no URL" instead of surfacing an empty status field, and an agent stops polling status.url forever for an instance that will never have one. The API server defaults it to "internal", which is the safe reading: a template that never said it publishes anything is assumed not to. Because the default is stamped at admission, readers see a concrete value and never need to interpret an empty field. default: "internal"; enum: &#91;"internal", "optional", "public"&#93; |
| `spec.iconURL` | string | No | IconURL is an optional asset URL the portal shows on catalog cards. Falls back to a generic icon when empty. maxLength: 2048 |
| `spec.instanceCRD` | object | Yes | InstanceCRD declares the per-template CRD the platform publishes for tenants to author instances against. Must be in group infrastructure.faros.sh; the resource (lowercase plural) and kind (CamelCase singular) are operator-chosen but must be unique across all Templates. |
| `spec.instanceCRD.group` | string | Yes | Group MUST be infrastructure.faros.sh. Pinned here so every per-template CRD lives under the same namespace and the portal can render them uniformly. pattern: "^infrastructure&#92;&#92;.faros&#92;&#92;.sh$" |
| `spec.instanceCRD.kind` | string | Yes | Kind is the CamelCase singular tenants use in apiVersion + kind. maxLength: 64; pattern: "^&#91;A-Z&#93;&#91;A-Za-z0-9&#93;*$" |
| `spec.instanceCRD.resource` | string | Yes | Resource is the lowercase plural the apiserver routes on (kubectl get &lt;resource&gt;). Must be unique across all Templates in the provider workspace. maxLength: 64; pattern: "^&#91;a-z&#93;&#91;a-z0-9&#93;*$" |
| `spec.instanceCRD.version` | string | Yes | Version of the per-template CRD's served + storage schema. Templates can ship multiple Versions (a future Template can extend a previous one's set); the controller updates the CRD's spec.versions list rather than overwriting on conflict. pattern: "^v&#91;0-9&#93;+((alpha&#124;beta)&#91;0-9&#93;+)?$" |
| `spec.sampleValues` | object | No | SampleValues is an optional example input payload the portal pre-fills the provision form with, so a user can provision a working instance in one click and tweak from there. Keyed by the schema's top-level property names (nested objects allowed). Opaque to the controller; surfaced to the portal as spec.sampleValues. Stored as raw JSON. |
| `spec.schema` | object | Yes | Schema is the JSON Schema applied to the per-template CRD's spec field. Stored as raw JSON because importing apiextensions/v1.JSONSchemaProps directly trips controller-gen on the upstream type's recursive shape; the Template controller parses this back into JSONSchemaProps when it builds the CRD's spec.versions&#91;&#93;.schema.openAPIV3Schema.properties.spec. Expected content is the standard subset of OpenAPI v3 (type, properties, required, enum, default, description, minimum, maximum, pattern). The controller rejects Templates whose Schema fails to parse. |
| `spec.version` | string | Yes | Version pins the Template definition's revision. Required by the per-template CRD's served version selection and by instance-create-time consistency checks. maxLength: 64; pattern: "^&#92;&#92;d+&#92;&#92;.&#92;&#92;d+&#92;&#92;.&#92;&#92;d+(-&#91;0-9A-Za-z.-&#93;+)?$" |
| `spec.view` | object | No | View is optional presentation metadata that tells the portal how to render this template's instances — extra columns in the instance-list table and grouped, typed fields on the instance detail page — instead of the default raw-JSON dump. Authored by the template owner so each template controls its own UX. Field values are dot-paths or ${…}-interpolated strings resolved against the instance's spec/status/meta (see the portal's view resolver). Stored as raw JSON (preserve-unknown-fields) and surfaced to the portal as spec.view; opaque to the controller. Shape: columns: # extra instance-list columns - header: Endpoint value: "https://${spec.expose.fqdn}" type: link # text &#124; link &#124; badge &#124; code detail: # detail-page field groups - title: Access fields: - label: URL value: "https://${status.url}" type: link - label: Region path: spec.region |
| `status` | object | No | TemplateStatus is the observed state. |
| `status.backend` | object | No | Backend reflects what the backend reported from its SetupTemplate call. Empty until first reconcile. |
| `status.backend.message` | string | No | Message carries human-readable detail when Ready is false. maxLength: 2048 |
| `status.backend.name` | string | No | Name echoes spec.backend so consumers don't have to cross- reference. Helpful if a Template's backend changes mid-life. |
| `status.backend.ready` | boolean | No | Ready is the backend's headline status; matches BackendTemplateStatus.Ready from the Go interface. |
| `status.conditions` | array&#91;object&#93; | No | Conditions follows the standard Kubernetes conditions pattern. The aggregate Ready condition is True iff schema validation and the backend both succeed. |
| `status.conditions[].lastTransitionTime` | string | Yes | lastTransitionTime is the last time the condition transitioned from one status to another. This should be when the underlying condition changed. If that is not known, then using the time when the API field changed is acceptable. |
| `status.conditions[].message` | string | Yes | message is a human readable message indicating details about the transition. This may be an empty string. maxLength: 32768 |
| `status.conditions[].observedGeneration` | integer | No | observedGeneration represents the .metadata.generation that the condition was set based upon. For instance, if .metadata.generation is currently 12, but the .status.conditions&#91;x&#93;.observedGeneration is 9, the condition is out of date with respect to the current state of the instance. minimum: 0 |
| `status.conditions[].reason` | string | Yes | reason contains a programmatic identifier indicating the reason for the condition's last transition. Producers of specific condition types may define expected values and meanings for this field, and whether the values are considered a guaranteed API. The value should be a CamelCase string. This field may not be empty. minLength: 1; maxLength: 1024; pattern: "^&#91;A-Za-z&#93;(&#91;A-Za-z0-9_,:&#93;*&#91;A-Za-z0-9_&#93;)?$" |
| `status.conditions[].status` | string | Yes | status of the condition, one of True, False, Unknown. enum: &#91;"True", "False", "Unknown"&#93; |
| `status.conditions[].type` | string | Yes | type of condition in CamelCase or in foo.example.com/CamelCase. maxLength: 316; pattern: "^(&#91;a-z0-9&#93;(&#91;-a-z0-9&#93;*&#91;a-z0-9&#93;)?(&#92;&#92;.&#91;a-z0-9&#93;(&#91;-a-z0-9&#93;*&#91;a-z0-9&#93;)?)*/)?((&#91;A-Za-z0-9&#93;&#91;-A-Za-z0-9_.&#93;*)?&#91;A-Za-z0-9&#93;)$" |
| `status.observedGeneration` | integer | No | ObservedGeneration mirrors metadata.generation last reconciled. Drives the standard "is the status fresh?" check. |
