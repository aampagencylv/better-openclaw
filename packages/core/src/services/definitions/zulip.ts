import type { ServiceDefinition } from "../../types.js";

export const zulipDefinition: ServiceDefinition = {
	id: "zulip",
	name: "Zulip",
	description:
		"Threaded team chat combining the immediacy of real-time chat with email's topic-based threading for async collaboration.",
	category: "communication",
	icon: "💬",

	image: "zulip/docker-zulip",
	imageTag: "9.4-0",
	ports: [
		{
			host: 8380,
			container: 443,
			description: "Zulip HTTPS",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "zulip-data",
			containerPath: "/data",
			description: "Zulip persistent data and uploads",
		},
	],
	environment: [
		{
			key: "SETTING_EXTERNAL_HOST",
			defaultValue: "localhost",
			secret: false,
			description: "External hostname for Zulip",
			required: true,
		},
		{
			key: "SETTING_ZULIP_ADMINISTRATOR",
			defaultValue: "admin@example.com",
			secret: false,
			description: "Email address of the Zulip administrator",
			required: true,
		},
		{
			key: "SECRETS_secret_key",
			defaultValue: "${ZULIP_SECRET_KEY}",
			secret: true,
			description: "Secret key for Zulip session signing and encryption",
			required: true,
		},
		{
			key: "SECRETS_email_password",
			defaultValue: "",
			secret: true,
			description: "Email password for Zulip outbound email",
			required: false,
		},
		{
			key: "DISABLE_HTTPS",
			defaultValue: "true",
			secret: false,
			description: "Disable HTTPS when running behind a reverse proxy",
			required: false,
		},
		{
			key: "DB_HOST",
			defaultValue: "postgresql",
			secret: false,
			description: "PostgreSQL hostname for Zulip",
			required: true,
		},
		{
			key: "DB_USER",
			defaultValue: "zulip",
			secret: false,
			description: "PostgreSQL user for Zulip",
			required: true,
		},
		{
			key: "DB_NAME",
			defaultValue: "zulip",
			secret: false,
			description: "PostgreSQL database name for Zulip",
			required: true,
		},
		{
			key: "SETTING_MEMCACHED_LOCATION",
			defaultValue: "redis:11211",
			secret: false,
			description: "Memcached-compatible cache location (Redis)",
			required: true,
		},
	],
	healthcheck: {
		test: "curl -sf http://localhost:80 || exit 1",
		interval: "30s",
		timeout: "10s",
		retries: 5,
		startPeriod: "120s",
	},
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://zulip.readthedocs.io/en/latest/production/install.html",
	tags: ["team-chat", "threaded", "async", "slack-alternative"],
	maturity: "stable",

	requires: ["postgresql", "redis"],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 1024,
	gpuRequired: false,
};
