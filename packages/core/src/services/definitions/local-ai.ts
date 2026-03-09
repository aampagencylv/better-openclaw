import type { ServiceDefinition } from "../../types.js";

export const localAiDefinition: ServiceDefinition = {
	id: "local-ai",
	name: "LocalAI",
	description:
		"Drop-in OpenAI API replacement for running local LLMs, image generation, and audio processing without GPU.",
	category: "ai",
	icon: "🧊",

	image: "localai/localai",
	imageTag: "latest-cpu",
	ports: [
		{
			host: 8191,
			container: 8080,
			description: "OpenAI-compatible API",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "local-ai-models",
			containerPath: "/models",
			description: "LocalAI model storage",
		},
	],
	environment: [
		{
			key: "THREADS",
			defaultValue: "4",
			secret: false,
			description: "Number of CPU threads for inference",
			required: false,
		},
		{
			key: "CONTEXT_SIZE",
			defaultValue: "512",
			secret: false,
			description: "Default context size for models",
			required: false,
		},
		{
			key: "MODELS_PATH",
			defaultValue: "/models",
			secret: false,
			description: "Path to model files inside the container",
			required: false,
		},
	],
	healthcheck: {
		test: "curl -sf http://localhost:8080/readyz || exit 1",
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
			key: "LOCAL_AI_HOST",
			defaultValue: "local-ai",
			secret: false,
			description: "LocalAI hostname for OpenClaw",
			required: true,
		},
		{
			key: "LOCAL_AI_PORT",
			defaultValue: "8080",
			secret: false,
			description: "LocalAI API port for OpenClaw",
			required: true,
		},
	],

	docsUrl: "https://localai.io/docs/",
	tags: ["openai-compatible", "local-llm", "inference", "cpu"],
	maturity: "stable",

	requires: [],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 2048,
	gpuRequired: false,
};
