import type { ServiceDefinition } from "../../types.js";

export const jitsiMeetDefinition: ServiceDefinition = {
	id: "jitsi-meet",
	name: "Jitsi Meet",
	description:
		"Open-source video conferencing platform with screen sharing, chat, and recording for secure self-hosted meetings.",
	category: "communication",
	icon: "📹",

	image: "jitsi/web",
	imageTag: "stable-9823",
	ports: [
		{
			host: 8443,
			container: 443,
			description: "Jitsi Meet HTTPS UI",
			exposed: true,
		},
		{
			host: 8280,
			container: 80,
			description: "Jitsi Meet HTTP UI",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "jitsi-config",
			containerPath: "/config",
			description: "Jitsi Meet configuration files",
		},
		{
			name: "jitsi-transcripts",
			containerPath: "/usr/share/jitsi-meet/transcripts",
			description: "Jitsi Meet meeting transcripts",
		},
	],
	environment: [
		{
			key: "PUBLIC_URL",
			defaultValue: "http://localhost:8280",
			secret: false,
			description: "Public URL for Jitsi Meet",
			required: true,
		},
		{
			key: "TZ",
			defaultValue: "UTC",
			secret: false,
			description: "Timezone for the Jitsi Meet server",
			required: false,
		},
		{
			key: "ENABLE_AUTH",
			defaultValue: "0",
			secret: false,
			description: "Enable authentication for Jitsi Meet",
			required: false,
		},
		{
			key: "ENABLE_GUESTS",
			defaultValue: "1",
			secret: false,
			description: "Allow guest access without authentication",
			required: false,
		},
	],
	healthcheck: {
		test: "curl -sf http://localhost:80 || exit 1",
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
			key: "JITSI_HOST",
			defaultValue: "jitsi-meet",
			description: "Jitsi Meet service hostname",
			secret: false,
			required: false,
		},
		{
			key: "JITSI_PORT",
			defaultValue: "80",
			description: "Jitsi Meet service port",
			secret: false,
			required: false,
		},
	],

	docsUrl: "https://jitsi.github.io/handbook/docs/devops-guide/devops-guide-docker",
	tags: ["video-conferencing", "meetings", "webrtc", "zoom-alternative"],
	maturity: "stable",

	requires: [],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 512,
	gpuRequired: false,
};
