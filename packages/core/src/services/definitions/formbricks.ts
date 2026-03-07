import type { ServiceDefinition } from "../../types.js";

export const formbricksDefinition: ServiceDefinition = {
	id: "formbricks",
	name: "Formbricks",
	description:
		"Privacy-first survey and form builder with in-app surveys, NPS, feature requests, and product feedback collection.",
	category: "forms",
	icon: "📋",

	image: "formbricks/formbricks",
	imageTag: "latest",
	ports: [
		{
			host: 3038,
			container: 3000,
			description: "Formbricks web UI",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "formbricks-uploads",
			containerPath: "/apps/web/uploads",
			description: "Formbricks uploaded files",
		},
	],
	environment: [
		{
			key: "DATABASE_URL",
			defaultValue: "postgresql://formbricks:${FORMBRICKS_DB_PASSWORD}@postgresql:5432/formbricks",
			secret: true,
			description: "PostgreSQL connection URL",
			required: true,
		},
		{
			key: "NEXTAUTH_SECRET",
			defaultValue: "${FORMBRICKS_NEXTAUTH_SECRET}",
			secret: true,
			description: "NextAuth.js secret",
			required: true,
		},
		{
			key: "NEXTAUTH_URL",
			defaultValue: "http://localhost:3038",
			secret: false,
			description: "Public URL for NextAuth callbacks",
			required: true,
		},
	],
	healthcheck: {
		test: "curl -sf http://localhost:3000/ || exit 1",
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

	docsUrl: "https://formbricks.com/docs/self-hosting/docker",
	tags: ["forms", "surveys", "nps", "feedback", "privacy"],
	maturity: "stable",

	requires: ["postgresql"],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 256,
	gpuRequired: false,
};
