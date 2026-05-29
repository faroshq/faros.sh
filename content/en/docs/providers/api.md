---
title: Defining the API
description: CRDs, APIExport, APIBinding, and permission claims.
weight: 3
---

A provider's API surface is one or more **CRDs** that tenants can create in their own workspace. The plumbing is kcp's: you publish an `APIExport` with the schemas you want to share, tenants create an `APIBinding` to pull those resources into their workspace, and from there they're regular `kubectl` objects.

The kedge hub handles all the bootstrap for you. You just declare the schemas; the hub creates the `APIExport`, the bind grants, and the catalog metadata that drives the portal's Enable button.

## The flow, end to end

1. **You declare** `CatalogEntry.spec.apiExport` (third-party) or pass equivalent data through `BuiltinSpec` (first-party). It includes the export name, the inline schemas, and any permission claims you need to read tenant data.
2. **The hub reconciles**: creates a per-provider workspace at `root:kedge:providers:<your-name>`, applies the `APIResourceSchema` objects there, creates the `APIExport`, and installs a `ClusterRoleBinding` so `system:authenticated` users are allowed to bind.
3. **The tenant clicks Enable** in the portal. The portal posts an `APIBinding` into the tenant's workspace pointing at your export.
4. **kcp materializes** the bound resources. The tenant can now `kubectl get yourthings` in their workspace.
5. **Your controllers** watch through the export's "virtual workspace" — the union of all bound tenants' resources — and reconcile each one. (Out of scope for this page; the same kcp controller pattern any APIExport author uses.)

## The CatalogEntry shape

```yaml
apiVersion: providers.kedge.faros.sh/v1alpha1
kind: CatalogEntry
metadata:
  name: my-provider
spec:
  displayName: "My Provider"
  description: "Manage Things."
  category: "Custom"

  apiExport:
    # APIExport name — convention: <provider>.providers.kedge.faros.sh.
    # This becomes the name of the kcp APIExport object.
    name: "my-provider.providers.kedge.faros.sh"

    # PermissionClaims tell kcp what your provider's controllers may
    # access *in the tenant's workspace* beyond your own CRDs. Each
    # claim shows up in the Enable dialog so the tenant explicitly
    # accepts it before the binding is created.
    permissionClaims:
      - group: ""
        resource: configmaps
        verbs: [get, list, watch]
        tenantScoped: true
      - group: ""
        resource: secrets
        verbs: [get, list, watch]
        tenantScoped: true

    # Inline APIResourceSchema documents. The hub applies these into
    # the per-provider workspace before creating the export. body is
    # the full APIResourceSchema YAML as a string — easy to template
    # from your CRD generator output.
    schemas:
      - groupResource: "things.my-provider.providers.kedge.faros.sh"
        body: |
          apiVersion: apis.kcp.io/v1alpha1
          kind: APIResourceSchema
          metadata:
            name: v260529-abc.things.my-provider.providers.kedge.faros.sh
          spec:
            group: my-provider.providers.kedge.faros.sh
            names:
              kind: Thing
              listKind: ThingList
              plural: things
              singular: thing
            scope: Namespaced
            versions:
              - name: v1alpha1
                served: true
                storage: true
                schema:
                  openAPIV3Schema:
                    type: object
                    properties:
                      spec:
                        type: object
                        properties:
                          replicas:
                            type: integer
                      status:
                        type: object
                        properties:
                          phase: { type: string }
                additionalPrinterColumns:
                  - name: Phase
                    type: string
                    jsonPath: .status.phase

  # The UI/backend URL fields — covered in the UI and Virtual Workspace guides.
  ui:
    url: "http://my-provider-portal.my-namespace.svc:8080"
  backend:
    url: "http://my-provider-backend.my-namespace.svc:8080"
```

### Schema versioning

`APIResourceSchema` names must be unique and immutable per kcp's contract — once applied you can't mutate the schema body in place. The convention is to prefix with a date or version suffix: `v260529-abc.things.my-provider.providers.kedge.faros.sh`. When you change the schema, ship a new name. The `APIExport` references the latest by name, and old bindings continue to work against the old schema.

