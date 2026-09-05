---
title: "Schedules and triggers"
description: "Run an agent on a timetable or in response to an event."
weight: 3
doc_type: "Guide"
---

## Before you start

Verify the agent’s model and tools in an interactive run. Select its workspace. Decide the intended timezone, output destination, and budget before scheduling background work.

## Add a schedule

1. Open the AI agents **Schedules** view and create a schedule for the agent.
2. Choose recurring cron, a wakeup, or a heartbeat as appropriate.
3. For cron, enter a five-field expression such as `0 9 * * *` and an explicit timezone such as `America/Chicago`.
4. Enter a bounded task and choose the desired enabled state.
5. Save, inspect the recorded schedule, and use its run action to verify the task before relying on unattended execution.
6. Check the resulting run and output destination. An enabled schedule alone does not prove that the model or tools can complete it.

## Triggers

Use a Trigger for webhook, channel, email, or event-driven work supported by your deployment. Configure its connection and authentication, then submit a test event and inspect the resulting run.

## Stop or diagnose background work

Disable the schedule or trigger before changing a misbehaving task. Inspect run errors, approval state, budget limits, and connection credentials. Verify the next execution time after changing timezone or cron fields.

Delete test schedules and triggers when finished; closing the browser does not stop them.

## Create a schedule from the CLI

Use the [CLI in the agent's workspace](/docs/reference/cli/resources/). This is the same Schedule resource used by the console. Inspect the installed schema and select an existing agent:

```bash
kubectl get agents.agents.faros.sh
kubectl explain schedules.agents.faros.sh.spec
```

Save the following as `schedule.yaml`, replacing `AGENT-NAME`. Start suspended so it cannot run before you review the configuration. The task is an example; choose one appropriate for the agent's tools and output channel.

```yaml
apiVersion: agents.faros.sh/v1alpha1
kind: Schedule
metadata:
  name: daily-summary-example
spec:
  agentRef: AGENT-NAME
  type: cron
  schedule: "0 9 * * *"
  timeZone: America/Chicago
  task: "Summarize the information available to you for my daily review."
  suspend: true
```

```bash
kubectl apply -f schedule.yaml
kubectl get schedules.agents.faros.sh daily-summary-example -o yaml
```

Verify `agentRef`, timezone, task, and the agent's destination channel. Use the console's run action to test execution; creating a Schedule does not perform a test run.

Once ready to allow scheduled execution:

```bash
kubectl patch schedules.agents.faros.sh daily-summary-example --type=merge -p '{"spec":{"suspend":false}}'
kubectl get schedules.agents.faros.sh daily-summary-example -o yaml
```

Inspect `status.nextRun` and verify the next resulting run in the console. An enabled schedule is not evidence of successful execution. To stop future firings, suspend it; suspension does not cancel a run already in progress.

```bash
kubectl patch schedules.agents.faros.sh daily-summary-example --type=merge -p '{"spec":{"suspend":true}}'
```

Remove the example when finished:

```bash
kubectl delete schedules.agents.faros.sh daily-summary-example
```

The file still declares `suspend: true`; reapplying it suspends the schedule again. Update the reviewed manifest if you intend to keep an enabled schedule under version control.
