import type { ServiceDefinition } from "../../types.js";

export const keycloakDefinition: ServiceDefinition = {
	id: "keycloak",
	name: "Keycloak",
	description:
		"Enterprise identity and access management platform with SSO, OIDC, SAML, and user federation for internal platforms and customer-facing apps.",
	category: "security",
	icon: "🗝️",

	image: "quay.io/keycloak/keycloak",
	imageTag: "26.2",
	ports: [
		{
			host: 8112,
			container: 8080,
			description: "Keycloak HTTP interface",
			exposed: true,
		},
	],
	volumes: [],
	environment: [
		{
			key: "KC_DB",
			defaultValue: "postgres",
			secret: false,
			description: "Database vendor",
			required: true,
		},
		{
			key: "KC_DB_URL_HOST",
			defaultValue: "postgresql",
			secret: false,
			description: "PostgreSQL host",
			required: true,
		},
		{
			key: "KC_DB_URL_DATABASE",
			defaultValue: "keycloak",
			secret: false,
			description: "PostgreSQL database name",
			required: true,
		},
		{
			key: "KC_DB_USERNAME",
			defaultValue: "keycloak",
			secret: false,
			description: "PostgreSQL user",
			required: true,
		},
		{
			key: "KC_DB_PASSWORD",
			defaultValue: "${KEYCLOAK_DB_PASSWORD}",
			secret: true,
			description: "PostgreSQL password",
			required: true,
		},
		{
			key: "KEYCLOAK_ADMIN",
			defaultValue: "admin",
			secret: false,
			description: "Initial Keycloak admin username",
			required: true,
		},
		{
			key: "KEYCLOAK_ADMIN_PASSWORD",
			defaultValue: "${KEYCLOAK_ADMIN_PASSWORD}",
			secret: true,
			description: "Initial Keycloak admin password",
			required: true,
		},
		{
			key: "KC_HEALTH_ENABLED",
			defaultValue: "true",
			secret: false,
			description: "Enable health endpoints",
			required: true,
		},
		{
			key: "KC_HTTP_ENABLED",
			defaultValue: "true",
			secret: false,
			description: "Enable HTTP listener",
			required: true,
		},
		{
			key: "KC_PROXY_HEADERS",
			defaultValue: "xforwarded",
			secret: false,
			description: "Trust reverse proxy forwarding headers",
			required: true,
		},
	],
	healthcheck: {
		test: "curl -sf http://localhost:8080/health/ready || exit 1",
		interval: "30s",
		timeout: "10s",
		retries: 10,
		startPeriod: "60s",
	},
	command: "start-dev --http-port=8080",
	dependsOn: ["postgresql"],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://www.keycloak.org/server/containers",
	tags: ["identity", "iam", "sso", "oidc", "saml", "oauth2"],
	maturity: "stable",

	requires: ["postgresql"],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 1024,
	gpuRequired: false,
};
