import type { ServiceDefinition } from "../../types.js";

export const janDefinition: ServiceDefinition = {
	id: "jan",
	name: "Jan",
	description:
		"Offline-first ChatGPT alternative with local model management, OpenAI-compatible API, and extensions.",
	category: "ai-platform",
	icon: "🤖",

	image: "janhq/jan",
	imageTag: "latest",
	ports: [
		{
			host: 1337,
			container: 1337,
			description: "Jan API + UI",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "jan-data",
			containerPath: "/app/jan",
			description: "Jan application data and models",
		},
	],
	environment: [],
	healthcheck: {
		test: "curl -sf http://localhost:1337/healthz || exit 1",
		interval: "30s",
		timeout: "10s",
		retries: 3,
		startPeriod: "60s",
	},
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [
		{
			key: "JAN_HOST",
			defaultValue: "jan",
			secret: false,
			description: "Jan hostname for OpenClaw",
			required: true,
		},
		{
			key: "JAN_PORT",
			defaultValue: "1337",
			secret: false,
			description: "Jan API port for OpenClaw",
			required: true,
		},
	],

	docsUrl: "https://jan.ai/docs",
	tags: ["chatgpt-alternative", "local-llm", "offline", "privacy"],
	maturity: "stable",

	requires: [],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 2048,
	gpuRequired: false,
};
