---
title: "Connect a model"
description: "Create and test a workspace model credential before assigning it to an agent."
weight: 2
doc_type: "Guide"
---

## Prerequisites

Enable **AI agents** in your selected workspace. You need permission to manage its model credentials, an OpenAI-compatible endpoint, an exact model identifier served by that endpoint, and an API key permitted to invoke it. Model calls can incur charges at your model provider.

## Add and test the credential

1. Open **AI agents → Models** and select **Add model credential**.
2. Enter a **Name**, such as `notes-assistant-model`, using lowercase letters, digits, and hyphens.
3. Choose **Provider**, then verify **Base URL** against your endpoint. The preset is a starting value, not proof that your account can use it.
4. Enter the exact **Model** identifier and **API key**, then choose **Add credential**. Faros stores the key as a workspace Secret.
5. Find the new credential and select **Test**. Expect **healthy** with a latency value. **untested** means no successful check has been recorded; **failed** requires investigation.

If testing fails, check the endpoint URL, key validity, model availability, and the provider runtime's outbound network access. Correct the credential with **Rotate / model**, save it, and test again. Never paste the key into an agent prompt or diagnostic report.

## Assign the model

[Create an agent](/docs/use/agents/quickstart/) and select this credential as its model. Run a short conversation to verify generation. A healthy credential test does not validate tool permissions or every model feature.

## Rotate or remove

Use **Rotate / model** to change the model, endpoint, or key. Leaving the new key blank keeps the existing key. After saving, test the credential and an assigned agent again.

Review the credential's primary/fallback agent assignments before deleting it. Reassign those agents first; deletion does not revoke the upstream API key. Revoke an exposed key at its issuer separately.
