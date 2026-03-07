import type { ServiceDefinition } from "../../types.js";

export const airbyteDefinition: ServiceDefinition = {
	id: "airbyte",
	name: "Airbyte",
	description:
		"Open-source data integration platform with 300+ connectors for syncing data between databases, APIs, SaaS tools, and warehouses.",
	category: "automation",
	icon: "🔄",

	image: "airbyte/airbyte-bootloader",
	imageTag: "latest",
	ports: [
		{
			host: 8000,
			container: 8000,
			description: "Airbyte web UI",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "airbyte-data",
			containerPath: "/data",
			description: "Airbyte workspace and connection data",
		},
	],
	environment: [
		{
			key: "DATABASE_URL",
			defaultValue: "jdbc:postgresql://postgresql:5432/airbyte",
			secret: false,
			description: "PostgreSQL connection URL",
			required: true,
		},
		{
			key: "DATABASE_USER",
			defaultValue: "airbyte",
			secret: false,
			description: "Database username",
			required: true,
		},
		{
			key: "DATABASE_PASSWORD",
			defaultValue: "${AIRBYTE_DB_PASSWORD}",
			secret: true,
			description: "Database password",
			required: true,
		},
	],
	healthcheck: {
		test: "curl -sf http://localhost:8000/api/v1/health || exit 1",
		interval: "30s",
		timeout: "10s",
		retries: 5,
		startPeriod: "60s",
	},
	dependsOn: ["postgresql"],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://docs.airbyte.com/deploying-airbyte/docker-compose",
	tags: ["data", "integration", "etl", "connectors", "sync", "pipeline"],
	maturity: "stable",

	requires: ["postgresql"],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 1024,
	gpuRequired: false,
};
