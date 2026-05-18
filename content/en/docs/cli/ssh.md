---
title: SSH
description: Reach server-mode edges through the hub's reverse tunnel.
weight: 3
---

`kubectl kedge ssh` opens a shell (or runs a single command) on a `server`-type edge. The connection rides on the same reverse tunnel the agent uses to talk to the hub — no inbound SSH port, no public IP, no jump host.

## Interactive shell

```bash
kubectl kedge ssh my-vps
```

The hub authenticates you (bearer token from `kubectl kedge login`), then upgrades the HTTP connection to a TCP stream that the agent pipes to a local `sshd` running inside the agent container.

Exit with `exit` or `Ctrl-D` as you would with any SSH session.

## Run a single command

```bash
kubectl kedge ssh my-vps -- df -h
kubectl kedge ssh my-vps -- "systemctl status nginx"
```

The double-dash separates kedge flags from the remote command. The command runs in a non-interactive shell — stdout and stderr stream back to your terminal; the exit code is the remote command's exit code.

## Copying files

There's no `kedge scp`, but you can pipe through the SSH stream:

```bash
# Local to remote
cat localfile.txt | kubectl kedge ssh my-vps -- "cat > /tmp/remotefile.txt"

# Remote to local
kubectl kedge ssh my-vps -- cat /etc/hostname > local-hostname.txt
```

For larger files or recursive copies, run an interactive session and use `rsync` or `tar` over the SSH stream.

## How it works

```
your laptop  ──HTTPS──►  hub  ──reverse tunnel──►  agent  ──unix socket──►  sshd
```

The agent on the server hosts a per-edge `sshd` listening on a local socket. The hub authenticates your bearer token, then proxies the bytes between your terminal and that socket. No SSH key management — you're authorized because you can log in to the hub.

## Limits

- The remote user is whichever user the agent runs as. For Helm-installed agents that's `root` inside the agent pod; for systemd-installed agents on a host, it's whoever owns the systemd unit.
- Long-running sessions are kept alive via WebSocket pings. Idle disconnects come from the hub's tunnel timeout (default 60s of total silence), not OpenSSH's `ClientAliveInterval`.
- Port forwarding (`-L` / `-R`) is not exposed through `kubectl kedge ssh`. If you need it, run a real SSH server on the host and reach it some other way.
