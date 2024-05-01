---
title: "Deploy & Configure Wireguard"
date: 2021-11-14T00:01:00+01:00
draft: true
image: "/images/blog/wireguard/wg.png"
description: "Wireguard is a leading VPN technology. Not only it's faster than OpenVPN, but much easier to configure. Especially if you use Synpse to deploy it"
draft: true
authors:
- Mangirdas Judeikis
tags: [Wireguard,VPN,Free]
---


WireGuard is an extremely simple yet fast and modern VPN that utilizes state-of-the-art cryptography. It aims to be faster, simpler, leaner, and more useful than IPsec, while avoiding the massive headache. It intends to be considerably more performant than OpenVPN. WireGuard is designed as a general purpose VPN for running on embedded interfaces and super computers alike, fit for many different circumstances. Initially released for the Linux kernel, it is now cross-platform (Windows, macOS, BSD, iOS, Android) and widely deployable. It is currently under heavy development, but already it might be regarded as the most secure, easiest to use, and simplest VPN solution in the industry.

Combined with Synpse, it becomes super easy to configure and use! No more paying for VPNs that steal your data!

### Technologies used

1. [Synpse](https://cloud.synpse.net) for hosting and running applications anywhere
2. [Wireguard](https://www.wireguard.com/) VPN provider
3. [Cloudflare](https://cloudflare.com/) DNS management

### Pre-requisites

If you don't own a domain, and don't have a need for it - you can use DuckDNS to get one for free. We are going use Cloudflare as we already own a domain, personally I find it the best way to control your DNS settings.

And because our device is in our home network, we will have to configure port forwarding for our device.

#### Step 1: Configure Cloudflare

To get your own IP from anywhere inside your home network, run this command in the terminal:

`curl https://ifconfig.me/`

![Cloudflare](/images/blog/wireguard/cloudflare.png)

#### Step 2: Configure port forwarding

In order for your device to be reachable from the internet, you will need to configure your router with port forwarding into our device in home network. We use `D-Link DIR-815`.
We configure `Virtual Server` to forward port `51820` to forward to synpse device.

![Router](/images/blog/wireguard/router.png)

The important part here is to ensure that router is port forwarding UDP protocol (not TCP) as Wireguard requires it. If you are not sure then enable both protocols.

### Deploy the Wireguard server

```yaml
name: wireguard
scheduling:
  type: Conditional
  selectors:
    # selector for our device
    wireguard: server
spec:
  containers:
    - name: wireguard
      image: linuxserver/wireguard
      capAdd:
        - NET_ADMIN
        - SYS_MODULE
      ports:
        - 51820:51820
      sysctl:
        net.ipv4.conf.all.src_valid_mark: "1"
      volumes:
        # configuration directory where configuration will be generated
        - /data/wireguard/config:/config
        - /lib/modules:/lib/modules
      env:
        - name: PUID
          value: "1000"
        - name: PGID
          value: "1000"
        - name: TZ
          value: Europe/London
        - name: SERVERURL # Server URL in our DNS. Used to generate configuration
          value: wireguard.judeikis.lt
        - name: PEERS # Additional configuration we asking to be generated. 
          value: laptop,tablet,phone
        - name: PEERDNS
          value: auto
      restartPolicy: {}
```

### Download configuration

Once this is done and Wireguard starts successfully, it will emit configuration into console. and write a bunch of files.

You can use `synpse application logs <wireguard> --device <device-name>` to get codes. In our case we will backup the configuration locally from remote device for us to use later:

```bash
# make sure public SSH keys is configured with synpse
synpse ssh-keys list
# If you don't see anything in the output, execute:
synpse ssh-keys configure

# SSH first using native CLI method to generate .ssh/config
synpse ssh <device-name>

# If you ever SSH'ed into device using native method and have SSH key added, .ssh/config record will be generated.
# Now copy wireguard configuration to our laptop:
scp -r <device-name>:/data/wireguard $HOME/Documents/wireguard
```

Get out your phone and install `Wireguard` application. Once inside the app you will see the option to import configuration by scanning a QA code, use it to scan the picture from `$HOME/Documents/peer_phone/peer_phone.png`.

And add your endpoint!

![App](/images/blog/wireguard/app.png)

# ./wrap_up.sh

And this is it! If all steps have been done right, you have free VPN. Simple and powerful setup.

If you have any questions or suggestions, feel free to start a new discussion in our [forum](https://github.com/synpse-hq/synpse/discussions) or drop us a line on [Discord](https://discord.gg/dkgN4vVNdm)