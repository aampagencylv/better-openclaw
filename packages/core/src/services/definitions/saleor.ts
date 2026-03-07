import type { ServiceDefinition } from "../../types.js";

export const saleorDefinition: ServiceDefinition = {
	id: "saleor",
	name: "Saleor",
	description:
		"GraphQL-first headless e-commerce platform for multi-channel commerce with product management, checkout, and payments.",
	category: "ecommerce",
	icon: "🏪",

	image: "ghcr.io/saleor/saleor",
	imageTag: "latest",
	ports: [
		{
			host: 8003,
			container: 8000,
			description: "Saleor GraphQL API",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "saleor-media",
			containerPath: "/app/media",
			description: "Saleor product media uploads",
		},
	],
	environment: [
		{
			key: "DATABASE_URL",
			defaultValue: "postgresql://saleor:${SALEOR_DB_PASSWORD}@postgresql:5432/saleor",
			secret: true,
			description: "PostgreSQL connection URL",
			required: true,
		},
		{
			key: "CACHE_URL",
			defaultValue: "redis://:${REDIS_PASSWORD}@redis:6379/0",
			secret: true,
			description: "Redis cache URL",
			required: true,
		},
		{
			key: "SECRET_KEY",
			defaultValue: "${SALEOR_SECRET_KEY}",
			secret: true,
			description: "Django secret key",
			required: true,
		},
	],
	healthcheck: {
		test: "curl -sf http://localhost:8000/health/ || exit 1",
		interval: "30s",
		timeout: "10s",
		retries: 3,
		startPeriod: "30s",
	},
	dependsOn: ["postgresql", "redis"],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://docs.saleor.io/docs/3.x/setup/docker-compose",
	tags: ["ecommerce", "graphql", "store", "products", "checkout", "payments"],
	maturity: "stable",

	requires: ["postgresql", "redis"],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 512,
	gpuRequired: false,
};
