import type { ServiceDefinition } from "../../types.js";

export const woodpeckerCiDefinition: ServiceDefinition = {
	id: "woodpecker-ci",
	name: "Woodpecker CI",
	description:
		"Lightweight container-native CI/CD engine with YAML pipelines, multi-platform builds, and Gitea/GitHub/GitLab integration.",
	category: "dev-tools",
	icon: "🐦",

	image: "woodpeckerci/woodpecker-server",
	imageTag: "latest",
	ports: [
		{
			host: 8320,
			container: 8000,
			description: "Woodpecker web UI",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "woodpecker-data",
			containerPath: "/var/lib/woodpecker",
			description: "Woodpecker server data",
		},
	],
	environment: [
		{
			key: "WOODPECKER_HOST",
			defaultValue: "http://localhost:8320",
			secret: false,
			description: "Woodpecker server URL",
			required: true,
		},
		{
			key: "WOODPECKER_AGENT_SECRET",
			defaultValue: "",
			secret: true,
			description: "Shared secret for agent auth",
			required: true,
		},
		{
			key: "WOODPECKER_GITEA",
			defaultValue: "true",
			secret: false,
			description: "Enable Gitea integration",
			required: false,
		},
		{
			key: "WOODPECKER_GITEA_URL",
			defaultValue: "http://gitea:3000",
			secret: false,
			description: "Gitea server URL",
			required: false,
		},
	],
	healthcheck: {
		test: "wget -qO- http://localhost:8000/healthz || exit 1",
		interval: "30s",
		timeout: "10s",
		retries: 3,
		startPeriod: "15s",
	},
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [
		{
			key: "WOODPECKER_HOST",
			defaultValue: "woodpecker-ci",
			secret: false,
			description: "Woodpecker hostname",
			required: false,
		},
		{
			key: "WOODPECKER_PORT",
			defaultValue: "8000",
			secret: false,
			description: "Woodpecker port",
			required: false,
		},
	],

	docsUrl: "https://woodpecker-ci.org/docs/intro",
	tags: ["ci-cd", "pipelines", "container-native", "drone-compatible"],
	maturity: "stable",

	requires: [],
	recommends: ["gitea", "forgejo"],
	conflictsWith: [],

	minMemoryMB: 256,
	gpuRequired: false,
};
