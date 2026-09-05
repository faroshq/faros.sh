---
title: "Services, workloads, and placement"
description: "Expose an edge service or deploy a workload to selected clusters."
weight: 3
doc_type: "Guide"
---

Connect an existing service so Faros can reach it through an edge, or deploy a container workload to connected Kubernetes clusters.

## Prerequisites

Sign in to Faros SaaS and select a workspace with Edges enabled. You need permission to create services or workloads and a [connected edge](/docs/use/edges/quickstart/). Services can use a Linux server or Kubernetes edge; workloads require a Kubernetes edge. Have the application's address and any required credential ready. For workloads, confirm the image can be pulled by the target cluster and inspect its edge labels before selecting targets.

## Connect a service

1. Open **Edges → Services** and choose **Create service**.
2. Enter a **Name**, select the **Edge**, and choose the service **Type**.
3. Set **Scheme** and **Port**. A preset may fix the scheme.
4. For **Host / IP**, enter the address reachable from that edge, not from your laptop. For **Kubernetes Service**, enter **Target namespace** and **Target service name**. Linux server edges use the host option.
5. Choose **Create service**, then open the service and configure its credentials if the selected type requires them.
6. Check its validation result and reachability before using it with an assistant.

Expect the service to be listed on the selected edge and validation to succeed. Then use [MCP setup](/docs/use/ai-assistants/) to connect an assistant and inspect the tools exposed for that service. A listing alone does not verify connectivity or access.

## Available service presets

Edges supports the following service types. Presets describe how to connect to an existing application; they do not install it. The application must be reachable from the selected edge, and its credential must permit the operations you intend to expose.

| Category | Service type values |
|---|---|
| Home automation | `home-assistant` |
| Observability | `grafana`, `grafana-loki`, `prometheus` |
| Infrastructure | `portainer`, `proxmox` |
| Network | `adguard`, `pihole`, `unifi-network`, `unifi-protect` |
| Custom service | `generic` |

Inspect the [service schema](/docs/reference/providers/edges/schemas/) for connection fields and the [service catalog](https://github.com/faroshq/faros/blob/main/providers/edges/internal/svccatalog/catalog.go) for preset operations and authentication. Home Assistant has a [dedicated tool implementation](https://github.com/faroshq/faros/blob/main/providers/edges/internal/tunnel/mcp_service.go). A generic service does not automatically gain every preset's tools. After validation, use the MCP client's tool discovery to confirm the operations actually exposed by your service.

## Deploy a workload

1. Open **Edges → Workloads** and start creating a workload.
2. Enter a **Name** and a container **Image** available to the cluster. Prefer a fixed version or digest for repeatable deployment.
3. Choose **Replicas** and **Strategy**: **Spread** targets all matching edges; **Singleton** selects one.
4. Enter an **Edge selector** using comma-separated labels such as `env=dev`. Confirm those labels belong only to the Kubernetes edges you intend to use.
5. Choose **Create workload**. Inspect the resulting Placements to see which edges received the workload.
6. Wait for ready replicas, then check the application's behavior on the target cluster. A running container does not necessarily expose a public URL.

For a marketplace application, select the application, enter **Workload name**, choose a Kubernetes **Edge**, review the pinned chart and service information, then choose **Deploy**. This path creates a singleton Helm workload pinned to that edge; complete any service credentials afterward.

## If the service or workload is not ready

| Symptom | What to check |
| --- | --- |
| Service validation fails | Confirm the address and port are reachable from the edge and that the configured credential is accepted by the application. |
| No Placements appear | Check the edge selector against actual Kubernetes edge labels; Linux server edges do not run these workloads. |
| Placement has no ready replicas | Check edge connectivity, image availability, and application startup errors on that cluster. |
| Workload is ready but application is inaccessible | Verify its own Service, port, and exposure configuration; readiness is not a public routing check. |

## Optional CLI diagnostics {#verify-workloads-from-the-cli}

If the console status does not explain a failure, select the [owning Faros workspace](/docs/reference/cli/resources/), then list deployment and placement state:

```bash
kubectl faros get workloads
kubectl faros get placements
kubectl faros edge list
```

Workloads report image, phase, and ready replicas. Placements report the target edge, phase, and ready replicas. Verify that placement targets match your intended edge labels. No Placements suggests selection or reconciliation needs investigation; disconnected edges explain a different class of failure. A ready placement still needs an application-level check on its target.

## Cleanup

Delete the test Workload and confirm that its Placements and target resources are cleaned up. Review chart persistence settings before assuming stored data is removed. Remove a test Service when its MCP exposure is no longer needed.

For target connection and credentials, see [the edge quickstart](/docs/use/edges/quickstart/).
