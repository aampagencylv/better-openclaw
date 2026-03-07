import type { ServiceDefinition } from "../../types.js";

export const langfuseDefinition: ServiceDefinition = {
	id: "langfuse",
	name: "Langfuse",
	description:
		"Open-source LLM observability platform for tracing, evaluating, and debugging AI agent interactions with cost and latency tracking.",
	category: "ai-observability",
	icon: "🔭",

	image: "langfuse/langfuse",
	imageTag: "latest",
	ports: [
		{
			host: 3033,
			container: 3000,
			description: "Langfuse web UI",
			exposed: true,
		},
	],
	volumes: [],
	environment: [
		{
			key: "DATABASE_URL",
			defaultValue: "postgresql://langfuse:${LANGFUSE_DB_PASSWORD}@postgresql:5432/langfuse",
			secret: true,
			description: "PostgreSQL connection URL",
			required: true,
		},
		{
			key: "NEXTAUTH_SECRET",
			defaultValue: "${LANGFUSE_NEXTAUTH_SECRET}",
			secret: true,
			description: "NextAuth.js secret for session signing",
			required: true,
		},
		{
			key: "NEXTAUTH_URL",
			defaultValue: "http://localhost:3033",
			secret: false,
			description: "Public URL for NextAuth callbacks",
			required: true,
		},
		{
			key: "SALT",
			defaultValue: "${LANGFUSE_SALT}",
			secret: true,
			description: "Salt for hashing API keys",
			required: true,
		},
	],
	healthcheck: {
		test: "curl -sf http://localhost:3000/api/public/health || exit 1",
		interval: "30s",
		timeout: "10s",
		retries: 5,
		startPeriod: "30s",
	},
	dependsOn: ["postgresql"],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://langfuse.com/docs/deployment/self-host",
	tags: ["llm", "observability", "tracing", "ai", "debugging", "cost-tracking"],
	maturity: "stable",

	requires: ["postgresql"],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 512,
	gpuRequired: false,
};
