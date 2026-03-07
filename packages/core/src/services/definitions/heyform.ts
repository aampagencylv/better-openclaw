import type { ServiceDefinition } from "../../types.js";

export const heyformDefinition: ServiceDefinition = {
	id: "heyform",
	name: "Heyform",
	description:
		"Open-source, conversational form builder for creating beautiful interactive forms, surveys, and quizzes — a Typeform alternative.",
	category: "forms",
	icon: "📝",

	image: "heyform/community-edition",
	imageTag: "latest",
	ports: [
		{
			host: 3039,
			container: 8000,
			description: "Heyform web UI",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "heyform-data",
			containerPath: "/app/data",
			description: "Heyform application data",
		},
	],
	environment: [
		{
			key: "APP_HOMEPAGE_URL",
			defaultValue: "http://localhost:3039",
			secret: false,
			description: "Public URL for Heyform",
			required: true,
		},
		{
			key: "SESSION_KEY",
			defaultValue: "${HEYFORM_SESSION_KEY}",
			secret: true,
			description: "Session encryption key",
			required: true,
		},
	],
	healthcheck: {
		test: "curl -sf http://localhost:8000/ || exit 1",
		interval: "30s",
		timeout: "10s",
		retries: 3,
	},
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://docs.heyform.net/self-hosted/installation",
	tags: ["forms", "surveys", "quizzes", "typeform", "conversational"],
	maturity: "stable",

	requires: [],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 256,
	gpuRequired: false,
};
