import type { ServiceDefinition } from "../../types.js";

export const vectorLogDefinition: ServiceDefinition = {
	id: "vector-log",
	name: "Vector",
	description:
		"High-performance observability data pipeline for collecting, transforming, and routing logs, metrics, and traces.",
	category: "monitoring",
	icon: "📊",

	image: "timberio/vector",
	imageTag: "0.43.1-alpine",
	ports: [
		{
			host: 8686,
			container: 8686,
			description: "Vector API",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "vector-data",
			containerPath: "/var/lib/vector",
			description: "Vector buffer and state data",
		},
	],
	environment: [
		{
			key: "VECTOR_LOG",
			defaultValue: "info",
			secret: false,
			description: "Log level",
			required: false,
		},
	],
	healthcheck: {
		test: "wget -qO- http://localhost:8686/health || exit 1",
		interval: "30s",
		timeout: "10s",
		retries: 3,
		startPeriod: "10s",
	},
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://vector.dev/docs/",
	tags: ["log-pipeline", "metrics", "observability", "etl", "data-pipeline"],
	maturity: "stable",

	requires: [],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 128,
	gpuRequired: false,
};
