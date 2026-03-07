import type { ServiceDefinition } from "../../types.js";

export const mauticDefinition: ServiceDefinition = {
	id: "mautic",
	name: "Mautic",
	description:
		"Open-source marketing automation platform for email campaigns, drip sequences, lead scoring, contact management, and landing pages.",
	category: "email-marketing",
	icon: "📧",

	image: "mautic/mautic",
	imageTag: "latest",
	ports: [
		{
			host: 8082,
			container: 80,
			description: "Mautic web UI",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "mautic-data",
			containerPath: "/var/www/html",
			description: "Mautic application data and assets",
		},
	],
	environment: [
		{
			key: "MAUTIC_DB_HOST",
			defaultValue: "mysql",
			secret: false,
			description: "MySQL host",
			required: true,
		},
		{
			key: "MAUTIC_DB_NAME",
			defaultValue: "mautic",
			secret: false,
			description: "MySQL database name",
			required: true,
		},
		{
			key: "MAUTIC_DB_USER",
			defaultValue: "mautic",
			secret: false,
			description: "MySQL username",
			required: true,
		},
		{
			key: "MAUTIC_DB_PASSWORD",
			defaultValue: "${MAUTIC_DB_PASSWORD}",
			secret: true,
			description: "MySQL password",
			required: true,
		},
	],
	healthcheck: {
		test: "curl -sf http://localhost:80/ || exit 1",
		interval: "30s",
		timeout: "10s",
		retries: 5,
		startPeriod: "60s",
	},
	dependsOn: ["mysql"],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://docs.mautic.org/en/5.x/getting_started/how_to_install_mautic.html",
	tags: ["marketing", "email", "automation", "campaigns", "leads", "crm"],
	maturity: "stable",

	requires: ["mysql"],
	recommends: ["redis"],
	conflictsWith: [],

	minMemoryMB: 512,
	gpuRequired: false,
};
