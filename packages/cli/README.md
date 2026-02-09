# create-better-openclaw

CLI tool for scaffolding production-ready OpenClaw stacks with Docker Compose.

## Usage

```bash
# Interactive wizard
pnpm create better-openclaw@latest [project-directory]

# Non-interactive
pnpm create better-openclaw@latest --preset researcher --yes
pnpm create better-openclaw@latest --services ollama,qdrant,n8n --skills ollama-local-llm,qdrant-memory
```

## Options

| Flag | Description |
|------|-------------|
| `-y, --yes` | Use default configuration (skip wizard) |
| `--preset <name>` | Use preset: minimal, creator, researcher, devops, full |
| `--services <ids>` | Comma-separated service IDs |
| `--skills <packs>` | Comma-separated skill pack IDs |
| `--proxy <type>` | Reverse proxy: none, caddy, traefik |
| `--domain <domain>` | Domain for reverse proxy auto-SSL |
| `--monitoring` | Include Grafana + Prometheus |
| `--gpu` | Enable GPU passthrough for AI services |
| `--dry-run` | Preview without writing files |
| `--open` | Open web UI stack builder in browser |

## Development

```bash
pnpm build    # Compile TypeScript
pnpm dev      # Watch mode
pnpm test     # Run tests
pnpm lint     # Run Biome
```
