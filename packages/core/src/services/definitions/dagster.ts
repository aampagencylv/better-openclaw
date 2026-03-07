import type { ServiceDefinition } from "../../types.js";

export const dagsterDefinition: ServiceDefinition = {
	id: "dagster",
	name: "Dagster",
	description:
		"Asset-focused data orchestration platform with observability, testing, and scheduling for modern data pipelines.",
	category: "automation",
	icon: "📊",

	image: "dagster/dagster-webserver",
	imageTag: "latest",
	ports: [
		{
			host: 3035,
			container: 3000,
			description: "Dagster web UI (Dagit)",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "dagster-storage",
			containerPath: "/opt/dagster/dagster_home",
			description: "Dagster instance storage and run logs",
		},
	],
	environment: [
		{
			key: "DAGSTER_PG_HOST",
			defaultValue: "postgresql",
			secret: false,
			description: "PostgreSQL host",
			required: true,
		},
		{
			key: "DAGSTER_PG_DB",
			defaultValue: "dagster",
			secret: false,
			description: "PostgreSQL database name",
			required: true,
		},
		{
			key: "DAGSTER_PG_USERNAME",
			defaultValue: "dagster",
			secret: false,
			description: "PostgreSQL username",
			required: true,
		},
		{
			key: "DAGSTER_PG_PASSWORD",
			defaultValue: "${DAGSTER_DB_PASSWORD}",
			secret: true,
			description: "PostgreSQL password",
			required: true,
		},
	],
	healthcheck: {
		test: "curl -sf http://localhost:3000/server_info || exit 1",
		interval: "30s",
		timeout: "10s",
		retries: 3,
		startPeriod: "30s",
	},
	dependsOn: ["postgresql"],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://docs.dagster.io/deployment/guides/docker",
	tags: ["data", "pipeline", "orchestration", "etl", "assets", "observability"],
	maturity: "stable",

	requires: ["postgresql"],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 512,
	gpuRequired: false,
};
