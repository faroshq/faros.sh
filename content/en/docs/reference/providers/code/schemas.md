---
title: "Resource schemas"
description: "Generated fields and validation rules for code workspace resources."
weight: 91
doc_type: "Reference"
provider: "code"
---

## Compatibility and access

Generated from [product commit `6f341b4e6d35`](https://github.com/faroshq/faros/commit/6f341b4e6d356dd28d1a90ec65e220b98a9bbb96). This is a source snapshot, not a guarantee that your deployment runs this version.

These resource schemas describe provider configuration. Check your deployed API discovery for the schema installed in your hub. Use the intended [workspace context](/docs/reference/cli/resources/) and an identity permitted to read or change the resource. Required fields below are required within their containing object; optional parent objects may be omitted.

[Download complete schemas](/schemas/code.json), including nested validation rules and status definitions. This page covers Kubernetes-style resources; provider HTTP actions and runtime behavior are separate contracts. Return to [API reference](/docs/reference/providers/code/) for those interfaces and related guides.

## Collaborator (v1alpha1)

API: `code.faros.sh/v1alpha1` · Resource: `collaborators` · Scope: `Cluster`

[Source schema](https://github.com/faroshq/faros/blob/6f341b4e6d356dd28d1a90ec65e220b98a9bbb96/providers/code/deploy/chart/files/schemas/collaborators.code.faros.sh.yaml)

```bash
kubectl explain collaborators.code.faros.sh --api-version=code.faros.sh/v1alpha1 --recursive
```

| Field | Type | Required in parent | Description and constraints |
| --- | --- | --- | --- |
| `spec` | object | Yes | CollaboratorSpec is the desired state. |
| `spec.permission` | string | No | Permission defaults to pull when empty. enum: &#91;"pull", "push", "admin"&#93; |
| `spec.repositoryRef` | string | Yes | RepositoryRef names the Repository (same workspace) this grant is on. minLength: 1; maxLength: 253 |
| `spec.username` | string | Yes | Username is the host login to grant access to. minLength: 1; maxLength: 100 |
| `status` | object | No | CollaboratorStatus is the observed state. |
| `status.conditions` | array&#91;object&#93; | No | Conditions follows the standard Kubernetes conditions pattern. The InvitationPending condition is True while the host reports the user has been invited but not yet accepted. |
| `status.conditions[].lastTransitionTime` | string | Yes | lastTransitionTime is the last time the condition transitioned from one status to another. This should be when the underlying condition changed. If that is not known, then using the time when the API field changed is acceptable. |
| `status.conditions[].message` | string | Yes | message is a human readable message indicating details about the transition. This may be an empty string. maxLength: 32768 |
| `status.conditions[].observedGeneration` | integer | No | observedGeneration represents the .metadata.generation that the condition was set based upon. For instance, if .metadata.generation is currently 12, but the .status.conditions&#91;x&#93;.observedGeneration is 9, the condition is out of date with respect to the current state of the instance. minimum: 0 |
| `status.conditions[].reason` | string | Yes | reason contains a programmatic identifier indicating the reason for the condition's last transition. Producers of specific condition types may define expected values and meanings for this field, and whether the values are considered a guaranteed API. The value should be a CamelCase string. This field may not be empty. minLength: 1; maxLength: 1024; pattern: "^&#91;A-Za-z&#93;(&#91;A-Za-z0-9_,:&#93;*&#91;A-Za-z0-9_&#93;)?$" |
| `status.conditions[].status` | string | Yes | status of the condition, one of True, False, Unknown. enum: &#91;"True", "False", "Unknown"&#93; |
| `status.conditions[].type` | string | Yes | type of condition in CamelCase or in foo.example.com/CamelCase. maxLength: 316; pattern: "^(&#91;a-z0-9&#93;(&#91;-a-z0-9&#93;*&#91;a-z0-9&#93;)?(&#92;&#92;.&#91;a-z0-9&#93;(&#91;-a-z0-9&#93;*&#91;a-z0-9&#93;)?)*/)?((&#91;A-Za-z0-9&#93;&#91;-A-Za-z0-9_.&#93;*)?&#91;A-Za-z0-9&#93;)$" |
| `status.invitationID` | string | No | InvitationID is the host-side id of a pending invitation, set while an outside collaborator has not yet accepted. maxLength: 64 |
| `status.observedGeneration` | integer | No | ObservedGeneration mirrors metadata.generation last reconciled. |

## Connection (v1alpha1)

API: `code.faros.sh/v1alpha1` · Resource: `connections` · Scope: `Cluster`

[Source schema](https://github.com/faroshq/faros/blob/6f341b4e6d356dd28d1a90ec65e220b98a9bbb96/providers/code/deploy/chart/files/schemas/connections.code.faros.sh.yaml)

```bash
kubectl explain connections.code.faros.sh --api-version=code.faros.sh/v1alpha1 --recursive
```

| Field | Type | Required in parent | Description and constraints |
| --- | --- | --- | --- |
| `spec` | object | Yes | ConnectionSpec is the desired state. |
| `spec.baseURL` | string | No | BaseURL overrides the default git host endpoint for self-hosted installs (GitHub Enterprise Server, self-managed GitLab). Empty targets the provider's public SaaS endpoint. maxLength: 2048 |
| `spec.owner` | string | Yes | Owner is the org or user under which repositories created via this Connection land. Must be an account the credential can write to. minLength: 1; maxLength: 100 |
| `spec.provider` | string | Yes | Provider names the git hosting sub-provider. v1: github. enum: &#91;"github"&#93; |
| `spec.secretRef` | object | Yes | SecretRef points at the Secret in the tenant workspace holding the credential. For type=pat the default key is "token". |
| `spec.secretRef.key` | string | No | Key is the entry within the Secret's data holding the value. For a Connection PAT this defaults to "token"; for a DeployKey private key the controller writes "ssh-privatekey". maxLength: 253 |
| `spec.secretRef.name` | string | Yes | Name of the Secret. minLength: 1; maxLength: 253 |
| `spec.secretRef.namespace` | string | No | Namespace of the Secret. Empty resolves to the provider's convention namespace ("default"). maxLength: 253 |
| `spec.type` | string | Yes | Type selects the credential model. v1: pat. enum: &#91;"pat", "github-app", "oauth"&#93; |
| `status` | object | No | ConnectionStatus is the observed state. |
| `status.conditions` | array&#91;object&#93; | No | Conditions follows the standard Kubernetes conditions pattern. The Validated condition is True once the credential authenticates. |
| `status.conditions[].lastTransitionTime` | string | Yes | lastTransitionTime is the last time the condition transitioned from one status to another. This should be when the underlying condition changed. If that is not known, then using the time when the API field changed is acceptable. |
| `status.conditions[].message` | string | Yes | message is a human readable message indicating details about the transition. This may be an empty string. maxLength: 32768 |
| `status.conditions[].observedGeneration` | integer | No | observedGeneration represents the .metadata.generation that the condition was set based upon. For instance, if .metadata.generation is currently 12, but the .status.conditions&#91;x&#93;.observedGeneration is 9, the condition is out of date with respect to the current state of the instance. minimum: 0 |
| `status.conditions[].reason` | string | Yes | reason contains a programmatic identifier indicating the reason for the condition's last transition. Producers of specific condition types may define expected values and meanings for this field, and whether the values are considered a guaranteed API. The value should be a CamelCase string. This field may not be empty. minLength: 1; maxLength: 1024; pattern: "^&#91;A-Za-z&#93;(&#91;A-Za-z0-9_,:&#93;*&#91;A-Za-z0-9_&#93;)?$" |
| `status.conditions[].status` | string | Yes | status of the condition, one of True, False, Unknown. enum: &#91;"True", "False", "Unknown"&#93; |
| `status.conditions[].type` | string | Yes | type of condition in CamelCase or in foo.example.com/CamelCase. maxLength: 316; pattern: "^(&#91;a-z0-9&#93;(&#91;-a-z0-9&#93;*&#91;a-z0-9&#93;)?(&#92;&#92;.&#91;a-z0-9&#93;(&#91;-a-z0-9&#93;*&#91;a-z0-9&#93;)?)*/)?((&#91;A-Za-z0-9&#93;&#91;-A-Za-z0-9_.&#93;*)?&#91;A-Za-z0-9&#93;)$" |
| `status.login` | string | No | Login is the authenticated account the credential resolved to (e.g. the GitHub login). Empty until first successful validation. maxLength: 100 |
| `status.observedGeneration` | integer | No | ObservedGeneration mirrors metadata.generation last reconciled. |
| `status.scopes` | array&#91;string&#93; | No | Scopes lists the granted token scopes the git host reported, when discoverable (GitHub returns them on the X-OAuth-Scopes header). |

## DeployKey (v1alpha1)

API: `code.faros.sh/v1alpha1` · Resource: `deploykeys` · Scope: `Cluster`

[Source schema](https://github.com/faroshq/faros/blob/6f341b4e6d356dd28d1a90ec65e220b98a9bbb96/providers/code/deploy/chart/files/schemas/deploykeys.code.faros.sh.yaml)

```bash
kubectl explain deploykeys.code.faros.sh --api-version=code.faros.sh/v1alpha1 --recursive
```

| Field | Type | Required in parent | Description and constraints |
| --- | --- | --- | --- |
| `spec` | object | Yes | DeployKeySpec is the desired state. |
| `spec.publicKey` | string | No | PublicKey is an OpenSSH-format public key to register (bring your own). When empty the controller generates an ed25519 keypair and writes the private half to status.secretRef. maxLength: 8192 |
| `spec.readOnly` | boolean | No | ReadOnly registers the key without write (push) access. |
| `spec.repositoryRef` | string | Yes | RepositoryRef names the Repository (same workspace) this key is installed on. minLength: 1; maxLength: 253 |
| `spec.title` | string | No | Title is the human-readable label shown on the host. Empty uses metadata.name. maxLength: 255 |
| `status` | object | No | DeployKeyStatus is the observed state. |
| `status.conditions` | array&#91;object&#93; | No | Conditions follows the standard Kubernetes conditions pattern. |
| `status.conditions[].lastTransitionTime` | string | Yes | lastTransitionTime is the last time the condition transitioned from one status to another. This should be when the underlying condition changed. If that is not known, then using the time when the API field changed is acceptable. |
| `status.conditions[].message` | string | Yes | message is a human readable message indicating details about the transition. This may be an empty string. maxLength: 32768 |
| `status.conditions[].observedGeneration` | integer | No | observedGeneration represents the .metadata.generation that the condition was set based upon. For instance, if .metadata.generation is currently 12, but the .status.conditions&#91;x&#93;.observedGeneration is 9, the condition is out of date with respect to the current state of the instance. minimum: 0 |
| `status.conditions[].reason` | string | Yes | reason contains a programmatic identifier indicating the reason for the condition's last transition. Producers of specific condition types may define expected values and meanings for this field, and whether the values are considered a guaranteed API. The value should be a CamelCase string. This field may not be empty. minLength: 1; maxLength: 1024; pattern: "^&#91;A-Za-z&#93;(&#91;A-Za-z0-9_,:&#93;*&#91;A-Za-z0-9_&#93;)?$" |
| `status.conditions[].status` | string | Yes | status of the condition, one of True, False, Unknown. enum: &#91;"True", "False", "Unknown"&#93; |
| `status.conditions[].type` | string | Yes | type of condition in CamelCase or in foo.example.com/CamelCase. maxLength: 316; pattern: "^(&#91;a-z0-9&#93;(&#91;-a-z0-9&#93;*&#91;a-z0-9&#93;)?(&#92;&#92;.&#91;a-z0-9&#93;(&#91;-a-z0-9&#93;*&#91;a-z0-9&#93;)?)*/)?((&#91;A-Za-z0-9&#93;&#91;-A-Za-z0-9_.&#93;*)?&#91;A-Za-z0-9&#93;)$" |
| `status.keyID` | string | No | KeyID is the host-side id of the registered key. maxLength: 64 |
| `status.observedGeneration` | integer | No | ObservedGeneration mirrors metadata.generation last reconciled. |
| `status.secretRef` | object | No | SecretRef points at the Secret holding the generated private key (key "ssh-privatekey"). Only set when the controller generated the keypair (spec.publicKey was empty). The Secret is owned by this CR. |
| `status.secretRef.key` | string | No | Key is the entry within the Secret's data holding the value. For a Connection PAT this defaults to "token"; for a DeployKey private key the controller writes "ssh-privatekey". maxLength: 253 |
| `status.secretRef.name` | string | Yes | Name of the Secret. minLength: 1; maxLength: 253 |
| `status.secretRef.namespace` | string | No | Namespace of the Secret. Empty resolves to the provider's convention namespace ("default"). maxLength: 253 |

## Package (v1alpha1)

API: `code.faros.sh/v1alpha1` · Resource: `packages` · Scope: `Cluster`

[Source schema](https://github.com/faroshq/faros/blob/6f341b4e6d356dd28d1a90ec65e220b98a9bbb96/providers/code/deploy/chart/files/schemas/packages.code.faros.sh.yaml)

```bash
kubectl explain packages.code.faros.sh --api-version=code.faros.sh/v1alpha1 --recursive
```

| Field | Type | Required in parent | Description and constraints |
| --- | --- | --- | --- |
| `spec` | object | Yes | PackageSpec links the Package back to its owning Repository. Authored by the PackageController on create and immutable thereafter — everything observed is in status. |
| `spec.repositoryRef` | string | Yes | RepositoryRef names the Repository (same workspace) this package is published under. Also mirrored onto the LabelRepository label so the portal can list a repository's packages with a label selector. minLength: 1; maxLength: 253 |
| `status` | object | No | PackageStatus is the observed package metadata as last crawled from the host. |
| `status.conditions` | array&#91;object&#93; | No | Conditions follows the standard Kubernetes conditions pattern. |
| `status.conditions[].lastTransitionTime` | string | Yes | lastTransitionTime is the last time the condition transitioned from one status to another. This should be when the underlying condition changed. If that is not known, then using the time when the API field changed is acceptable. |
| `status.conditions[].message` | string | Yes | message is a human readable message indicating details about the transition. This may be an empty string. maxLength: 32768 |
| `status.conditions[].observedGeneration` | integer | No | observedGeneration represents the .metadata.generation that the condition was set based upon. For instance, if .metadata.generation is currently 12, but the .status.conditions&#91;x&#93;.observedGeneration is 9, the condition is out of date with respect to the current state of the instance. minimum: 0 |
| `status.conditions[].reason` | string | Yes | reason contains a programmatic identifier indicating the reason for the condition's last transition. Producers of specific condition types may define expected values and meanings for this field, and whether the values are considered a guaranteed API. The value should be a CamelCase string. This field may not be empty. minLength: 1; maxLength: 1024; pattern: "^&#91;A-Za-z&#93;(&#91;A-Za-z0-9_,:&#93;*&#91;A-Za-z0-9_&#93;)?$" |
| `status.conditions[].status` | string | Yes | status of the condition, one of True, False, Unknown. enum: &#91;"True", "False", "Unknown"&#93; |
| `status.conditions[].type` | string | Yes | type of condition in CamelCase or in foo.example.com/CamelCase. maxLength: 316; pattern: "^(&#91;a-z0-9&#93;(&#91;-a-z0-9&#93;*&#91;a-z0-9&#93;)?(&#92;&#92;.&#91;a-z0-9&#93;(&#91;-a-z0-9&#93;*&#91;a-z0-9&#93;)?)*/)?((&#91;A-Za-z0-9&#93;&#91;-A-Za-z0-9_.&#93;*)?&#91;A-Za-z0-9&#93;)$" |
| `status.htmlURL` | string | No | HTMLURL links to the package's browser page. maxLength: 2048 |
| `status.imageRepository` | string | No | ImageRepository is the pullable registry path (no tag/digest) for image packages, e.g. "ghcr.io/owner/repo/component". Combine with a version's digest to form a deployable reference. Empty for non-image packages. maxLength: 512 |
| `status.lastSyncTime` | string | No | LastSyncTime is when the crawler last refreshed this package from the host. |
| `status.observedGeneration` | integer | No | ObservedGeneration mirrors metadata.generation last reconciled. |
| `status.packageName` | string | No | PackageName is the package's name on the host (the artifact name, which may differ from the Kubernetes object name). maxLength: 255 |
| `status.type` | string | No | Type is the package ecosystem: container &#124; docker &#124; npm &#124; maven &#124; rubygems &#124; nuget. maxLength: 32 |
| `status.updatedAt` | string | No | UpdatedAt is the host's last-updated time in RFC3339, or "" when unknown. maxLength: 64 |
| `status.versionCount` | integer | No | VersionCount is how many versions the host reports (0 when unknown). |
| `status.versions` | array&#91;object&#93; | No | Versions is a bounded, most-recent-first list of the package's published versions with their tags and digest (populated for container/docker packages). It lets consumers resolve a build tag such as "sha-&lt;commit&gt;" to an immutable image digest. maxItems: 100 |
| `status.versions[].createdAt` | string | No | CreatedAt is the version's creation time in RFC3339, or "" when unknown. maxLength: 64 |
| `status.versions[].digest` | string | No | Digest is the version's immutable content digest, e.g. "sha256:…". maxLength: 256 |
| `status.versions[].tags` | array&#91;string&#93; | No | Tags are the tags pointing at this digest (e.g. "sha-&lt;commit&gt;", "latest"). maxItems: 64 |
| `status.visibility` | string | No | Visibility is "public", "internal", or "private" (host-reported; may be empty). maxLength: 32 |

## Repository (v1alpha1)

API: `code.faros.sh/v1alpha1` · Resource: `repositories` · Scope: `Cluster`

[Source schema](https://github.com/faroshq/faros/blob/6f341b4e6d356dd28d1a90ec65e220b98a9bbb96/providers/code/deploy/chart/files/schemas/repositories.code.faros.sh.yaml)

```bash
kubectl explain repositories.code.faros.sh --api-version=code.faros.sh/v1alpha1 --recursive
```

| Field | Type | Required in parent | Description and constraints |
| --- | --- | --- | --- |
| `spec` | object | Yes | RepositorySpec is the desired state. |
| `spec.autoInit` | boolean | No | AutoInit creates an initial commit (README) so the repository has a default branch immediately. Required if DeployKeys/clones must succeed right after creation. |
| `spec.connectionRef` | string | Yes | ConnectionRef names the Connection (same workspace) whose credential minLength: 1; maxLength: 253 |
| `spec.defaultBranch` | string | No | DefaultBranch names the initial default branch. Empty uses the host default (e.g. "main"). maxLength: 255 |
| `spec.description` | string | No | Description is set as the repository description on the host. maxLength: 2048 |
| `spec.name` | string | Yes | Name is the repository name on the git host (the path segment after the owner). DNS-ish; the host enforces its own rules. minLength: 1; maxLength: 100 |
| `spec.owner` | string | No | Owner overrides the Connection's owner for this single repository (e.g. to create under a different org the same credential controls). Empty inherits Connection.spec.owner. maxLength: 100 |
| `spec.visibility` | string | No | Visibility defaults to private when empty. enum: &#91;"private", "public", "internal"&#93; |
| `status` | object | No | RepositoryStatus is the observed state. |
| `status.cloneURL` | string | No | CloneURL is the HTTPS clone URL. maxLength: 2048 |
| `status.conditions` | array&#91;object&#93; | No | Conditions follows the standard Kubernetes conditions pattern. |
| `status.conditions[].lastTransitionTime` | string | Yes | lastTransitionTime is the last time the condition transitioned from one status to another. This should be when the underlying condition changed. If that is not known, then using the time when the API field changed is acceptable. |
| `status.conditions[].message` | string | Yes | message is a human readable message indicating details about the transition. This may be an empty string. maxLength: 32768 |
| `status.conditions[].observedGeneration` | integer | No | observedGeneration represents the .metadata.generation that the condition was set based upon. For instance, if .metadata.generation is currently 12, but the .status.conditions&#91;x&#93;.observedGeneration is 9, the condition is out of date with respect to the current state of the instance. minimum: 0 |
| `status.conditions[].reason` | string | Yes | reason contains a programmatic identifier indicating the reason for the condition's last transition. Producers of specific condition types may define expected values and meanings for this field, and whether the values are considered a guaranteed API. The value should be a CamelCase string. This field may not be empty. minLength: 1; maxLength: 1024; pattern: "^&#91;A-Za-z&#93;(&#91;A-Za-z0-9_,:&#93;*&#91;A-Za-z0-9_&#93;)?$" |
| `status.conditions[].status` | string | Yes | status of the condition, one of True, False, Unknown. enum: &#91;"True", "False", "Unknown"&#93; |
| `status.conditions[].type` | string | Yes | type of condition in CamelCase or in foo.example.com/CamelCase. maxLength: 316; pattern: "^(&#91;a-z0-9&#93;(&#91;-a-z0-9&#93;*&#91;a-z0-9&#93;)?(&#92;&#92;.&#91;a-z0-9&#93;(&#91;-a-z0-9&#93;*&#91;a-z0-9&#93;)?)*/)?((&#91;A-Za-z0-9&#93;&#91;-A-Za-z0-9_.&#93;*)?&#91;A-Za-z0-9&#93;)$" |
| `status.htmlURL` | string | No | HTMLURL is the browser URL of the repository. maxLength: 2048 |
| `status.observedGeneration` | integer | No | ObservedGeneration mirrors metadata.generation last reconciled. |
| `status.repoID` | string | No | RepoID is the host-side numeric/opaque id of the repository. maxLength: 64 |
| `status.sshURL` | string | No | SSHURL is the SSH clone URL (used together with a DeployKey). maxLength: 2048 |

## RepositoryBuildStatus (v1alpha1)

API: `code.faros.sh/v1alpha1` · Resource: `repositorybuildstatuses` · Scope: `Cluster`

[Source schema](https://github.com/faroshq/faros/blob/6f341b4e6d356dd28d1a90ec65e220b98a9bbb96/providers/code/deploy/chart/files/schemas/repositorybuildstatuses.code.faros.sh.yaml)

```bash
kubectl explain repositorybuildstatuses.code.faros.sh --api-version=code.faros.sh/v1alpha1 --recursive
```

| Field | Type | Required in parent | Description and constraints |
| --- | --- | --- | --- |
| `spec` | object | Yes | RepositoryBuildStatusSpec is the desired inspection/re-run request. |
| `spec.action` | string | No | Action selects status (default) or rerun. enum: &#91;"status", "rerun"&#93; |
| `spec.maxLogLines` | integer | No | MaxLogLines caps the failure-log tail per failed job (status action). minimum: 1; maximum: 1000 |
| `spec.ref` | string | No | Ref is the commit SHA to inspect (status) or the branch to re-run on (rerun). Empty inspects the most recent run / re-runs the default branch. maxLength: 255 |
| `spec.repositoryRef` | string | Yes | RepositoryRef names the Repository (same workspace) whose build to inspect. minLength: 1; maxLength: 253 |
| `spec.workflowFileName` | string | Yes | WorkflowFileName is the workflow file to inspect or dispatch (e.g. "faros-app-studio-build.yml"). minLength: 1; maxLength: 255 |
| `status` | object | No | RepositoryBuildStatusStatus is the observed result. |
| `status.completedAt` | string | No | No description supplied by the source schema. |
| `status.conditions` | array&#91;object&#93; | No | No description supplied by the source schema. |
| `status.conditions[].lastTransitionTime` | string | Yes | lastTransitionTime is the last time the condition transitioned from one status to another. This should be when the underlying condition changed. If that is not known, then using the time when the API field changed is acceptable. |
| `status.conditions[].message` | string | Yes | message is a human readable message indicating details about the transition. This may be an empty string. maxLength: 32768 |
| `status.conditions[].observedGeneration` | integer | No | observedGeneration represents the .metadata.generation that the condition was set based upon. For instance, if .metadata.generation is currently 12, but the .status.conditions&#91;x&#93;.observedGeneration is 9, the condition is out of date with respect to the current state of the instance. minimum: 0 |
| `status.conditions[].reason` | string | Yes | reason contains a programmatic identifier indicating the reason for the condition's last transition. Producers of specific condition types may define expected values and meanings for this field, and whether the values are considered a guaranteed API. The value should be a CamelCase string. This field may not be empty. minLength: 1; maxLength: 1024; pattern: "^&#91;A-Za-z&#93;(&#91;A-Za-z0-9_,:&#93;*&#91;A-Za-z0-9_&#93;)?$" |
| `status.conditions[].status` | string | Yes | status of the condition, one of True, False, Unknown. enum: &#91;"True", "False", "Unknown"&#93; |
| `status.conditions[].type` | string | Yes | type of condition in CamelCase or in foo.example.com/CamelCase. maxLength: 316; pattern: "^(&#91;a-z0-9&#93;(&#91;-a-z0-9&#93;*&#91;a-z0-9&#93;)?(&#92;&#92;.&#91;a-z0-9&#93;(&#91;-a-z0-9&#93;*&#91;a-z0-9&#93;)?)*/)?((&#91;A-Za-z0-9&#93;&#91;-A-Za-z0-9_.&#93;*)?&#91;A-Za-z0-9&#93;)$" |
| `status.dispatched` | boolean | No | Dispatched is true when a rerun action successfully fired. |
| `status.observedGeneration` | integer | No | No description supplied by the source schema. |
| `status.phase` | string | No | Phase is the coarse status for clients that do not parse conditions. |
| `status.run` | object | No | Run is the inspected run (status action). |
| `status.run.conclusion` | string | No | No description supplied by the source schema. |
| `status.run.found` | boolean | Yes | Found is false when no run exists for the request. |
| `status.run.headSHA` | string | No | No description supplied by the source schema. |
| `status.run.htmlURL` | string | No | No description supplied by the source schema. |
| `status.run.jobs` | array&#91;object&#93; | No | No description supplied by the source schema. |
| `status.run.jobs[].conclusion` | string | No | Conclusion is success &#124; failure &#124; cancelled &#124; ... &#124; "" while running. |
| `status.run.jobs[].failureLog` | string | No | FailureLog is a bounded tail of the job's logs, set only for a failed job. |
| `status.run.jobs[].name` | string | No | No description supplied by the source schema. |
| `status.run.jobs[].status` | string | No | Status is queued &#124; in_progress &#124; completed. |
| `status.run.runID` | integer | No | No description supplied by the source schema. |
| `status.run.status` | string | No | No description supplied by the source schema. |

## RepositoryCheckout (v1alpha1)

API: `code.faros.sh/v1alpha1` · Resource: `repositorycheckouts` · Scope: `Cluster`

[Source schema](https://github.com/faroshq/faros/blob/6f341b4e6d356dd28d1a90ec65e220b98a9bbb96/providers/code/deploy/chart/files/schemas/repositorycheckouts.code.faros.sh.yaml)

```bash
kubectl explain repositorycheckouts.code.faros.sh --api-version=code.faros.sh/v1alpha1 --recursive
```

| Field | Type | Required in parent | Description and constraints |
| --- | --- | --- | --- |
| `spec` | object | Yes | RepositoryCheckoutSpec is the desired checkout operation. |
| `spec.ref` | string | No | Ref is the branch, tag, or commit SHA to read. Empty uses the Repository's defaultBranch, then the host default. maxLength: 255 |
| `spec.repositoryRef` | string | Yes | RepositoryRef names the Repository (same workspace) to read. minLength: 1; maxLength: 253 |
| `status` | object | No | RepositoryCheckoutStatus is the observed result of the checkout operation. |
| `status.bundleRef` | object | No | BundleRef names the provider-owned bundle holding the checked-out files, scoped to this CR's cluster. |
| `status.bundleRef.digest` | string | No | Digest is the expected bundle digest, usually sha256:&lt;hex&gt;. maxLength: 96 |
| `status.bundleRef.name` | string | Yes | Name is the bundle object's provider-local name. minLength: 1; maxLength: 253 |
| `status.commitSHA` | string | No | CommitSHA is the commit the tree was read at. maxLength: 128 |
| `status.completedAt` | string | No | CompletedAt is when the controller reached a terminal phase. |
| `status.conditions` | array&#91;object&#93; | No | Conditions follows the standard Kubernetes conditions pattern. |
| `status.conditions[].lastTransitionTime` | string | Yes | lastTransitionTime is the last time the condition transitioned from one status to another. This should be when the underlying condition changed. If that is not known, then using the time when the API field changed is acceptable. |
| `status.conditions[].message` | string | Yes | message is a human readable message indicating details about the transition. This may be an empty string. maxLength: 32768 |
| `status.conditions[].observedGeneration` | integer | No | observedGeneration represents the .metadata.generation that the condition was set based upon. For instance, if .metadata.generation is currently 12, but the .status.conditions&#91;x&#93;.observedGeneration is 9, the condition is out of date with respect to the current state of the instance. minimum: 0 |
| `status.conditions[].reason` | string | Yes | reason contains a programmatic identifier indicating the reason for the condition's last transition. Producers of specific condition types may define expected values and meanings for this field, and whether the values are considered a guaranteed API. The value should be a CamelCase string. This field may not be empty. minLength: 1; maxLength: 1024; pattern: "^&#91;A-Za-z&#93;(&#91;A-Za-z0-9_,:&#93;*&#91;A-Za-z0-9_&#93;)?$" |
| `status.conditions[].status` | string | Yes | status of the condition, one of True, False, Unknown. enum: &#91;"True", "False", "Unknown"&#93; |
| `status.conditions[].type` | string | Yes | type of condition in CamelCase or in foo.example.com/CamelCase. maxLength: 316; pattern: "^(&#91;a-z0-9&#93;(&#91;-a-z0-9&#93;*&#91;a-z0-9&#93;)?(&#92;&#92;.&#91;a-z0-9&#93;(&#91;-a-z0-9&#93;*&#91;a-z0-9&#93;)?)*/)?((&#91;A-Za-z0-9&#93;&#91;-A-Za-z0-9_.&#93;*)?&#91;A-Za-z0-9&#93;)$" |
| `status.observedGeneration` | integer | No | ObservedGeneration mirrors metadata.generation last reconciled. |
| `status.phase` | string | No | Phase is the coarse status for clients that do not parse conditions. enum: &#91;"Pending", "Running", "Succeeded", "Failed"&#93; |
| `status.ref` | string | No | Ref is the branch/tag the backend resolved. maxLength: 255 |
| `status.skipped` | array&#91;string&#93; | No | Skipped lists repository paths the checkout left out (binary content, oversized files, tree/file-count caps), so consumers know the bundle is not the complete tree. maxItems: 100 |
| `status.source` | object | No | Source records where the checked-out bundle landed, without contents. The bundle is deleted once its consumer reads it, so this reference is short-lived by design. |
| `status.source.digest` | string | No | Digest is the bundle digest committed by the controller. maxLength: 96 |
| `status.source.fileCount` | integer | No | FileCount is the number of files in the bundle. |
| `status.source.size` | integer | No | Size is the total bundle size in bytes. |
| `status.startedAt` | string | No | StartedAt is when the controller first picked up the request. |

## RepositoryCommit (v1alpha1)

API: `code.faros.sh/v1alpha1` · Resource: `repositorycommits` · Scope: `Cluster`

[Source schema](https://github.com/faroshq/faros/blob/6f341b4e6d356dd28d1a90ec65e220b98a9bbb96/providers/code/deploy/chart/files/schemas/repositorycommits.code.faros.sh.yaml)

```bash
kubectl explain repositorycommits.code.faros.sh --api-version=code.faros.sh/v1alpha1 --recursive
```

| Field | Type | Required in parent | Description and constraints |
| --- | --- | --- | --- |
| `spec` | object | Yes | RepositoryCommitSpec is the desired commit operation. |
| `spec.branch` | string | No | Branch overrides the repository default branch. Empty uses the Repository's defaultBranch, then the host/provider default. maxLength: 255 |
| `spec.message` | string | No | Message is the commit message. Empty lets the backend choose a default. maxLength: 512 |
| `spec.repositoryRef` | string | Yes | RepositoryRef names the Repository (same workspace) to commit into. minLength: 1; maxLength: 253 |
| `spec.source` | object | Yes | Source identifies the provider-owned bundle to commit. File contents are intentionally not stored in this CR. |
| `spec.source.bundleRef` | object | Yes | BundleRef points at a provider-owned, immutable bundle object. |
| `spec.source.bundleRef.digest` | string | No | Digest is the expected bundle digest, usually sha256:&lt;hex&gt;. maxLength: 96 |
| `spec.source.bundleRef.name` | string | Yes | Name is the bundle object's provider-local name. minLength: 1; maxLength: 253 |
| `status` | object | No | RepositoryCommitStatus is the observed result of the commit operation. |
| `status.branch` | string | No | Branch is the branch the backend committed to. maxLength: 255 |
| `status.commitSHA` | string | No | CommitSHA is the resulting commit SHA. maxLength: 128 |
| `status.commitURL` | string | No | CommitURL is the browser URL for the resulting commit. maxLength: 2048 |
| `status.completedAt` | string | No | CompletedAt is when the controller reached a terminal phase. |
| `status.conditions` | array&#91;object&#93; | No | Conditions follows the standard Kubernetes conditions pattern. |
| `status.conditions[].lastTransitionTime` | string | Yes | lastTransitionTime is the last time the condition transitioned from one status to another. This should be when the underlying condition changed. If that is not known, then using the time when the API field changed is acceptable. |
| `status.conditions[].message` | string | Yes | message is a human readable message indicating details about the transition. This may be an empty string. maxLength: 32768 |
| `status.conditions[].observedGeneration` | integer | No | observedGeneration represents the .metadata.generation that the condition was set based upon. For instance, if .metadata.generation is currently 12, but the .status.conditions&#91;x&#93;.observedGeneration is 9, the condition is out of date with respect to the current state of the instance. minimum: 0 |
| `status.conditions[].reason` | string | Yes | reason contains a programmatic identifier indicating the reason for the condition's last transition. Producers of specific condition types may define expected values and meanings for this field, and whether the values are considered a guaranteed API. The value should be a CamelCase string. This field may not be empty. minLength: 1; maxLength: 1024; pattern: "^&#91;A-Za-z&#93;(&#91;A-Za-z0-9_,:&#93;*&#91;A-Za-z0-9_&#93;)?$" |
| `status.conditions[].status` | string | Yes | status of the condition, one of True, False, Unknown. enum: &#91;"True", "False", "Unknown"&#93; |
| `status.conditions[].type` | string | Yes | type of condition in CamelCase or in foo.example.com/CamelCase. maxLength: 316; pattern: "^(&#91;a-z0-9&#93;(&#91;-a-z0-9&#93;*&#91;a-z0-9&#93;)?(&#92;&#92;.&#91;a-z0-9&#93;(&#91;-a-z0-9&#93;*&#91;a-z0-9&#93;)?)*/)?((&#91;A-Za-z0-9&#93;&#91;-A-Za-z0-9_.&#93;*)?&#91;A-Za-z0-9&#93;)$" |
| `status.files` | array&#91;object&#93; | No | Files records per-file metadata for visibility and debugging. Contents stay in the bundle store. maxItems: 500 |
| `status.files[].delete` | boolean | No | Delete reports that this path was removed by the commit. |
| `status.files[].digest` | string | No | Digest is the file content digest, usually sha256:&lt;hex&gt;. maxLength: 96 |
| `status.files[].path` | string | Yes | Path is the repository-relative file path. minLength: 1; maxLength: 1024 |
| `status.files[].size` | integer | No | Size is the UTF-8 content size in bytes. |
| `status.observedGeneration` | integer | No | ObservedGeneration mirrors metadata.generation last reconciled. |
| `status.phase` | string | No | Phase is the coarse status for clients that do not parse conditions. enum: &#91;"Pending", "Running", "Succeeded", "Failed"&#93; |
| `status.source` | object | No | Source records the observed bundle metadata, without file contents. |
| `status.source.digest` | string | No | Digest is the bundle digest committed by the controller. maxLength: 96 |
| `status.source.fileCount` | integer | No | FileCount is the number of files in the bundle. |
| `status.source.size` | integer | No | Size is the total bundle size in bytes. |
| `status.startedAt` | string | No | StartedAt is when the controller first picked up the request. |
