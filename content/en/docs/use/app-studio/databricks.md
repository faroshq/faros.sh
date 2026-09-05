---
title: "Build an application using Databricks data"
description: "Connect a Databricks table and use the project assistant to build an application around it."
weight: 6
doc_type: "Tutorial"
---

Build a small dashboard that displays data from a Databricks table. In Faros SaaS, you connect the data and describe the application you want; the project assistant handles the application code in your App Studio environment.

## Before you start

Sign in to Faros SaaS and select your workspace. You need an App Studio project and an imported Databricks table you are allowed to use.

- If you do not have a project yet, follow the [App Studio quickstart](/docs/use/app-studio/quickstart/).
- If your table is not available in Faros, follow [import a Databricks table](/docs/use/databricks/quickstart/) or ask your workspace administrator to make it available.
- Your workspace needs App Studio, Code, Infrastructure, and Databricks enabled. Ask your administrator if a required capability is missing.

Choose a small table whose data you recognize, so you can check whether the application displays it correctly.

## Connect the table

1. Open your project’s integrations controls.
2. Select **Databricks** as the provider and **Query table · `query_table/v1`** as the versioned action.
3. Enter the imported table’s Faros resource name in **Exact resource name**, and choose an **Integration alias**, such as `sales`.
4. Review the table and action being granted, accept consent if requested, and select **Create grant**.
5. Note the integration alias. You will use that name when asking the assistant to build with the table.

The alias identifies this connection in your project. It can differ from the table’s name. Connecting one table does not give the project access to every table in Databricks.

## Ask the assistant to build the application

Return to the project conversation and describe what you want to see. For example, replace `sales` below with your saved integration alias:

```text
Build a private dashboard using the Databricks integration named sales.
Inspect the available columns and show up to five rows in a readable table.
Use real data from the connected table.
Include a clear empty state when there are no rows and an error message if the query fails.
Open the preview when it is ready.
```

Let the assistant make the project changes, then review its result in the preview. You can refine the application in the same conversation—for example, ask it to give columns friendlier labels or format dates and amounts appropriately for the data.

Keep Databricks credentials out of the conversation. Use the saved integration to provide access.

## Check the preview

Verify the result before sharing it:

- **Correct data:** compare the displayed columns and a few values with the table you selected. Ask the assistant to replace any placeholder data with the connected table’s results.
- **Useful presentation:** check that labels, dates, and amounts make sense to the intended users.
- **Empty and error states:** an empty table should show an explanation. A failed query should show an error rather than appear to be an empty table.
- **Appropriate access:** keep the application private while testing. Anyone allowed to use the application may be able to see the data it displays; choose its audience accordingly.

If the preview needs changes, describe the problem in the project conversation and verify the next result. For example: “The date column is difficult to read. Format it as a date and keep the rows from the connected table.”

## If the data does not load

Check that you are in the intended workspace and that the project integration still points to the correct table. If access was removed or the table changed, review and reconnect the integration with an authorized identity.

Give the assistant the visible error message and ask it to check the saved integration. Do not paste tokens or table credentials into the conversation. If the table itself is unavailable, use [Databricks troubleshooting](/docs/use/databricks/troubleshooting/); if the project preview fails to start, use [App Studio troubleshooting](/docs/use/app-studio/troubleshooting/).

## Share or disconnect

When the preview works, follow [publish the application](/docs/use/app-studio/publishing/) and review who should have access to its data.

Choose **Revoke action** when the project should no longer query the table through this grant. Use **Remove integration** when you no longer need the project connection. Neither operation deletes the Databricks table.

For custom server-side integration code, see [provider actions](/docs/extend/actions/).
