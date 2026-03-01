import type { ServiceDefinition } from "../../types.js";

export const nextcloudDefinition: ServiceDefinition = {
	id: "nextcloud",
	name: "Nextcloud",
	description: "Self-hosted productivity platform that keeps you in control.",
	category: "storage",
	icon: "☁️",

	image: "nextcloud",
	imageTag: "32.0.6",
	ports: [
		{
			host: 8181,
			container: 80,
			description: "Nextcloud Web Interface",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "nextcloud_data",
			containerPath: "/var/www/html",
			description: "Persistent Nextcloud data storage",
		},
	],
	environment: [
		{
			key: "POSTGRES_DB",
			defaultValue: "nextcloud",
			secret: false,
			description: "PostgreSQL database name for Nextcloud",
			required: true,
		},
		{
			key: "POSTGRES_USER",
			defaultValue: "nextcloud",
			secret: false,
			description: "PostgreSQL user for Nextcloud",
			required: true,
		},
		{
			key: "POSTGRES_PASSWORD",
			defaultValue: "${NEXTCLOUD_DB_PASSWORD}",
			secret: false,
			description: "PostgreSQL password for Nextcloud (resolved from NEXTCLOUD_DB_PASSWORD)",
			required: true,
		},
		{
			key: "POSTGRES_HOST",
			defaultValue: "postgresql",
			secret: false,
			description: "PostgreSQL hostname for Nextcloud",
			required: true,
		},
	],
	healthcheck: {
		test: "curl --fail http://localhost:80/status.php || exit 1",
		interval: "30s",
		timeout: "10s",
		retries: 3,
		startPeriod: "30s",
	},
	dependsOn: ["postgresql"],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://nextcloud.com/",
	tags: ["storage", "cloud", "productivity", "collaboration"],
	maturity: "stable",

	requires: ["postgresql"],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 512,
	gpuRequired: false,
};
