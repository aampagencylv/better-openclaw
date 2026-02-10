# @better-openclaw/api

REST API for generating production-ready OpenClaw Docker Compose stacks.

## Endpoints

Base path: `/v1`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/services` | List services (`?category=`, `?maturity=`) |
| GET | `/skills` | List skill packs (`?services=id1,id2`) |
| GET | `/presets` | List preset configurations |
| POST | `/validate` | Validate stack configuration |
| POST | `/generate` | Generate stack (returns files + metadata). Body: `projectName`, `services`, `skillPacks?`, `proxy?`, `domain?`, `gpu?`, `platform?`, `deployment?`, `deploymentType?` (docker \| bare-metal; bare-metal = native + Docker hybrid with platform-specific install scripts), `monitoring?` |
| GET | `/openapi.json` | OpenAPI specification |

## Run

```bash
pnpm dev    # Development (tsx watch), port 3456
pnpm build  # Compile TypeScript
pnpm start  # Production (node dist/index.js)
```

Set `PORT` to override the default (3456).

## Development

```bash
pnpm test   # Run tests
pnpm lint   # Run Biome
```
