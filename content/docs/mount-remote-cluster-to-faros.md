---
title: "How to mount a remote Kubernetes cluster"
date: 2024-05-01T00:03:00+01:00
image: /images/mount.webp
description: "How to mount a remote cluster to Faros cluster for remote access and management"
authors:
- Mangirdas Judeikis
tags: [faros,install,cloud,kubernetes,kcp]
---

In this article we will assume that you already have cli access to your Faros cloud,
have workspace created and ready to mount a remote Kubernetes cluster to it.

### Mount remote cluster

Get into workspace `clusters` we created in previous article:

```bash
kubectl faros ws use clusters
```

Use existing `prod` workspace or create new one.
We gonna create new one as our cluster is [Ryzen Mini](https://www.google.com/search?sca_esv=b511c58466c4623d&sca_upv=1&sxsrf=ACQVn0-yFZNVvsWho9-hIMltiOU1Lac1_g:1714585139149&q=ryzen+mini&uds=AMwkrPt4t1EVCCdSUNw8MsX-M3cqtNiQ84nMzdxJhp5HOFvF1QxJMdCNw3zgDF9mV0MT2N9WmWk6KeXDHY9-29IhtiyHUFR7DaMbxTc0dPzYIxVURtdlwo46K3Umyo6ddiUR9Eyv80UsrN8zgOt534327b73HhkL8lsWXgCYDRyNiS61arledobBbJ0qCOb9b4RgNaKGN7FPcQX959BisDorVhhRKuS2Iw_hGYcPRIJqgKQfwTGXm2vXFvaStPplVFOPzn7UvNg-&udm=2&prmd=ivnbz&sa=X&ved=2ahUKEwjWyZ-x_-yFAxXDLBAIHYMvCNAQtKgLegQIDBAB&biw=1628&bih=937&dpr=1), running `k3s`:

```bash
kubectl faros ws create mini
```

Now if you can access cluster from the local machine where you have Faros CLI installed, you can mount it to the workspace:

```bash
kubectl faros mount mini -w mini --remote-kubeconfig=kind.kubeconfig
```

This command will mount the remote cluster to the workspace `mini`. Next time
you use `kubectl faros ws use mini` you will be able to access the remote cluster.

If you don't have access to the remote cluster from the local machine, you can
mount it from the remote machine where you have access to the cluster:

```bash
kubectl faros mount mini -w mini

Cluster is ready to be mounted. You will need to deploy resources to the remote cluster manually:
1. Get resources to be deployed to the remote cluster.
   kubectl get configmap mini-resources -o jsonpath='{.data.resources}' > mini-resources.yaml

2. Deploy resources to the remote cluster.
   kubectl apply -f mini-resources.yaml --kubeconfig <your-kubeconfig>

3. Wait for the remote cluster to accept the mount to be Ready.
   kubectl get KubeCluster -w
```

Now repeat this for other clusters and you have all your clusters mounted to the Faros cloud:

```bash
k faros ws tree -f
.
└── ixn3tjgtr9bb
    └── ixn3tjgtr9bb:clusters
        ├── ixn3tjgtr9bb:clusters:mini
        └── ixn3tjgtr9bb:clusters:prod

```

Where with simple command `kubectl faros ws use ixn3tjgtr9bb:clusters:mini` or
just traversing the hierarchy you can access the remote cluster.
