---
title: "Author infrastructure templates"
description: "Publish configurable products through the Infrastructure catalog."
weight: 8
doc_type: "Guide"
---

Templates define configurable inputs, runtime resources, and supported outputs. Tenants provision them through the shared `Instance` API.

1. Define configurable values in the template schema, with appropriate defaults and validation.
2. Define runtime resources and any development, data-plane, or exposure requirements.
3. Register the template through your Infrastructure deployment.
4. Provision a disposable Instance and verify validation, readiness, outputs, updates, and deletion.
5. Test missing credentials and invalid inputs before making the template available to users.

Do not introduce a tenant-facing resource kind for every template. Use `Instance.spec.template` and `spec.values`. Template-specific runtime kinds are an implementation detail.

[Template conventions](https://github.com/faroshq/faros/blob/main/providers/infrastructure/docs/template-conventions.md) · [Credential conventions](https://github.com/faroshq/faros/blob/main/providers/infrastructure/docs/credentials.md).
