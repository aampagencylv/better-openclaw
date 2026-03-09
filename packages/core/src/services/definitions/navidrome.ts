import type { ServiceDefinition } from "../../types.js";

export const navidromeDefinition: ServiceDefinition = {
	id: "navidrome",
	name: "Navidrome",
	description:
		"Modern self-hosted music server and streamer compatible with Subsonic and Airsonic clients for streaming your music collection.",
	category: "media",
	icon: "🎵",

	image: "deluan/navidrome",
	imageTag: "latest",
	ports: [
		{
			host: 4533,
			container: 4533,
			description: "Navidrome web UI",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "navidrome-data",
			containerPath: "/data",
			description: "Navidrome database and cache",
		},
		{
			name: "navidrome-music",
			containerPath: "/music",
			description: "Music library",
		},
	],
	environment: [
		{
			key: "ND_SCANSCHEDULE",
			defaultValue: "1h",
			secret: false,
			description: "Music library scan interval",
			required: false,
		},
		{
			key: "ND_LOGLEVEL",
			defaultValue: "info",
			secret: false,
			description: "Log level",
			required: false,
		},
		{
			key: "ND_BASEURL",
			defaultValue: "",
			secret: false,
			description: "Base URL if behind reverse proxy",
			required: false,
		},
	],
	healthcheck: {
		test: "wget -qO- http://localhost:4533/ping || exit 1",
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
			key: "NAVIDROME_HOST",
			defaultValue: "navidrome",
			secret: false,
			description: "Navidrome hostname",
			required: false,
		},
		{
			key: "NAVIDROME_PORT",
			defaultValue: "4533",
			secret: false,
			description: "Navidrome port",
			required: false,
		},
	],

	docsUrl: "https://www.navidrome.org/docs/",
	tags: ["music", "streaming", "subsonic", "spotify-alternative"],
	maturity: "stable",

	requires: [],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 128,
	gpuRequired: false,
};
