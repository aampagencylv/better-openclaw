import type { ServiceDefinition } from "../../types.js";

export const pocketIdDefinition: ServiceDefinition = {
	id: "pocket-id",
	name: "Pocket ID",
	description:
		"Simple, clean OIDC provider with passkey-first authentication. Self-hosted alternative to Auth0/Okta for adding SSO to your services.",
	category: "security",
	icon: "🪪",

	image: "ghcr.io/pocket-id/pocket-id",
	imageTag: "latest",
	ports: [
		{
			host: 3055,
			container: 1411,
			description: "Pocket ID web interface and OIDC endpoints",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "pocket-id-data",
			containerPath: "/app/data",
			description: "Pocket ID persistent data (SQLite DB, config, keys)",
		},
	],
	environment: [
		{
			key: "APP_URL",
			defaultValue: "${POCKET_ID_APP_URL}",
			secret: false,
			description: "Public URL where Pocket ID is accessible (must be HTTPS in production)",
			required: true,
		},
		{
			key: "ENCRYPTION_KEY",
			defaultValue: "${POCKET_ID_ENCRYPTION_KEY}",
			secret: true,
			description: "32-character encryption key for securing tokens and sessions",
			required: true,
		},
		{
			key: "TRUST_PROXY",
			defaultValue: "true",
			secret: false,
			description: "Trust reverse proxy headers (required when behind Caddy/Traefik)",
			required: true,
		},
		{
			key: "PUID",
			defaultValue: "1000",
			secret: false,
			description: "User ID for file permissions",
			required: false,
		},
		{
			key: "PGID",
			defaultValue: "1000",
			secret: false,
			description: "Group ID for file permissions",
			required: false,
		},
	],
	healthcheck: {
		test: "wget -qO- http://localhost:1411/health || exit 1",
		interval: "30s",
		timeout: "10s",
		retries: 3,
		startPeriod: "15s",
	},
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [{ skillId: "pocket-id-auth", autoInstall: true }],
	openclawEnvVars: [
		{
			key: "POCKET_ID_URL",
			defaultValue: "http://pocket-id:1411",
			secret: false,
			description: "Internal URL for Pocket ID OIDC provider",
			required: false,
		},
	],

	docsUrl: "https://pocket-id.org",
	selfHostedDocsUrl: "https://pocket-id.org/docs/setup/installation",
	tags: ["auth", "oidc", "passkey", "sso", "webauthn", "identity-provider", "openid-connect"],
	maturity: "stable",

	requires: [],
	recommends: ["caddy", "postgresql"],
	conflictsWith: [],

	minMemoryMB: 128,
	gpuRequired: false,
};
