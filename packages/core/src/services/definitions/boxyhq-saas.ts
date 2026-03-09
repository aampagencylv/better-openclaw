import type { ServiceDefinition } from "../../types.js";

export const boxyhqSaasDefinition: ServiceDefinition = {
	id: "boxyhq-saas",
	name: "BoxyHQ Enterprise SaaS Starter",
	description:
		"Enterprise-grade Next.js SaaS starter kit with SSO (SAML/OIDC), directory sync, audit logs, team management, Prisma ORM, Stripe billing, and PostgreSQL.",
	category: "saas-boilerplate",
	icon: "🚀",

	gitSource: {
		repoUrl: "https://github.com/boxyhq/saas-starter-kit.git",
		branch: "main",
		postCloneCommands: ["cp .env.example .env"],
	},
	buildContext: {
		dockerfile: "Dockerfile",
		context: ".",
	},

	ports: [
		{
			host: 3102,
			container: 3000,
			description: "BoxyHQ SaaS web application",
			exposed: true,
		},
	],
	volumes: [],
	environment: [
		{
			key: "BOXYHQ_SAAS_DB_PASSWORD",
			defaultValue: "",
			secret: true,
			description: "Database password for BoxyHQ SaaS",
			required: true,
		},
		{
			key: "DATABASE_URL",
			defaultValue: "postgresql://boxyhqsaas:${BOXYHQ_SAAS_DB_PASSWORD}@postgresql:5432/boxyhqsaas",
			secret: false,
			description: "PostgreSQL connection string",
			required: true,
		},
		{
			key: "NEXTAUTH_SECRET",
			defaultValue: "",
			secret: true,
			description: "NextAuth.js session encryption secret",
			required: true,
		},
		{
			key: "NEXTAUTH_URL",
			defaultValue: "http://localhost:3102",
			secret: false,
			description: "NextAuth.js callback URL",
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

	docsUrl: "https://github.com/boxyhq/saas-starter-kit#readme",
	tags: ["saas", "boilerplate", "nextjs", "enterprise", "sso", "saml", "stripe", "prisma"],
	maturity: "beta",

	requires: ["postgresql"],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 512,
	gpuRequired: false,
};
