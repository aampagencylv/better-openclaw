import type { ServiceDefinition } from "../../types.js";

export const excalidrawDefinition: ServiceDefinition = {
	id: "excalidraw",
	name: "Excalidraw",
	description:
		"Collaborative virtual whiteboard for hand-drawn-style diagrams, architecture sketches, brainstorming, and visual collaboration.",
	category: "collaboration",
	icon: "🎨",

	image: "excalidraw/excalidraw",
	imageTag: "latest",
	ports: [
		{
			host: 3043,
			container: 80,
			description: "Excalidraw web UI",
			exposed: true,
		},
	],
	volumes: [],
	environment: [],
	healthcheck: {
		test: "curl -sf http://localhost:80/ || exit 1",
		interval: "30s",
		timeout: "10s",
		retries: 3,
	},
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://docs.excalidraw.com",
	tags: ["whiteboard", "diagrams", "collaboration", "sketching", "drawing"],
	maturity: "stable",

	requires: [],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 128,
	gpuRequired: false,
};
