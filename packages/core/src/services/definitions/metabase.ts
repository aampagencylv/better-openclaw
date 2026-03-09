import type { ServiceDefinition } from "../../types.js";

export const metabaseDefinition: ServiceDefinition = {
	id: "metabase",
	name: "Metabase",
	description:
		"Open-source business intelligence and analytics platform. Ask questions about your data and visualize answers with interactive dashboards.",
	category: "business-intelligence",
	icon: "📊",

	image: "metabase/metabase",
	imageTag: "v0.52.5",
	ports: [
		{
			host: 3200,
			container: 3000,
			description: "Metabase web UI",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "metabase-data",
			containerPath: "/metabase-data",
			description: "Persistent Metabase application data",
		},
	],
	environment: [
		{
			key: "MB_DB_TYPE",
			defaultValue: "postgres",
			secret: false,
			description: "Database type for Metabase application database",
			required: true,
		},
		{
			key: "MB_DB_DBNAME",
			defaultValue: "metabase",
			secret: false,
			description: "Database name for Metabase",
			required: true,
		},
		{
			key: "MB_DB_PORT",
			defaultValue: "5432",
			secret: false,
			description: "Database port for Metabase",
			required: true,
		},
		{
			key: "MB_DB_USER",
			defaultValue: "metabase",
			secret: false,
			description: "Database user for Metabase",
			required: true,
		},
		{
			key: "MB_DB_PASS",
			defaultValue: "${METABASE_DB_PASSWORD}",
			secret: true,
			description: "Database password for Metabase",
			required: true,
		},
		{
			key: "MB_DB_HOST",
			defaultValue: "postgresql",
			secret: false,
			description: "Database host for Metabase",
			required: true,
		},
	],
	healthcheck: {
		test: "curl -sf http://localhost:3000/api/health || exit 1",
		interval: "30s",
		timeout: "10s",
		retries: 3,
		startPeriod: "30s",
	},
	dependsOn: ["postgresql"],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [
		{
			key: "METABASE_HOST",
			defaultValue: "metabase",
			secret: false,
			description: "Metabase hostname",
			required: false,
		},
		{
			key: "METABASE_PORT",
			defaultValue: "3000",
			secret: false,
			description: "Metabase internal port",
			required: false,
		},
	],

	docsUrl: "https://www.metabase.com/docs/latest/",
	tags: ["bi", "dashboards", "visualization", "analytics", "sql"],
	maturity: "stable",

	requires: ["postgresql"],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 1024,
	gpuRequired: false,
};
