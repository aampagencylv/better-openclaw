import type { ServiceDefinition } from "../../types.js";

export const fonosterDefinition: ServiceDefinition = {
	id: "fonoster",
	name: "Fonoster",
	description:
		"Open-source programmable voice platform (Twilio alternative) for building AI-powered voice agents, IVR systems, and phone bots.",
	category: "voice",
	icon: "📞",

	image: "fonoster/fonoster",
	imageTag: "latest",
	ports: [
		{
			host: 50051,
			container: 50051,
			description: "Fonoster gRPC API",
			exposed: true,
		},
		{
			host: 3041,
			container: 8080,
			description: "Fonoster web UI",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "fonoster-data",
			containerPath: "/data",
			description: "Fonoster data and recordings",
		},
	],
	environment: [
		{
			key: "CLOAK_ENCRYPTION_KEY",
			defaultValue: "${FONOSTER_ENCRYPTION_KEY}",
			secret: true,
			description: "Encryption key for secrets",
			required: true,
		},
	],
	healthcheck: {
		test: "curl -sf http://localhost:8080/health || exit 1",
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

	docsUrl: "https://fonoster.com/docs",
	tags: ["voice", "telephony", "sip", "voip", "ivr", "phone", "twilio"],
	maturity: "beta",

	requires: [],
	recommends: ["redis"],
	conflictsWith: [],

	minMemoryMB: 512,
	gpuRequired: false,
};
