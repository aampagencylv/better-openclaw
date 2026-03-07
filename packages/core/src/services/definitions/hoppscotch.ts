import type { ServiceDefinition } from "../../types.js";

export const hoppscotchDefinition: ServiceDefinition = {
	id: "hoppscotch",
	name: "Hoppscotch",
	description:
		"Open-source API development and testing platform with REST, GraphQL, WebSocket support — a self-hosted Postman alternative.",
	category: "dev-tools",
	icon: "🦅",

	image: "hoppscotch/hoppscotch",
	imageTag: "latest",
	ports: [
		{
			host: 3040,
			container: 3000,
			description: "Hoppscotch web UI",
			exposed: true,
		},
		{
			host: 3170,
			container: 3170,
			description: "Hoppscotch admin UI",
			exposed: true,
		},
	],
	volumes: [],
	environment: [
		{
			key: "DATABASE_URL",
			defaultValue: "postgresql://hoppscotch:${HOPPSCOTCH_DB_PASSWORD}@postgresql:5432/hoppscotch",
			secret: true,
			description: "PostgreSQL connection URL",
			required: true,
		},
		{
			key: "JWT_SECRET",
			defaultValue: "${HOPPSCOTCH_JWT_SECRET}",
			secret: true,
			description: "JWT signing secret",
			required: true,
		},
		{
			key: "SESSION_SECRET",
			defaultValue: "${HOPPSCOTCH_SESSION_SECRET}",
			secret: true,
			description: "Session encryption secret",
			required: true,
		},
	],
	healthcheck: {
		test: "curl -sf http://localhost:3000/ || exit 1",
		interval: "30s",
		timeout: "10s",
		retries: 3,
	},
	dependsOn: ["postgresql"],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://docs.hoppscotch.io/documentation/self-host/community-edition/install-and-build",
	tags: ["api", "testing", "rest", "graphql", "websocket", "postman"],
	maturity: "stable",

	requires: ["postgresql"],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 256,
	gpuRequired: false,
};
