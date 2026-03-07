import type { ServiceDefinition } from "../../types.js";

export const flagsmithDefinition: ServiceDefinition = {
	id: "flagsmith",
	name: "Flagsmith",
	description:
		"Open-source feature flag and remote configuration platform for product rollouts, segmentation, A/B testing, and environment-aware releases.",
	category: "dev-tools",
	icon: "🚩",

	image: "flagsmith/flagsmith",
	imageTag: "2.14.3",
	ports: [
		{
			host: 8022,
			container: 8000,
			description: "Flagsmith API and dashboard",
			exposed: true,
		},
	],
	volumes: [],
	environment: [
		{
			key: "DATABASE_URL",
			defaultValue: "postgresql://flagsmith:${FLAGSMITH_DB_PASSWORD}@postgresql:5432/flagsmith",
			secret: true,
			description: "PostgreSQL connection URL",
			required: true,
		},
		{
			key: "DJANGO_SECRET_KEY",
			defaultValue: "${FLAGSMITH_SECRET_KEY}",
			secret: true,
			description: "Django secret key",
			required: true,
		},
		{
			key: "DJANGO_ALLOWED_HOSTS",
			defaultValue: "*",
			secret: false,
			description: "Allowed hosts for the Flagsmith dashboard",
			required: true,
		},
		{
			key: "REDIS_URL",
			defaultValue: "redis://:${REDIS_PASSWORD}@redis:6379",
			secret: true,
			description: "Redis URL for caching and task backends",
			required: true,
		},
	],
	healthcheck: {
		test: "curl -sf http://localhost:8000/api/v1/health/ || exit 1",
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

	docsUrl: "https://docs.flagsmith.com/deployment-self-hosting/hosting-guides/docker",
	tags: ["feature-flags", "remote-config", "release-management", "experiments"],
	maturity: "stable",

	requires: ["postgresql", "redis"],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 512,
	gpuRequired: false,
};
