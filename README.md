# Faros Platform Documentation

Documentation website for [Faros](https://faros.sh) - a unified platform for managing distributed Kubernetes clusters at the edge.

## About Faros

Faros provides a centralized platform for managing multiple Kubernetes clusters through a modern CLI interface. Key features:

- **Edge Cluster Registration**: Register remote clusters with outbound-only connections
- **Multi-Mode Access**: CLI, WebSocket SSH, or RESTful API
- **AI Agent Integration**: Deploy LLM-powered agents for intelligent cluster analysis
- **Secure by Default**: No inbound connections, JWT authentication, TLS encryption
- **Team Collaboration**: GitHub SSO with Kubernetes-native RBAC

## Documentation Structure

This site provides comprehensive documentation for:

- **CLI Installation & Usage**: kubectl plugin for cluster and AI agent management
- **Cluster Management**: Registering, accessing, and monitoring Kubernetes clusters
- **AI Agents**: Deploying and configuring intelligent agents for cluster analysis
- **Concepts**: Core architecture and security model

## Technology Stack

This documentation site is built with:

- **Hugo**: Static site generator (v0.110.0+)
- **Docsy Theme**: Google's documentation theme
- **Tailwind CSS**: Utility-first CSS framework
- **Alpine.js**: Lightweight JavaScript framework

The site uses Hugo modules for theme management and dependencies.

## Getting Started with Faros

### Prerequisites

- `kubectl` installed
- `krew` (kubectl plugin manager)

### Quick Start

```bash
# Install Faros CLI
kubectl krew index add faros https://github.com/faroshq/krew-index.git
kubectl krew install faros/faros

# Authenticate
kubectl faros login

# Register a cluster
kubectl faros clusters init production

# List clusters
kubectl faros clusters list

# Access cluster via SSH
kubectl faros clusters ssh production

# Deploy an AI agent
kubectl faros ai-agents init \
  --name prod-analyzer \
  --backend openai \
  --model gpt-4 \
  --api-key <your-key>
```

## Development Setup

### Prerequisites

- Hugo extended v0.110.0 or higher
- Node.js and npm (for PostCSS and Tailwind)
- Go 1.18 or higher

### Local Development

```bash
# Install dependencies
npm install

# Run development server
hugo server
```

The site will be available at `http://localhost:1313`.

## Building for Production

```bash
# Build static site
hugo

# Build with npm scripts
npm run build
```

The generated site will be in the `public/` directory.

## Docker Development

Run the documentation site in a Docker container:

```bash
# Build and run
docker-compose up --build

# Access at http://localhost:1313
```

To stop and cleanup:

```bash
# Stop (Ctrl + C)
# Remove containers
docker-compose rm
```

## Advanced Development

### Using a Local Docsy Theme

For theme development, clone Docsy locally:

```bash
cd /path/to/faros.sh
git clone --branch v0.7.2 https://github.com/google/docsy.git ../docsy

# Run with local theme
HUGO_MODULE_WORKSPACE=docsy.work hugo server --ignoreVendorPaths "**"

# Or with npm
npm run local serve
```

This enables hot-reloading of theme changes.

## Troubleshooting

### Hugo Version Errors

**Error**: `template for shortcode "blocks/cover" not found`

**Solution**: Upgrade to Hugo extended v0.110.0 or higher:

```bash
# Check version
hugo version

# Install latest extended version
# See: https://gohugo.io/installation/
```

### SCSS Build Errors

**Error**: `TOCSS: failed to transform "scss/main.scss"`

**Solution**: Ensure you're using Hugo **extended** edition, not the standard version.

### Module Download Errors

**Error**: `binary with name "go" not found`

**Solution**: Install Go 1.18 or higher:

```bash
# Verify installation
go version
```

### PostCSS/Tailwind Errors

**Solution**: Install Node dependencies:

```bash
npm install
```

## Contributing

Contributions to improve the documentation are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally with `hugo server`
5. Submit a pull request

## Resources

- **Faros Platform**: [https://faros.sh](https://faros.sh)
- **Documentation**: [https://faros.sh/docs](https://faros.sh/docs)
- **GitHub**: [https://github.com/faroshq](https://github.com/faroshq)
- **Docsy Theme**: [https://www.docsy.dev](https://www.docsy.dev)
- **Hugo Documentation**: [https://gohugo.io/documentation](https://gohugo.io/documentation)

## License

This documentation is part of the Faros platform project.
