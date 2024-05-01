---
title: "How to mount a remote Kubernetes cluster"
date: 2024-05-01T00:03:00+01:00
image: /images/front.webp
description: "How to mount a remote cluster to Faros cluster for remote access and management"
authors:
- Mangirdas Judeikis
tags: [synpse,install,IoT]
---

In this article we will assume that you already have cli access to your Faros cloud,
have workspace created and ready to mount a remote Kubernetes cluster to it.

### Mount remote cluster

Get into workspace `clusters` we created in previous article:

```bash
kubectl faros ws use clusters
```

Use existing `prod` workspace or create new one.
We gonna create new one as our cluster is (Ryzen Mini)[https://www.google.com/search?sca_esv=b511c58466c4623d&sca_upv=1&sxsrf=ACQVn0-yFZNVvsWho9-hIMltiOU1Lac1_g:1714585139149&q=ryzen+mini&uds=AMwkrPt4t1EVCCdSUNw8MsX-M3cqtNiQ84nMzdxJhp5HOFvF1QxJMdCNw3zgDF9mV0MT2N9WmWk6KeXDHY9-29IhtiyHUFR7DaMbxTc0dPzYIxVURtdlwo46K3Umyo6ddiUR9Eyv80UsrN8zgOt534327b73HhkL8lsWXgCYDRyNiS61arledobBbJ0qCOb9b4RgNaKGN7FPcQX959BisDorVhhRKuS2Iw_hGYcPRIJqgKQfwTGXm2vXFvaStPplVFOPzn7UvNg-&udm=2&prmd=ivnbz&sa=X&ved=2ahUKEwjWyZ-x_-yFAxXDLBAIHYMvCNAQtKgLegQIDBAB&biw=1628&bih=937&dpr=1], running `k3s`:

```bash
kubectl faros ws create mini

```
