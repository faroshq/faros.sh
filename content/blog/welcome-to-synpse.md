---
title: "Welcome to Synpse"
date: 2021-08-22T00:01:00+01:00
draft: false
# we hide it from main blog list
hidden: true
description: Curious about how to manage hundreds of thousands of devices? Then Synpse is the right tool to use. In this group of articles we will cover how to set up Synpse and how to control individual servers, deploy services spanning hundreds of devices.
image: /images/synpse-ssh.png
authors:
- Mangirdas Judeikis
tags: [IoT,Intro]
---

### Why IoT?

IoT should not be hard. Sadly we found it to be not the case. As a DYI hackers and hobbyists we are running a lot of random projects on the side. From home automation, 3D printers, heating, temperature sensors, car tracking systems and more.

Then, once upon a time, we received a request to deploy software to a place where we didn't even imagine you can place a computer with a working Linux OS 🤯.

That led us to a journey where we tried and tested a bunch of different tools for IoT fleet management. In the end we reached a conclusion - running software on the edge is not that easy with the current available technologies. The ones capable of doing so are either too expensive to run, do not scale or require custom OS'es to be installed or all those things. What is more, if you do it yourself it is an incredibly tedious and error prone process. Ansible, Chef, Puppet, Terraform and all the other tools are great, but they are not flexible enough to manage thousands of devices and especially when all of those little computers are just out of reach.

So, as true Engineers - we created a new tool for the job 😀

### Why Synpse?

If you are coming from [Kubernetes](https://kubernetes.io/) world, you might be thinking - "I know how to do it - let's use Kubernetes". Not so fast, cowboy 🤠. True edge devices have a bit different requirements. They need to be able to go "offline" and "online" without any need to reach the control plane, "graceful shutdown" almost never exist, your devices just lose electricity. They need to be independent from the network and they need to be able to be deployed in different environments.

![Kubernetes is not a solution!](/images/kubernetes.jpeg)

So, the main reasons why we didn't choose Kubernetes:
- We didn't want to run Kubernetes ourselves as we don't need most of the features it offers.
- Agents should be lightweight and are not allowed to consume most of the resources (kubelets can be resource hungry).
- Deployments in IoT fleets usually work more as a daemonsets where it's important to run apps on specific devices and not an X number of replicas on any of the devices (can be achieved on k8s with daemonsets and taints but it's just not the right solution).
- Scale and controlplane resource consumption. With Kubernetes, when you reach >1K, controller nodes will be consuming massive amounts of CPU, RAM and Etcd will be slowing down. We wanted a system that can easily scale to thousands of nodes, running on a single core machine with several gigs of RAM.

**Why not Docker Compose?**

Well, [Docker Compose](https://docs.docker.com/compose/) is great for local development or deploying some simple software to a remote server. However, moving docker-compose.yaml files around can become complicated. Also, it wouldn't provide any cluster management functionality.

We didn't create the tool for sake of building something. We encountered a problem and decided to solve it.

### Biggest challenges that we had to overcome

1. How to quickly bootstrap thousands of devices.
2. How to ensure that the bootstrap process is secure, reproduceable and allows the organization to group devices based on their needs.
3. How to access devices when they are located in the unknown network you don't control, even behind firewalls where external IPs are not available or when it's behind CGNAT.
4. How to deploy software to devices and update applications easily (updates over the air/OTA)
5. Use concepts and tools that most modern software developers are already familiar with and love - SSH, Containers, Docker, TCP tunnels.
6. We wanted to use any OS we choose to. Some tools are better on Ubuntu, some on Fedora or Raspberry PI OS. When you deal with embedded devices you need more flexibility as manufacturers are often not very accomodating.
7. It should be simple and easy to use (batteries included :)).

None of these are new problems. We just had to solve them in a different way. So we did.

### This is how Synpse was born

![Frankenstein was not a monster](/images/its-alive.jpg)

Bespoke solution for edge device management. Easy to use without history of complexity behind it.

# Whats next?

We prepared set of blog posts for you to get started:

1. [How to create image for your device](/blog/how-to-build-image/)
2. [How to install Synpse](/blog/how-to-install-synpse/)
3. [How to install on a GPU cloud VM](/blog/vultr-gpu-server-setup/)
4. [How to deploy Home Automation to Synpse](/blog/how-to-deploy-homeassistant/)
