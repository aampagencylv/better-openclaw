import type { ServiceDefinition } from "../../types.js";

export const tabbyMlDefinition: ServiceDefinition = {
	id: "tabby-ml",
	name: "Tabby",
	description:
		"Self-hosted AI code completion server providing GitHub Copilot-like suggestions with support for multiple models.",
	category: "coding-agent",
	icon: "🐱",

	image: "tabbyml/tabby",
	imageTag: "latest",
	ports: [
		{
			host: 8180,
			container: 8080,
			description: "Tabby API",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "tabby-data",
			containerPath: "/data",
			description: "Tabby model storage and configuration data",
		},
	],
	environment: [
		{
			key: "TABBY_MODEL",
			defaultValue: "StarCoder-1B",
			secret: false,
			description: "Default code completion model",
			required: false,
		},
	],
	healthcheck: {
		test: "curl -sf http://localhost:8080/v1/health || exit 1",
		interval: "30s",
		timeout: "10s",
		retries: 3,
		startPeriod: "120s",
	},
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [
		{
			key: "TABBY_HOST",
			defaultValue: "tabby-ml",
			secret: false,
			description: "Tabby hostname for OpenClaw",
			required: true,
		},
		{
			key: "TABBY_PORT",
			defaultValue: "8080",
			secret: false,
			description: "Tabby API port for OpenClaw",
			required: true,
		},
	],

	docsUrl: "https://tabby.tabbyml.com/docs/getting-started/",
	tags: ["code-completion", "copilot", "ai-coding", "ide"],
	maturity: "stable",

	requires: [],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 2048,
	gpuRequired: false,
};
