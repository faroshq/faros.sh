---
title: "Access remote networks using Synpse"
date: 2021-09-20T00:01:00+01:00
draft: false
description: How to use Synpse proxy and SSH capabilities to access other devices in the remote networks without need of a VPN.
image: /images/blog/synpse/proxy.png
authors:
- Mangirdas Judeikis
tags: [jumpbox,synpse,proxy,remote-access,port-forward]
---

Sometimes you get into situations where you want to configure your home router to expose new ports, or help your close ones to configure some network device in their home network (IP camera, router, smart home system). How many times you wanted to have SSH access into your mini server at home while on holidays?

We had a similar case. I was traveling, and at some point I needed to reconfigure my home wifi router because ISP updated the firmware, and external IP address changed and I lost all port forwarding rules to my "home hosted devices". So no more free home hosted VPN.

Luckily, I had synpse device running in my home! We will show a simple and easy way to access your remote networks in cases like this.

<!---more--->
###Proxy feature

Synpse allows you to proxy from your laptop to remote device for the local development:

```bash
synpse device proxy <device-name> <local-port>:<remote-port>
```

This is very helpful, when you are doing remote development and need to debug remote devices and application. But there is more to this. Synpse can act as forward proxy to other devices on the remote network. Diagram bellow show how this could be used at the high level:

![Remote router](/images/blog/synpse/proxy.png)

To achieve this, just change a command a bit:

```bash
synpse device proxy <device-name> <local-port>:<hostname/ip>:<remote-port>
```

###How does this looks like?

In our case, we needed to access WIFI router and reconfigure it.

Step 1: SSH into remote device to check network address space it is running in.

```bash
synpse device ssh rpi3
root@synpse:/# ip a
...
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000
    link/ether b8:27:eb:15:c6:af brd ff:ff:ff:ff:ff:ff
    inet 192.168.0.178/24 brd 192.168.0.255 scope global dynamic eth0
       valid_lft 85386sec preferred_lft 85386sec
    inet6 fd01::ba27:ebff:fe15:c6af/64 scope global dynamic mngtmpaddr noprefixroute 
       valid_lft 286sec preferred_lft 286sec
    inet6 fe80::ba27:ebff:fe15:c6af/64 scope link 
       valid_lft forever preferred_lft forever
...
```

We see that we are in `192.168.0.1/24` network. We know our router is the first IP address in the network. Lets get to it:

```bash
synpse device proxy rpi3 8443:192.168.0.1:443
forwarding port (local->remote) 8443 -> 192.168.0.1:443 
```

and this is it. Open `https://localhost:8443` and you should see the router page:

![Remote router](/images/blog/synpse/remote-access.png)

###./wrap_up

In short, Synpse is not only a tool to manage deployments for your IoT fleet, but it is development and debugging tool too!
If you have any questions or suggestions, feel free to start a new discussion in our [forum](https://github.com/synpse-hq/synpse/discussions) or drop us a line on [Discord](https://discord.gg/dkgN4vVNdm)