In practice this means your CRD code-generation pipeline writes a new file per change, and you bump the schema name on every release. The first-party providers in the kedge repo follow this pattern; see `config/kcp/apiresourceschema-edges.kedge.faros.sh.yaml` for an example.

## Permission claims

Permission claims are kcp's way of letting an `APIExport`'s controllers read or write resources *in the tenant workspace* that the provider doesn't own. Examples:

- A "secrets sync" provider needs `get/list/watch` on `Secrets` to mirror them somewhere.
- A "policy" provider needs `list/watch` on `Pods` and `Deployments` to validate them.
- A "cost" provider needs `list` on `Nodes` and `Pods` to compute usage.

Each claim names the resource + verbs. The portal surfaces them in the Enable dialog:

> *Enable my-provider in workspace `tenant-foo`?*
> *It will be granted:*
> - *`get, list, watch` on `configmaps`*
> - *`get, list, watch` on `secrets`*
>
> *[Cancel] [Enable]*

When the tenant clicks Enable, the portal sets each claim's `state: Accepted` on the `APIBinding`; un-accepted claims become `state: Rejected` and kcp refuses to expose those resources to your controllers.

### `tenantScoped: true`

Mark claims as `tenantScoped` if they're scoped to the tenant's own workspace (the common case). Untrusted/cross-workspace claims require an admin annotation on the `CatalogEntry` (`kedge.faros.sh/accept-untrusted-claims`) and shouldn't be the default.

### Don't over-claim

A provider that claims `*/*` will be rejected by careful tenants every time. Start with the narrowest set of resources you actually need; expand only when you have a concrete reason. Each new claim is friction at Enable time and a security review the tenant has to do.

## What the tenant sees on Enable

The portal's flow once the user clicks Enable on the catalog page:

1. Fetches `/api/providers` to get the `permissionClaims` list.
2. Shows the confirmation dialog with each claim laid out.
3. On accept, POSTs an `APIBinding` into the tenant's workspace:
   ```yaml
   apiVersion: apis.kcp.io/v1alpha1
   kind: APIBinding
   metadata:
     name: my-provider-binding
   spec:
     reference:
       export:
         path: "root:kedge:providers:my-provider"
         name: "my-provider.providers.kedge.faros.sh"
     permissionClaims:
       - { group: "", resource: configmaps, state: Accepted, ... }
   ```
4. kcp resolves the bind (the hub's `ApplyBindGrant` already authorized `system:authenticated` to bind your export, so this succeeds).
5. The portal refreshes; the provider's resources are now visible in the tenant's workspace.

The disable flow is the inverse: delete the `APIBinding` and kcp cleans up the materialized resources.

## Discovering bound providers from the portal

The portal lists `APIBinding`s in the tenant workspace and matches `spec.reference.export.path` against the catalog to figure out which providers are enabled for the current tenant. That drives the side nav: enabled providers (with UIs) appear in the nav; unbound providers are visible only in the catalog page.

## First-party variant

First-party providers don't need a `CatalogEntry` YAML — the hub's bootstrap creates one automatically from the `BuiltinSpec` registered in Go. The CRDs ship in the hub repo under `config/crds/` and `config/kcp/apiresourceschema-*.yaml`, and the bootstrap applies them at startup before creating the export.

If your first-party provider needs CRDs, the conventional places to add them are:

```
config/crds/<your>.kedge.faros.sh_<resource>.yaml      # for plain CRDs
config/kcp/apiresourceschema-<resource>.<group>.yaml   # for the kcp schema
pkg/hub/bootstrap/crds/...                              # for the embedded copy the hub installer applies
```

The CI codegen pipeline (`make codegen`) keeps these in sync with the Go types under `apis/<group>/v1alpha1/`.

## Beyond the basics

What this page doesn't cover yet:

- **Writing the controller**: the standard kcp APIExport-controller pattern with the virtual-workspace client. The existing providers (`providers/kubernetesedges/controllers/`) are good references.
- **Status subresource conventions**: how kedge providers report `phase` + `conditions`.
- **Webhook admission**: optional, same shape as any kcp APIExport that ships webhooks.

The [Virtual Workspace guide](/docs/providers/virtual-workspace/) covers the *other* kind of HTTP surface — handlers mounted at `/services/` that aren't tied to CRDs.
