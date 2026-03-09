import type { ServiceDefinition } from "../../types.js";

export const ixartzSaasDefinition: ServiceDefinition = {
	id: "ixartz-saas",
	name: "SaaS Boilerplate (Ixartz)",
	description:
		"Modern Next.js 14 SaaS boilerplate with TypeScript, DrizzleORM, Tailwind CSS, ShadCN UI, Clerk auth, Stripe billing, i18n support, and comprehensive testing.",
	category: "saas-boilerplate",
	icon: "🚀",

	gitSource: {
		repoUrl: "https://github.com/ixartz/SaaS-Boilerplate.git",
		branch: "main",
		postCloneCommands: [],
	},
	buildContext: {
		dockerfile: "Dockerfile",
		context: ".",
	},

	ports: [
		{
			host: 3103,
			container: 3000,
			description: "Ixartz SaaS web application",
			exposed: true,
		},
	],
	volumes: [],
	environment: [
		{
			key: "IXARTZ_SAAS_DB_PASSWORD",
			defaultValue: "",
			secret: true,
			description: "Database password for Ixartz SaaS",
			required: true,
		},
		{
			key: "DATABASE_URL",
			defaultValue: "postgresql://ixartzsaas:${IXARTZ_SAAS_DB_PASSWORD}@postgresql:5432/ixartzsaas",
			secret: false,
			description: "PostgreSQL connection string",
			required: true,
		},
		{
			key: "CLERK_SECRET_KEY",
			defaultValue: "",
			secret: true,
			description: "Clerk authentication secret key",
			required: true,
		},
		{
			key: "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
			defaultValue: "",
			secret: false,
			description: "Clerk publishable key (client-side)",
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

	docsUrl: "https://github.com/ixartz/SaaS-Boilerplate#readme",
	tags: ["saas", "boilerplate", "nextjs", "typescript", "drizzle", "clerk", "stripe", "tailwind"],
	maturity: "beta",

	requires: ["postgresql"],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 512,
	gpuRequired: false,
};
