import type { ServiceDefinition } from "../../types.js";

export const calibreWebDefinition: ServiceDefinition = {
	id: "calibre-web",
	name: "Calibre-Web",
	description:
		"Web-based ebook management interface for browsing, reading, and downloading books from a Calibre library.",
	category: "media",
	icon: "📖",

	image: "lscr.io/linuxserver/calibre-web",
	imageTag: "latest",
	ports: [
		{
			host: 8083,
			container: 8083,
			description: "Calibre-Web UI",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "calibreweb-config",
			containerPath: "/config",
			description: "Calibre-Web configuration",
		},
		{
			name: "calibreweb-books",
			containerPath: "/books",
			description: "Book library",
		},
	],
	environment: [
		{
			key: "PUID",
			defaultValue: "1000",
			secret: false,
			description: "User ID",
			required: false,
		},
		{
			key: "PGID",
			defaultValue: "1000",
			secret: false,
			description: "Group ID",
			required: false,
		},
		{
			key: "TZ",
			defaultValue: "UTC",
			secret: false,
			description: "Timezone",
			required: false,
		},
	],
	healthcheck: {
		test: "curl -sf http://localhost:8083 || exit 1",
		interval: "30s",
		timeout: "10s",
		retries: 3,
		startPeriod: "30s",
	},
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [
		{
			key: "CALIBREWEB_HOST",
			defaultValue: "calibre-web",
			secret: false,
			description: "Calibre-Web hostname",
			required: false,
		},
		{
			key: "CALIBREWEB_PORT",
			defaultValue: "8083",
			secret: false,
			description: "Calibre-Web port",
			required: false,
		},
	],

	docsUrl: "https://github.com/janeczku/calibre-web/wiki",
	tags: ["ebooks", "reading", "library", "calibre", "kindle"],
	maturity: "stable",

	requires: [],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 128,
	gpuRequired: false,
};
