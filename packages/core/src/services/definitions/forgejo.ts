import type { ServiceDefinition } from "../../types.js";

export const forgejoDefinition: ServiceDefinition = {
	id: "forgejo",
	name: "Forgejo",
	description:
		"Community-driven Git forge providing repository hosting, issue tracking, pull requests, and CI/CD — a hard fork of Gitea.",
	category: "dev-tools",
	icon: "🍴",

	image: "codeberg.org/forgejo/forgejo",
	imageTag: "10",
	ports: [
		{
			host: 3300,
			container: 3000,
			description: "Forgejo web UI",
			exposed: true,
		},
		{
			host: 2222,
			container: 22,
			description: "SSH access",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "forgejo-data",
			containerPath: "/data",
			description: "Persistent Forgejo data",
		},
	],
	environment: [
		{
			key: "USER_UID",
			defaultValue: "1000",
			secret: false,
			description: "User ID",
			required: false,
		},
		{
			key: "USER_GID",
			defaultValue: "1000",
			secret: false,
			description: "Group ID",
			required: false,
		},
		{
			key: "FORGEJO__database__DB_TYPE",
			defaultValue: "postgres",
			secret: false,
			description: "Database type",
			required: true,
		},
		{
			key: "FORGEJO__database__HOST",
			defaultValue: "postgresql:5432",
			secret: false,
			description: "Database host",
			required: true,
		},
		{
			key: "FORGEJO__database__NAME",
			defaultValue: "forgejo",
			secret: false,
			description: "Database name",
			required: true,
		},
		{
			key: "FORGEJO__database__USER",
			defaultValue: "forgejo",
			secret: false,
			description: "Database user",
			required: true,
		},
		{
			key: "FORGEJO__database__PASSWD",
			defaultValue: "${FORGEJO_DB_PASSWORD}",
			secret: true,
			description: "Database password",
			required: true,
		},
	],
	healthcheck: {
		test: "curl -sf http://localhost:3000/api/v1/version || exit 1",
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

	docsUrl: "https://forgejo.org/docs/",
	tags: ["git", "forge", "repository", "gitea-fork", "ci-cd"],
	maturity: "stable",

	requires: ["postgresql"],
	recommends: [],
	conflictsWith: ["gitea"],

	minMemoryMB: 256,
	gpuRequired: false,
};
