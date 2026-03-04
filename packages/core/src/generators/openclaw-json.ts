import type { AiProvider, DeploymentType, ResolverOutput } from "../types.js";

export interface OpenClawConfigOptions {
  deploymentType: DeploymentType;
  gatewayPort: number;
  openclawVersion: string;
}

const PROVIDER_CONFIGS: Record<AiProvider, any> = {
  openai: {
    baseUrl: "https://api.openai.com/v1",
    api: "openai-completions",
    auth: "api-key",
    apiKey: "${OPENAI_API_KEY}",
    models: [
      {
        id: "gpt-5",
        name: "GPT-5",
        api: "openai-completions",
        reasoning: false,
        input: ["text", "image"],
        cost: { input: 2.5, output: 10, cacheRead: 1.25, cacheWrite: 2.5 },
        contextWindow: 128000,
        maxTokens: 16384,
      },
      {
        id: "o4-mini",
        name: "o4-mini",
        api: "openai-completions",
        reasoning: true,
        input: ["text"],
        cost: { input: 1.1, output: 4.4, cacheRead: 0.55, cacheWrite: 1.1 },
        contextWindow: 200000,
        maxTokens: 100000,
      },
      {
        id: "gpt-5-mini",
        name: "GPT-5 Mini",
        api: "openai-completions",
        reasoning: false,
        input: ["text", "image"],
        cost: { input: 0.15, output: 0.6, cacheRead: 0.075, cacheWrite: 0.15 },
        contextWindow: 128000,
        maxTokens: 16384,
      },
    ],
  },
  anthropic: {
    baseUrl: "https://api.anthropic.com/v1/messages",
    api: "anthropic-messages",
    auth: "api-key",
    apiKey: "${ANTHROPIC_API_KEY}",
    models: [
      {
        id: "claude-opus-4-6",
        name: "Claude 4.6 Opus",
        api: "anthropic-messages",
        reasoning: true,
        input: ["text", "image"],
        cost: { input: 15.0, output: 75.0, cacheRead: 1.5, cacheWrite: 18.75 },
        contextWindow: 1000000,
        maxTokens: 128000,
      },
      {
        id: "claude-sonnet-4-6",
        name: "Claude 4.6 Sonnet",
        api: "anthropic-messages",
        reasoning: true,
        input: ["text", "image"],
        cost: { input: 3.0, output: 15.0, cacheRead: 0.3, cacheWrite: 3.75 },
        contextWindow: 1000000,
        maxTokens: 128000,
      },
    ],
  },
  google: {
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai",
    api: "openai-completions",
    auth: "api-key",
    apiKey: "${GOOGLE_API_KEY}",
    models: [
      {
        id: "gemini-3.1-pro-preview",
        name: "Gemini 3.1 Pro",
        api: "openai-completions",
        reasoning: true,
        input: ["text", "image"],
        cost: { input: 2.0, output: 8.0, cacheRead: 0.5, cacheWrite: 2.0 },
        contextWindow: 2000000,
        maxTokens: 8192,
      },
      {
        id: "gemini-3-flash-preview",
        name: "Gemini 3 Flash",
        api: "openai-completions",
        reasoning: false,
        input: ["text", "image"],
        cost: { input: 0.15, output: 0.6, cacheRead: 0.0375, cacheWrite: 0.15 },
        contextWindow: 1000000,
        maxTokens: 8192,
      },
    ],
  },
  xai: {
    baseUrl: "https://api.x.ai/v1",
    api: "openai-completions",
    auth: "api-key",
    apiKey: "${XAI_API_KEY}",
    models: [
      {
        id: "grok-4-fast",
        name: "Grok 4 Fast",
        api: "openai-completions",
        reasoning: false,
        input: ["text", "image"],
        cost: { input: 2.0, output: 10.0, cacheRead: 1.0, cacheWrite: 2.0 },
        contextWindow: 256000,
        maxTokens: 32768,
      },
    ],
  },
  deepseek: {
    baseUrl: "https://api.deepseek.com/v1",
    api: "openai-completions",
    auth: "api-key",
    apiKey: "${DEEPSEEK_API_KEY}",
    models: [
      {
        id: "deepseek-chat",
        name: "DeepSeek V3",
        api: "openai-completions",
        reasoning: false,
        input: ["text"],
        cost: { input: 0.14, output: 0.28, cacheRead: 0.014, cacheWrite: 0.14 },
        contextWindow: 65536,
        maxTokens: 8192,
      },
      {
        id: "deepseek-reasoner",
        name: "DeepSeek R1",
        api: "openai-completions",
        reasoning: true,
        input: ["text"],
        cost: { input: 0.55, output: 2.19, cacheRead: 0.14, cacheWrite: 0.55 },
        contextWindow: 65536,
        maxTokens: 8192,
      },
    ],
  },
  groq: {
    baseUrl: "https://api.groq.com/openai/v1",
    api: "openai-completions",
    auth: "api-key",
    apiKey: "${GROQ_API_KEY}",
    models: [
      {
        id: "llama-4-maverick",
        name: "LLaMA 4 Maverick (Groq)",
        api: "openai-completions",
        reasoning: false,
        input: ["text", "image"],
        cost: { input: 0.59, output: 0.79 },
        contextWindow: 1000000,
        maxTokens: 32768,
      },
    ],
  },
  openrouter: {
    baseUrl: "https://openrouter.ai/api/v1",
    api: "openai-completions",
    auth: "api-key",
    apiKey: "${OPENROUTER_API_KEY}",
    models: [
      {
        id: "anthropic/claude-opus-4-6",
        name: "Claude 4.6 Opus (OpenRouter)",
        api: "openai-completions",
        reasoning: true,
        input: ["text", "image"],
        cost: { input: 15.0, output: 75.0 },
        contextWindow: 1000000,
        maxTokens: 128000,
      },
    ],
  },
  mistral: {
    baseUrl: "https://api.mistral.ai/v1",
    api: "openai-completions",
    auth: "api-key",
    apiKey: "${MISTRAL_API_KEY}",
    models: [
      {
        id: "mistral-large-latest",
        name: "Mistral Large",
        api: "openai-completions",
        reasoning: false,
        input: ["text"],
        cost: { input: 2.0, output: 6.0 },
        contextWindow: 131000,
        maxTokens: 8192,
      },
    ],
  },
  together: {
    baseUrl: "https://api.together.xyz/v1",
    api: "openai-completions",
    auth: "api-key",
    apiKey: "${TOGETHER_API_KEY}",
    models: [
      {
        id: "meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8", // "meta-llama/Llama-4-Maverick-Instruct-Turbo",
        name: "LLaMA 4 Maverick (Together)",
        api: "openai-completions",
        reasoning: false,
        input: ["text", "image"],
        cost: { input: 0.88, output: 0.88 },
        contextWindow: 1000000,
        maxTokens: 32768,
      },
    ],
  },
  ollama: {
    baseUrl: null, // dynamic: resolved at generation time based on deployment type
    api: "openai-completions",
    auth: "none",
    models: [
      {
        id: "llama3:latest",
        name: "LLaMA 3 (Local)",
        api: "openai-completions",
        reasoning: false,
        input: ["text"],
        cost: { input: 0, output: 0 },
        contextWindow: 8192,
        maxTokens: 4096,
      },
      {
        id: "deepseek-r1:latest",
        name: "DeepSeek R1 (Local)",
        api: "openai-completions",
        reasoning: true,
        input: ["text"],
        cost: { input: 0, output: 0 },
        contextWindow: 8192,
        maxTokens: 4096,
      },
    ],
  },
  "ollama-cloud": {
    baseUrl: "https://ollama.com/v1",
    api: "openai-completions",
    auth: "api-key",
    apiKey: "${OLLAMA_API_KEY}",
    models: [
      {
        id: "qwen3.5:397b-cloud",
        name: "Qwen 3.5 397B (Cloud)",
        api: "openai-completions",
        reasoning: false,
        input: ["text"],
        cost: { input: 0, output: 0 },
        contextWindow: 131072,
        maxTokens: 32768,
      },
      {
        id: "glm-5:cloud",
        name: "GLM-5 (Cloud)",
        api: "openai-completions",
        reasoning: false,
        input: ["text"],
        cost: { input: 0, output: 0 },
        contextWindow: 131072,
        maxTokens: 32768,
      },
      {
        id: "minimax-m2.5:cloud",
        name: "MiniMax M2.5 (Cloud)",
        api: "openai-completions",
        reasoning: false,
        input: ["text"],
        cost: { input: 0, output: 0 },
        contextWindow: 131072,
        maxTokens: 32768,
      },
      {
        id: "kimi-k2.5:cloud",
        name: "Kimi K2.5 (Cloud)",
        api: "openai-completions",
        reasoning: false,
        input: ["text"],
        cost: { input: 0, output: 0 },
        contextWindow: 131072,
        maxTokens: 32768,
      },
      {
        id: "gemini-3-flash-preview:cloud",
        name: "Gemini 3 Flash (Cloud)",
        api: "openai-completions",
        reasoning: false,
        input: ["text", "image"],
        cost: { input: 0, output: 0 },
        contextWindow: 1000000,
        maxTokens: 8192,
      },
    ],
  },
  lmstudio: {
    baseUrl: null, // dynamic: resolved at generation time based on deployment type
    api: "openai-completions",
    auth: "none",
    models: [
      {
        id: "local-model",
        name: "LM Studio Model",
        api: "openai-completions",
        reasoning: false,
        input: ["text"],
        cost: { input: 0, output: 0 },
        contextWindow: 8192,
        maxTokens: 4096,
      },
    ],
  },
  vllm: {
    baseUrl: null, // dynamic: resolved at generation time based on deployment type
    api: "openai-completions",
    auth: "none",
    models: [
      {
        id: "local-model",
        name: "vLLM Model",
        api: "openai-completions",
        reasoning: false,
        input: ["text"],
        cost: { input: 0, output: 0 },
        contextWindow: 8192,
        maxTokens: 4096,
      },
    ],
  },
};

