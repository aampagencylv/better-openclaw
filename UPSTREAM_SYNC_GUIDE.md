# OpenClaw Upstream Sync Guide

This document describes how to sync changes from the upstream **openclaw** repository
(`C:\Users\diopi\source\repos\diopisemou\openclaw`) into the **better-openclaw** repository.
Any AI agent can read this file to understand what to check and how to propagate changes.

---

## Relationship Between the Repos

| Aspect | openclaw (upstream) | better-openclaw (this repo) |
| --- | --- | --- |
| Purpose | Multi-channel AI gateway application | Docker Compose stack generation toolkit |
| Structure | Single package (`src/`) | pnpm monorepo (`packages/core`, `cli`, `api`, `web`, `mission-control`) |
| Our concern | Config schema, Docker image, env vars, gateway ports/bind, version, Dockerfile, docker-compose.yml, docker-setup.sh | Everything in `packages/core/` that generates configs for the upstream product |

**better-openclaw generates Docker Compose stacks that _run_ the openclaw gateway.** When the upstream repo changes its configuration format, default ports, Docker image structure, environment variables, or CLI flags, we must update our generators to match.

---

## What to Sync (Priority Order)

### 1. Version & Image Tags

**Upstream file:** `package.json` → `"version"` field
**Our file:** [openclaw-json.ts](packages/core/src/generators/openclaw-json.ts) → `meta.lastTouchedVersion`
**Our file:** [schema.ts](packages/core/src/schema.ts) → `openclawVersion` default

Check the upstream version string (format: `YYYY.M.D`, e.g., `2026.3.8`).

**Upstream file:** `Dockerfile` → `ARG OPENCLAW_NODE_BOOKWORM_IMAGE`
Check if the base Node.js image or digest has changed. Our compose generator references the official image tag.

### 2. Docker Compose & Gateway Config

**Upstream file:** `docker-compose.yml`
**Our generator:** [openclaw-json.ts](packages/core/src/generators/openclaw-json.ts) + compose generation in [composer.ts](packages/core/src/composer.ts)

Check for changes to:
- **Default ports**: Gateway port `18789`, Bridge port `18790`, Canvas port `18793`, Browser CDP ports `18800-18899`
- **Bind mode**: Default bind (`lan` for Docker, `loopback` for bare-metal)
- **Command structure**: `node dist/index.js gateway --bind lan --port 18789`
- **Healthcheck**: Currently uses `fetch('http://127.0.0.1:18789/healthz')`
- **Environment variables**: `HOME`, `TERM`, `OPENCLAW_GATEWAY_TOKEN`, etc.
- **Volumes**: Config dir → `/home/node/.openclaw`, Workspace dir → `/home/node/.openclaw/workspace`
- **Security**: `cap_drop`, `security_opt`, `init: true`
- **New services**: e.g., `openclaw-cli` service added alongside the gateway

### 3. Gateway Configuration Schema (`openclaw.json`)

**Upstream files:**

- `src/config/types.openclaw.ts` — Full `OpenClawConfig` root type
- `src/config/types.gateway.ts` — Gateway config types
- `src/config/types.browser.ts` — Browser config types
- `src/config/types.acp.ts` — ACP (Agent Client Protocol) config
- `src/config/types.tools.ts` — Tools config (web search, fetch, exec, loop detection)
- `src/config/types.memory.ts` — Memory config (builtin/qmd backends)
- `src/config/types.sandbox.ts` — Sandbox Docker/browser settings
- `src/config/types.skills.ts` — Skills config
- `src/config/types.agents.ts` — Agent config, runtime, sub-agents, agent-to-agent
- `src/config/types.agent-defaults.ts` — Agent defaults (heartbeat, compaction, sandbox)
- `src/config/types.agents-shared.ts` — Shared agent types (model, sandbox)
- `src/config/types.node-host.ts` — Node host browser proxy config
- `src/config/types.base.ts` — Session config (agent-to-agent turn limits)
- `src/config/port-defaults.ts` — Default port assignments
- `src/config/zod-schema.ts` — Zod validation schema

**Our generator:** [openclaw-json.ts](packages/core/src/generators/openclaw-json.ts) → `generateOpenClawConfig()`

