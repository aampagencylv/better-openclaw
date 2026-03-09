import type { ServiceDefinition } from "../../types.js";

export const vikunjaDefinition: ServiceDefinition = {
	id: "vikunja",
	name: "Vikunja",
	description:
		"Open-source task management and to-do list application with Kanban boards, calendars, and collaboration. Self-hosted Todoist alternative.",
	category: "project-management",
	icon: "✅",

	image: "vikunja/vikunja",
	imageTag: "0.24",
	ports: [
		{
			host: 3460,
			container: 3456,
			description: "Vikunja API + frontend",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "vikunja-data",
			containerPath: "/app/vikunja/files",
			description: "Vikunja persistent file storage",
		},
	],
	environment: [
		{
			key: "VIKUNJA_DATABASE_TYPE",
			defaultValue: "postgres",
			secret: false,
			description: "Database type for Vikunja persistence",
			required: true,
		},
		{
			key: "VIKUNJA_DATABASE_HOST",
			defaultValue: "postgresql",
			secret: false,
			description: "PostgreSQL hostname for Vikunja",
			required: true,
		},
		{
			key: "VIKUNJA_DATABASE_USER",
			defaultValue: "vikunja",
			secret: false,
			description: "PostgreSQL user for Vikunja",
			required: true,
		},
		{
			key: "VIKUNJA_DATABASE_PASSWORD",
			defaultValue: "${VIKUNJA_DB_PASSWORD}",
			secret: true,
			description: "PostgreSQL password for Vikunja",
			required: true,
		},
		{
			key: "VIKUNJA_DATABASE_DATABASE",
			defaultValue: "vikunja",
			secret: false,
			description: "PostgreSQL database name for Vikunja",
			required: true,
		},
		{
			key: "VIKUNJA_SERVICE_JWTSECRET",
			defaultValue: "${VIKUNJA_JWT_SECRET}",
			secret: true,
			description: "JWT secret for Vikunja authentication tokens",
			required: true,
		},
	],
	healthcheck: {
		test: "wget -qO- http://localhost:3456/api/v1/info || exit 1",
		interval: "30s",
		timeout: "10s",
		retries: 3,
		startPeriod: "30s",
	},
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://vikunja.io/docs/",
	tags: ["tasks", "todo", "kanban", "calendar", "todoist-alternative"],
	maturity: "stable",

	requires: ["postgresql"],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 128,
	gpuRequired: false,
};
