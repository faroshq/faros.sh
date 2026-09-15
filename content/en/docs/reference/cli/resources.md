---
title: Work with provider resources
description: Select a workspace, discover its APIs, and inspect resources with kubectl.
weight: 8
doc_type: Guide
---

## Choose the right command and context

Install the [CLI](/docs/get-started/install/) and authenticate first. `kubectl railgrid` handles Railgrid-specific workflows such as workspace selection, edges, and MCP setup. Standard `kubectl` handles the Kubernetes-style APIs exposed in a workspace. Provider HTTP APIs and MCP tools handle actions outside resource CRUD.

```bash
kubectl railgrid use
kubectl config current-context
kubectl api-resources
```

Select the intended organization and workspace in the picker. The context name alone does not identify the workspace: `railgrid use` updates its endpoint. Confirm the API groups you expect in discovery. After connecting to an edge, select your Railgrid workspace again before running provider-resource commands.

Use fully qualified resource names, such as `instances.infrastructure.railgrid.ai`, because multiple providers expose resources named `connections`. The examples use workspace-scoped, cluster-scoped resources; hosting-cluster namespaces are a different boundary.

## Inspect before changing

```bash
kubectl api-resources --api-group=infrastructure.railgrid.ai
kubectl explain instances.infrastructure.railgrid.ai.spec
kubectl auth can-i create instances.infrastructure.railgrid.ai
kubectl get instances.infrastructure.railgrid.ai
```

Discovery establishes that the API is exposed, not that its provider is healthy. A permission check evaluates the current credential; it does not prove another user or service account has access. An authorization or discovery failure should be resolved before applying a manifest.

For a known resource, inspect its conditions and watch changes:

```bash
kubectl get instances.infrastructure.railgrid.ai INSTANCE-NAME -o yaml
kubectl get instances.infrastructure.railgrid.ai INSTANCE-NAME --watch
```

Replace uppercase placeholders before running commands. Use Ctrl-C to stop a watch; it does not stop reconciliation. Treat resource output as potentially sensitive and redact it before sharing.

## Apply reviewed manifests

Use standard `kubectl apply -f FILE` for provider resources after checking their installed schema. A successful apply means the API accepted the object; inspect provider status and test the resulting service before treating the task as complete.

`kubectl railgrid get` is a separate convenience command supporting only `edges`, `workloads`, and `placements`. The source-baseline `railgrid apply` has its own resource mapping; it is not a replacement for Kubernetes API discovery across every provider.

See [provision an instance](/docs/use/infrastructure/quickstart/) and [manage agent schedules](/docs/use/agents/schedules/) for complete examples.
