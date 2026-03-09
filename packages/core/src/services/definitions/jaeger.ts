import type { ServiceDefinition } from "../../types.js";

export const jaegerDefinition: ServiceDefinition = {
	id: "jaeger",
	name: "Jaeger",
	description:
		"End-to-end distributed tracing platform for monitoring and troubleshooting microservice architectures.",
	category: "monitoring",
	icon: "🔎",

	image: "jaegertracing/all-in-one",
	imageTag: "1.64",
	ports: [
		{
			host: 16686,
			container: 16686,
			description: "Jaeger web UI",
			exposed: true,
		},
		{
			host: 4317,
			container: 4317,
			description: "OpenTelemetry gRPC",
			exposed: true,
		},
		{
			host: 4318,
			container: 4318,
			description: "OpenTelemetry HTTP",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "jaeger-data",
			containerPath: "/badger",
			description: "Jaeger trace storage",
		},
	],
	environment: [
		{
			key: "SPAN_STORAGE_TYPE",
			defaultValue: "badger",
			secret: false,
			description: "Storage backend type",
			required: true,
		},
		{
			key: "BADGER_EPHEMERAL",
			defaultValue: "false",
			secret: false,
			description: "Persist traces to disk",
			required: true,
		},
		{
			key: "BADGER_DIRECTORY_VALUE",
			defaultValue: "/badger/data",
			secret: false,
			description: "Badger data directory",
			required: true,
		},
		{
			key: "BADGER_DIRECTORY_KEY",
			defaultValue: "/badger/key",
			secret: false,
			description: "Badger key directory",
			required: true,
		},
	],
	healthcheck: {
		test: "curl -sf http://localhost:16686/ || exit 1",
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

	docsUrl: "https://www.jaegertracing.io/docs/",
	tags: ["distributed-tracing", "opentelemetry", "observability", "microservices"],
	maturity: "stable",

	requires: [],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 256,
	gpuRequired: false,
};
