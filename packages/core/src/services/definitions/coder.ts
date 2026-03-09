import type { ServiceDefinition } from "../../types.js";

export const coderDefinition: ServiceDefinition = {
	id: "coder",
	name: "Coder",
	description:
		"Cloud development environment platform providing consistent, reproducible workspaces with IDE support and infrastructure templates.",
	category: "dev-tools",
	icon: "💻",

	image: "ghcr.io/coder/coder",
	imageTag: "latest",
	ports: [
		{
			host: 7080,
			container: 7080,
			description: "Coder web UI",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "coder-data",
			containerPath: "/home/coder/.config/coderv2",
			description: "Coder server data",
		},
	],
	environment: [
		{
			key: "CODER_ACCESS_URL",
			defaultValue: "http://localhost:7080",
			secret: false,
			description: "External access URL",
			required: true,
		},
		{
			key: "CODER_PG_CONNECTION_URL",
			defaultValue: "postgresql://coder:${CODER_DB_PASSWORD}@postgresql:5432/coder?sslmode=disable",
			secret: false,
			description: "PostgreSQL connection string",
			required: true,
		},
	],
	healthcheck: {
		test: "curl -sf http://localhost:7080/api/v2/buildinfo || exit 1",
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

	docsUrl: "https://coder.com/docs",
	tags: ["cloud-ide", "workspaces", "remote-development", "devcontainers"],
	maturity: "stable",

	requires: ["postgresql"],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 512,
	gpuRequired: false,
};
