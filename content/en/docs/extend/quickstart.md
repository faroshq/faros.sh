---
title: "Build your first provider"
description: "Start from the reference provider and verify its integration with the hub."
weight: 1
doc_type: "Tutorial"
---

Build and register the `quickstart` reference provider on a disposable local development hub. It belongs to provider development, not the end-user capability catalog.

## Prerequisites

Use the product repository, Go matching its module requirement, Node/npm, make, kubectl, and the hub's development prerequisites. Ports 9443, 6443, 3000, and 8081 must be free. Run all commands from the product repository root unless shown otherwise. This path uses development certificates and static authentication; do not expose it as a production hub.

## Start the hub and console

In one terminal:

```bash
make run-hub-embedded-static
```

Wait for the embedded kcp and hub to start and `.kcp/admin.kubeconfig` to appear. In another terminal start the console dev server:

```bash
cd portal
npm install
npm run dev
```

The hub proxies console traffic to the dev server at port 3000. Keep both processes running. Use the development identity configured for this hub when opening its console.

## Build and register the provider

In a third terminal, from the repository root:

```bash
make build-quickstart-provider
make install-provider-quickstart
umask 077
make init-provider-quickstart
```

The build includes the portal bundle. Installation applies the Provider and CatalogEntry; initialization bootstraps the APIExport and writes `.kcp/quickstart-runtime.kubeconfig`. If initialization reports that the provider-token Secret is empty, wait for the Provider controller to provision the workspace, then rerun initialization. Keep the generated kubeconfig private.

## Run and verify

Start the built binary directly so the development Make target does not print its configured heartbeat token:

```bash
PORT=8081 FAROS_HUB_URL=https://localhost:9443 \
  FAROS_HUB_INSECURE=true FAROS_PROVIDER_NAME=quickstart \
  ./bin/quickstart-provider
```

This scaffold does not require a heartbeat bearer token by default. In another terminal:

```bash
curl --fail http://localhost:8081/healthz
curl --fail http://localhost:8081/api/hello
```

Expect `{"status":"ok"}` from health and a hello response identifying `quickstart`. These direct requests only verify the local process.

In the hub, select a disposable workspace and enable the registered **quickstart** provider. Open its provider UI and exercise its hello request. Verify that the response arrives through the hub and contains the selected workspace context. The checked-in catalog points to localhost:8081; a hub running in a container needs a reachable host address instead.

Test with a second identity without access to that workspace: the hub must reject access to its provider route. A successful direct localhost request does not test tenant authorization.

## Make your first change

Change the hello message in `providers/quickstart/main.go`, stop the provider process, run `make build-quickstart-provider`, and restart it with the same environment. Reload the provider UI and verify the changed response through the hub. This proves the backend edit/build/proxy loop before you add a new resource.

Next, [define a provider API](/docs/extend/api/). When copying the scaffold, rename its API group, Provider, CatalogEntry, APIExport, chart, and portal registration consistently.

## Cleanup

Remove test resources and disable the workspace binding. Stop the provider, then, only on this disposable hub:

```bash
make uninstall-provider-quickstart
```

Deleting the Provider tears down its provider workspace. Do not run this against a shared registration. Stop the console and hub processes separately and remove local credential files when no longer needed.

*Source-reviewed development sequence; live hub execution pending.*
