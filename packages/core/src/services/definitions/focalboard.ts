import type { ServiceDefinition } from "../../types.js";

export const focalboardDefinition: ServiceDefinition = {
	id: "focalboard",
	name: "Focalboard",
	description:
		"Open-source project management tool for organizing tasks with boards, lists, and cards. Self-hosted Trello and Notion alternative.",
	category: "project-management",
	icon: "📌",

	image: "mattermost/focalboard",
	imageTag: "7.11.4",
	ports: [
		{
			host: 8200,
			container: 8000,
			description: "Focalboard Web UI",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "focalboard-data",
			containerPath: "/opt/focalboard/data",
			description: "Focalboard persistent data",
		},
	],
	environment: [
		{
			key: "FOCALBOARD_DBTYPE",
			defaultValue: "postgres",
			secret: false,
			description: "Database type for Focalboard persistence",
			required: true,
		},
		{
			key: "FOCALBOARD_DBCONFIG",
			defaultValue:
				"postgres://focalboard:${FOCALBOARD_DB_PASSWORD}@postgresql:5432/focalboard?sslmode=disable",
			secret: false,
			description: "PostgreSQL connection string for Focalboard",
			required: true,
		},
	],
	healthcheck: {
		test: "curl -sf http://localhost:8000 || exit 1",
		interval: "30s",
		timeout: "10s",
		retries: 3,
		startPeriod: "15s",
	},
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://www.focalboard.com/docs/",
	tags: ["kanban", "boards", "project-management", "trello-alternative", "notion-alternative"],
	maturity: "stable",

	requires: ["postgresql"],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 256,
	gpuRequired: false,
};
