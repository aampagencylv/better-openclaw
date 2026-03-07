import type { ServiceDefinition } from "../../types.js";

export const pocketbaseDefinition: ServiceDefinition = {
	id: "pocketbase",
	name: "PocketBase",
	description:
		"Lightweight backend with auth, realtime APIs, file storage, and an admin UI, designed for solo builders and small products.",
	category: "database",
	icon: "👜",

	image: "benallfree/pocketbase",
	imageTag: "0.29.1",
	ports: [
		{
			host: 8097,
			container: 8090,
			description: "PocketBase API and admin UI",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "pocketbase-data",
			containerPath: "/data",
			description: "PocketBase sqlite database and uploaded files",
		},
	],
	environment: [
		{
			key: "GOMEMLIMIT",
			defaultValue: "512MiB",
			secret: false,
			description: "Go memory limit hint for PocketBase",
			required: true,
		},
	],
	command: "pocketbase serve --http=0.0.0.0:8090 --dir=/data/pb_data",
	healthcheck: {
		test: "curl -sf http://localhost:8090/api/health || exit 1",
		interval: "30s",
		timeout: "10s",
		retries: 5,
		startPeriod: "20s",
	},
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://pocketbase.io/docs/going-to-production",
	tags: ["backend", "auth", "sqlite", "realtime", "files", "solo-builder"],
	maturity: "beta",

	requires: [],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 128,
	gpuRequired: false,
};
