import type { ServiceDefinition } from "../../types.js";

export const surrealdbDefinition: ServiceDefinition = {
	id: "surrealdb",
	name: "SurrealDB",
	description:
		"Multi-model database combining document, graph, and relational capabilities with SQL-like query language and real-time subscriptions.",
	category: "database",
	icon: "🌀",

	image: "surrealdb/surrealdb",
	imageTag: "v2.2",
	command: "start --user root --pass ${SURREALDB_ROOT_PASSWORD} file:/data/database.db",
	ports: [
		{
			host: 8000,
			container: 8000,
			description: "SurrealDB HTTP API",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "surrealdb-data",
			containerPath: "/data",
			description: "Persistent SurrealDB data",
		},
	],
	environment: [
		{
			key: "SURREALDB_ROOT_PASSWORD",
			defaultValue: "",
			secret: true,
			description: "SurrealDB root password",
			required: true,
		},
	],
	healthcheck: {
		test: "curl -sf http://localhost:8000/health || exit 1",
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
			key: "SURREALDB_HOST",
			defaultValue: "surrealdb",
			secret: false,
			description: "SurrealDB hostname",
			required: false,
		},
		{
			key: "SURREALDB_PORT",
			defaultValue: "8000",
			secret: false,
			description: "SurrealDB port",
			required: false,
		},
	],

	docsUrl: "https://surrealdb.com/docs",
	tags: ["multi-model", "document", "graph", "relational", "realtime"],
	maturity: "stable",

	requires: [],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 256,
	gpuRequired: false,
};
