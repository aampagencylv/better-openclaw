# @better-openclaw/web

Next.js web application for better-openclaw: visual stack builder, documentation, and showcase.

## Features

- **Visual Stack Builder** (`/new`) — Pick services, add skill packs, live preview, one-click download
- **Documentation** (`/docs`) — Installation, CLI, API, services, skill packs, deployment
- **API Reference** (`/api-docs`) — REST endpoints with curl examples
- **Showcase** (`/showcase`) — Example stacks and project gallery

## Run

```bash
pnpm dev    # Development server, port 3654
pnpm build  # Production build
pnpm start  # Production server
```

Set `NEXT_PUBLIC_API_URL` to point at the API server (default: `http://localhost:3456/v1`).

## Development

```bash
pnpm lint     # Run Biome
pnpm typecheck
```
