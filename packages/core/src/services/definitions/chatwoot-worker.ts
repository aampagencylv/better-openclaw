import type { ServiceDefinition } from "../../types.js";

const chatwootSharedEnv = [
	{
		key: "RAILS_ENV",
		defaultValue: "production",
		secret: false,
		description: "Rails runtime environment",
		required: true,
	},
	{
		key: "NODE_ENV",
		defaultValue: "production",
		secret: false,
		description: "Node runtime environment",
		required: true,
	},
	{
		key: "INSTALLATION_ENV",
		defaultValue: "docker",
		secret: false,
		description: "Deployment mode indicator",
		required: true,
	},
	{
		key: "SECRET_KEY_BASE",
		defaultValue: "${CHATWOOT_SECRET_KEY_BASE}",
		secret: true,
		description: "Rails secret key base",
		required: true,
	},
	{
		key: "FRONTEND_URL",
		defaultValue: "http://localhost:3011",
		secret: false,
		description: "Public Chatwoot URL",
		required: true,
	},
	{
		key: "DATABASE_URL",
		defaultValue: "postgresql://chatwoot:${CHATWOOT_DB_PASSWORD}@postgresql:5432/chatwoot",
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
] as const;

export const chatwootWorkerDefinition: ServiceDefinition = {
	id: "chatwoot-worker",
	name: "Chatwoot (Worker)",
	description:
		"Background worker for Chatwoot. Processes jobs such as webhooks, emails, inbox automation, and asynchronous conversation tasks.",
	category: "communication",
	icon: "⚙️",

	image: "chatwoot/chatwoot",
	imageTag: "latest",
	ports: [],
	volumes: [],
	environment: [...chatwootSharedEnv],
	command: "bundle exec sidekiq -C config/sidekiq.yml",
	healthcheck: {
		test: "ps aux | grep sidekiq | grep -v grep || exit 1",
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

	docsUrl: "https://developers.chatwoot.com/self-hosted/deployment/docker",
	tags: ["support", "chat", "crm", "inbox", "customer-success", "worker"],
	maturity: "stable",

	requires: ["postgresql", "redis"],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 512,
	gpuRequired: false,
};
