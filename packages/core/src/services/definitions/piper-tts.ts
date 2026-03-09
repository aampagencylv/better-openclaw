import type { ServiceDefinition } from "../../types.js";

export const piperTtsDefinition: ServiceDefinition = {
	id: "piper-tts",
	name: "Piper TTS",
	description:
		"Fast local neural text-to-speech engine supporting 30+ languages with low-latency voice synthesis.",
	category: "voice",
	icon: "🗣️",

	image: "rhasspy/wyoming-piper",
	imageTag: "latest",
	ports: [
		{
			host: 10200,
			container: 10200,
			description: "Wyoming protocol",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "piper-data",
			containerPath: "/data",
			description: "Piper TTS voice model data",
		},
	],
	environment: [
		{
			key: "PIPER_VOICE",
			defaultValue: "en_US-lessac-medium",
			secret: false,
			description: "Default TTS voice model",
			required: false,
		},
	],
	healthcheck: {
		test: "echo > /dev/tcp/localhost/10200 || exit 1",
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
			key: "PIPER_TTS_HOST",
			defaultValue: "piper-tts",
			secret: false,
			description: "Piper TTS hostname for OpenClaw",
			required: true,
		},
		{
			key: "PIPER_TTS_PORT",
			defaultValue: "10200",
			secret: false,
			description: "Piper TTS port for OpenClaw",
			required: true,
		},
	],

	docsUrl: "https://github.com/rhasspy/piper",
	tags: ["tts", "text-to-speech", "voice-synthesis", "speech"],
	maturity: "stable",

	requires: [],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 512,
	gpuRequired: false,
};
