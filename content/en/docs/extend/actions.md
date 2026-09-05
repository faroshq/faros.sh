---
title: "Provider Actions and assistant skills"
description: "Publish callable actions and distribute guidance without conflating permissions."
weight: 9
doc_type: "Guide"
---

Provider Actions declare versioned operations, input/output schemas, limits, consent, and the exact bound resource type in a CatalogEntry. Applications receive grants to specific resources and invoke actions under workload identity.

The reviewed implementation supports synchronous actions; Databricks `query_table/v1` is the implemented action described in these guides. Do not advertise unsupported execution or idempotency modes.

Assistant skills distribute instructions and supporting resources. They do not confer action grants or tool authority. Test skill distribution separately from action authorization.

Verify catalog validation, exact resource binding, denied access, revocation, schema changes, and bounded results before publishing an action.

[Action contract](https://github.com/faroshq/faros/blob/main/docs/provider-actions.md) · [Application SDK](https://github.com/faroshq/faros/blob/main/provider-sdk/actions-node/README.md) · [App integration tutorial](/docs/use/app-studio/databricks/).
