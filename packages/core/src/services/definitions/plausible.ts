import type { ServiceDefinition } from "../../types.js";

export const plausibleDefinition: ServiceDefinition = {
	id: "plausible",
	name: "Plausible Analytics",
	description:
		"Lightweight, privacy-friendly web analytics alternative to Google Analytics with no cookies and GDPR compliance out of the box.",
	category: "analytics",
	icon: "📉",

	image: "ghcr.io/plausible/community-edition",
	imageTag: "v2.1",
	ports: [
		{
			host: 8350,
			container: 8000,
			description: "Plausible web UI",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "plausible-data",
			containerPath: "/var/lib/plausible",
			description: "Plausible event data",
		},
	],
	environment: [
		{
			key: "BASE_URL",
			defaultValue: "http://localhost:8350",
			secret: false,
			description: "Public URL for Plausible",
			required: true,
		},
		{
			key: "SECRET_KEY_BASE",
			defaultValue: "",
			secret: true,
			description: "Secret key for encryption (min 64 chars)",
			required: true,
		},
		{
			key: "DATABASE_URL",
			defaultValue: "postgres://plausible:${PLAUSIBLE_DB_PASSWORD}@postgresql:5432/plausible",
			secret: false,
			description: "PostgreSQL connection string",
			required: true,
		},
		{
			key: "CLICKHOUSE_DATABASE_URL",
			defaultValue: "http://clickhouse:8123/plausible_events",
			secret: false,
			description: "ClickHouse connection URL",
			required: true,
		},
	],
	healthcheck: {
		test: "curl -sf http://localhost:8000/api/health || exit 1",
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
			key: "PLAUSIBLE_HOST",
			defaultValue: "plausible",
			secret: false,
			description: "Plausible hostname",
			required: false,
		},
		{
			key: "PLAUSIBLE_PORT",
			defaultValue: "8000",
			secret: false,
			description: "Plausible port",
			required: false,
		},
	],

	docsUrl: "https://plausible.io/docs/self-hosting",
	tags: ["web-analytics", "privacy", "gdpr", "cookie-free", "google-analytics-alternative"],
	maturity: "stable",

	requires: ["postgresql", "clickhouse"],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 256,
	gpuRequired: false,
};
