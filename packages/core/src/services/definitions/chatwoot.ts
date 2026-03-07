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

export const chatwootDefinition: ServiceDefinition = {
	id: "chatwoot",
	name: "Chatwoot",
	description:
		"Customer support inbox and live chat platform for managing conversations, support workflows, agents, and product feedback across channels.",
	category: "communication",
	icon: "💬",

	image: "chatwoot/chatwoot",
	imageTag: "latest",
	ports: [
		{
			host: 3011,
			container: 3000,
			description: "Chatwoot web UI",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "chatwoot-storage",
			containerPath: "/app/storage",
			description: "Chatwoot uploaded assets and attachments",
		},
	],
	environment: [...chatwootSharedEnv],
	command: "bundle exec rails s -p 3000 -b 0.0.0.0",
	healthcheck: {
		test: "curl -sf http://localhost:3000/ || exit 1",
		interval: "30s",
		timeout: "10s",
		retries: 5,
		startPeriod: "45s",
	},
	dependsOn: ["postgresql", "redis", "chatwoot-worker"],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://developers.chatwoot.com/self-hosted/deployment/docker",
	tags: ["support", "chat", "crm", "inbox", "customer-success", "live-chat"],
	maturity: "stable",

	requires: ["postgresql", "redis", "chatwoot-worker"],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 512,
	gpuRequired: false,
};
