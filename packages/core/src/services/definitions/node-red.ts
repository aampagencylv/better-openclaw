import type { ServiceDefinition } from "../../types.js";

export const nodeRedDefinition: ServiceDefinition = {
	id: "node-red",
	name: "Node-RED",
	description:
		"Flow-based visual programming tool for wiring together IoT devices, APIs, and online services with a browser-based editor.",
	category: "iot",
	icon: "🔴",

	image: "nodered/node-red",
	imageTag: "latest",
	ports: [
		{
			host: 1880,
			container: 1880,
			description: "Node-RED editor and API",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "nodered-data",
			containerPath: "/data",
			description: "Node-RED flows and configuration",
		},
	],
	environment: [
		{
			key: "TZ",
			defaultValue: "UTC",
			secret: false,
			description: "Timezone",
			required: false,
		},
		{
			key: "NODE_RED_CREDENTIAL_SECRET",
			defaultValue: "",
			secret: true,
			description: "Encryption key for credentials",
			required: true,
		},
	],
	healthcheck: {
		test: "curl -sf http://localhost:1880/ || exit 1",
		interval: "30s",
		timeout: "10s",
		retries: 3,
		startPeriod: "15s",
	},
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [
		{
			key: "NODERED_HOST",
			defaultValue: "node-red",
			secret: false,
			description: "Node-RED hostname",
			required: false,
		},
		{
			key: "NODERED_PORT",
			defaultValue: "1880",
			secret: false,
			description: "Node-RED port",
			required: false,
		},
	],

	docsUrl: "https://nodered.org/docs/",
	tags: ["iot", "flow-based", "visual-programming", "automation", "mqtt"],
	maturity: "stable",

	requires: [],
	recommends: ["mosquitto", "homeassistant"],
	conflictsWith: [],

	minMemoryMB: 256,
	gpuRequired: false,
};