/** Default ports for local inference providers (ollama, lmstudio, vllm). */
const LOCAL_PROVIDER_PORTS: Record<string, number> = {
  ollama: 11434,
  lmstudio: 1234,
  vllm: 8000,
};

/**
 * Generates a default `openclaw/config/openclaw.json` tailored
 * to the services installed in the stack.
 */
export function generateOpenClawConfig(
  resolved: ResolverOutput,
  options: OpenClawConfigOptions,
): string {
  const isDocker = options.deploymentType === "docker";
  // Docker containers reach host services via host.docker.internal; bare-metal uses localhost
  const localInferenceHost = isDocker ? "host.docker.internal" : "localhost";
  // Docker: bind to all interfaces (0.0.0.0) so port mapping works from host
  // Bare-metal/local: bind to loopback (127.0.0.1) for security, Tailscale can expose if needed
  const gatewayBind = isDocker ? "lan" : "loopback";
  const defaultSkills: Record<string, { enabled: boolean }> = {};

  // Auto-enable any OpenClaw skills attached to installed companion services
  for (const { definition } of resolved.services) {
    for (const skill of definition.skills) {
      if (skill.autoInstall) {
        defaultSkills[skill.skillId] = { enabled: true };
      }
    }
  }

  const providers: Record<string, any> = {};
  const agentsModels: Record<string, { alias: string }> = {};
  let primaryModel = "";

  // Always default to empty or the first choice, fallback to openai if nothing was passed
  const selectedProviders =
    resolved.aiProviders && resolved.aiProviders.length > 0
      ? resolved.aiProviders
      : (["openai"] as AiProvider[]);

  for (const provider of selectedProviders) {
    const meta = PROVIDER_CONFIGS[provider];
    if (!meta) continue;

    // Local inference providers have null baseUrl — resolve dynamically based on deployment type
    const baseUrl =
      meta.baseUrl ??
      `http://${localInferenceHost}:${LOCAL_PROVIDER_PORTS[provider] ?? 8000}/v1`;

    providers[provider] = {
      baseUrl,
      api: meta.api,
      auth: meta.auth,
      ...(meta.apiKey ? { apiKey: meta.apiKey } : {}),
      models: meta.models,
    };

    for (const m of meta.models) {
      const fullId = `${provider}/${m.id}`;
      agentsModels[fullId] = { alias: m.name };
      if (!primaryModel) primaryModel = fullId; // Use the very first model mapped as the global system default
    }
  }

  const authProfiles: Record<string, any> = {
    "local:default": {
      provider: "local",
      mode: "token",
    },
  };

  // Add provider auth profiles too
  for (const provider of Object.keys(providers)) {
    authProfiles[`${provider}:default`] = {
      provider: provider,
      mode: "api_key",
    };
  }

  const config = {
    meta: {
      lastTouchedVersion: options.openclawVersion,
      lastTouchedAt: new Date().toISOString(),
    },
    env: {
      shellEnv: {
        enabled: true,
      },
      vars: {},
    },
    wizard: {
      lastRunAt: new Date().toISOString(),
      lastRunVersion: options.openclawVersion,
      lastRunCommand: "auto-generated-by-better-openclaw",
      lastRunMode: "local",
    },
    logging: {
      redactSensitive: "tools",
    },
    update: {
      checkOnStart: true,
    },
    auth: {
      profiles: authProfiles,
    },
    models: {
      mode: "merge",
      providers,
    },
    agents: {
      defaults: {
        model: {
          primary: primaryModel,
        },
        models: agentsModels,
        workspace: isDocker ? "/home/node/.openclaw/workspace" : "./workspace",
        compaction: { mode: "safeguard" },
        maxConcurrent: 4,
        subagents: { maxConcurrent: 8 },
      },
    },
    messages: {
      ackReactionScope: "group-mentions",
    },
    commands: {
      native: "auto",
      nativeSkills: "auto",
    },
    cron: {
      enabled: true,
    },
    hooks: {
      internal: {
        enabled: true,
        entries: {
          "boot-md": { enabled: true },
          "bootstrap-extra-files": { enabled: true },
          "command-logger": { enabled: true },
          "session-memory": { enabled: true },
        },
      },
    },
    web: {
      enabled: true,
    },
    discovery: {
      wideArea: {
        enabled: true,
      },
    },
    canvasHost: {
      enabled: true,
      liveReload: true,
    },
    channels: {},
    gateway: {
      port: options.gatewayPort,
      mode: "local",
      bind: gatewayBind,
      controlUi: {
        enabled: true,
        // Docker NAT makes browser connections appear external — skip device pairing, use token-only auth
        ...(isDocker ? { allowInsecureAuth: true } : {}),
        // Non-loopback binds need explicit origin allowlist for control UI CORS
        // Reference: docker-setup.sh ensure_control_ui_allowed_origins()
        ...(gatewayBind !== "loopback"
          ? { allowedOrigins: [`http://127.0.0.1:${options.gatewayPort}`] }
          : {}),
      },
      auth: {
        mode: "token",
        token: "${OPENCLAW_GATEWAY_TOKEN}",
        ...(isDocker ? {} : { allowTailscale: true }),
      },
      // Tailscale serve only works on bare-metal/local (not inside Docker containers)
      ...(isDocker ? {} : { tailscale: { mode: "serve", resetOnExit: true } }),
      nodes: {
        denyCommands: ["camera.snap", "camera.clip", "screen.record"],
      },
    },
    skills: {
      install: { nodeManager: "pnpm" },
      load: {
        watch: true,
      },
      ...(Object.keys(defaultSkills).length > 0
        ? { entries: defaultSkills }
        : {}),
    },
    plugins: {
      enabled: true,
      entries: {
        telegram: { enabled: true },
        whatsapp: { enabled: true },
        discord: { enabled: true },
        "memory-core": { enabled: true },
      },
    },
  };

  return JSON.stringify(config, null, 2);
}
