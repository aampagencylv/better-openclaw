import type { ServiceDefinition } from "../../types.js";

export const sentryDefinition: ServiceDefinition = {
	id: "sentry",
	name: "Sentry",
	description:
		"Application performance monitoring and error tracking platform with real-time alerting, release tracking, and stack trace analysis.",
	category: "monitoring",
	icon: "🐛",

	image: "getsentry/self-hosted",
	imageTag: "24.12.0",
	ports: [
		{
			host: 9500,
			container: 9000,
			description: "Sentry web UI",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "sentry-data",
			containerPath: "/data",
			description: "Persistent Sentry data",
		},
	],
	environment: [
		{
			key: "SENTRY_SECRET_KEY",
			defaultValue: "",
			secret: true,
			description: "Sentry secret key for encryption",
			required: true,
		},
		{
			key: "SENTRY_POSTGRES_HOST",
			defaultValue: "postgresql",
			secret: false,
			description: "PostgreSQL host",
			required: true,
		},
		{
			key: "SENTRY_DB_USER",
			defaultValue: "sentry",
			secret: false,
			description: "Database user",
			required: true,
		},
		{
			key: "SENTRY_DB_PASSWORD",
			defaultValue: "${SENTRY_DB_PASSWORD}",
			secret: true,
			description: "Database password",
			required: true,
		},
		{
			key: "SENTRY_REDIS_HOST",
			defaultValue: "redis",
			secret: false,
			description: "Redis host",
			required: true,
		},
	],
	healthcheck: {
		test: "curl -sf http://localhost:9000/_health/ || exit 1",
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
			key: "SENTRY_HOST",
			defaultValue: "sentry",
			secret: false,
			description: "Sentry hostname",
			required: false,
		},
		{
			key: "SENTRY_PORT",
			defaultValue: "9000",
			secret: false,
			description: "Sentry port",
			required: false,
		},
	],

	docsUrl: "https://develop.sentry.dev/self-hosted/",
	tags: ["error-tracking", "apm", "monitoring", "alerting", "debugging"],
	maturity: "stable",

	requires: ["postgresql", "redis"],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 2048,
	gpuRequired: false,
};
