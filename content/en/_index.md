---
title: Faros Platform
---

{{< blocks/cover title="Distributed Control Plane for Kubernetes" image_anchor="top" height="full" >}}
<div class="mx-auto">
<p class="lead">Unified platform for multi-cluster management with AI-powered intelligence. Connect clusters from anywhere, manage with kubectl, and deploy AI agents for autonomous analysis.</p>
<a class="btn btn-lg btn-primary me-3 mb-4" href="/docs/getting-started/">
  Get Started <i class="fas fa-rocket ms-2"></i>
</a>
<a class="btn btn-lg btn-secondary me-3 mb-4" href="#how-it-works">
  See How It Works <i class="fas fa-play ms-2"></i>
</a>
</div>
{{< blocks/link-down color="info" >}}
{{< /blocks/cover >}}

{{% blocks/lead color="primary" %}}
Faros is a distributed control-plane for managing multiple Kubernetes clusters from a single interface. Connect home labs, cloud, and remote clusters without exposing them to the internet. Access via native kubectl, CLI, or REST API. Deploy AI agents powered by OpenAI or other LLM providers for intelligent cluster analysis and recommendations.

**Multi-cluster management** – unified control plane. **Secure by default** – outbound-only connections. **AI-powered** – LLM agents via MCP servers.
{{% /blocks/lead %}}

{{% blocks/section color="white" type="row" %}}
{{% blocks/feature icon="fas fa-network-wired" title="Multi-Cluster Registration" %}}
Register any Kubernetes cluster with a single CLI command. Lightweight agents connect via outbound-only WebSocket tunnels – no VPN, no inbound firewall rules, no exposed control planes. Works with home labs, cloud, and remote clusters.
{{% /blocks/feature %}}

{{% blocks/feature icon="fas fa-terminal" title="Native kubectl Access" %}}
Access all registered clusters through native kubectl plugin, CLI commands, WebSocket SSH for terminal sessions, or REST API for automation. Full Kubernetes API access with GitHub SSO and RBAC.
{{% /blocks/feature %}}

{{% blocks/feature icon="fas fa-brain" title="AI-Powered Intelligence" %}}
Deploy AI agents with OpenAI (GPT-4, GPT-3.5-turbo, GPT-4-turbo) or custom LLM backends. Agents connect via MCP servers to provide health analysis, troubleshooting recommendations, optimization insights, and compliance auditing.
{{% /blocks/feature %}}
{{% /blocks/section %}}

{{% blocks/section color="dark" type="row" %}}
{{% blocks/feature icon="fas fa-shield-alt" title="Secure by Default" %}}
Clusters initiate outbound connections only. No inbound traffic, no exposed control planes, read-only agents by default. JWT authentication with automatic rotation and TLS encryption for all communications.
{{% /blocks/feature %}}

{{% blocks/feature icon="fas fa-layer-group" title="Workspace Organization" %}}
Organize clusters and resources using Workspaces – enhanced namespaces with hierarchy support. Group resources like namespaces, service accounts, roles, and secrets with nesting capabilities for complex organizational structures.
{{% /blocks/feature %}}

{{% blocks/feature icon="fas fa-users" title="Team Collaboration" %}}
Share cluster access with GitHub SSO authentication and Kubernetes-native RBAC. Use standard ClusterRoleBindings for authorization – no custom user management, just native Kubernetes security patterns.
{{% /blocks/feature %}}
{{% /blocks/section %}}

{{% blocks/section color="light" %}}
<div class="text-center mb-5" id="how-it-works">
<h2 class="display-4 mb-4">How It Works</h2>
<p class="lead mb-5">Connect and manage clusters in three simple steps</p>
</div>

<div class="row justify-content-center">
<div class="col-lg-10">
<div class="row">
<div class="col-md-4 mb-5 text-center">
<div class="step-number text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-4 transition-all" style="width: 80px; height: 80px;">
<h3 class="mb-0">1</h3>
</div>
<h4 class="mb-3">Install & Authenticate</h4>
<p class="text-muted">Install the kubectl plugin via krew and authenticate with GitHub OAuth. The CLI provides cluster management, AI agent management, and user management commands.</p>
<div class="text-muted small">
<i class="fas fa-code"></i> <code>kubectl krew install faros/faros</code><br/>
<i class="fas fa-sign-in-alt"></i> <code>kubectl faros login</code>
</div>
</div>

