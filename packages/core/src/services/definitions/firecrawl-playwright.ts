import type { ServiceDefinition } from "../../types.js";

export const firecrawlPlaywrightDefinition: ServiceDefinition = {
	id: "firecrawl-playwright",
	name: "Firecrawl (Playwright Service)",
	description:
		"Browser execution companion for Firecrawl. Handles page rendering and scraping workloads for the main Firecrawl API service.",
	category: "browser",
	icon: "🎭",

	image: "ghcr.io/firecrawl/playwright-service",
	imageTag: "latest",
	ports: [
		{
			host: 3300,
			container: 3000,
			description: "Firecrawl Playwright microservice",
			exposed: false,
		},
	],
	volumes: [],
	environment: [
		{
			key: "PORT",
			defaultValue: "3000",
			secret: false,
			description: "Playwright service port",
			required: true,
		},
		{
			key: "MAX_CONCURRENT_PAGES",
			defaultValue: "5",
			secret: false,
			description: "Maximum concurrently rendered browser pages",
			required: true,
		},
	],
	healthcheck: {
		test: "curl -sf http://localhost:3000/ || exit 1",
		interval: "30s",
		timeout: "10s",
		retries: 5,
		startPeriod: "20s",
	},
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://docs.firecrawl.dev/contributing/self-host",
	tags: ["browser", "playwright", "rendering", "scraping", "firecrawl"],
	maturity: "beta",

	requires: [],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 1024,
	gpuRequired: false,
};
