import type { ServiceDefinition } from "../../types.js";

export const usesendDefinition: ServiceDefinition = {
	id: "usesend",
	name: "useSend",
	description:
		"Self-hosted sending infrastructure for developers. Email via AWS SES/SNS, GitHub auth, Postgres and Redis. Open-source alternative for transactional and status emails.",
	category: "communication",
	icon: "📧",

	image: "usesend/usesend",
	imageTag: "v1.7.7",
	ports: [
		{
			host: 3025,
			container: 3000,
			description: "useSend web UI",
			exposed: true,
		},
	],
	volumes: [],
	environment: [
		{
			key: "DATABASE_URL",
			defaultValue: "postgres://usesend:${USESEND_DB_PASSWORD}@postgresql:5432/usesend",
			secret: true,
			description: "PostgreSQL connection URL",
			required: true,
		},
		{
			key: "REDIS_URL",
			defaultValue: "redis://:password@redis:6379",
			secret: true,
			description: "Redis connection URL",
			required: true,
		},
		{
			key: "AWS_ACCESS_KEY",
			defaultValue: "your-aws-access-key",
			secret: true,
			description: "AWS access key for SES/SNS",
			required: true,
		},
		{
			key: "AWS_SECRET_KEY",
			defaultValue: "your-aws-secret-key",
			secret: true,
			description: "AWS secret key for SES/SNS",
			required: true,
		},
		{
			key: "GITHUB_ID",
			defaultValue: "your-github-oauth-client-id",
			secret: false,
			description: "GitHub OAuth app client ID",
			required: true,
		},
		{
			key: "GITHUB_SECRET",
			defaultValue: "your-github-oauth-client-secret",
			secret: true,
			description: "GitHub OAuth app client secret",
			required: true,
		},
		{
			key: "NEXTAUTH_URL",
			defaultValue: "https://your-usesend-instance",
			secret: false,
			description: "Public URL of your useSend instance",
			required: true,
		},
		{
			key: "NEXTAUTH_SECRET",
			defaultValue: "",
			secret: true,
			description: "Random secret for NextAuth (e.g. openssl rand -base64 32)",
			required: true,
		},
	],
	dependsOn: ["postgresql", "redis"],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://docs.usesend.com/self-hosting/overview",
	selfHostedDocsUrl: "https://docs.usesend.com/self-hosting/overview",
	tags: ["email", "ses", "smtp", "transactional", "self-hosted"],
	maturity: "stable",

	requires: ["postgresql", "redis"],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 512,
	gpuRequired: false,
};