<div class="col-md-4 mb-5 text-center">
<div class="step-number text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-4 transition-all" style="width: 80px; height: 80px;">
<h3 class="mb-0">2</h3>
</div>
<h4 class="mb-3">Register Clusters</h4>
<p class="text-muted">Initialize cluster registration which generates agent manifests. Deploy agents to target clusters – they establish secure WebSocket tunnels with JWT authentication.</p>
<div class="text-muted small">
<i class="fas fa-network-wired"></i> <code>kubectl faros clusters init prod</code><br/>
<i class="fas fa-shield-alt"></i> Outbound-only WebSocket tunnel
</div>
</div>

<div class="col-md-4 mb-5 text-center">
<div class="step-number text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-4 transition-all" style="width: 80px; height: 80px;">
<h3 class="mb-0">3</h3>
</div>
<h4 class="mb-3">Manage & Analyze</h4>
<p class="text-muted">Access clusters via kubectl, SSH, or API. Deploy AI agents with your preferred LLM backend for automated health monitoring, troubleshooting, and optimization recommendations.</p>
<div class="text-muted small">
<i class="fas fa-terminal"></i> <code>kubectl faros clusters ssh prod</code><br/>
<i class="fas fa-brain"></i> <code>kubectl faros ai-agents init --model gpt-4</code>
</div>
</div>
</div>
</div>
</div>
{{% /blocks/section %}}

{{% blocks/section color="primary" %}}
<div class="text-center">
<h2 class="display-4 mb-4">Built for Distributed Kubernetes</h2>
<p class="lead mb-5">Unified control plane for home labs, cloud, and remote clusters</p>
<div class="row justify-content-center">
<div class="col-lg-8">
<div class="row text-center">
<div class="col-md-4 mb-4">
<h3 class="display-5 text-white"><i class="fas fa-network-wired"></i></h3>
<p class="text-light"><strong>Multi-Cluster</strong><br/>Unlimited clusters, single control plane, native kubectl experience</p>
</div>
<div class="col-md-4 mb-4">
<h3 class="display-5 text-white"><i class="fas fa-lock"></i></h3>
<p class="text-light"><strong>Secure</strong><br/>Outbound-only WebSocket tunnels with JWT + TLS encryption</p>
</div>
<div class="col-md-4 mb-4">
<h3 class="display-5 text-white"><i class="fas fa-brain"></i></h3>
<p class="text-light"><strong>AI-Powered</strong><br/>LLM agents via MCP servers for intelligent cluster insights</p>
</div>
</div>
</div>
</div>
</div>
{{% /blocks/section %}}

{{% blocks/section color="light" %}}
<div class="text-center">
<h2 class="mb-4">Ready to Unify Your Kubernetes Clusters?</h2>
<p class="lead mb-5">Install the CLI and connect your first cluster in minutes</p>
<div class="row justify-content-center mb-5">
<div class="col-lg-8">
<div class="ai-terminal text-white p-4 rounded mb-4">
<div class="d-flex align-items-center justify-content-center">
<div class="me-3">
<i class="fas fa-terminal text-success" style="font-size: 1.5rem;"></i>
</div>
<div class="text-start">
<div class="font-monospace">
<div>$ kubectl krew install faros/faros</div>
<div>$ kubectl faros login</div>
<div class="text-success">✓ Authenticated via GitHub SSO</div>
<div>$ kubectl faros clusters init production</div>
<div class="text-info">→ Deploy agent manifests to your cluster</div>
<div class="text-success">✓ Cluster connected via WebSocket tunnel</div>
<div>$ kubectl faros ai-agents init --name analyzer --model gpt-4</div>
<div class="text-success">✓ AI agent deployed with MCP server</div>
</div>
</div>
</div>
</div>
</div>
</div>
<div class="d-flex justify-content-center flex-wrap gap-3">
<a class="btn btn-primary btn-lg px-5" href="/docs/getting-started/">
<i class="fas fa-rocket me-2"></i>Get Started
</a>
<a class="btn btn-outline-primary btn-lg px-4" href="/docs/getting-started/cli/">
<i class="fas fa-terminal me-2"></i>Install CLI
</a>
<a class="btn btn-outline-secondary btn-lg px-4" href="/docs/api/">
<i class="fas fa-code me-2"></i>API Reference
</a>
</div>
<div class="mt-4">
<p class="text-muted small">
<i class="fas fa-shield-alt me-1"></i>
WebSocket tunnels • JWT auth • GitHub SSO • Kubernetes RBAC • MCP server integration
</p>
</div>
</div>
{{% /blocks/section %}}
