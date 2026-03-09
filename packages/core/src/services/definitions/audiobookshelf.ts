import type { ServiceDefinition } from "../../types.js";

export const audiobookshelfDefinition: ServiceDefinition = {
	id: "audiobookshelf",
	name: "Audiobookshelf",
	description:
		"Self-hosted audiobook and podcast server with progress tracking, chapter support, and multi-user library management.",
	category: "media",
	icon: "🎧",

	image: "ghcr.io/advplyr/audiobookshelf",
	imageTag: "latest",
	ports: [
		{
			host: 13378,
			container: 80,
			description: "Audiobookshelf web UI",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "audiobookshelf-config",
			containerPath: "/config",
			description: "Audiobookshelf config",
		},
		{
			name: "audiobookshelf-metadata",
			containerPath: "/metadata",
			description: "Audiobookshelf metadata",
		},
		{
			name: "audiobookshelf-audiobooks",
			containerPath: "/audiobooks",
			description: "Audiobook files",
		},
		{
			name: "audiobookshelf-podcasts",
			containerPath: "/podcasts",
			description: "Podcast files",
		},
	],
	environment: [],
	healthcheck: {
		test: "wget -qO- http://localhost:80/healthcheck || exit 1",
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
			key: "AUDIOBOOKSHELF_HOST",
			defaultValue: "audiobookshelf",
			secret: false,
			description: "Audiobookshelf hostname",
			required: false,
		},
		{
			key: "AUDIOBOOKSHELF_PORT",
			defaultValue: "80",
			secret: false,
			description: "Audiobookshelf port",
			required: false,
		},
	],

	docsUrl: "https://www.audiobookshelf.org/docs",
	tags: ["audiobooks", "podcasts", "streaming", "library"],
	maturity: "stable",

	requires: [],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 128,
	gpuRequired: false,
};
