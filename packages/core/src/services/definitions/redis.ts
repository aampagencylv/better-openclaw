import type { ServiceDefinition } from "../../types.js";

export const redisDefinition: ServiceDefinition = {
	id: "redis",
	name: "Redis",
	description:
		"In-memory data store used for caching, session management, pub/sub messaging, and as a high-performance key-value database.",
	category: "database",
	icon: "🔴",

	image: "redis",
	imageTag: "7-alpine",
	ports: [
		{
			host: 6379,
			container: 6379,
			description: "Redis server port",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "redis-data",
			containerPath: "/data",
			description: "Persistent Redis data",
		},
	],
	environment: [
		{
			key: "REDIS_PASSWORD",
			defaultValue: "changeme",
			secret: true,
			description: "Password for Redis authentication",
			required: true,
		},
	],
	healthcheck: {
		test: "redis-cli ping",
		interval: "10s",
		timeout: "5s",
		retries: 3,
	},
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [{ skillId: "redis-cache", autoInstall: true }],
	openclawEnvVars: [
		{
			key: "REDIS_HOST",
			defaultValue: "redis",
			secret: false,
			description: "Redis hostname for OpenClaw",
			required: true,
		},
		{
			key: "REDIS_PORT",
			defaultValue: "6379",
			secret: false,
			description: "Redis port for OpenClaw",
			required: true,
		},
		{
			key: "REDIS_PASSWORD",
			defaultValue: "${REDIS_PASSWORD}",
			secret: true,
			description: "Redis password for OpenClaw (references service password)",
			required: true,
		},
	],

	docsUrl: "https://redis.io/docs",
	tags: ["cache", "pubsub", "message-bus", "session-store"],
	maturity: "stable",

	requires: [],
	recommends: [],
	conflictsWith: ["valkey"],

	minMemoryMB: 128,
	gpuRequired: false,
};
