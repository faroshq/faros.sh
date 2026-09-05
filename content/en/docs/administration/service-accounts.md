---
title: "Service accounts and credentials"
description: "Use a workspace identity for automation."
weight: 3
doc_type: "Guide"
---

Create a dedicated workspace identity for an automation and verify that it has the intended access.

## Prerequisites

Sign in to Faros SaaS as an administrator of the target workspace. Decide whether the task needs the workspace’s `member` or `admin` role, and have a secret store ready for the credential.

## Create and verify

1. Open **Settings → Workspaces**, select the intended workspace, and use a workspace admin identity. Only workspace admins can view or manage service accounts.
2. In **Service accounts**, enter a descriptive name, choose `member` or `admin`, and select **Create**. Give the account only the role required by the automation.
3. Select **Issue token** for the new account. Copy the token from the one-time dialog immediately; it cannot be retrieved later. Store it in the automation’s secret store, never in source control or chat.
4. Configure the automation with the intended workspace endpoint and bearer token.
5. Test one intended operation and one operation that should be denied, using only the service-account credential.

Human sessions, automation service accounts, provider controllers, edge agents, and MCPServer credentials are different principals. Verify the identity used at each boundary. A workspace URL alone is not an authorization policy. Document which principal an integration actually uses.

## Expected result and recovery

The account is listed with the intended role and its credential permits the intended operation. Note the token expiry shown in the dialog; the current implementation defaults to 365 days, so plan rotation rather than treating it as a short session token. If the dialog was closed before saving the token, issue another token. If access is denied, check the account’s workspace and role before increasing privileges.

## Optional CLI diagnostics

Configure a separate kubeconfig using the issued workspace endpoint and service-account credential. Keep it outside source control and restrict file access. Use that file explicitly for every check so your personal session cannot mask a permissions problem.

To create that file from an existing [workspace context](/docs/reference/cli/workspaces/), first select the correct workspace with `kubectl faros use`. The following copies its server and CA settings and replaces personal authentication with the token you enter at the hidden prompt. It writes a separate file and does not change your current kubeconfig.

```bash
umask 077
kubectl config view --raw --minify --flatten -o json | python3 -c '
import getpass, json, os, sys
config = json.load(sys.stdin)
token = getpass.getpass("Service-account token: ")
if not token:
    raise SystemExit("No token supplied")
config["users"] = [{"name": "automation", "user": {"token": token}}]
for context in config["contexts"]:
    context["context"]["user"] = "automation"
with open("automation.kubeconfig", "x") as output:
    json.dump(config, output, indent=2)
'
```

The command refuses to overwrite an existing `automation.kubeconfig`. Treat that file as a secret. For an account intended to read Infrastructure instances:

```bash
kubectl --kubeconfig ./automation.kubeconfig auth can-i list instances.infrastructure.faros.sh
kubectl --kubeconfig ./automation.kubeconfig get instances.infrastructure.faros.sh
```

Choose a resource and operation that your policy denies and check it with `auth can-i` as well. The expected results depend on the role you granted; do not grant extra access merely to make the example pass. Repeat both checks after rotating credentials. The Faros CLI has no dedicated service-account creation command in the documented source baseline; retain the supported console creation flow.

## Rotate or remove

To rotate, issue a new token, update the consumer, and verify its operation before retiring the old credential. **Revoke tokens** invalidates every token for that account, so use it only when all existing holders can be interrupted; issue a replacement token afterward if the account remains in use. To retire the identity, choose **Delete service account**; its active tokens stop working and the account’s workspace access is removed. Remove test accounts after use.

For external AI assistants, see [MCP authentication](/docs/use/ai-assistants/).
