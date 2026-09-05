---
title: "Author infrastructure templates"
description: "Publish configurable products through the Infrastructure catalog."
weight: 8
doc_type: "Guide"
---

An Infrastructure `Template` is a catalog entry for a configurable product. Its `spec.schema` describes the values an instance owner may provide, while `spec.backendConfig` describes the resources the Infrastructure backend materializes. Tenants create the shared `Instance` kind and select the product with `spec.template`; a new template does not add a new tenant-facing API kind.

This walkthrough uses the repository's `simple-webapp` seed template. It provisions one HTTP workload with a public URL, and its schema has the same inputs used by the catalog form: a name, image, port, replica count, environment map, and exposure settings. See the complete [simple-webapp template](https://github.com/faroshq/faros/blob/main/providers/infrastructure/install/templates/simple-webapp.yaml) before adapting the example.

## Design the contract first

Start with the values an instance owner must choose. Per-instance values belong in `spec.schema` and should have typed defaults where a safe default exists. The simple web app uses an integer default for `port`, bounds `replicas` from 1 through 10, and validates `expose.hostnamePrefix` as a DNS label. A value that the platform computes, such as `expose.fqdn` or `farosCluster`, is still represented in the schema so the controller and graph can distinguish it from tenant input; its description tells callers not to set it.

Use a schema rule when validity depends on more than a field type. In `simple-webapp`, production requires `image`, while development mode can omit it because the platform supplies the development image. This excerpt omits the development configuration that supplies `farosMode`; retain that configuration from the complete seed template:

```yaml
schema:
  type: object
  properties:
    name:
      type: string
    image:
      type: string
      description: Required in production; ignored in development mode.
    port:
      type: integer
      default: 8080
    replicas:
      type: integer
      default: 1
      minimum: 1
      maximum: 10
  required: [name]
  x-kubernetes-validations:
    - rule: "(has(self.farosMode) && self.farosMode == 'development') || has(self.image)"
      message: "image is required in production mode"
```

Keep images and other per-instance settings in schema fields with sane defaults. Use a literal for fixed tooling images. Reserved `${faros.*}` substitutions are for platform-wide values that have no universal default, such as the configured Gateway; they are not an environment-variable override for a tenant's image or version. The [template authoring conventions](https://github.com/faroshq/faros/blob/main/providers/infrastructure/docs/template-conventions.md) explain this boundary and the type errors caused by string substitutions.

## Describe the product and its runtime

The top of a template supplies the catalog and controller contract. This abbreviated outline is not installable; use the complete linked seed template for the walkthrough:

```yaml
apiVersion: infrastructure.faros.sh/v1alpha1
kind: Template
metadata:
  name: simple-webapp
spec:
  displayName: "Simple web app"
  description: "A single-container web app on a public URL."
  category: Workloads
  version: 0.2.0
  exposure: public
  backend: kro
  sampleValues:
    name: demo-site
    image: nginx:latest
    port: 80
  instanceCRD:
    group: infrastructure.faros.sh
    version: v1alpha1
    resource: simplewebapps
    kind: SimpleWebApp
  schema: {} # Replace with the complete schema from the linked seed template.
  backendConfig:
    resources: [] # Replace with the seed template's complete runtime resources.
    status: {} # Replace with the seed template's status expressions.
```

`sampleValues` drives the catalog's one-click example; it is not a replacement for schema defaults or validation. `exposure` describes what the graph provides: an internal template must not contain an HTTP route, an optional template must make exposure conditional, and a public template must create the route for each instance. The controller and backend use `instanceCRD` as the graph's per-template identity, but tenants still operate the shared `Instance` resource.

`backendConfig` is opaque to the platform. For the `kro` backend it contains the resource graph and status mapping. Put Deployments, Services, routes, credentials, and other runtime resources there, and map only stable, useful results to status. Do not make consumers reach into the runtime cluster: the Infrastructure provider owns that cluster and exposes the instance contract through the hub.

## Register and verify a template

