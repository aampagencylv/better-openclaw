import type { ServiceDefinition } from "../../types.js";

export const openhandsDefinition: ServiceDefinition = {
	id: "openhands",
	name: "OpenHands",
	description:
		"Autonomous AI coding agent with a web UI that can write, test, and debug code in sandboxed containers.",
	category: "coding-agent",
	icon: "🤲",

	image: "ghcr.io/all-hands-ai/openhands",
	imageTag: "latest",
	ports: [
		{
			host: 3034,
			container: 3000,
			description: "OpenHands web UI",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "openhands-workspace",
			containerPath: "/opt/workspace_base",
			description: "OpenHands workspace for code projects",
		},
	],
	environment: [
		{
			key: "SANDBOX_RUNTIME_CONTAINER_IMAGE",
			defaultValue: "ghcr.io/all-hands-ai/runtime:latest",
			secret: false,
			description: "Runtime sandbox container image",
			required: true,
		},
	],
	healthcheck: {
		test: "curl -sf http://localhost:3000/ || exit 1",
		interval: "30s",
		timeout: "10s",
		retries: 3,
	},
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://docs.all-hands.dev",
	tags: ["ai", "coding", "agent", "autonomous", "development"],
	maturity: "beta",

	requires: [],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 1024,
	gpuRequired: false,
};
