import type { ServiceDefinition } from "../../types.js";

export const openSaasDefinition: ServiceDefinition = {
	id: "open-saas",
	name: "Open SaaS",
	description:
		"Full-stack React + Node.js SaaS starter built on the Wasp framework with auth, payments (Stripe/Lemon Squeezy), email, analytics, and admin dashboard.",
	category: "saas-boilerplate",
	icon: "🚀",

	// Git-based service — built from source
	gitSource: {
		repoUrl: "https://github.com/wasp-lang/open-saas.git",
		branch: "main",
		subdirectory: "template",
		postCloneCommands: [],
	},
	buildContext: {
		dockerfile: "Dockerfile",
		context: ".",
	},

	ports: [
		{
			host: 3100,
			container: 3000,
			description: "Open SaaS web application",
			exposed: true,
		},
	],
	volumes: [],
	environment: [
		{
			key: "DATABASE_URL",
			defaultValue: "postgresql://opensaas:${OPENSAAS_DB_PASSWORD}@postgresql:5432/opensaas",
			secret: false,
			description: "PostgreSQL connection string",
			required: true,
		},
		{
			key: "OPENSAAS_DB_PASSWORD",
			defaultValue: "",
			secret: true,
			description: "Database password for Open SaaS",
			required: true,
		},
		{
			key: "JWT_SECRET",
			defaultValue: "",
			secret: true,
			description: "JWT signing secret",
			required: true,
		},
	],
	healthcheck: {
		test: "wget -q --spider http://localhost:3000/ || exit 1",
		interval: "30s",
		timeout: "10s",
		retries: 3,
		startPeriod: "60s",
	},
	dependsOn: ["postgresql"],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://opensaas.sh/docs",
	tags: ["saas", "boilerplate", "react", "nodejs", "wasp", "stripe", "auth"],
	maturity: "beta",

	requires: ["postgresql"],
	recommends: ["redis"],
	conflictsWith: [],

	minMemoryMB: 512,
	gpuRequired: false,
};
