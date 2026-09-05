---
title: "Publishing and sharing"
description: "Control production deployment and who can open the application."
weight: 4
doc_type: "Guide"
---

## Before publishing

Confirm that the project has a production-capable template, a successful build, and a production environment binding. Test the development preview first. Select the intended workspace and verify your permission to change the project.

## Publish and verify

1. Open **Publishing**, wait for **Verified release**, choose **Deploy SHA**, review the release and configuration, and confirm **Deploy release**.
2. Wait for the production instance’s ready status; inspect build and runtime errors if promotion fails.
3. Open the production URL and verify the application’s behavior.
4. Choose private or public access deliberately. For private access, grant the intended people access through the sharing controls.
5. Test with an intended recipient’s own identity; your workspace-admin session does not prove that another person can open it.

Project sharing and published-application access are separate. Access to a project does not mean that every possible application access mode is configured.

## Development preview access

Preview access uses `Project.spec.sharing.preview.mode`. Private previews are for workspace members; public previews allow anyone with the URL. Individual production invitations do not grant private development-preview access.

## Revoke access or remove the deployment

Revoke individual grants to remove private application access. Removing publishing access settings makes the application private and removes its grants; it does **not** undeploy production. Workspace members may still have access. An existing production access session can remain valid for up to 15 minutes after grant revocation; reauthentication checks the current authorization. Use the instance lifecycle to remove the deployment itself.

[Implementation reference](https://github.com/faroshq/faros/blob/main/docs/app-studio-publishing.md).
