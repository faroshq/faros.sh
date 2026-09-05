---
title: Work with provider resources
description: Select a workspace, discover its APIs, and inspect resources with kubectl.
weight: 8
doc_type: Guide
---

## Choose the right command and context

Install the [CLI](/docs/get-started/install/) and authenticate first. `kubectl faros` handles Faros-specific workflows such as workspace selection, edges, and MCP setup. Standard `kubectl` handles the Kubernetes-style APIs exposed in a workspace. Provider HTTP APIs and MCP tools handle actions outside resource CRUD.

```bash
kubectl faros use
kubectl config current-context
kubectl api-resources
```

Select the intended organization and workspace in the picker. The context name alone does not identify the workspace: `faros use` updates its endpoint. Confirm the API groups you expect in discovery. After connecting to an edge, select your Faros workspace again before running provider-resource commands.

Use fully qualified resource names, such as `instances.infrastructure.faros.sh`, because multiple providers expose resources named `connections`. The examples use workspace-scoped, cluster-scoped resources; hosting-cluster namespaces are a different boundary.

## Inspect before changing

```bash
kubectl api-resources --api-group=infrastructure.faros.sh
kubectl explain instances.infrastructure.faros.sh.spec
kubectl auth can-i create instances.infrastructure.faros.sh
kubectl get instances.infrastructure.faros.sh
```

Discovery establishes that the API is exposed, not that its provider is healthy. A permission check evaluates the current credential; it does not prove another user or service account has access. An authorization or discovery failure should be resolved before applying a manifest.

For a known resource, inspect its conditions and watch changes:

```bash
kubectl get instances.infrastructure.faros.sh INSTANCE-NAME -o yaml
kubectl get instances.infrastructure.faros.sh INSTANCE-NAME --watch
```

Replace uppercase placeholders before running commands. Use Ctrl-C to stop a watch; it does not stop reconciliation. Treat resource output as potentially sensitive and redact it before sharing.

## Apply reviewed manifests

Use standard `kubectl apply -f FILE` for provider resources after checking their installed schema. A successful apply means the API accepted the object; inspect provider status and test the resulting service before treating the task as complete.

`kubectl faros get` is a separate convenience command supporting only `edges`, `workloads`, and `placements`. The source-baseline `faros apply` has its own resource mapping; it is not a replacement for Kubernetes API discovery across every provider.

See [provision an instance](/docs/use/infrastructure/quickstart/) and [manage agent schedules](/docs/use/agents/schedules/) for complete examples.
