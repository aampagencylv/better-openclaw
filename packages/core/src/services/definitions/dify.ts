import type { ServiceDefinition } from "../../types.js";

export const difyDefinition: ServiceDefinition = {
	id: "dify",
	name: "Dify",
	description:
		"Open-source LLM app development platform with visual AI workflow builder, RAG pipeline, agent capabilities, and model management.",
	category: "ai-platform",
	icon: "🔮",

	image: "langgenius/dify-api",
	imageTag: "latest",
	ports: [
		{
			host: 3110,
			container: 5001,
			description: "Dify API",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "dify-data",
			containerPath: "/app/api/storage",
			description: "Dify storage",
		},
	],
	environment: [],
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://docs.dify.ai/",
	tags: ["ai-platform", "workflow", "rag", "agents", "visual-builder"],
	maturity: "stable",

	requires: ["postgresql", "redis"],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 1024,
	gpuRequired: false,
};
