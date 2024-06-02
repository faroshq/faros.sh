---
title: Install CLI
date: 2024-06-02
description: >
  How to install and use faros CLI.
categories: [cli, docs]
tags: [cli, docs]
weight: 1
---

{{% pageinfo %}}
Faros CLI can be used as standalone or kubectl plugin. It is a tool that allows you to interact with Faros API.
{{% /pageinfo %}}


### Prerequisites:
- Ensure `kubectl` is installed. If not, refer to the [official Kubernetes documentation](https://kubernetes.io/docs/tasks/tools/) for installation guidance.
- Install `krew`, the kubectl plugin manager, following the [official krew documentation](https://krew.sigs.k8s.io/docs/user-guide/setup/install/).


### Plugin Installation:
Execute the commands below to add the Faros plugin and install it:

```bash
kubectl krew index add faros https://github.com/faroshq/krew-index.git
kubectl krew install faros/faros
```

To update the plugin, run:

```bash
kubectl krew update
```


### Understanding Workspaces

Workspaces in Faros are akin to Kubernetes namespaces, but with enhanced functionality. They are designed to group resources together under a virtual cluster-like environment, without being actual clusters. Each workspace contains its own resources, such as namespaces, service accounts, roles, roleBindings, secrets, and configMaps.

More information about workspaces can be found [here](/docs/concepts/workspaces/).


### Setting Up and Managing Workspaces

```bash
kubectl faros login
```

Once logged in, create and manage new workspaces similarly to how you would manage a regular Kubernetes cluster.

Users can be invited via their email, associated with their GitHub accounts, using the following role binding template:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: workspace-admin
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
- apiGroup: rbac.authorization.k8s.io
  kind: User
  name: faros-sso-{email}
```

> We are working on a feature to expose workspaces, you have access to, via the Faros CLI. This will allow you to manage workspace access and interact with them via the CLI.
>
> For now if you shared a workspace with someone, they will have to access by changing the context in their kubectl configuration.

### Explore Kubernetes APIs

Check the supported APIs using the command:

```yaml
kubectl api-resources
```

