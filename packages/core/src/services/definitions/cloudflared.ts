import type { ServiceDefinition } from "../../types.js";

export const cloudflaredDefinition: ServiceDefinition = {
	id: "cloudflared",
	name: "Cloudflare Tunnel",
	description:
		"Secure tunnel to expose local services to the internet without port forwarding using Cloudflare's network.",
	category: "dns-networking",
	icon: "☁️",

	image: "cloudflare/cloudflared",
	imageTag: "latest",
	command: "tunnel run",
	ports: [],
	volumes: [
		{
			name: "cloudflared-config",
			containerPath: "/etc/cloudflared",
			description: "Tunnel configuration and credentials",
		},
	],
	environment: [
		{
			key: "TUNNEL_TOKEN",
			defaultValue: "",
			secret: true,
			description: "Cloudflare Tunnel token from dashboard",
			required: true,
		},
	],
	healthcheck: {
		test: "cloudflared tunnel info || exit 1",
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

	docsUrl: "https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/",
	tags: ["tunnel", "cloudflare", "zero-trust", "ingress", "no-port-forward"],
	maturity: "stable",

	requires: [],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 64,
	gpuRequired: false,
};
