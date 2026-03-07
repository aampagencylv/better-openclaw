import type { ServiceDefinition } from "../../types.js";

export const stirlingPdfDefinition: ServiceDefinition = {
	id: "stirling-pdf",
	name: "Stirling PDF",
	description:
		"Self-hosted PDF toolkit for merging, splitting, OCR, compressing, redacting, and transforming documents before they enter knowledge workflows.",
	category: "knowledge",
	icon: "📄",

	image: "stirlingtools/stirling-pdf",
	imageTag: "latest",
	ports: [
		{
			host: 8113,
			container: 8080,
			description: "Stirling PDF web UI",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "stirling-pdf-configs",
			containerPath: "/configs",
			description: "Stirling PDF configuration and custom settings",
		},
		{
			name: "stirling-pdf-custom-files",
			containerPath: "/customFiles",
			description: "Custom fonts, assets, and extra files",
		},
	],
	environment: [
		{
			key: "DOCKER_ENABLE_SECURITY",
			defaultValue: "false",
			secret: false,
			description: "Enable built-in Stirling PDF login and security mode",
			required: true,
		},
		{
			key: "LANGS",
			defaultValue: "en_GB",
			secret: false,
			description: "Enabled UI languages",
			required: true,
		},
	],
	healthcheck: {
		test: "curl -sf http://localhost:8080/ || exit 1",
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

	docsUrl: "https://docs.stirlingpdf.com/",
	tags: ["pdf", "documents", "ocr", "merge", "split", "transform"],
	maturity: "stable",

	requires: [],
	recommends: ["paperless-ngx", "outline", "docsgpt"],
	conflictsWith: [],

	minMemoryMB: 512,
	gpuRequired: false,
};
