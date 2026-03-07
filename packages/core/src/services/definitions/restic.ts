import type { ServiceDefinition } from "../../types.js";

export const resticDefinition: ServiceDefinition = {
	id: "restic",
	name: "Restic REST Server",
	description:
		"Fast, secure, encrypted backup server with deduplication, supporting S3/MinIO/local storage backends.",
	category: "backup",
	icon: "💾",

	image: "restic/rest-server",
	imageTag: "latest",
	ports: [
		{
			host: 8500,
			container: 8000,
			description: "Restic REST API",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "restic-data",
			containerPath: "/data",
			description: "Restic backup repository",
		},
	],
	environment: [
		{
			key: "OPTIONS",
			defaultValue: "--no-auth",
			secret: false,
			description: "Server options (use --no-auth for dev, configure auth in production)",
			required: false,
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

	docsUrl: "https://restic.readthedocs.io/en/latest/",
	tags: ["backup", "restore", "encryption", "deduplication", "s3"],
	maturity: "stable",

	requires: [],
	recommends: ["minio"],
	conflictsWith: [],

	minMemoryMB: 128,
	gpuRequired: false,
};
