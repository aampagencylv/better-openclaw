import type { ServiceDefinition } from "../../types.js";

export const clickhouseDefinition: ServiceDefinition = {
	id: "clickhouse",
	name: "ClickHouse",
	description:
		"High-performance columnar database for online analytical processing (OLAP). Optimized for real-time analytics on large datasets with SQL support.",
	category: "database",
	icon: "🏠",

	image: "clickhouse/clickhouse-server",
	imageTag: "24.12",
	ports: [
		{
			host: 8123,
			container: 8123,
			description: "ClickHouse HTTP API",
			exposed: true,
		},
		{
			host: 9000,
			container: 9000,
			description: "ClickHouse Native TCP protocol",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "clickhouse-data",
			containerPath: "/var/lib/clickhouse",
			description: "Persistent ClickHouse data storage",
		},
		{
			name: "clickhouse-logs",
			containerPath: "/var/log/clickhouse-server",
			description: "ClickHouse server logs",
		},
	],
	environment: [
		{
			key: "CLICKHOUSE_DB",
			defaultValue: "default",
			secret: false,
			description: "Default database name",
			required: true,
		},
		{
			key: "CLICKHOUSE_USER",
			defaultValue: "openclaw",
			secret: false,
			description: "ClickHouse admin user",
			required: true,
		},
		{
			key: "CLICKHOUSE_PASSWORD",
			defaultValue: "${CLICKHOUSE_PASSWORD}",
			secret: true,
			description: "ClickHouse admin password",
			required: true,
		},
		{
			key: "CLICKHOUSE_DEFAULT_ACCESS_MANAGEMENT",
			defaultValue: "1",
			secret: false,
			description: "Enable SQL-driven access management and account creation",
			required: true,
		},
	],
	healthcheck: {
		test: "wget -qO- http://localhost:8123/ping || exit 1",
		interval: "30s",
		timeout: "10s",
		retries: 3,
		startPeriod: "30s",
	},
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [
		{
			key: "CLICKHOUSE_HOST",
			defaultValue: "clickhouse",
			secret: false,
			description: "ClickHouse hostname",
			required: false,
		},
		{
			key: "CLICKHOUSE_HTTP_PORT",
			defaultValue: "8123",
			secret: false,
			description: "ClickHouse HTTP API port",
			required: false,
		},
		{
			key: "CLICKHOUSE_TCP_PORT",
			defaultValue: "9000",
			secret: false,
			description: "ClickHouse Native TCP port",
			required: false,
		},
	],

	docsUrl: "https://clickhouse.com/docs",
	tags: ["columnar", "analytics", "olap", "time-series", "sql"],
	maturity: "stable",

	requires: [],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 1024,
	gpuRequired: false,
};
