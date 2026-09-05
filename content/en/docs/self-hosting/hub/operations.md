---
title: "Monitor, recover, and upgrade"
description: "Plan around the state each component owns."
weight: 8
doc_type: "Guide"
---

## Monitor

Track hub and provider readiness, reconciliation failures, agent connectivity, and persistent-store health. A provider answering HTTP is not necessarily ready to reconcile resources; use its configured readiness probe and resource conditions.

For an unavailable capability, inspect its pod events and logs, hub registration/heartbeat, and accepted API bindings before restarting components.

## Inspect the hosting cluster from the CLI

These commands use the Kubernetes context that hosts the hub/provider pods, **not a Faros workspace or connected-edge context**. Replace `HOSTING-CONTEXT`, `NAMESPACE`, `POD-NAME`, and `CONTAINER-NAME` with your deployment's values.

```bash
kubectl --context HOSTING-CONTEXT get pods -n NAMESPACE
kubectl --context HOSTING-CONTEXT get deployments,statefulsets -n NAMESPACE
kubectl --context HOSTING-CONTEXT describe pod POD-NAME -n NAMESPACE
kubectl --context HOSTING-CONTEXT logs POD-NAME -n NAMESPACE -c CONTAINER-NAME --tail=100
kubectl --context HOSTING-CONTEXT get events -n NAMESPACE --sort-by=.metadata.creationTimestamp
```

Use the container names shown by pod inspection. The hub chart's serving container is `hub`; provider container names vary. Check readiness, restart counts, probe failures, image pulls, and storage errors. If a container restarted, inspect its previous logs with `--previous`. Redact credentials and request data before sharing logs.

Check rollout state against the discovered workload name:

```bash
kubectl --context HOSTING-CONTEXT rollout status deployment/DEPLOYMENT-NAME -n NAMESPACE --timeout=180s
```

For embedded-kcp hubs, use `statefulset/STATEFULSET-NAME` instead. A timeout does not roll back an installation. Inspect events and logs before deciding on a recovery action.

## Record the installed Helm release

```bash
helm --kube-context HOSTING-CONTEXT list -n NAMESPACE
helm --kube-context HOSTING-CONTEXT status RELEASE-NAME -n NAMESPACE
helm --kube-context HOSTING-CONTEXT history RELEASE-NAME -n NAMESPACE
```

Record chart and image versions before upgrading. Helm status is not an end-to-end health check: also verify login, workspace API discovery, provider access, and one representative task. Use the selected chart's installation instructions for upgrade flags and values; rollback remains conditional on migration compatibility.

## Storage and recovery

Inventory embedded/external kcp state, provider databases, persistent volumes, encryption keys, credentials, and runtime data. Repositories and upstream services have separate retention responsibilities.

Before upgrading, take backups using each datastore’s supported procedure and verify a restore in an isolated environment. Keep encryption keys with the recovery plan: a database backup alone may not make encrypted messages readable. Reconcile runtime resources against restored control-plane state before allowing writes.

This documentation does not establish a tested backup product or recovery-time objective. Define and rehearse a deployment-specific restore procedure before depending on recovery.

## Scaling

Embedded kcp remains single-replica. External kcp permits multiple hub replicas. Provider limits differ: consult the provider’s own chart and [hosting guide](/docs/self-hosting/providers/). Do not apply one replica count to every component.

## Upgrade and rollback

1. Record deployed chart, image, and schema versions and read their change notes.
2. Back up required state and preserve the current values and credentials.
3. Rehearse the upgrade against restored/test data.
4. Upgrade compatible components, then verify readiness, sign-in, provider enablement, and a representative task.
5. If it fails, inspect migration compatibility before rolling back. A Helm rollback cannot undo an incompatible database or resource-schema migration.

For uninstall, inventory and remove dependent resources first. Helm removal may retain PVCs or secrets; delete retained state only after its owners agree it is no longer needed.
