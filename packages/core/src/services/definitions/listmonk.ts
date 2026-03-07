import type { ServiceDefinition } from "../../types.js";

export const listmonkDefinition: ServiceDefinition = {
	id: "listmonk",
	name: "Listmonk",
	description:
		"Self-hosted newsletter and mailing list manager for product updates, lifecycle email, broadcasts, and audience segmentation.",
	category: "communication",
	icon: "📬",

	image: "listmonk/listmonk",
	imageTag: "latest",
	ports: [
		{
			host: 9018,
			container: 9000,
			description: "Listmonk admin UI and API",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "listmonk-uploads",
			containerPath: "/listmonk/uploads",
			description: "Uploaded assets and media for Listmonk campaigns",
		},
	],
	environment: [
		{
			key: "LISTMONK_db__host",
			defaultValue: "postgresql",
			secret: false,
			description: "PostgreSQL host",
			required: true,
		},
		{
			key: "LISTMONK_db__port",
			defaultValue: "5432",
			secret: false,
			description: "PostgreSQL port",
			required: true,
		},
		{
			key: "LISTMONK_db__user",
			defaultValue: "listmonk",
			secret: false,
			description: "PostgreSQL user",
			required: true,
		},
		{
			key: "LISTMONK_db__password",
			defaultValue: "${LISTMONK_DB_PASSWORD}",
			secret: true,
			description: "PostgreSQL password",
			required: true,
		},
		{
			key: "LISTMONK_db__database",
			defaultValue: "listmonk",
			secret: false,
			description: "PostgreSQL database name",
			required: true,
		},
		{
			key: "LISTMONK_db__ssl_mode",
			defaultValue: "disable",
			secret: false,
			description: "PostgreSQL SSL mode",
			required: true,
		},
		{
			key: "LISTMONK_app__address",
			defaultValue: "0.0.0.0:9000",
			secret: false,
			description: "Listmonk bind address",
			required: true,
		},
		{
			key: "LISTMONK_ADMIN_USER",
			defaultValue: "admin",
			secret: false,
			description: "Initial Listmonk admin username",
			required: false,
		},
		{
			key: "LISTMONK_ADMIN_PASSWORD",
			defaultValue: "${LISTMONK_ADMIN_PASSWORD}",
			secret: true,
			description: "Initial Listmonk admin password",
			required: false,
		},
	],
	command: `sh -c "./listmonk --install --idempotent --yes --config '' && ./listmonk --upgrade --yes --config '' && ./listmonk --config ''"`,
	healthcheck: {
		test: "curl -sf http://localhost:9000/ || exit 1",
		interval: "30s",
		timeout: "10s",
		retries: 5,
		startPeriod: "45s",
	},
	dependsOn: ["postgresql"],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://listmonk.app/docs/",
	tags: ["newsletter", "email", "campaigns", "mailing-list", "marketing"],
	maturity: "stable",

	requires: ["postgresql"],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 256,
	gpuRequired: false,
};