Watch for changes to:
- `GatewayConfig` type — new fields, renamed fields, changed defaults
- `GatewayAuthConfig` — new auth modes (e.g., `trusted-proxy` was added)
- `GatewayBindMode` — new bind modes (currently: `auto`, `lan`, `loopback`, `custom`, `tailnet`)
- `GatewayControlUiConfig` — new security options
- `GatewayTailscaleConfig` — Tailscale integration changes
- `GatewayHttpConfig` — HTTP endpoint configs (chat completions, responses API)
- `GatewayNodesConfig` — node invoke permissions
- `BrowserConfig` — browser relay, CDP, profiles
- `DiscoveryConfig` / `CanvasHostConfig` — discovery and canvas hosting
- `GatewayTlsConfig` — TLS support
- `GatewayReloadConfig` — config reload modes (`off`, `restart`, `hot`, `hybrid`)
- `GatewayRemoteConfig` — remote gateway WebSocket, SSH tunnel config
- `GatewayNodesConfig` — node browser routing (auto/manual/off), command allow/deny lists
- `AgentConfig` / `AgentsConfig` — agent definitions, sub-agent spawning, runtime types
- `AgentRuntimeConfig` — embedded vs ACP runtime for agents
- `NodeHostConfig` — node host browser proxy exposure settings
- `ToolsConfig.agentToAgent` — agent-to-agent messaging tool (enabled, allow patterns)
- `SessionConfig.agentToAgent` — ping-pong turn limits for agent-to-agent safety
- `DiscoveryConfig` — mDNS mode (off/minimal/full), wide-area DNS-SD
- `AcpConfig` — ACP enabled/dispatch/stream/runtime settings
- `ToolsConfig` — web.search (brave/perplexity/grok/gemini/kimi), web.fetch (Firecrawl), exec, loopDetection, fs guards
- `MemoryConfig` — backend (builtin/qmd), citations mode
- `SandboxDockerSettings` — container security: image, caps, memory, PIDs, network
- `SandboxBrowserSettings` — sandbox browser container settings

### 4. Environment Variables

**Upstream file:** `.env.example`
**Our generator:** [env.ts](packages/core/src/generators/env.ts)

Check for:
- New env vars (e.g., `OPENCLAW_GATEWAY_PASSWORD`, `OPENCLAW_LOAD_SHELL_ENV`)
- Renamed env vars
- New provider API key patterns (e.g., `ZAI_API_KEY`, `MINIMAX_API_KEY`, `SYNTHETIC_API_KEY`)
- New channel env vars (e.g., `MATTERMOST_BOT_TOKEN`, `ZALO_BOT_TOKEN`, `OPENCLAW_TWITCH_ACCESS_TOKEN`)
- Tool/voice env vars (e.g., `ELEVENLABS_API_KEY`, `DEEPGRAM_API_KEY`)

### 5. AI Provider Config

**Our generator:** [openclaw-json.ts](packages/core/src/generators/openclaw-json.ts) → `PROVIDER_CONFIGS`

Check for:
- New model IDs or updated model names from each provider
- Changed API base URLs
- New providers added to the upstream models config system
- Updated context windows, max tokens, or pricing

### 6. CLI Commands & Features

**Upstream files:** `src/cli/program/register.*.ts`, `src/commands/*.ts`
**Our installer script:** [openclaw-install-script.ts](packages/core/src/generators/openclaw-install-script.ts)

Check for:
- New CLI commands (e.g., `openclaw backup` was recently added)
- Changed onboarding flow (`openclaw onboard`)
- Changed dashboard command (`openclaw dashboard`)
- New install flags or options

### 7. Dockerfile Changes

**Upstream file:** `Dockerfile`
**Our reference:** compose generation that sets image/build args

Check for:
- New `ARG` variables (e.g., `OPENCLAW_INSTALL_BROWSER`, `OPENCLAW_INSTALL_DOCKER_CLI`, `OPENCLAW_DOCKER_APT_PACKAGES`)
- Changed runtime image (bookworm vs bookworm-slim, `OPENCLAW_VARIANT`)
- Changed `CMD` or `HEALTHCHECK` instructions
- New multi-stage build targets

### 8. docker-setup.sh Changes

**Upstream file:** `docker-setup.sh`
**Our script:** [openclaw_docker-setup.sh](openclaw_docker-setup.sh) (if maintained)

Check for:
- New setup parameters (e.g., `OPENCLAW_SANDBOX`, `OPENCLAW_EXTRA_MOUNTS`, `OPENCLAW_HOME_VOLUME`)
- Changed gateway token discovery logic
- New safety checks or SELinux handling
- Sandbox container support

---

## How to Perform the Sync

### Step 1: Check Upstream Changes

```bash
cd /c/Users/diopi/source/repos/diopisemou/openclaw
git pull origin main
git log --oneline --since="<last-sync-date>" -- \
  docker-compose.yml Dockerfile docker-setup.sh \
  .env.example package.json \
  src/config/types.gateway.ts src/config/types.browser.ts \
  src/config/port-defaults.ts src/config/types.ts \
  src/config/zod-schema.ts src/config/version.ts \
  src/config/defaults.ts
```

### Step 2: Compare Key Values

