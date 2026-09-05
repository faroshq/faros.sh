---
title: "Services, workloads, and placement"
description: "Expose an edge service or deploy a workload to selected clusters."
weight: 3
doc_type: "Guide"
---

## Connect a service

Use a connected edge in your selected workspace. In Edges, create a Service using the supported preset or generic configuration. For a Linux server, identify the host/LAN address and port; for Kubernetes, select the target service. Configure the required credential through the provider.

Verify validation status and reachability before testing the generated MCP tools. Discovery alone does not establish permission or readiness. See [MCP setup](/docs/use/ai-assistants/) to connect an external assistant.

## Available service presets

Edges supports the following service types. Presets describe how to connect to an existing application; they do not install it. The application must be reachable from the selected edge, and its credential must permit the operations you intend to expose.

| Category | Service type values |
|---|---|
| Home automation | `home-assistant` |
| Media | `qbittorrent`, `prowlarr`, `sonarr`, `radarr`, `jellyfin`, `plex` |
| Observability | `grafana`, `grafana-loki`, `prometheus` |
| Infrastructure | `portainer`, `proxmox` |
| Network | `adguard`, `pihole`, `unifi-network`, `unifi-protect` |
| Custom service | `generic` |

Inspect the [service schema](/docs/reference/providers/edges/schemas/) for connection fields and the [service catalog](https://github.com/faroshq/faros/blob/main/providers/edges/internal/svccatalog/catalog.go) for preset operations and authentication. Home Assistant has a [dedicated tool implementation](https://github.com/faroshq/faros/blob/main/providers/edges/internal/tunnel/mcp_service.go). A generic service does not automatically gain every preset's tools. After validation, use the MCP client's tool discovery to confirm the operations actually exposed by your service.

## Deploy a workload

Open Workloads or the marketplace and choose a workload or chart. Review values and the edge label selector before creating it. A Workload fans out into Placements for matching targets.

Inspect Placements and verify the application on the intended edges. If nothing deploys, check labels, connectivity, rendered configuration, and agent status.

## Verify workloads from the CLI

Select the [owning Faros workspace](/docs/reference/cli/resources/), then list deployment and placement state:

```bash
kubectl faros get workloads
kubectl faros get placements
kubectl faros edge list
```

Workloads report image, phase, and ready replicas. Placements report the target edge, phase, and ready replicas. Verify that placement targets match your intended edge labels. No Placements suggests selection or reconciliation needs investigation; disconnected edges explain a different class of failure. A ready placement still needs an application-level check on its target.

## Cleanup

Delete the test Workload and confirm that its Placements and target resources are cleaned up. Review chart persistence settings before assuming stored data is removed. Remove a test Service when its MCP exposure is no longer needed.

For target connection and credentials, see [the edge quickstart](/docs/use/edges/quickstart/).
