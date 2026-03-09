import type { ServiceDefinition } from "../../types.js";

export const textGenWebuiDefinition: ServiceDefinition = {
	id: "text-gen-webui",
	name: "Text Generation WebUI",
	description:
		"Feature-rich web interface for running large language models with support for GPTQ, GGUF, and many backends.",
	category: "ai-platform",
	icon: "💬",

	image: "atinoda/text-generation-webui",
	imageTag: "default-nightly",
	ports: [
		{
			host: 7860,
			container: 7860,
			description: "Gradio UI",
			exposed: true,
		},
		{
			host: 5000,
			container: 5000,
			description: "API",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "textgen-models",
			containerPath: "/app/models",
			description: "Language model files",
		},
		{
			name: "textgen-loras",
			containerPath: "/app/loras",
			description: "LoRA adapter files",
		},
		{
			name: "textgen-characters",
			containerPath: "/app/characters",
			description: "Character card files",
		},
	],
	environment: [
		{
			key: "EXTRA_LAUNCH_ARGS",
			defaultValue: "--listen --api",
			secret: false,
			description: "Additional launch arguments for the WebUI",
			required: false,
		},
	],
	healthcheck: {
		test: "curl -sf http://localhost:7860/ || exit 1",
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
			key: "TEXT_GEN_WEBUI_HOST",
			defaultValue: "text-gen-webui",
			secret: false,
			description: "Text Generation WebUI hostname for OpenClaw",
			required: true,
		},
		{
			key: "TEXT_GEN_WEBUI_PORT",
			defaultValue: "5000",
			secret: false,
			description: "Text Generation WebUI API port for OpenClaw",
			required: true,
		},
	],

	docsUrl: "https://github.com/oobabooga/text-generation-webui",
	tags: ["llm", "inference", "gptq", "gguf", "text-generation"],
	maturity: "stable",

	requires: [],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 4096,
	gpuRequired: false,
};
