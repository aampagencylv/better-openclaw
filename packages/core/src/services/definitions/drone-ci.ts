import type { ServiceDefinition } from "../../types.js";

export const droneCiDefinition: ServiceDefinition = {
	id: "drone-ci",
	name: "Drone CI",
	description:
		"Container-native continuous integration platform with pipeline-as-code and multi-platform build support.",
	category: "dev-tools",
	icon: "🚁",

	image: "drone/drone",
	imageTag: "2",
	ports: [
		{
			host: 8310,
			container: 80,
			description: "Drone web UI",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "drone-data",
			containerPath: "/data",
			description: "Drone server data",
		},
	],
	environment: [
		{
			key: "DRONE_GITEA_SERVER",
			defaultValue: "http://gitea:3000",
			secret: false,
			description: "Gitea server URL",
			required: false,
		},
		{
			key: "DRONE_GITEA_CLIENT_ID",
			defaultValue: "",
			secret: false,
			description: "Gitea OAuth client ID",
			required: false,
		},
		{
			key: "DRONE_GITEA_CLIENT_SECRET",
			defaultValue: "",
			secret: true,
			description: "Gitea OAuth client secret",
			required: false,
		},
		{
			key: "DRONE_RPC_SECRET",
			defaultValue: "",
			secret: true,
			description: "Shared secret for runner communication",
			required: true,
		},
		{
			key: "DRONE_SERVER_HOST",
			defaultValue: "localhost:8310",
			secret: false,
			description: "External server hostname",
			required: true,
		},
		{
			key: "DRONE_SERVER_PROTO",
			defaultValue: "http",
			secret: false,
			description: "Server protocol",
			required: true,
		},
	],
	healthcheck: {
		test: "curl -sf http://localhost:80/healthz || exit 1",
		interval: "30s",
		timeout: "10s",
		retries: 3,
		startPeriod: "15s",
	},
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://docs.drone.io/",
	tags: ["ci-cd", "pipelines", "container-native", "builds"],
	maturity: "stable",

	requires: [],
	recommends: ["gitea"],
	conflictsWith: [],

	minMemoryMB: 256,
	gpuRequired: false,
};
