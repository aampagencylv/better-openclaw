import type { ServiceDefinition } from "../../types.js";

export const tempoDefinition: ServiceDefinition = {
	id: "tempo",
	name: "Grafana Tempo",
	description:
		"High-scale distributed tracing backend by Grafana Labs with native Grafana integration and S3/GCS storage support.",
	category: "monitoring",
	icon: "🎵",

	image: "grafana/tempo",
	imageTag: "latest",
	ports: [
		{
			host: 3210,
			container: 3200,
			description: "Tempo HTTP API",
			exposed: true,
		},
		{
			host: 4327,
			container: 4317,
			description: "OpenTelemetry gRPC receiver",
			exposed: false,
		},
	],
	volumes: [
		{
			name: "tempo-data",
			containerPath: "/var/tempo",
			description: "Tempo trace data",
		},
	],
	environment: [],
	healthcheck: {
		test: "wget -qO- http://localhost:3200/ready || exit 1",
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

	docsUrl: "https://grafana.com/docs/tempo/latest/",
	tags: ["distributed-tracing", "opentelemetry", "grafana", "observability"],
	maturity: "stable",

	requires: [],
	recommends: ["grafana"],
	conflictsWith: ["jaeger"],

	minMemoryMB: 256,
	gpuRequired: false,
};
