import type { ServiceDefinition } from "../../types.js";

export const revoltDefinition: ServiceDefinition = {
	id: "revolt",
	name: "Revolt",
	description:
		"Open-source Discord alternative with voice channels, bots, custom emojis, and modern UI for community building.",
	category: "communication",
	icon: "🔴",

	image: "revoltchat/server",
	imageTag: "latest",
	ports: [
		{
			host: 14000,
			container: 14000,
			description: "Revolt API",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "revolt-data",
			containerPath: "/data",
			description: "Revolt persistent data storage",
		},
	],
	environment: [
		{
			key: "REVOLT_MONGO_URI",
			defaultValue: "mongodb://mongodb:27017/revolt",
			secret: false,
			description: "MongoDB connection string for Revolt",
			required: true,
		},
		{
			key: "REVOLT_REDIS_URI",
			defaultValue: "redis://redis:6379",
			secret: false,
			description: "Redis connection string for Revolt",
			required: true,
		},
	],
	healthcheck: {
		test: "curl -sf http://localhost:14000/ || exit 1",
		interval: "30s",
		timeout: "10s",
		retries: 3,
		startPeriod: "30s",
	},
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://developers.revolt.chat/",
	tags: ["discord-alternative", "communities", "voice", "bots"],
	maturity: "beta",

	requires: ["redis"],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 512,
	gpuRequired: false,
};
