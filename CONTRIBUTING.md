# Contributing to better-openclaw

Thank you for your interest in contributing! This guide will help you get started.

## Development Setup

### Prerequisites

- Node.js 20+
- pnpm 9+ (`corepack enable && corepack prepare pnpm@latest --activate`)
- Docker (for e2e testing only)

### Getting Started

```bash
# Clone the repository
git clone https://github.com/bidewio/better-openclaw.git
cd better-openclaw

# Install dependencies (pnpm is enforced)
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Start development mode
pnpm dev
```

## Monorepo Structure

```
better-openclaw/
  packages/
    core/     # Shared logic: schemas, services, resolver, composer, generators
    cli/      # Interactive CLI tool (npm: create-better-openclaw)
    api/      # REST API server (Hono)
    mcp/      # MCP server for AI agent integration
    web/      # Website + visual stack builder (Next.js)
  skills/     # SKILL.md templates for OpenClaw
  presets/    # Preset stack configurations (JSON)
```

### Package Dependencies

- `cli`, `api`, and `mcp` depend on `core`
- `web` depends on `core` (for client-side generation preview)
- `core` has no internal dependencies

## Adding a New Service Definition

1. Create a new file in `packages/core/src/services/definitions/`:

```typescript
import type { ServiceDefinition } from "../../types.js";

export const myServiceDefinition: ServiceDefinition = {
  id: "my-service",           // lowercase, hyphenated slug
  name: "My Service",         // display name
  description: "What it does",
  category: "database",       // see ServiceCategorySchema
  icon: "🔧",
  image: "docker/image",
  imageTag: "latest",
  ports: [{ host: 8080, container: 8080, description: "Web UI", exposed: true }],
  volumes: [{ name: "my-service-data", containerPath: "/data", description: "Persistent data" }],
  environment: [],
  healthcheck: { test: "curl -f http://localhost:8080/health || exit 1", interval: "30s", timeout: "10s", retries: 3 },
  dependsOn: [],
  restartPolicy: "unless-stopped",
  networks: ["openclaw-network"],
  skills: [],
  openclawEnvVars: [],
  docsUrl: "https://...",
  tags: ["tag1", "tag2"],
  maturity: "stable",
  requires: [],
  recommends: [],
  conflictsWith: [],
  minMemoryMB: 256,
  gpuRequired: false,
  // Optional: enable native install on host (bare-metal deployment)
  // nativeSupported: true,
  // nativeRecipes: [{ platform: "linux", installSteps: ["apt install ..."], startCommand: "systemctl start ...", configPath: "/etc/...", configTemplate: "..." }],
};
```

2. Add the export to `packages/core/src/services/definitions/index.ts`:
   - Add a named export line
   - Add the import
   - Add it to the `allServiceDefinitions` array

3. Run tests: `pnpm test`

4. If the service has an OpenClaw skill, create a `skills/<skill-id>/SKILL.md` template.

### Native recipes (bare-metal)

For services that can run natively on the host (e.g. Redis, PostgreSQL), you can add `nativeSupported: true` and a `nativeRecipes` array. Each recipe specifies `platform` (linux, windows, macos), `installSteps`, `startCommand`, and optionally `configPath`, `configTemplate`, `stopCommand`, `systemdUnit`. When users generate a bare-metal stack, those services get install/run scripts in `native/` and are excluded from the Docker Compose file; the gateway connects to them via `host.docker.internal`. See `packages/core/src/schema.ts` for `NativeRecipeSchema` and `packages/core/src/services/definitions/redis.ts` for an example.

## Adding a Skill Pack

Edit `packages/core/src/skills/registry.ts` and add an entry to the `skillPacks` array:

```typescript
{
  id: "my-pack",
  name: "My Pack",
  description: "What this pack enables",
  requiredServices: ["service-a", "service-b"],
  skills: ["skill-a", "skill-b"],
  icon: "🎯",
  tags: ["relevant", "tags"],
}
```

## Testing

```bash
# Run all tests
pnpm test

# Run specific test file
npx vitest run packages/core/src/resolver.test.ts

# Run tests in watch mode
npx vitest packages/core/src/
```

### Test Structure

- `packages/core/src/*.test.ts` -- Unit and integration tests
- `packages/core/src/composer.snapshot.test.ts` -- Snapshot tests for compose output
- Test files live next to the source files they test

## Code Style

- **Formatter/Linter**: Biome (run `pnpm check` to verify)
- **TypeScript**: Strict mode with `noUncheckedIndexedAccess`
- **Imports**: Always use `.js` extensions for ESM
- **Package manager**: pnpm only (enforced via `preinstall` script)

## Before You PR

- Test locally with your better-openclaw setup
- Run tests: `pnpm test`
- Ensure types check: `pnpm typecheck`
- Ensure linting passes: `pnpm lint`
- Keep PRs focused (one thing per PR; do not mix unrelated concerns)
- Describe what & why
- Reply to or resolve bot review conversations you addressed before asking for review again
- **Include screenshots** — one showing the problem/before, one showing the fix/after (for UI or visual changes)

## Review Conversations Are Author-Owned

If a review bot leaves review conversations on your PR, you are expected to handle the follow-through:

- Resolve the conversation yourself once the code or explanation fully addresses the bot's concern
- Reply and leave it open only when you need reviewer or maintainer judgment
- Do not leave "fixed" bot review conversations for maintainers to clean up for you

This applies to both human-authored and AI-assisted PRs.

## AI/Vibe-Coded PRs Welcome! 🤖

Built with Codex, Claude, or other AI tools? **Awesome - just mark it!**

Please include in your PR:

- [ ] Mark as AI-assisted in the PR title or description
- [ ] Note the degree of testing (untested / lightly tested / fully tested)
- [ ] Include prompts or session logs if possible (super helpful!)
- [ ] Confirm you understand what the code does
- [ ] Resolve or reply to bot review conversations after you address them

AI PRs are first-class citizens here. We just want transparency so reviewers know what to look for. If you are using an LLM coding agent, instruct it to resolve bot review conversations it has addressed instead of leaving them for maintainers.

## Pull Request Guidelines

1. Create a feature branch from `main`
2. Make your changes with clear, atomic commits
3. Ensure all tests pass: `pnpm test`
4. Ensure types check: `pnpm typecheck`
5. Ensure linting passes: `pnpm lint`
6. Submit a PR using the provided template

## Versioning

We use [Changesets](https://github.com/changesets/changesets) for version management. When making a change that should be released:

```bash
pnpm changeset
```

Follow the prompts to describe your change and select the appropriate version bump.

## Report a Vulnerability

We take security reports seriously. See [SECURITY.md](.github/SECURITY.md) for reporting instructions.

## License

By contributing, you agree that your contributions will be licensed under the AGPL-3.0 License.
