<p align="center">
  <h1 align="center">better-openclaw</h1>
  <p align="center">
    Build your OpenClaw superstack in seconds
  </p>
</p>

<p align="center">
  <a href="#quick-start">Quick Start</a> &bull;
  <a href="#features">Features</a> &bull;
  <a href="#service-catalog">Services</a> &bull;
  <a href="#skill-packs">Skill Packs</a> &bull;
  <a href="#architecture">Architecture</a> &bull;
  <a href="#development">Development</a>
</p>

<p align="center">
  <img alt="License" src="https://img.shields.io/badge/license-MIT-blue.svg" />
  <img alt="Node" src="https://img.shields.io/badge/node-%3E%3D20-brightgreen.svg" />
  <img alt="pnpm" src="https://img.shields.io/badge/pnpm-9.15.4-orange.svg" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.7-blue.svg" />
</p>

---

**better-openclaw** is a CLI tool, REST API, and web UI for scaffolding production-ready [OpenClaw](https://github.com/openclaw) stacks with Docker Compose. Pick your services, choose skill packs, and get a fully wired `docker-compose.yml`, `.env`, reverse proxy configs, monitoring dashboards, and agent skill files -- all in one command.

## Quick Start

```bash
pnpm create better-openclaw@latest
```

Follow the interactive wizard to select services, skill packs, and configuration options. Your complete stack will be generated in seconds.

Or run non-interactively:

```bash
pnpm create better-openclaw@latest --preset researcher --output ./my-stack
```

## Features

- **Interactive CLI wizard** -- guided service selection with dependency resolution
- **Non-interactive mode** -- scriptable with presets and flags for CI/CD pipelines
- **REST API** -- generate stacks programmatically via HTTP endpoints
- **Web UI** -- visual stack builder with live preview and one-click download
- **Smart dependency resolution** -- automatically adds required services (e.g., n8n adds PostgreSQL)
- **Preset stacks** -- pre-configured templates for common use cases
- **Skill packs** -- bundles of agent skills wired to their backing services
- **Reverse proxy configs** -- auto-generated Caddy or Traefik configuration
- **Monitoring dashboards** -- Grafana + Prometheus pre-wired with service exporters
- **Environment files** -- secure `.env` generation with random secrets
- **Validation engine** -- port conflicts, resource limits, and configuration checks
- **Multi-platform support** -- linux/amd64 and linux/arm64

## Service Catalog

23 services across 11 categories, ready to compose:

| Category | Services |
|---|---|
| **Database & Caching** | PostgreSQL, Redis, Valkey |
| **Vector Databases** | Qdrant, ChromaDB, Weaviate |
| **Automation & Workflows** | n8n |
| **Media & Video** | FFmpeg, Remotion, Motion Canvas |
| **Object Storage** | MinIO |
| **Reverse Proxy** | Caddy, Traefik |
| **Monitoring** | Grafana, Prometheus, Uptime Kuma |
| **Browser Automation** | Browserless |
| **Search** | SearXNG, Meilisearch |
| **AI / Local Models** | Ollama, Whisper |
| **Notifications** | Gotify, ntfy |

Each service definition includes Docker image, ports, volumes, health checks, environment variables, resource limits, and dependency declarations.

## Skill Packs

Skill packs bundle agent skills with their required infrastructure:

| Pack | Description | Services |
|---|---|---|
| **Video Creator** | Create and process videos programmatically | FFmpeg, Remotion, MinIO |
| **Research Agent** | Web research with vector memory and scraping | Qdrant, SearXNG, Browserless |
| **Social Media** | Content processing with caching and storage | FFmpeg, Redis, MinIO |
| **DevOps** | Monitoring, automation, and alerting | n8n, Redis, Uptime Kuma, Grafana, Prometheus |
| **Knowledge Base** | Document indexing with vector + full-text search | Qdrant, PostgreSQL, Meilisearch |
| **Local AI** | Local LLM inference and speech-to-text | Ollama, Whisper |

## Presets

Pre-configured stack templates for quick starts:

| Preset | Services | Memory |
|---|---|---|
| **Minimal** | Redis | ~1 GB |
| **Creator** | FFmpeg, Remotion, MinIO, Redis | ~2 GB |
| **Researcher** | Qdrant, SearXNG, Browserless, Redis | ~2.5 GB |
| **DevOps** | n8n, PostgreSQL, Redis, Uptime Kuma, Grafana, Prometheus | ~3 GB |
| **Full Stack** | All 17 core services + all skill packs | ~8 GB |

## Architecture

better-openclaw is a TypeScript monorepo managed with pnpm workspaces and Turborepo:

```
better-openclaw/
├── packages/
│   ├── core/          # Schemas, service registry, resolver, composer, validators
│   ├── cli/           # Interactive wizard + non-interactive CLI (Commander + Clack)
│   ├── api/           # REST API (Hono + Zod OpenAPI)
│   └── web/           # Web UI (Next.js 15 + Tailwind CSS 4)
├── presets/           # JSON preset definitions
├── skills/            # Agent skill templates (Markdown)
├── turbo.json         # Turborepo task pipeline
├── biome.json         # Linting and formatting (Biome)
└── vitest.config.ts   # Test configuration (Vitest)
```

### Package Dependency Graph

```
@better-openclaw/web ──┐
@better-openclaw/api ──┤──▶ @better-openclaw/core
@better-openclaw/cli ┘
```

### Key Technologies

- **Runtime**: Node.js 22
- **Language**: TypeScript 5.7
- **Monorepo**: pnpm workspaces + Turborepo
- **API**: Hono with Zod OpenAPI
- **Web**: Next.js 15 with React 19, Tailwind CSS 4, Framer Motion
- **CLI**: Commander + @clack/prompts
- **Validation**: Zod schemas throughout
- **Testing**: Vitest
- **Linting**: Biome

## Development

### Prerequisites

- Node.js >= 20
- pnpm 9.15.4

### Setup

```bash
# Clone the repository
git clone https://github.com/diopisemou/better-openclaw.git
cd better-openclaw

# Install dependencies
pnpm install

# Start all packages in development mode
pnpm dev
```

This starts:
- **API** at `http://localhost:3456` (with hot reload via tsx)
- **Web** at `http://localhost:3654` (with Next.js fast refresh)
- **Core** and **CLI** in watch mode

### Commands

| Command | Description |
|---|---|
| `pnpm dev` | Start all packages in dev mode |
| `pnpm build` | Build all packages |
| `pnpm test` | Run all tests |
| `pnpm lint` | Lint all packages |
| `pnpm typecheck` | Type-check all packages |
| `pnpm format` | Format all files with Biome |
| `pnpm clean` | Remove all build artifacts |

### Docker

Build and run the full stack with Docker:

```bash
docker compose up --build
```

This exposes:
- **Web UI** at `http://localhost:3000`
- **API** at `http://localhost:3456`

## Contributing

Contributions are welcome! Please see the [Contributing Guide](CONTRIBUTING.md) for details on:

- Adding new service definitions
- Creating skill packs
- Building preset stacks
- Writing tests
- Code style and conventions

## License

[MIT](LICENSE) -- build freely.

---

<p align="center">
  Made with care by <a href="https://bidew.io">Bachir @ bidew.io</a>
</p>
