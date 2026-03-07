import type { ServiceDefinition } from "../../types.js";

export const hedgedocDefinition: ServiceDefinition = {
	id: "hedgedoc",
	name: "HedgeDoc",
	description:
		"Real-time collaborative Markdown editor for teams with simultaneous editing, rich embeds, and presentation mode.",
	category: "collaboration",
	icon: "✏️",

	image: "quay.io/hedgedoc/hedgedoc",
	imageTag: "1.10.0",
	ports: [
		{
			host: 3042,
			container: 3000,
			description: "HedgeDoc web UI",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "hedgedoc-uploads",
			containerPath: "/hedgedoc/public/uploads",
			description: "HedgeDoc file uploads",
		},
	],
	environment: [
		{
			key: "CMD_DB_URL",
			defaultValue: "postgresql://hedgedoc:${HEDGEDOC_DB_PASSWORD}@postgresql:5432/hedgedoc",
			secret: true,
			description: "PostgreSQL connection URL",
			required: true,
		},
		{
			key: "CMD_DOMAIN",
			defaultValue: "localhost",
			secret: false,
			description: "Domain name for HedgeDoc",
			required: true,
		},
		{
			key: "CMD_URL_ADDPORT",
			defaultValue: "true",
			secret: false,
			description: "Add port to URL",
			required: false,
		},
		{
			key: "CMD_SESSION_SECRET",
			defaultValue: "${HEDGEDOC_SESSION_SECRET}",
			secret: true,
			description: "Session encryption secret",
			required: true,
		},
	],
	healthcheck: {
		test: "curl -sf http://localhost:3000/ || exit 1",
		interval: "30s",
		timeout: "10s",
		retries: 3,
	},
	dependsOn: ["postgresql"],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://docs.hedgedoc.org/setup/docker/",
	tags: ["markdown", "collaboration", "editor", "realtime", "notes", "wiki"],
	maturity: "stable",

	requires: ["postgresql"],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 256,
	gpuRequired: false,
};
