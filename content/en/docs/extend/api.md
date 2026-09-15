---
title: Defining the API
description: APIResourceSchemas, the APIExport, permission claims, and schema versioning.
weight: 2
---

A provider's API surface is a set of custom resources that tenants create in their own workspaces. The plumbing is kcp's: you publish an **`APIExport`** referencing **`APIResourceSchema`** objects; tenants get the resources via an **`APIBinding`** (created by the hub's Enable flow). Your `init` subcommand applies all of it — see [Anatomy & lifecycle](/docs/extend/anatomy/) for where that runs.

## APIResourceSchemas

An `APIResourceSchema` is kcp's workspace-aware equivalent of a CRD. You generate them from your Go types the same way you'd generate CRDs (the Railgrid repo does this with controller-gen plus a conversion step in `make codegen`), and bake the YAML files into your image under `/etc/railgrid/schemas`.

Names are version-prefixed and encode the group and resource:

```
v260522-001.greetings.quickstart.providers.railgrid.ai
└───┬────┘ └───┬───┘ └──────────────┬──────────────────┘
 revision   resource              group
```

**Schemas are immutable.** Once applied, the body can't change. To change your API, ship a new file with a bumped revision prefix (`v260522-002...`) and reference the new name from the export. Old bindings keep working against the old schema until they're migrated.

Group convention: `<provider>.providers.railgrid.ai` for provider-scoped APIs (quickstart), or a first-class group like `code.railgrid.ai` / `infrastructure.railgrid.ai` for platform providers. Pick one and stay consistent — the group appears in every tenant's `kubectl` output.

## The APIExport

The SDK's `init` bootstrap builds the export from three inputs you pass it: the export name, the schema list (derived from the schema files), and permission claims:

```go
// init_cmd.go — what a provider passes to the SDK bootstrap
import sdkinstall "github.com/railgrid/provider-sdk/install"

err := sdkinstall.Bootstrap(ctx, sdkinstall.Options{
    Config:        config, // rest.Config from RAILGRID_PROVIDER_KUBECONFIG
    ExportName:    "quickstart.providers.railgrid.ai",
    WorkspacePath: "root:railgrid:providers:quickstart",
    SchemasDir:    "/etc/railgrid/schemas",
    Claims: []sdkinstall.PermissionClaim{
        {Resource: "configmaps", Verbs: []string{"get", "list", "watch"}},
    },
    CatalogEntryFile: os.Getenv("RAILGRID_CATALOGENTRY_FILE"),
})
```

Two behaviors worth knowing:

- **`spec.resources` is merged, not replaced.** The SDK merges by group+name. Infrastructure now exports a shared `Instance` kind; adding a template does not add a tenant-facing kind.
- **The endpoint slice is delete-and-recreated on path change.** `APIExportEndpointSlice.spec.export` is immutable in kcp; the SDK handles stale slices for you.

## Permission claims

Permission claims let your controllers touch resources *in the tenant's workspace* that your export doesn't own — Secrets for credentials, ConfigMaps for settings, another provider's resources for integration.

```yaml
apiExport:
  name: "kuery.providers.railgrid.ai"
  permissionClaims:
    - group: "edges.railgrid.ai"
      resource: kubernetesclusters
      verbs: [get, list, watch]
      tenantScoped: true
```

Rules of the road:

- **`tenantScoped: true`** marks a claim as bounded to the binding tenant's own workspace — the common, auto-acceptable case. Claims that aren't tenant-scoped are refused unless a platform admin overrides with the `railgrid.ai/accept-untrusted-claims` annotation.
- **First-party claim groups need an identity hash.** Claiming a `*.railgrid.ai` group (like the kuery example above) requires the export's `identityHash`, which the platform admin supplies at deploy time (it's a Helm value, visible in the hub's admin view). Built-in Kubernetes types (empty group — `configmaps`, `secrets`) need none.
- **Don't over-claim.** Each claim is rendered in the Enable dialog and is friction plus security review for every tenant. Start with the narrowest set you need.

The claims live in two places: on the **APIExport** (where kcp enforces them) and mirrored on the **CatalogEntry** (where the portal renders the Enable dialog). Keep them in sync — the dialog shows the CatalogEntry copy, kcp enforces the export copy.

## What the tenant sees

After Enable, your resources are ordinary objects in the tenant workspace:

```bash
kubectl get greetings.quickstart.providers.railgrid.ai
kubectl apply -f my-greeting.yaml
```

Status subresource conventions follow the Railgrid house style: a `phase` string for at-a-glance state plus `conditions[]` (with `Ready` as the summary condition) for machine consumption. Every shipped provider follows this; tenants and the portal rely on it.

## Consuming your API from controllers

Defining the API is half the story — reconciling it across all tenant workspaces is the other half, and that's the [virtual workspace](/docs/extend/virtual-workspace/) guide.
