import type { Preset } from "../types.js";

const presets: Preset[] = [
	{
		id: "minimal",
		name: "Minimal",
		description: "OpenClaw + Redis for caching and session management",
		services: ["redis", "caddy"],
		skillPacks: [],
		estimatedMemoryMB: 1024,
	},
	{
		id: "creator",
		name: "Creator",
		description: "Full media creation stack with FFmpeg, Remotion, and MinIO storage",
		services: ["ffmpeg", "remotion", "minio", "redis", "caddy"],
		skillPacks: ["video-creator"],
		estimatedMemoryMB: 2048,
	},
	{
		id: "researcher",
		name: "Researcher",
		description: "Research agent with vector search, web scraping, and meta search",
		services: ["qdrant", "searxng", "browserless", "redis", "caddy", "postgresql"],
		skillPacks: ["research-agent"],
		estimatedMemoryMB: 2560,
	},
	{
		id: "devops",
		name: "DevOps",
		description: "Full monitoring and automation stack with n8n, Grafana, and Uptime Kuma",
		services: ["n8n", "postgresql", "redis", "uptime-kuma", "grafana", "prometheus", "caddy"],
		skillPacks: ["dev-ops"],
		estimatedMemoryMB: 3072,
	},
	{
		id: "full",
		name: "Full Stack",
		description: "Everything enabled — all services and skill packs",
		services: [
			"redis",
			"postgresql",
			"qdrant",
			"n8n",
			"ffmpeg",
			"remotion",
			"minio",
			"caddy",
			"browserless",
			"searxng",
			"meilisearch",
			"uptime-kuma",
			"grafana",
			"prometheus",
			"ollama",
			"whisper",
			"gotify",
		],
		skillPacks: [
			"video-creator",
			"research-agent",
			"social-media",
			"dev-ops",
			"knowledge-base",
			"local-ai",
		],
		estimatedMemoryMB: 8192,
	},
	{
		id: "content-creator",
		name: "Content Creator",
		description: "Social media scheduling with Postiz, media processing, and analytics",
		services: ["postiz", "ffmpeg", "minio", "redis", "postgresql", "umami", "caddy"],
		skillPacks: ["content-creator"],
		estimatedMemoryMB: 2048,
	},
	{
		id: "ai-playground",
		name: "AI Playground",
		description: "Local AI stack with Ollama, Open WebUI, LiteLLM gateway, and document chat",
		services: ["ollama", "open-webui", "litellm", "anything-llm", "redis", "caddy"],
		skillPacks: ["ai-playground"],
		estimatedMemoryMB: 4096,
	},
	{
		id: "ai-powerhouse",
		name: "AI Powerhouse",
		description: "Local AI stack with Ollama, Open WebUI, LiteLLM gateway, and document chat",
		services: [
			"ollama",
			"redis",
			"qdrant",
			"minio",
			"litellm",
			"anything-llm",
			"n8n",
			"postgresql",
			"caddy",
			"open-webui",
			"searxng",
		],
		skillPacks: ["ai-playground"],
		estimatedMemoryMB: 4096,
	},
	{
		id: "ai-virtual-desktop",
		name: "AI Virtual Desktop",
		description:
			"Self-hosted autonomous AI agent with local LLM, vector memory, web search, browser automation, and workflow orchestration. The open-source alternative to Manus and Perplexity Computer.",
		services: [
			"ollama",
			"qdrant",
			"postgresql",
			"redis",
			"minio",
			"n8n",
			"browserless",
			"open-webui",
			"searxng",
			"caddy",
		],
		skillPacks: ["research-agent", "dev-ops"],
		estimatedMemoryMB: 6144,
	},
	{
		id: "coding-team",
		name: "Coding Team",
		description: "AI development environment with coding agents, Git, and browser IDE",
		services: ["claude-code", "opencode", "gitea", "code-server", "redis", "caddy"],
		skillPacks: ["coding-team"],
		estimatedMemoryMB: 2560,
	},
	{
		id: "lasuite-meet",
		name: "La Suite Meet",
		description: "Open-source video conferencing from La Suite numérique (Django + LiveKit)",
		services: [
			"postgresql",
			"redis",
			"livekit",
			"lasuite-meet-backend",
			"lasuite-meet-frontend",
			"lasuite-meet-agents",
			"whisper",
			"ollama",
			"caddy",
		],
		skillPacks: [],
		estimatedMemoryMB: 2048,
	},
	// ── New service presets ─────────────────────────────────────────────────
	{
		id: "backend-platform",
		name: "Backend Platform",
		description:
			"BaaS stack with Appwrite, MariaDB, Redis, RabbitMQ for auth, storage, and async workflows",
		services: ["appwrite", "mariadb", "redis", "rabbitmq", "caddy"],
		skillPacks: ["appwrite-platform"],
		estimatedMemoryMB: 3072,
	},
	{
		id: "rag-platform",
		name: "RAG Platform",
		description:
			"RAGFlow with MySQL, Redis, MinIO, OpenSearch for knowledge ingestion and grounded AI assistants",
		services: ["ragflow", "mysql", "redis", "minio", "opensearch", "caddy"],
		skillPacks: ["ragflow-platform"],
		estimatedMemoryMB: 6144,
	},
	{
		id: "zero-trust",
		name: "Zero-Trust Security",
		description:
			"SSO, secrets management, and access control with Authelia, Keycloak, and Infisical",
		services: ["authelia", "keycloak", "infisical", "postgresql", "redis", "caddy"],
		skillPacks: ["authelia-security"],
		estimatedMemoryMB: 3584,
	},
	{
		id: "content-platform",
		name: "Content Platform",
		description: "CMS and newsletter stack with Directus, Strapi, Listmonk, and Stirling PDF",
		services: ["directus", "strapi", "listmonk", "postgresql", "redis", "stirling-pdf", "caddy"],
		skillPacks: ["cms-stack"],
		estimatedMemoryMB: 3584,
	},
	{
		id: "ai-orchestrator",
		name: "AI Orchestrator",
		description: "Langflow and Firecrawl for building and deploying AI workflows",
		services: ["langflow", "firecrawl", "postgresql", "redis", "caddy"],
		skillPacks: ["ai-agent-orchestra"],
		estimatedMemoryMB: 3072,
	},
	// ── New Presets (from feature analysis) ───────────────────────────────────
	{
		id: "support-desk",
		name: "Support Desk",
		description:
			"AI-powered customer support with live chat, LLM observability, and ticket management",
		services: ["chatwoot", "chatwoot-worker", "langfuse", "redis", "postgresql", "caddy"],
		skillPacks: ["customer-support"],
		estimatedMemoryMB: 3072,
	},
	{
		id: "sales-machine",
		name: "Sales Machine",
		description:
			"CRM-driven sales pipeline with email marketing, newsletters, and workflow automation",
		services: ["twenty", "mautic", "listmonk", "n8n", "postgresql", "mysql", "redis", "caddy"],
		skillPacks: ["sales-pipeline"],
		estimatedMemoryMB: 4096,
	},
	{
		id: "data-warehouse",
		name: "Data Warehouse",
		description: "End-to-end data pipeline with DAG orchestration, 300+ connectors, and monitoring",
		services: ["airflow", "airbyte", "postgresql", "grafana", "prometheus", "redis", "caddy"],
		skillPacks: ["data-pipeline"],
		estimatedMemoryMB: 4096,
	},
	{
		id: "voice-center",
		name: "Voice Center",
		description:
			"AI voice agent stack with programmable telephony, transcription, and real-time comms",
		services: ["fonoster", "livekit", "whisper", "redis", "caddy"],
		skillPacks: ["voice-agent"],
		estimatedMemoryMB: 3072,
	},
	{
		id: "shopfront",
		name: "Shopfront",
		description: "AI-managed headless e-commerce with product management and object storage",
		services: ["medusa", "minio", "postgresql", "redis", "caddy"],
		skillPacks: ["ecommerce-ops"],
		estimatedMemoryMB: 2560,
	},
];

const presetMap = new Map<string, Preset>();
for (const preset of presets) {
	if (presetMap.has(preset.id)) {
		throw new Error(`Duplicate preset ID: "${preset.id}"`);
	}
	presetMap.set(preset.id, preset);
}

export const presetRegistry: ReadonlyMap<string, Preset> = presetMap;

export function getPresetById(id: string): Preset | undefined {
	return presetMap.get(id);
}

export function getAllPresets(): Preset[] {
	return [...presets];
}
