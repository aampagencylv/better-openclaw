import type { ServiceDefinition } from "../../types.js";

export const langflowDefinition: ServiceDefinition = {
	id: "langflow",
	name: "Langflow",
	description:
		"Visual low-code builder for LLM workflows, agents, retrieval pipelines, and tool orchestration using LangChain-compatible components.",
	category: "ai-platform",
	icon: "🧩",

	image: "langflowai/langflow",
	imageTag: "latest",
	ports: [
		{
			host: 7865,
			container: 7860,
			description: "Langflow web UI",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "langflow-data",
			containerPath: "/app/langflow",
			description: "Langflow configuration, sqlite database, and uploads",
		},
	],
	environment: [
		{
			key: "LANGFLOW_HOST",
			defaultValue: "0.0.0.0",
			secret: false,
			description: "Host interface for Langflow",
			required: true,
		},
		{
			key: "LANGFLOW_PORT",
			defaultValue: "7860",
			secret: false,
			description: "Langflow application port",
			required: true,
		},
		{
			key: "LANGFLOW_CONFIG_DIR",
			defaultValue: "/app/langflow",
			secret: false,
			description: "Directory for Langflow state and configuration",
			required: true,
		},
		{
			key: "DO_NOT_TRACK",
			defaultValue: "true",
			secret: false,
			description: "Disable telemetry",
			required: true,
		},
	],
	healthcheck: {
		test: "curl -sf http://localhost:7860/ || exit 1",
		interval: "30s",
		timeout: "10s",
		retries: 5,
		startPeriod: "30s",
	},
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://docs.langflow.org/",
	tags: ["llm", "workflow-builder", "langchain", "agents", "rag", "visual-builder"],
	maturity: "stable",

	requires: [],
	recommends: ["qdrant", "postgresql", "ollama", "open-webui"],
	conflictsWith: [],

	minMemoryMB: 512,
	gpuRequired: false,
};
