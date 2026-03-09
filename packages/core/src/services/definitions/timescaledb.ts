import type { ServiceDefinition } from "../../types.js";

export const timescaledbDefinition: ServiceDefinition = {
	id: "timescaledb",
	name: "TimescaleDB",
	description:
		"PostgreSQL extension for time-series data with automatic partitioning, continuous aggregates, and compression.",
	category: "database",
	icon: "⏱️",

	image: "timescale/timescaledb",
	imageTag: "latest-pg17",
	ports: [
		{
			host: 5433,
			container: 5432,
			description: "TimescaleDB server port",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "timescaledb-data",
			containerPath: "/var/lib/postgresql/data",
			description: "Persistent TimescaleDB data",
		},
	],
	environment: [
		{
			key: "POSTGRES_USER",
			defaultValue: "openclaw",
			secret: false,
			description: "Database superuser",
			required: true,
		},
		{
			key: "POSTGRES_PASSWORD",
			defaultValue: "",
			secret: true,
			description: "Database password",
			required: true,
		},
		{
			key: "POSTGRES_DB",
			defaultValue: "openclaw_ts",
			secret: false,
			description: "Default database",
			required: true,
		},
	],
	healthcheck: {
		test: "pg_isready -U openclaw",
		interval: "10s",
		timeout: "5s",
		retries: 3,
		startPeriod: "30s",
	},
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [
		{
			key: "TIMESCALEDB_HOST",
			defaultValue: "timescaledb",
			secret: false,
			description: "TimescaleDB hostname",
			required: false,
		},
		{
			key: "TIMESCALEDB_PORT",
			defaultValue: "5432",
			secret: false,
			description: "TimescaleDB port",
			required: false,
		},
	],

	docsUrl: "https://docs.timescale.com/",
	tags: ["time-series", "postgresql", "hypertables", "compression", "analytics"],
	maturity: "stable",

	requires: [],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 512,
	gpuRequired: false,
};
