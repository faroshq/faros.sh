---
title: "Build and publish an application"
description: "Create a project, check its preview, and prepare a production deployment."
weight: 1
doc_type: "Tutorial"
source: "providers/app-studio/portal/src/NewProjectWizard.vue"
---

Build a small notes application, verify its development preview, and deploy one verified release. Start in the Faros SaaS hub. If your organization uses a [self-hosted hub](/docs/self-hosting/), follow this walkthrough there with the same workspace prerequisites.

## Prerequisites

Select a workspace with **App Studio, Code, and Infrastructure** enabled. You need permission to create projects, a configured App Studio model, a usable GitHub connection, and an available template with development and production runtimes. Your operator must also configure the template's image build/publishing path. No CLI is required.

## Create a project

1. Open **App Studio** in the intended organization and workspace.
2. Describe a small application: “Build a project notes page with a title and a list of notes.”
3. Follow **Describe**, **Prepare**, and **Confirm**. Review the proposed template, components, repository setup, and project name before confirming. Preparation alone does not create the project.
4. Wait for the development environment to become ready. If setup reports a missing model, repository connection, or template, resolve that prerequisite before retrying.

Expected result: the project opens with an assistant session and a provisioned development environment.

## Implement and preview

1. Ask the assistant to implement the notes page with adding and removing notes.
2. Open the development preview. Add a note, remove it, and check the empty state.
3. Review the repository changes and ensure the intended changes are committed. Record the commit SHA you intend to deploy.

The preview runs the development environment. It does not prove that production images have built. If preview fails, [trace the development instance](/docs/use/app-studio/development/#trace-the-environment-from-the-cli) before recreating the project.

## Build and deploy a release

1. Open **Publishing** and inspect the release pipeline in **Production**. Wait for the template's build pipeline to produce images for the intended commit. Use **View build** when available to inspect the upstream build.
2. Wait for **Verified release** and **Image verified** for the component images. If these do not appear, follow the displayed blocking reason; do not deploy a different commit just to clear the error.
3. Select **Deploy SHA**. In the review, verify the release SHA and production runtime/configuration, then select **Deploy release**.
4. Wait for **Production is running**. Use **Refresh status** if the status is stale.
5. Open the production URL and repeat the add/remove-note interaction. Verify that the deployed release matches the intended SHA.

Expected result: a production instance runs the verified release while development remains available. First deployment starts invite-only.

## Share and verify access

Open **Share** or **Manage access**. Keep private access for this test and invite a test recipient. Ask them to open the production URL with their own identity. Workspace members already have broad access, so your own successful visit does not test the invitation. Only select public access if anyone with the URL should be able to open the app.

See [publishing and sharing](/docs/use/app-studio/publishing/) for preview access and revocation behavior.

## Cleanup and next step

Remove test invitations in **Manage access**. This does not undeploy the application. If the entire project was disposable, use **Delete project** and review its confirmation before proceeding. Verify the associated Infrastructure resources and retained GitHub repository afterward; do not assume deleting access grants removes runtime or upstream data.

Next: [connect Databricks data](/docs/use/app-studio/databricks/).
