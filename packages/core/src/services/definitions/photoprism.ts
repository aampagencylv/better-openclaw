import type { ServiceDefinition } from "../../types.js";

export const photoprismDefinition: ServiceDefinition = {
	id: "photoprism",
	name: "PhotoPrism",
	description:
		"AI-powered photo management app with automatic tagging, face recognition, location mapping, and RAW file support.",
	category: "media",
	icon: "📷",

	image: "photoprism/photoprism",
	imageTag: "latest",
	ports: [
		{
			host: 2342,
			container: 2342,
			description: "PhotoPrism web UI",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "photoprism-storage",
			containerPath: "/photoprism/storage",
			description: "PhotoPrism metadata and cache",
		},
		{
			name: "photoprism-originals",
			containerPath: "/photoprism/originals",
			description: "Original photo files",
		},
	],
	environment: [
		{
			key: "PHOTOPRISM_ADMIN_USER",
			defaultValue: "admin",
			secret: false,
			description: "Admin username",
			required: true,
		},
		{
			key: "PHOTOPRISM_ADMIN_PASSWORD",
			defaultValue: "",
			secret: true,
			description: "Admin password",
			required: true,
		},
		{
			key: "PHOTOPRISM_SITE_URL",
			defaultValue: "http://localhost:2342/",
			secret: false,
			description: "Public site URL",
			required: true,
		},
		{
			key: "PHOTOPRISM_DATABASE_DRIVER",
			defaultValue: "mysql",
			secret: false,
			description: "Database driver",
			required: false,
		},
		{
			key: "PHOTOPRISM_DATABASE_SERVER",
			defaultValue: "mariadb:3306",
			secret: false,
			description: "Database server",
			required: false,
		},
		{
			key: "PHOTOPRISM_DATABASE_NAME",
			defaultValue: "photoprism",
			secret: false,
			description: "Database name",
			required: false,
		},
		{
			key: "PHOTOPRISM_DATABASE_USER",
			defaultValue: "photoprism",
			secret: false,
			description: "Database user",
			required: false,
		},
		{
			key: "PHOTOPRISM_DATABASE_PASSWORD",
			defaultValue: "${PHOTOPRISM_DB_PASSWORD}",
			secret: true,
			description: "Database password",
			required: false,
		},
	],
	healthcheck: {
		test: "curl -sf http://localhost:2342/api/v1/status || exit 1",
		interval: "30s",
		timeout: "10s",
		retries: 3,
		startPeriod: "60s",
	},
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [
		{
			key: "PHOTOPRISM_HOST",
			defaultValue: "photoprism",
			secret: false,
			description: "PhotoPrism hostname",
			required: false,
		},
		{
			key: "PHOTOPRISM_PORT",
			defaultValue: "2342",
			secret: false,
			description: "PhotoPrism port",
			required: false,
		},
	],

	docsUrl: "https://docs.photoprism.app/",
	tags: ["photos", "ai-tagging", "face-recognition", "gallery", "google-photos-alternative"],
	maturity: "stable",

	requires: [],
	recommends: ["mariadb"],
	conflictsWith: [],

	minMemoryMB: 1024,
	gpuRequired: false,
};
