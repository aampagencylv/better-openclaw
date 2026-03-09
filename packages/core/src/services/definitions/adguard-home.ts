import type { ServiceDefinition } from "../../types.js";

export const adguardHomeDefinition: ServiceDefinition = {
	id: "adguard-home",
	name: "AdGuard Home",
	description:
		"Network-wide ad and tracker blocking DNS server with parental controls, DHCP, and encrypted DNS support.",
	category: "dns-networking",
	icon: "🛡️",

	image: "adguard/adguardhome",
	imageTag: "latest",
	ports: [
		{
			host: 3100,
			container: 3000,
			description: "AdGuard web UI",
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
			name: "adguard-work",
			containerPath: "/opt/adguardhome/work",
			description: "AdGuard working data",
		},
		{
			name: "adguard-conf",
			containerPath: "/opt/adguardhome/conf",
			description: "AdGuard configuration",
		},
	],
	environment: [],
	healthcheck: {
		test: "wget -qO- http://localhost:3000 || exit 1",
		interval: "30s",
		timeout: "10s",
		retries: 3,
		startPeriod: "10s",
	},
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [
		{
			key: "ADGUARD_HOST",
			defaultValue: "adguard-home",
			secret: false,
			description: "AdGuard Home hostname",
			required: false,
		},
		{
			key: "ADGUARD_PORT",
			defaultValue: "3000",
			secret: false,
			description: "AdGuard Home web port",
			required: false,
		},
	],

	docsUrl: "https://adguard.com/en/adguard-home/overview.html",
	tags: ["dns", "ad-blocking", "privacy", "dhcp", "pihole-alternative"],
	maturity: "stable",

	requires: [],
	recommends: [],
	conflictsWith: ["pihole"],

	minMemoryMB: 128,
	gpuRequired: false,
};