| Value | Upstream Source | Our Location |
| --- | --- | --- |
| Version | `package.json` → `version` | Generated `openclaw.json` → `meta.lastTouchedVersion` |
| Gateway port | `docker-compose.yml` → ports | `openclaw-json.ts` → `gateway.port` |
| Bridge port | `port-defaults.ts` → `DEFAULT_BRIDGE_PORT` | Docker compose port mappings |
| Canvas port | `port-defaults.ts` → `DEFAULT_CANVAS_HOST_PORT` | Docker compose port mappings |
| Bind modes | `types.gateway.ts` → `GatewayBindMode` | `openclaw-json.ts` → `gateway.bind` |
| Auth modes | `types.gateway.ts` → `GatewayAuthMode` | `openclaw-json.ts` → `gateway.auth.mode` |
| Healthcheck | `docker-compose.yml` / `Dockerfile` → HEALTHCHECK | Compose healthcheck generation |
| Base image | `Dockerfile` → `ARG OPENCLAW_NODE_*` | Docker image reference in compose |
| CMD | `Dockerfile` → last `CMD` | Compose `command:` field |

### Step 3: Update Our Generators

1. **[openclaw-json.ts](packages/core/src/generators/openclaw-json.ts)**: Update config structure to match the latest `openclaw.json` format
2. **[env.ts](packages/core/src/generators/env.ts)**: Add/remove/rename env vars
3. **[composer.ts](packages/core/src/composer.ts)**: Update compose service definition for `openclaw-gateway`
4. **[schema.ts](packages/core/src/schema.ts)**: Update enums if new categories, providers, or options are added
5. **[types.ts](packages/core/src/types.ts)**: Update types if schema changes

### Step 4: Run Tests

```bash
cd /c/Users/diopi/source/repos/diopisemou/better-openclaw
npx vitest run
# If snapshot tests fail due to expected changes:
npx vitest run --update
```

---

## Current Port Assignments (as of 2026.3.8)

| Port | Service | Source |
| --- | --- | --- |
| 18789 | Gateway WS + HTTP | `docker-compose.yml`, `port-defaults.ts` |
| 18790 | Bridge | `port-defaults.ts` → `DEFAULT_BRIDGE_PORT` |
| 18791 | Browser Control | `port-defaults.ts` → `DEFAULT_BROWSER_CONTROL_PORT` |
| 18793 | Canvas Host | `port-defaults.ts` → `DEFAULT_CANVAS_HOST_PORT` |
| 18800-18899 | Browser CDP range | `port-defaults.ts` → `DEFAULT_BROWSER_CDP_PORT_RANGE_*` |

---

## Current Gateway Bind Modes

| Mode | Bind Address | Use Case |
| --- | --- | --- |
| `auto` | Loopback, fallback to 0.0.0.0 | General use (NOT recommended for Docker) |
| `lan` | 0.0.0.0 | Docker deployments (REQUIRED for port mapping) |
| `loopback` | 127.0.0.1 | Local-only, bare-metal |
| `tailnet` | Tailnet IPv4 (100.64.0.0/10) | Tailscale exposure |
| `custom` | User-specified IP | Advanced setups |

---

## Current Gateway Auth Modes

| Mode | Description |
|---|---|
| `none` | No authentication |
| `token` | Shared token (default) |
| `password` | Shared password |
| `trusted-proxy` | Identity-aware reverse proxy (Pomerium, Caddy+OAuth) |

---

## Recently Added Features (2026.3.x)

These are features recently added to the upstream repo that may need to be reflected in our generators:

