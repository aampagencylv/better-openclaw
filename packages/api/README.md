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
| POST | `/generate` | Generate stack. Default: JSON with `files` + `metadata`. Use `?format=complete` for full payload (input + files + metadata). Use `Accept: application/zip` or `?format=zip` for a binary ZIP. Body: same as above. |
| GET | `/openapi.json` | OpenAPI specification |

### Generate response formats

- **Default:** `{ files: Record<string, string>, metadata: { ... } }`
- **Complete JSON (for clawexa.net / export):** Add `?format=complete` or `Accept: application/vnd.openclaw.complete+json` to get `{ formatVersion: "1", input, files, metadata }`. The `input` field is the same request body used for generation.
- **ZIP:** Send `Accept: application/zip` or `?format=zip` to receive a binary ZIP with all generated files under a folder named by `projectName`. Use for one-click download or deploy (e.g. clawexa.net).

The **clawexa.net** deploy endpoint is configurable (e.g. `NEXT_PUBLIC_CLAWEXA_DEPLOY_URL` in the web app). The endpoint is not live yet; you can POST the complete JSON or upload the ZIP when the service is available.

## Rate limiting

All endpoints are rate-limited. Responses include `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `X-RateLimit-Reset` headers. When exceeded, the API returns `429` with `Retry-After`.

- **Global:** 30 requests/minute per IP (anonymous), or 300/minute when `X-API-Key` is set.
- **POST /generate:** Stricter limit (default 5/min anonymous, 10/min with API key) in addition to the global limit.

Configure via environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `RATE_LIMIT_WINDOW_MS` | `60000` | Window length in ms (global and generate) |
| `RATE_LIMIT_MAX_ANON` | `30` | Max requests per window for anonymous (global) |
| `RATE_LIMIT_MAX_API_KEY` | `300` | Max requests per window with `X-API-Key` (global) |
| `RATE_LIMIT_GENERATE_MAX_ANON` | `5` | Max generate requests per window (anonymous) |
| `RATE_LIMIT_GENERATE_MAX_API_KEY` | `10` | Max generate requests per window with API key |
| `RATE_LIMIT_GENERATE_WINDOW_MS` | same as `RATE_LIMIT_WINDOW_MS` | Window for generate endpoint |

## Run

```bash
pnpm dev    # Development (tsx watch), port 3456
pnpm build  # Compile TypeScript
pnpm start  # Production (node dist/index.mjs)
```

Set `PORT` to override the default (3456).

## Development

```bash
pnpm test   # Run tests
pnpm lint   # Run Biome
```
