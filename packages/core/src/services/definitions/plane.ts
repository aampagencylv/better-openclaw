import type { ServiceDefinition } from "../../types.js";

export const planeDefinition: ServiceDefinition = {
	id: "plane",
	name: "Plane",
	description:
		"Open-source project management tool for tracking issues, sprints, and cycles. Self-hosted Jira alternative with Kanban boards and roadmaps.",
	category: "project-management",
	icon: "✈️",

	image: "makeplane/plane-app",
	imageTag: "latest",
	ports: [
		{
			host: 3340,
			container: 3000,
			description: "Plane Web UI",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "plane-data",
			containerPath: "/app/data",
			description: "Plane persistent data",
		},
	],
	environment: [
		{
			key: "DATABASE_URL",
			defaultValue: "postgresql://plane:${PLANE_DB_PASSWORD}@postgresql:5432/plane",
			secret: false,
			description: "PostgreSQL connection string for Plane",
			required: true,
		},
		{
			key: "REDIS_URL",
			defaultValue: "redis://redis:6379/0",
			secret: false,
			description: "Redis connection string for caching and background jobs",
			required: true,
		},
		{
			key: "SECRET_KEY",
			defaultValue: "${PLANE_SECRET_KEY}",
			secret: true,
			description: "Secret key for Plane session encryption and security",
			required: true,
		},
	],
	healthcheck: {
		test: "curl -sf http://localhost:3000/ || exit 1",
		interval: "30s",
		timeout: "10s",
		retries: 5,
		startPeriod: "60s",
	},
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://docs.plane.so/",
	tags: ["project-management", "issues", "sprints", "kanban", "jira-alternative"],
	maturity: "stable",

	requires: ["postgresql", "redis"],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 512,
	gpuRequired: false,
};