1. **ACP (Agent Client Protocol)** — external agents connect to the gateway via `@agentclientprotocol/sdk`. Config: `acp.enabled`, `acp.dispatch`, `acp.stream`, `acp.runtime`
2. **Tools: Web search** — multi-provider: brave (default), perplexity, grok, gemini, kimi. Config: `tools.web.search`
3. **Tools: Web fetch** — with Firecrawl fallback. Config: `tools.web.fetch`
4. **Tools: Exec security** — `tools.exec.host` (sandbox/gateway/node), `tools.exec.security` (deny/allowlist/full)
5. **Tools: Loop detection** — prevents stuck tool-call loops. Config: `tools.loopDetection`
6. **Tools: Filesystem guards** — `tools.fs.workspaceOnly` restricts file tools to workspace
7. **Memory** — backend selection (builtin/qmd), vector search with hybrid BM25+vector scoring
8. **Sandbox** — Docker-based agent exec isolation: `agents.defaults.sandbox.docker` with container security settings (caps, PIDs, memory limits, network isolation)
9. **Sandbox browser** — isolated browser containers for sandboxed sessions
10. **UI customization** — `ui.assistant.name`, `ui.assistant.avatar`, `ui.seamColor`
11. **Media retention** — `media.preserveFilenames`, `media.ttlHours`
12. **Local backup CLI** (`openclaw backup`) — new command for backing up config/sessions
13. **Browser relay bind address** (`browser.relayBindHost`) — configurable for WSL2 setups
14. **Trusted-proxy auth mode** — `gateway.auth.mode: "trusted-proxy"` with `trustedProxy` config
15. **Gateway TLS** — `gateway.tls` config for HTTPS
16. **Gateway HTTP endpoints** — `gateway.http.endpoints.chatCompletions` and `.responses`
17. **Gateway reload modes** — `gateway.reload.mode: "hybrid"` (default)
18. **Config hot-reload** — `hybrid` reload mode for live config updates
19. **Docker image trimming** — smaller runtime image payload
20. **SELinux `:Z` mount option** — for Podman/SELinux enforcing hosts
21. **Agent-to-agent messaging** — `tools.agentToAgent` enables agents to invoke each other at runtime. Config: `enabled`, `allow` (allowlist of agent IDs/patterns). Essential for swarm architectures
22. **Gateway remote connections** — `gateway.remote` enables connecting to another OpenClaw gateway via WebSocket (ws/wss) or SSH tunnel. Config: `url`, `transport` (ssh/direct), `token`, `password`, `sshTarget`, `sshIdentity`, `tlsFingerprint`
23. **Gateway nodes config** — `gateway.nodes` controls browser routing across node hosts and command allow/deny lists. Config: `browser.mode` (auto/manual/off), `allowCommands`, `denyCommands`
24. **Node host config** — `nodeHost.browserProxy` controls how this instance exposes browser proxy to other gateway nodes
25. **Discovery (mDNS)** — `discovery.mdns.mode` (off/minimal/full) for local-network Bonjour instance discovery
26. **Discovery (wide-area DNS-SD)** — `discovery.wideArea` for cross-network instance discovery via unicast DNS-SD
27. **Session agent-to-agent limits** — `session.agentToAgent.maxPingPongTurns` prevents infinite agent-to-agent loops (default: 5)
28. **Sub-agent cross-agent spawning** — `agents.defaults.subagents.allowAgents` controls which agent IDs sub-agents can spawn under

---

## Sync Checklist Template

Use this checklist when performing a sync:

- [ ] Pull latest upstream: `git pull` in openclaw repo
- [ ] Check upstream version in `package.json`
- [ ] Review `docker-compose.yml` for port/bind/env changes
- [ ] Review `Dockerfile` for image/build/runtime changes
- [ ] Review `.env.example` for new/changed env vars
- [ ] Review `src/config/types.openclaw.ts` for new top-level config sections
- [ ] Review `src/config/types.gateway.ts` for config schema changes
- [ ] Review `src/config/types.browser.ts` for browser config changes
- [ ] Review `src/config/types.acp.ts` for ACP config changes
- [ ] Review `src/config/types.tools.ts` for tools config changes
- [ ] Review `src/config/types.memory.ts` for memory config changes
- [ ] Review `src/config/types.sandbox.ts` for sandbox config changes
- [ ] Review `src/config/types.agents.ts` for agent config, runtime, and sub-agent changes
- [ ] Review `src/config/types.node-host.ts` for node host config changes
- [ ] Review `src/config/types.base.ts` for session-level config changes (agentToAgent limits)
- [ ] Review `src/config/port-defaults.ts` for port changes
- [ ] Update `packages/core/src/generators/openclaw-json.ts`
- [ ] Update `packages/core/src/generators/env.ts`
- [ ] Update composer/compose generation if needed
- [ ] Update `packages/core/src/schema.ts` if enums changed
- [ ] Run tests: `npx vitest run`
- [ ] Update snapshot tests if needed: `npx vitest run --update`
- [ ] Record sync date below

---

## Sync History

| Date | Upstream Version | Notes |
| --- | --- | --- |
| 2026-03-08 | 2026.3.8 | Initial sync guide created. Applied gateway config updates, new auth modes, browser relay config, port defaults, Dockerfile changes. |
| 2026-03-08 | 2026.3.8 | Added ACP config, tools config (web search/fetch/exec/loopDetection/fs), memory config, sandbox defaults, UI customization, media retention, tool env vars (BRAVE_API_KEY, PERPLEXITY_API_KEY, FIRECRAWL_API_KEY, ELEVENLABS_API_KEY). |
| 2026-03-08 | 2026.3.8 | Added swarm/multi-instance support: agent-to-agent messaging (tools.agentToAgent), gateway remote connections (gateway.remote with WS/SSH), gateway nodes config, nodeHost browser proxy, mDNS discovery, session agent-to-agent safety limits, sub-agent cross-agent spawning. New env vars: OPENCLAW_REMOTE_GATEWAY_TOKEN, OPENCLAW_REMOTE_GATEWAY_PASSWORD. |
