---
title: "Provision an instance"
description: "Choose a template and create a workspace resource."
weight: 1
doc_type: "Tutorial"
---

## Prerequisites

Enable **Infrastructure**, select your workspace, and confirm that the operator has published a usable template. You need permission to create Instances and any credentials required by that template.

1. Open the template catalog and inspect the template’s inputs and required credentials.
2. Create an instance with a distinct name and the required values.
3. Inspect its phase and conditions. Validation happens during reconciliation, so accepting the object does not establish valid input or a ready runtime.
4. Wait for ready status and test the template’s documented output, such as its application URL.

The tenant-facing kind is always `Instance`; the template name belongs in `spec.template`. Its inputs belong in `spec.values`.

```yaml
apiVersion: infrastructure.faros.sh/v1alpha1
kind: Instance
metadata:
  name: example
spec:
  template: YOUR_TEMPLATE
  values: {} # Replace with the inputs required by this template.
```

For invalid input, inspect conditions and correct values before retrying. For runtime failures, ask the operator to inspect the underlying runtime and credentials.

To clean up, delete the test instance and wait for finalizers to finish. Check the template’s persistence behavior before assuming external data is removed.

## Create and verify from the CLI

After [selecting the workspace](/docs/reference/cli/resources/), save the manifest above as `instance.yaml`, replace `YOUR_TEMPLATE`, and supply the template's required inputs. Use a distinct name if `example` already exists; applying to an existing name updates that object.

```bash
kubectl explain instances.infrastructure.faros.sh.spec
kubectl auth can-i create instances.infrastructure.faros.sh
kubectl apply -f instance.yaml
kubectl get instances.infrastructure.faros.sh example -o yaml
kubectl wait --for=condition=Ready instances.infrastructure.faros.sh/example --timeout=180s
```

A successful wait means the reported `Ready` condition is true. Still test the template's application URL or other documented output. A timeout does not cancel provisioning: inspect `status.phase`, `status.message`, and `status.conditions` before retrying. Invalid template values can be accepted by the API but fail reconciliation.

For cleanup, delete only the test instance you created:

```bash
kubectl delete instances.infrastructure.faros.sh example --wait=true --timeout=180s
```

If deletion times out, inspect the remaining object and finalizers and ask the operator to investigate. Do not force-remove finalizers or assume persistent external data was deleted.

Next: [manage templates and instances](/docs/use/infrastructure/instances/).
