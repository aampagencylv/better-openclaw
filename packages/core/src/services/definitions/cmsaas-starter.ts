import type { ServiceDefinition } from "../../types.js";

export const cmsaasStarterDefinition: ServiceDefinition = {
	id: "cmsaas-starter",
	name: "CMSaasStarter",
	description:
		"SvelteKit SaaS starter with Supabase backend, Stripe payments, user management, blog engine, SEO optimization, and edge deployment support.",
	category: "saas-boilerplate",
	icon: "🚀",

	gitSource: {
		repoUrl: "https://github.com/CriticalMoments/CMSaasStarter.git",
		branch: "main",
		postCloneCommands: [],
	},
	buildContext: {
		dockerfile: "Dockerfile",
		context: ".",
	},

	ports: [
		{
			host: 3104,
			container: 3000,
			description: "CMSaasStarter web application",
			exposed: true,
		},
	],
	volumes: [],
	environment: [
		{
			key: "PUBLIC_SUPABASE_URL",
			defaultValue: "",
			secret: false,
			description: "Supabase project URL",
			required: true,
		},
		{
			key: "PUBLIC_SUPABASE_ANON_KEY",
			defaultValue: "",
			secret: false,
			description: "Supabase anonymous/public key",
			required: true,
		},
		{
			key: "PRIVATE_SUPABASE_SERVICE_ROLE",
			defaultValue: "",
			secret: true,
			description: "Supabase service role key (server-side only)",
			required: true,
		},
		{
			key: "PRIVATE_STRIPE_API_KEY",
			defaultValue: "",
			secret: true,
			description: "Stripe secret API key",
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
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://github.com/CriticalMoments/CMSaasStarter#readme",
	tags: ["saas", "boilerplate", "sveltekit", "supabase", "stripe", "seo"],
	maturity: "beta",

	requires: [],
	recommends: ["postgresql"],
	conflictsWith: [],

	minMemoryMB: 256,
	gpuRequired: false,
};
