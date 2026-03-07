import type { ServiceDefinition } from "../../types.js";

export const duplicatiDefinition: ServiceDefinition = {
	id: "duplicati",
	name: "Duplicati",
	description:
		"Web-based backup manager with scheduling, encryption, and support for S3, MinIO, and local storage backends.",
	category: "backup",
	icon: "🗃️",

	image: "linuxserver/duplicati",
	imageTag: "latest",
	ports: [
		{
			host: 8201,
			container: 8200,
			description: "Duplicati web UI",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "duplicati-config",
			containerPath: "/config",
			description: "Duplicati configuration and database",
		},
		{
			name: "duplicati-backups",
			containerPath: "/backups",
			description: "Backup destination",
		},
		{
			name: "duplicati-source",
			containerPath: "/source",
			description: "Source data to back up",
		},
	],
	environment: [
		{
			key: "PUID",
			defaultValue: "1000",
			secret: false,
			description: "User ID for file permissions",
			required: false,
		},
		{
			key: "PGID",
			defaultValue: "1000",
			secret: false,
			description: "Group ID for file permissions",
			required: false,
		},
	],
	healthcheck: {
		test: "curl -sf http://localhost:8200/ || exit 1",
		interval: "30s",
		timeout: "10s",
		retries: 3,
	},
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://docs.linuxserver.io/images/docker-duplicati/",
	tags: ["backup", "scheduling", "encryption", "restore", "s3"],
	maturity: "stable",

	requires: [],
	recommends: ["minio"],
	conflictsWith: [],

	minMemoryMB: 128,
	gpuRequired: false,
};
