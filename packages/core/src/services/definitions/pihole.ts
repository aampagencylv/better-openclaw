import type { ServiceDefinition } from "../../types.js";

export const piholeDefinition: ServiceDefinition = {
	id: "pihole",
	name: "Pi-hole",
	description:
		"Network-level ad blocker acting as a DNS sinkhole to block ads and trackers for all devices on the network.",
	category: "dns-networking",
	icon: "🕳️",

	image: "pihole/pihole",
	imageTag: "latest",
	ports: [
		{
			host: 8053,
			container: 80,
			description: "Pi-hole web admin",
			exposed: true,
		},
		{
			host: 53,
			container: 53,
			description: "DNS server",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "pihole-etc",
			containerPath: "/etc/pihole",
			description: "Pi-hole configuration",
		},
		{
			name: "pihole-dnsmasq",
			containerPath: "/etc/dnsmasq.d",
			description: "DNS configuration",
		},
	],
	environment: [
		{
			key: "WEBPASSWORD",
			defaultValue: "",
			secret: true,
			description: "Pi-hole web admin password",
			required: true,
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
		test: "curl -sf http://localhost:80/admin/ || exit 1",
		interval: "30s",
		timeout: "10s",
		retries: 3,
		startPeriod: "30s",
	},
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://docs.pi-hole.net/",
	tags: ["dns", "ad-blocking", "privacy", "sinkhole"],
	maturity: "stable",

	requires: [],
	recommends: [],
	conflictsWith: ["adguard-home"],

	minMemoryMB: 128,
	gpuRequired: false,
};
