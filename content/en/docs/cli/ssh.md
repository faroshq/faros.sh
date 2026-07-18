---
title: SSH
description: Reach server-mode edges through the hub's reverse tunnel.
weight: 5
---

`kubectl kedge ssh` opens a shell (or runs a single command) on a `server`-type edge. The connection rides on the same reverse tunnel the agent uses to talk to the hub — no inbound SSH port, no public IP, no jump host.

## Interactive shell

```bash
kubectl kedge ssh my-vps
```

The CLI looks up the edge's endpoint on the hub, opens a WebSocket with your bearer token (from `kubectl kedge login`), puts your terminal in raw mode, and streams the session — including window-resize events — through the agent's reverse tunnel.

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
your laptop  ──WebSocket──►  hub  ──reverse tunnel──►  agent  ──►  local sshd (port 22)
```

The agent proxies the session to the host's own SSH daemon (port configurable with `--ssh-proxy-port` at agent install time; user and key/password come from the agent's `--ssh-user` / `--ssh-private-key` / `--ssh-password` configuration). The hub authenticates your bearer token and proxies the bytes between your terminal and the agent. No inbound SSH port, no key exchange with you — you're authorized because you can log in to the hub.

## Limits

- The remote user is whatever the agent was configured with at install time (`--ssh-user`), not your hub identity.
- Long-running sessions are kept alive via WebSocket pings through the tunnel.
- Port forwarding (`-L` / `-R`) is not exposed through `kubectl kedge ssh`. If you need it, run a real SSH server on the host and reach it some other way.
