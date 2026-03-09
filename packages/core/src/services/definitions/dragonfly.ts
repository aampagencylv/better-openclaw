import type { ServiceDefinition } from "../../types.js";

export const dragonflyDefinition: ServiceDefinition = {
	id: "dragonfly",
	name: "Dragonfly",
	description:
		"Modern in-memory data store fully compatible with Redis and Memcached APIs, delivering up to 25x higher throughput.",
	category: "database",
	icon: "🐉",

	image: "docker.dragonflydb.io/dragonflydb/dragonfly",
	imageTag: "latest",
	ports: [
		{
			host: 6380,
			container: 6379,
			description: "Dragonfly port (Redis-compatible)",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "dragonfly-data",
			containerPath: "/data",
			description: "Persistent Dragonfly data",
		},
	],
	environment: [],
	healthcheck: {
		test: "redis-cli -p 6379 ping | grep PONG || exit 1",
		interval: "15s",
		timeout: "5s",
		retries: 3,
		startPeriod: "10s",
	},
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [
		{
			key: "DRAGONFLY_HOST",
			defaultValue: "dragonfly",
			secret: false,
			description: "Dragonfly hostname",
			required: false,
		},
		{
			key: "DRAGONFLY_PORT",
			defaultValue: "6379",
			secret: false,
			description: "Dragonfly port",
			required: false,
		},
	],

	docsUrl: "https://www.dragonflydb.io/docs",
	tags: ["redis-compatible", "in-memory", "cache", "high-performance"],
	maturity: "stable",

	requires: [],
	recommends: [],
	conflictsWith: ["redis", "valkey"],

	minMemoryMB: 256,
	gpuRequired: false,
};
