import type { ServiceDefinition } from "../../types.js";

export const elementWebDefinition: ServiceDefinition = {
	id: "element-web",
	name: "Element Web",
	description:
		"Feature-rich Matrix client for secure, decentralized messaging with end-to-end encryption, rooms, and spaces.",
	category: "communication",
	icon: "🟢",

	image: "vectorim/element-web",
	imageTag: "v1.11.86",
	ports: [
		{
			host: 8480,
			container: 80,
			description: "Element Web UI",
			exposed: true,
		},
	],
	volumes: [],
	environment: [],
	healthcheck: {
		test: "curl -sf http://localhost:80 || exit 1",
		interval: "30s",
		timeout: "10s",
		retries: 3,
		startPeriod: "10s",
	},
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [
		{
			key: "ELEMENT_HOST",
			defaultValue: "element-web",
			description: "Element Web service hostname",
			secret: false,
			required: false,
		},
		{
			key: "ELEMENT_PORT",
			defaultValue: "80",
			description: "Element Web service port",
			secret: false,
			required: false,
		},
	],

	docsUrl: "https://element.io/docs",
	tags: ["matrix", "chat", "encrypted", "decentralized", "discord-alternative"],
	maturity: "stable",

	requires: [],
	recommends: ["matrix-synapse"],
	conflictsWith: [],

	minMemoryMB: 128,
	gpuRequired: false,
};
