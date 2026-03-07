import type { ServiceDefinition } from "../../types.js";

export const strapiDefinition: ServiceDefinition = {
	id: "strapi",
	name: "Strapi",
	description:
		"Headless CMS for content-rich products and editorial workflows, with customizable APIs and admin experiences.",
	category: "knowledge",
	icon: "📰",

	image: "naskio/strapi",
	imageTag: "latest",
	ports: [
		{
			host: 1337,
			container: 1337,
			description: "Strapi admin UI and API",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "strapi-data",
			containerPath: "/srv/app",
			description: "Strapi application data, sqlite DB, uploads, and generated assets",
		},
	],
	environment: [
		{
			key: "NODE_ENV",
			defaultValue: "production",
			secret: false,
			description: "Runtime environment",
			required: true,
		},
		{
			key: "HOST",
			defaultValue: "0.0.0.0",
			secret: false,
			description: "Strapi host binding",
			required: true,
		},
		{
			key: "PORT",
			defaultValue: "1337",
			secret: false,
			description: "Strapi port",
			required: true,
		},
		{
			key: "DATABASE_CLIENT",
			defaultValue: "sqlite",
			secret: false,
			description: "Database client",
			required: true,
		},
		{
			key: "DATABASE_FILENAME",
			defaultValue: "/srv/app/data/data.db",
			secret: false,
			description: "Path to the Strapi sqlite database file",
			required: true,
		},
		{
			key: "APP_KEYS",
			defaultValue: "${STRAPI_APP_KEYS}",
			secret: true,
			description: "Comma-separated Strapi app keys",
			required: true,
		},
		{
			key: "API_TOKEN_SALT",
			defaultValue: "${STRAPI_API_TOKEN_SALT}",
			secret: true,
			description: "Salt for API tokens",
			required: true,
		},
		{
			key: "ADMIN_JWT_SECRET",
			defaultValue: "${STRAPI_ADMIN_JWT_SECRET}",
			secret: true,
			description: "Admin JWT secret",
			required: true,
		},
		{
			key: "TRANSFER_TOKEN_SALT",
			defaultValue: "${STRAPI_TRANSFER_TOKEN_SALT}",
			secret: true,
			description: "Salt for transfer tokens",
			required: true,
		},
		{
			key: "JWT_SECRET",
			defaultValue: "${STRAPI_JWT_SECRET}",
			secret: true,
			description: "JWT secret used by Strapi auth flows",
			required: true,
		},
	],
	healthcheck: {
		test: "curl -sf http://localhost:1337/admin || exit 1",
		interval: "30s",
		timeout: "10s",
		retries: 5,
		startPeriod: "40s",
	},
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://docs.strapi.io/",
	tags: ["cms", "headless", "content", "api", "editorial"],
	maturity: "beta",

	requires: [],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 512,
	gpuRequired: false,
};
