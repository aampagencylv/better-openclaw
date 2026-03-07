import type { ServiceDefinition } from "../../types.js";

export const kongDefinition: ServiceDefinition = {
	id: "kong",
	name: "Kong",
	description:
		"High-performance API gateway with plugins for rate limiting, authentication, load balancing, and request transformation.",
	category: "api-gateway",
	icon: "🔌",

	image: "kong/kong-gateway",
	imageTag: "3.9",
	ports: [
		{
			host: 8001,
			container: 8001,
			description: "Kong Admin API",
			exposed: true,
		},
		{
			host: 8443,
			container: 8443,
			description: "Kong proxy HTTPS",
			exposed: true,
		},
		{
			host: 8002,
			container: 8000,
			description: "Kong proxy HTTP",
			exposed: true,
		},
	],
	volumes: [],
	environment: [
		{
			key: "KONG_DATABASE",
			defaultValue: "postgres",
			secret: false,
			description: "Database backend",
			required: true,
		},
		{
			key: "KONG_PG_HOST",
			defaultValue: "postgresql",
			secret: false,
			description: "PostgreSQL host",
			required: true,
		},
		{
			key: "KONG_PG_DATABASE",
			defaultValue: "kong",
			secret: false,
			description: "PostgreSQL database name",
			required: true,
		},
		{
			key: "KONG_PG_USER",
			defaultValue: "kong",
			secret: false,
			description: "PostgreSQL username",
			required: true,
		},
		{
			key: "KONG_PG_PASSWORD",
			defaultValue: "${KONG_DB_PASSWORD}",
			secret: true,
			description: "PostgreSQL password",
			required: true,
		},
		{
			key: "KONG_PROXY_ACCESS_LOG",
			defaultValue: "/dev/stdout",
			secret: false,
			description: "Proxy access log output",
			required: false,
		},
		{
			key: "KONG_ADMIN_ACCESS_LOG",
			defaultValue: "/dev/stdout",
			secret: false,
			description: "Admin access log output",
			required: false,
		},
		{
			key: "KONG_ADMIN_LISTEN",
			defaultValue: "0.0.0.0:8001",
			secret: false,
			description: "Admin API listen address",
			required: true,
		},
	],
	healthcheck: {
		test: "kong health || exit 1",
		interval: "30s",
		timeout: "10s",
		retries: 3,
		startPeriod: "30s",
	},
	dependsOn: ["postgresql"],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://docs.konghq.com/gateway/latest/install/docker/",
	tags: ["api", "gateway", "rate-limiting", "auth", "load-balancing", "proxy"],
	maturity: "stable",

	requires: ["postgresql"],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 256,
	gpuRequired: false,
};
