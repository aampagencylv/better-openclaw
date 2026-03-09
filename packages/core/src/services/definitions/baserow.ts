import type { ServiceDefinition } from "../../types.js";

export const baserowDefinition: ServiceDefinition = {
	id: "baserow",
	name: "Baserow",
	description:
		"Open-source no-code database platform providing spreadsheet-like interface with API access, automations, and real-time collaboration.",
	category: "knowledge",
	icon: "📊",

	image: "baserow/baserow",
	imageTag: "1.30",
	ports: [
		{
			host: 8150,
			container: 80,
			description: "Baserow web UI",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "baserow-data",
			containerPath: "/baserow/data",
			description: "Baserow persistent data",
		},
	],
	environment: [
		{
			key: "BASEROW_PUBLIC_URL",
			defaultValue: "http://localhost:8150",
			secret: false,
			description: "Public URL for Baserow",
			required: true,
		},
		{
			key: "DATABASE_HOST",
			defaultValue: "postgresql",
			secret: false,
			description: "PostgreSQL host",
			required: true,
		},
		{
			key: "DATABASE_NAME",
			defaultValue: "baserow",
			secret: false,
			description: "Database name",
			required: true,
		},
		{
			key: "DATABASE_USER",
			defaultValue: "baserow",
			secret: false,
			description: "Database user",
			required: true,
		},
		{
			key: "DATABASE_PASSWORD",
			defaultValue: "${BASEROW_DB_PASSWORD}",
			secret: true,
			description: "Database password",
			required: true,
		},
		{
			key: "REDIS_URL",
			defaultValue: "redis://redis:6379/0",
			secret: false,
			description: "Redis connection URL",
			required: true,
		},
		{
			key: "SECRET_KEY",
			defaultValue: "",
			secret: true,
			description: "Django secret key",
			required: true,
		},
	],
	healthcheck: {
		test: "curl -sf http://localhost:80/api/_health/ || exit 1",
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
			key: "BASEROW_HOST",
			defaultValue: "baserow",
			secret: false,
			description: "Baserow hostname",
			required: false,
		},
		{
			key: "BASEROW_PORT",
			defaultValue: "80",
			secret: false,
			description: "Baserow port",
			required: false,
		},
	],

	docsUrl: "https://baserow.io/docs",
	tags: ["no-code", "database", "spreadsheet", "airtable-alternative", "api"],
	maturity: "stable",

	requires: ["postgresql", "redis"],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 512,
	gpuRequired: false,
};
