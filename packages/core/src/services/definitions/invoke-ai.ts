import type { ServiceDefinition } from "../../types.js";

export const invokeAiDefinition: ServiceDefinition = {
	id: "invoke-ai",
	name: "InvokeAI",
	description:
		"Professional Stable Diffusion frontend with node-based workflows, canvas painting, and model management.",
	category: "ai",
	icon: "🎨",

	image: "ghcr.io/invoke-ai/invokeai",
	imageTag: "latest",
	ports: [
		{
			host: 9090,
			container: 9090,
			description: "InvokeAI web UI",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "invokeai-data",
			containerPath: "/invokeai",
			description: "InvokeAI application data and models",
		},
	],
	environment: [
		{
			key: "INVOKEAI_ROOT",
			defaultValue: "/invokeai",
			secret: false,
			description: "InvokeAI root directory",
			required: false,
		},
	],
	healthcheck: {
		test: "curl -sf http://localhost:9090/api/app/version || exit 1",
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
			key: "INVOKEAI_HOST",
			defaultValue: "invoke-ai",
			secret: false,
			description: "InvokeAI hostname for OpenClaw",
			required: true,
		},
		{
			key: "INVOKEAI_PORT",
			defaultValue: "9090",
			secret: false,
			description: "InvokeAI port for OpenClaw",
			required: true,
		},
	],

	docsUrl: "https://invoke-ai.github.io/InvokeAI/",
	tags: ["stable-diffusion", "image-generation", "canvas", "ai-art"],
	maturity: "stable",

	requires: [],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 4096,
	gpuRequired: true,
};