Templates are registered by the Infrastructure provider deployment in its provider workspace. Add the template to the provider's installation set and deploy the provider through the same operator or chart workflow used for the rest of that installation. The operator bootstraps the provider workspace, API export, schemas, and catalog templates; it also reconciles the backend that will author the runtime graph. The provider README documents the [operator install and verification flow](https://github.com/faroshq/faros/blob/main/providers/infrastructure/README.md#deploy-operator).

Verify registration before testing an instance. The provider's catalog should show the template's name, display name, category, version, exposure, schema, and sample values. In a deployment using the provider MCP surface, `list_templates` and `describe_template` expose that same catalog contract. A registered template is not ready merely because its YAML was accepted: the backend must accept its graph. The seed-template tests decode every embedded template, run controller validation, and the backend e2e waits for `GraphAccepted=True` before provisioning.

## Provision a disposable instance

Select the intended organization and workspace, then create one shared `Instance` with the template name and schema values. This is the shape used by the current API:

```yaml
apiVersion: infrastructure.faros.sh/v1alpha1
kind: Instance
metadata:
  name: demo-site
spec:
  template: simple-webapp
  values:
    name: demo-site
    image: nginx:latest
    port: 80
    replicas: 1
    access: public
    expose:
      hostnamePrefix: demo-site
```

Save this instance as `demo-site.yaml`. Apply it from a kubeconfig targeting the selected workspace, using the API export and credentials supplied by your hub administrator. The exact kubeconfig setup is deployment-specific; do not apply this object to the provider's runtime cluster. The [Instance API type](https://github.com/faroshq/faros/blob/main/providers/infrastructure/apis/v1alpha1/types_instance.go) defines `spec.template` as immutable and `spec.values` as the template-shaped input.

```bash
kubectl apply -f demo-site.yaml
kubectl get instances.infrastructure.faros.sh demo-site -o yaml
```

The instance controller validates `spec.values` against `Template.spec.schema`. Invalid values can be admitted and report a `Valid=False` / `InvalidValues` condition; they are not proof that the runtime graph was created. Fix the values and inspect the next reconciliation. Once valid, the backend materializes the template graph and mirrors its lifecycle into `status.phase`, `status.conditions`, and template-defined outputs such as `status.url` and `status.ready`.

For this example, verify all of the following before handing the URL to another user:

1. The instance is `Ready` and its reported URL is present.
2. The URL reaches the expected container and the container listens on the selected port.
3. The reported ready count matches the requested replicas.
4. The status and runtime conditions identify the same instance and generation.
5. A private template or private instance is tested with a second identity when access controls are part of the contract.

The portal and MCP provision flow use the same template schema and instance lifecycle. A successful catalog form submission does not replace checking `Valid`, backend readiness, route reachability, and the outputs documented by the template.

## Update and clean up safely

Treat `spec.template` as immutable. To change products, create a new instance and migrate any dependent data deliberately. Update only schema fields that the template supports in place; for immutable inputs such as a database major version, follow the template's documented recreate-and-migrate procedure.

Delete the disposable `Instance` through the same workspace-scoped API used to create it:

```bash
kubectl delete instances.infrastructure.faros.sh demo-site
kubectl wait --for=delete instances.infrastructure.faros.sh/demo-site --timeout=120s
```

If deletion times out, inspect the remaining resource and operator logs. Confirm that the backend resources and finalizers have gone away, and check the template's data-retention behavior before assuming that external data was removed. For a database or other stateful product, deleting the instance is not a backup or migration plan.

Before publishing a template to other workspaces, test the complete lifecycle with valid defaults, missing required values, invalid enum/range/pattern values, missing credentials, update attempts, readiness failure, and deletion. The repository's [seed-template validation tests](https://github.com/faroshq/faros/blob/main/providers/infrastructure/install/seedtemplates_test.go) are the authoritative minimum for embedded templates; add backend graph tests that prove the graph is accepted and that its status mapping exposes the outputs your consumers need.

[Credential conventions](https://github.com/faroshq/faros/blob/main/providers/infrastructure/docs/credentials.md) · [Instance view conventions](https://github.com/faroshq/faros/blob/main/providers/infrastructure/docs/instance-views.md).
