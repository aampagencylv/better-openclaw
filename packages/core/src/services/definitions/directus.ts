import type { ServiceDefinition } from "../../types.js";

export const directusDefinition: ServiceDefinition = {
	id: "directus",
	name: "Directus",
	description:
		"Headless CMS and data platform for turning SQL or sqlite-backed content into APIs, admin workflows, and structured editorial systems.",
	category: "knowledge",
	icon: "🗂️",

	image: "directus/directus",
	imageTag: "latest",
	ports: [
		{
			host: 8055,
			container: 8055,
			description: "Directus admin UI and API",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "directus-database",
			containerPath: "/directus/database",
			description: "Directus sqlite database storage",
		},
		{
			name: "directus-uploads",
			containerPath: "/directus/uploads",
			description: "Directus uploaded assets",
		},
	],
	environment: [
		{
			key: "KEY",
			defaultValue: "${DIRECTUS_KEY}",
			secret: true,
			description: "Directus application key",
			required: true,
		},
		{
			key: "SECRET",
			defaultValue: "${DIRECTUS_SECRET}",
			secret: true,
			description: "Directus application secret",
			required: true,
		},
		{
			key: "ADMIN_EMAIL",
			defaultValue: "admin@example.com",
			secret: false,
			description: "Initial Directus admin email",
			required: true,
		},
		{
			key: "ADMIN_PASSWORD",
			defaultValue: "${DIRECTUS_ADMIN_PASSWORD}",
			secret: true,
			description: "Initial Directus admin password",
			required: true,
		},
		{
			key: "PUBLIC_URL",
			defaultValue: "http://localhost:8055",
			secret: false,
			description: "Public URL for the Directus instance",
			required: true,
		},
		{
			key: "DB_CLIENT",
			defaultValue: "sqlite3",
			secret: false,
			description: "Database client",
			required: true,
		},
		{
			key: "DB_FILENAME",
			defaultValue: "/directus/database/data.db",
			secret: false,
			description: "Path to the Directus sqlite database file",
			required: true,
		},
		{
			key: "WEBSOCKETS_ENABLED",
			defaultValue: "true",
			secret: false,
			description: "Enable realtime websocket features",
			required: true,
		},
	],
	healthcheck: {
		test: "curl -sf http://localhost:8055/server/health || exit 1",
		interval: "30s",
		timeout: "10s",
		retries: 5,
		startPeriod: "30s",
	},
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://directus.io/docs/",
	tags: ["cms", "headless", "content", "api", "editorial", "database-ui"],
	maturity: "stable",

	requires: [],
	recommends: ["minio"],
	conflictsWith: [],

	minMemoryMB: 256,
	gpuRequired: false,
};
