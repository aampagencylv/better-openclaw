import type { ServiceDefinition } from "../../types.js";

export const nginxProxyManagerDefinition: ServiceDefinition = {
	id: "nginx-proxy-manager",
	name: "Nginx Proxy Manager",
	description:
		"Beautiful web UI for managing Nginx reverse proxy hosts with free SSL certificates and access control.",
	category: "proxy",
	icon: "🔀",

	image: "jc21/nginx-proxy-manager",
	imageTag: "latest",
	ports: [
		{
			host: 8181,
			container: 81,
			description: "Admin web UI",
			exposed: true,
		},
		{
			host: 80,
			container: 80,
			description: "HTTP traffic",
			exposed: true,
		},
		{
			host: 443,
			container: 443,
			description: "HTTPS traffic",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "npm-data",
			containerPath: "/data",
			description: "Nginx Proxy Manager data",
		},
		{
			name: "npm-letsencrypt",
			containerPath: "/etc/letsencrypt",
			description: "SSL certificates",
		},
	],
	environment: [],
	healthcheck: {
		test: "curl -sf http://localhost:81 || exit 1",
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

	docsUrl: "https://nginxproxymanager.com/guide/",
	tags: ["reverse-proxy", "nginx", "ssl", "gui", "web-ui"],
	maturity: "stable",

	requires: [],
	recommends: [],
	conflictsWith: ["caddy", "traefik"],

	minMemoryMB: 128,
	gpuRequired: false,
};
