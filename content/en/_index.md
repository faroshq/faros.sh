---
title: Faros Platform
---

{{< blocks/cover title="Unified Platform for Edge Cluster Management" image_anchor="top" height="full" >}}
<div class="mx-auto">
<p class="lead">Register remote Kubernetes clusters, access them via CLI or SSH, and deploy AI agents for intelligent cluster analysis</p>
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
Faros provides a centralized platform for managing distributed Kubernetes clusters at the edge. Register clusters without exposing them to the internet, access them securely via SSH tunneling, and deploy AI agents that analyze cluster health, security, and performance.

**Multi-mode access** – CLI, SSH, or API. **Secure by default** – outbound connections only. **AI-powered** – intelligent insights and recommendations.
{{% /blocks/lead %}}

{{% blocks/section color="white" type="row" %}}
{{% blocks/feature icon="fas fa-network-wired" title="Edge Cluster Registration" %}}
Register remote Kubernetes clusters with a simple CLI command. Clusters connect via lightweight agents using outbound connections only – no VPN, no exposed endpoints, no firewall changes required.
{{% /blocks/feature %}}

{{% blocks/feature icon="fas fa-terminal" title="Multi-Mode Access" %}}
Access registered clusters through multiple interfaces: kubectl plugin for management, WebSocket SSH for interactive sessions, or RESTful API for automation. One platform, multiple access patterns.
{{% /blocks/feature %}}

{{% blocks/feature icon="fas fa-brain" title="AI Agent Integration" %}}
Deploy AI agents powered by OpenAI, Anthropic, or other LLM providers. Agents connect via MCP servers to analyze cluster metrics, identify issues, and provide intelligent recommendations.
{{% /blocks/feature %}}
{{% /blocks/section %}}

{{% blocks/section color="dark" type="row" %}}
{{% blocks/feature icon="fas fa-shield-alt" title="Secure by Default" %}}
Clusters initiate outbound connections only. No inbound traffic, no exposed control planes, no security compromises. JWT authentication and TLS encryption for all communications.
{{% /blocks/feature %}}

{{% blocks/feature icon="fas fa-users" title="Team Collaboration" %}}
Share cluster access with team members using Kubernetes-native RBAC. GitHub SSO for authentication, standard ClusterRoleBindings for authorization. No custom user management needed.
{{% /blocks/feature %}}

{{% blocks/feature icon="fas fa-sitemap" title="Centralized Management" %}}
Manage all your edge and remote clusters from a single control plane. List, access, and monitor clusters across different environments, regions, and clouds through one unified interface.
{{% /blocks/feature %}}
{{% /blocks/section %}}

{{% blocks/section color="light" %}}
<div class="text-center mb-5" id="how-it-works">
<h2 class="display-4 mb-4">How It Works</h2>
<p class="lead mb-5">Register and manage edge clusters in three simple steps</p>
</div>

<div class="row justify-content-center">
<div class="col-lg-10">
<div class="row">
<div class="col-md-4 mb-5 text-center">
<div class="step-number text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-4 transition-all" style="width: 80px; height: 80px;">
<h3 class="mb-0">1</h3>
</div>
<h4 class="mb-3">Authenticate & Register</h4>
<p class="text-muted">Login with GitHub OAuth and register your cluster. The CLI generates a JWT token and agent manifests for deployment.</p>
<div class="text-muted small">
<i class="fas fa-code"></i> <code>kubectl faros clusters init prod</code>
</div>
</div>

<div class="col-md-4 mb-5 text-center">
<div class="step-number text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-4 transition-all" style="width: 80px; height: 80px;">
<h3 class="mb-0">2</h3>
</div>
<h4 class="mb-3">Deploy Agent</h4>
<p class="text-muted">Apply the agent manifests to your target cluster. The agent establishes a secure WebSocket tunnel back to Faros using outbound connections only.</p>
<div class="text-muted small">
<i class="fas fa-network-wired"></i> Outbound-only connections
</div>
</div>

<div class="col-md-4 mb-5 text-center">
<div class="step-number text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-4 transition-all" style="width: 80px; height: 80px;">
<h3 class="mb-0">3</h3>
</div>
<h4 class="mb-3">Access & Analyze</h4>
<p class="text-muted">SSH into your cluster, deploy AI agents, or use the CLI to manage resources. All access is authenticated and logged.</p>
<div class="text-muted small">
<i class="fas fa-terminal"></i> Multi-mode access
</div>
</div>
</div>
</div>
</div>
{{% /blocks/section %}}

{{% blocks/section color="primary" %}}
<div class="text-center">
<h2 class="display-4 mb-4">Built for Modern Edge Computing</h2>
<p class="lead mb-5">Manage distributed Kubernetes clusters without complexity</p>
<div class="row justify-content-center">
<div class="col-lg-8">
<div class="row text-center">
<div class="col-md-4 mb-4">
<h3 class="display-5 text-white"><i class="fas fa-network-wired"></i></h3>
<p class="text-light"><strong>Multi-Cluster</strong><br/>Manage unlimited clusters from one control plane</p>
</div>
<div class="col-md-4 mb-4">
<h3 class="display-5 text-white"><i class="fas fa-lock"></i></h3>
<p class="text-light"><strong>Secure</strong><br/>Zero inbound connections, outbound-only architecture</p>
</div>
<div class="col-md-4 mb-4">
<h3 class="display-5 text-white"><i class="fas fa-brain"></i></h3>
<p class="text-light"><strong>AI-Powered</strong><br/>Deploy intelligent agents for cluster analysis</p>
</div>
</div>
</div>
</div>
</div>
{{% /blocks/section %}}

{{% blocks/section color="light" %}}
<div class="text-center">
<h2 class="mb-4">Ready to Connect Your Edge Clusters?</h2>
<p class="lead mb-5">Install the CLI and register your first cluster in minutes</p>
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
<div class="text-success">✓ Authenticated successfully</div>
<div>$ kubectl faros clusters init production</div>
<div class="text-info">→ Apply agent manifests to your cluster</div>
<div class="text-success">✓ Cluster registered and ready</div>
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
<a class="btn btn-outline-secondary btn-lg px-4" href="/docs/">
<i class="fas fa-book me-2"></i>Documentation
</a>
</div>
<div class="mt-4">
<p class="text-muted small">
<i class="fas fa-shield-alt me-1"></i>
Outbound-only connections • GitHub SSO • Kubernetes-native RBAC
</p>
</div>
</div>
{{% /blocks/section %}}
