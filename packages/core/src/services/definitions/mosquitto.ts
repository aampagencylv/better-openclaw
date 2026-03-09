import type { ServiceDefinition } from "../../types.js";

export const mosquittoDefinition: ServiceDefinition = {
	id: "mosquitto",
	name: "Eclipse Mosquitto",
	description:
		"Lightweight open-source MQTT message broker for IoT device communication with support for MQTT v5, v3.1.1, and WebSockets.",
	category: "iot",
	icon: "🦟",

	image: "eclipse-mosquitto",
	imageTag: "2",
	ports: [
		{
			host: 1883,
			container: 1883,
			description: "MQTT protocol",
			exposed: true,
		},
		{
			host: 9001,
			container: 9001,
			description: "MQTT over WebSockets",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "mosquitto-data",
			containerPath: "/mosquitto/data",
			description: "Mosquitto persistent data",
		},
		{
			name: "mosquitto-log",
			containerPath: "/mosquitto/log",
			description: "Mosquitto logs",
		},
		{
			name: "mosquitto-config",
			containerPath: "/mosquitto/config",
			description: "Mosquitto configuration",
		},
	],
	environment: [],
	healthcheck: {
		test: "mosquitto_sub -t '$$SYS/#' -C 1 -i healthcheck -W 3 || exit 1",
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
			key: "MOSQUITTO_HOST",
			defaultValue: "mosquitto",
			secret: false,
			description: "Mosquitto hostname",
			required: false,
		},
		{
			key: "MOSQUITTO_PORT",
			defaultValue: "1883",
			secret: false,
			description: "Mosquitto MQTT port",
			required: false,
		},
	],

	docsUrl: "https://mosquitto.org/documentation/",
	tags: ["mqtt", "iot", "messaging", "broker", "pubsub"],
	maturity: "stable",

	requires: [],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 32,
	gpuRequired: false,
};
