import type { ServiceDefinition } from "../../types.js";

export const lagoDefinition: ServiceDefinition = {
	id: "lago",
	name: "Lago",
	description:
		"Open-source usage-based billing engine for metered pricing, subscriptions, invoicing, and payment processing with Stripe integration.",
	category: "billing",
	icon: "💳",

	image: "getlago/api",
	imageTag: "latest",
	ports: [
		{
			host: 3036,
			container: 3000,
			description: "Lago API",
			exposed: true,
		},
		{
			host: 8081,
			container: 80,
			description: "Lago web UI (frontend)",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "lago-storage",
			containerPath: "/app/storage",
			description: "Lago uploaded files and invoices",
		},
	],
	environment: [
		{
			key: "DATABASE_URL",
			defaultValue: "postgresql://lago:${LAGO_DB_PASSWORD}@postgresql:5432/lago",
			secret: true,
			description: "PostgreSQL connection URL",
			required: true,
		},
		{
			key: "REDIS_URL",
			defaultValue: "redis://:${REDIS_PASSWORD}@redis:6379",
			secret: true,
			description: "Redis connection URL",
			required: true,
		},
		{
			key: "SECRET_KEY_BASE",
			defaultValue: "${LAGO_SECRET_KEY}",
			secret: true,
			description: "Rails secret key base",
			required: true,
		},
		{
			key: "LAGO_API_URL",
			defaultValue: "http://localhost:3036",
			secret: false,
			description: "Public API URL",
			required: true,
		},
		{
			key: "LAGO_FRONT_URL",
			defaultValue: "http://localhost:8081",
			secret: false,
			description: "Public frontend URL",
			required: true,
		},
	],
	healthcheck: {
		test: "curl -sf http://localhost:3000/health || exit 1",
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

	docsUrl: "https://docs.getlago.com/guide/introduction/welcome-to-lago",
	tags: ["billing", "payments", "metering", "subscriptions", "invoicing", "stripe"],
	maturity: "stable",

	requires: ["postgresql", "redis"],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 512,
	gpuRequired: false,
};
