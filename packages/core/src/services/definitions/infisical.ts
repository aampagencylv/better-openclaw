import type { ServiceDefinition } from "../../types.js";

export const infisicalDefinition: ServiceDefinition = {
	id: "infisical",
	name: "Infisical",
	description:
		"Open-source secrets management platform for securely storing, syncing, and rotating environment variables across teams and environments.",
	category: "security",
	icon: "🔐",

	image: "infisical/infisical",
	imageTag: "latest",
	ports: [
		{
			host: 8111,
			container: 8080,
			description: "Infisical web UI and API",
			exposed: true,
		},
	],
	volumes: [],
	environment: [
		{
			key: "NODE_ENV",
			defaultValue: "production",
			secret: false,
			description: "Runtime environment",
			required: true,
		},
		{
			key: "PORT",
			defaultValue: "8080",
			secret: false,
			description: "Infisical application port",
			required: true,
		},
		{
			key: "SITE_URL",
			defaultValue: "http://localhost:8111",
			secret: false,
			description: "Public URL for the Infisical instance",
			required: true,
		},
		{
			key: "ENCRYPTION_KEY",
			defaultValue: "${INFISICAL_ENCRYPTION_KEY}",
			secret: true,
			description: "Encryption key for stored secrets",
			required: true,
		},
		{
			key: "AUTH_SECRET",
			defaultValue: "${INFISICAL_AUTH_SECRET}",
			secret: true,
			description: "Application auth/session secret",
			required: true,
		},
		{
			key: "DB_CONNECTION_URI",
			defaultValue: "postgresql://infisical:${INFISICAL_DB_PASSWORD}@postgresql:5432/infisical",
			secret: true,
			description: "PostgreSQL connection URI",
			required: true,
		},
		{
			key: "REDIS_URL",
			defaultValue: "redis://:${REDIS_PASSWORD}@redis:6379",
			secret: true,
			description: "Redis connection URI",
			required: true,
		},
	],
	healthcheck: {
		test: "curl -sf http://localhost:8080/api/status || exit 1",
		interval: "30s",
		timeout: "10s",
		retries: 5,
		startPeriod: "45s",
	},
	dependsOn: ["postgresql", "redis"],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://infisical.com/docs/self-hosting/overview/introduction",
	tags: ["secrets", "vault", "config", "security", "environment-management"],
	maturity: "stable",

	requires: ["postgresql", "redis"],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 512,
	gpuRequired: false,
};
