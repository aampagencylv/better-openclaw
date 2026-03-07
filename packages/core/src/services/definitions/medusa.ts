import type { ServiceDefinition } from "../../types.js";

export const medusaDefinition: ServiceDefinition = {
	id: "medusa",
	name: "Medusa",
	description:
		"Modular headless commerce engine for building custom storefronts, managing products, orders, and payments with PostgreSQL and Redis.",
	category: "ecommerce",
	icon: "🛒",

	image: "medusajs/medusa",
	imageTag: "latest",
	ports: [
		{
			host: 9002,
			container: 9002,
			description: "Medusa backend API",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "medusa-uploads",
			containerPath: "/app/uploads",
			description: "Medusa product images and uploads",
		},
	],
	environment: [
		{
			key: "DATABASE_URL",
			defaultValue: "postgresql://medusa:${MEDUSA_DB_PASSWORD}@postgresql:5432/medusa",
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
			key: "JWT_SECRET",
			defaultValue: "${MEDUSA_JWT_SECRET}",
			secret: true,
			description: "JWT signing secret",
			required: true,
		},
		{
			key: "COOKIE_SECRET",
			defaultValue: "${MEDUSA_COOKIE_SECRET}",
			secret: true,
			description: "Cookie signing secret",
			required: true,
		},
	],
	healthcheck: {
		test: "curl -sf http://localhost:9000/health || exit 1",
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

	docsUrl: "https://docs.medusajs.com/learn",
	tags: ["ecommerce", "store", "products", "orders", "payments", "headless"],
	maturity: "stable",

	requires: ["postgresql", "redis"],
	recommends: ["minio"],
	conflictsWith: [],

	minMemoryMB: 512,
	gpuRequired: false,
};
