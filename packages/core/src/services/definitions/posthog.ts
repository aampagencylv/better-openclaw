import type { ServiceDefinition } from "../../types.js";

export const posthogDefinition: ServiceDefinition = {
	id: "posthog",
	name: "PostHog",
	description:
		"All-in-one product analytics platform with event tracking, session recording, feature flags, A/B testing, and user surveys.",
	category: "analytics",
	icon: "🦔",

	image: "posthog/posthog",
	imageTag: "latest",
	ports: [
		{
			host: 8290,
			container: 8000,
			description: "PostHog web UI",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "posthog-data",
			containerPath: "/var/lib/posthog/data",
			description: "PostHog persistent data",
		},
	],
	environment: [
		{
			key: "SECRET_KEY",
			defaultValue: "",
			secret: true,
			description: "PostHog secret key for encryption",
			required: true,
		},
		{
			key: "DATABASE_URL",
			defaultValue: "postgres://posthog:${POSTHOG_DB_PASSWORD}@postgresql:5432/posthog",
			secret: false,
			description: "PostgreSQL connection string",
			required: true,
		},
		{
			key: "REDIS_URL",
			defaultValue: "redis://redis:6379/",
			secret: false,
			description: "Redis connection URL",
			required: true,
		},
		{
			key: "SITE_URL",
			defaultValue: "http://localhost:8290",
			secret: false,
			description: "Public site URL",
			required: true,
		},
	],
	healthcheck: {
		test: "curl -sf http://localhost:8000/_health || exit 1",
		interval: "30s",
		timeout: "10s",
		retries: 5,
		startPeriod: "120s",
	},
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [
		{
			key: "POSTHOG_HOST",
			defaultValue: "posthog",
			secret: false,
			description: "PostHog hostname",
			required: false,
		},
		{
			key: "POSTHOG_PORT",
			defaultValue: "8000",
			secret: false,
			description: "PostHog port",
			required: false,
		},
	],

	docsUrl: "https://posthog.com/docs/self-host",
	tags: ["product-analytics", "event-tracking", "feature-flags", "session-recording", "ab-testing"],
	maturity: "stable",

	requires: ["postgresql", "redis"],
	recommends: ["clickhouse"],
	conflictsWith: [],

	minMemoryMB: 1024,
	gpuRequired: false,
};
