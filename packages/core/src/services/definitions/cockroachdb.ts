import type { ServiceDefinition } from "../../types.js";

export const cockroachdbDefinition: ServiceDefinition = {
	id: "cockroachdb",
	name: "CockroachDB",
	description:
		"Distributed SQL database with horizontal scaling, strong consistency, and PostgreSQL wire protocol compatibility.",
	category: "database",
	icon: "🪳",

	image: "cockroachdb/cockroach",
	imageTag: "latest-v24.3",
	command: "start-single-node --insecure",
	ports: [
		{
			host: 26257,
			container: 26257,
			description: "CockroachDB SQL port",
			exposed: true,
		},
		{
			host: 8090,
			container: 8080,
			description: "CockroachDB admin UI",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "cockroachdb-data",
			containerPath: "/cockroach/cockroach-data",
			description: "Persistent CockroachDB data",
		},
	],
	environment: [],
	healthcheck: {
		test: "curl -sf http://localhost:8080/health || exit 1",
		interval: "30s",
		timeout: "10s",
		retries: 3,
		startPeriod: "60s",
	},
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [
		{
			key: "COCKROACHDB_HOST",
			defaultValue: "cockroachdb",
			secret: false,
			description: "CockroachDB hostname",
			required: false,
		},
		{
			key: "COCKROACHDB_PORT",
			defaultValue: "26257",
			secret: false,
			description: "CockroachDB port",
			required: false,
		},
	],

	docsUrl: "https://www.cockroachlabs.com/docs/",
	tags: ["distributed-sql", "postgresql-compatible", "horizontal-scaling", "acid"],
	maturity: "stable",

	requires: [],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 1024,
	gpuRequired: false,
};
