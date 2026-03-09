import type { ServiceDefinition } from "../../types.js";

export const wireguardDefinition: ServiceDefinition = {
	id: "wireguard",
	name: "WireGuard",
	description:
		"Modern, high-performance VPN tunnel with simple configuration, strong encryption, and minimal attack surface.",
	category: "dns-networking",
	icon: "🔐",

	image: "linuxserver/wireguard",
	imageTag: "latest",
	ports: [
		{
			host: 51820,
			container: 51820,
			description: "WireGuard VPN",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "wireguard-config",
			containerPath: "/config",
			description: "WireGuard configuration and keys",
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
		{
			key: "SERVERURL",
			defaultValue: "auto",
			secret: false,
			description: "Server URL or auto-detect",
			required: true,
		},
		{
			key: "PEERS",
			defaultValue: "3",
			secret: false,
			description: "Number of VPN peers to generate",
			required: false,
		},
	],
	healthcheck: {
		test: "wg show || exit 1",
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

	docsUrl: "https://www.wireguard.com/quickstart/",
	tags: ["vpn", "tunnel", "encryption", "networking"],
	maturity: "stable",

	requires: [],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 64,
	gpuRequired: false,
};
