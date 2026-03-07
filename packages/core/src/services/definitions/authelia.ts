import type { ServiceDefinition } from "../../types.js";

export const autheliaDefinition: ServiceDefinition = {
	id: "authelia",
	name: "Authelia",
	description:
		"Authentication and authorization server for protecting self-hosted apps with SSO, MFA, and access policies behind your reverse proxy.",
	category: "security",
	icon: "🔒",

	image: "authelia/authelia",
	imageTag: "latest",
	ports: [
		{
			host: 9091,
			container: 9091,
			description: "Authelia web portal and API",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "authelia-config",
			containerPath: "/config",
			description: "Authelia configuration, sqlite storage, and notifier output",
		},
	],
	environment: [
		{
			key: "TZ",
			defaultValue: "UTC",
			secret: false,
			description: "Container timezone",
			required: true,
		},
		{
			key: "AUTHELIA_DOMAIN",
			defaultValue: "localhost",
			secret: false,
			description: "Default protected domain for Authelia session cookies",
			required: true,
		},
		{
			key: "AUTHELIA_JWT_SECRET",
			defaultValue: "${AUTHELIA_JWT_SECRET}",
			secret: true,
			description: "JWT secret used for identity validation flows",
			required: true,
		},
		{
			key: "AUTHELIA_SESSION_SECRET",
			defaultValue: "${AUTHELIA_SESSION_SECRET}",
			secret: true,
			description: "Session secret for cookie encryption",
			required: true,
		},
		{
			key: "AUTHELIA_STORAGE_ENCRYPTION_KEY",
			defaultValue: "${AUTHELIA_STORAGE_ENCRYPTION_KEY}",
			secret: true,
			description: "Encryption key for the local Authelia sqlite storage",
			required: true,
		},
		{
			key: "AUTHELIA_DEFAULT_USER_PASSWORD_HASH",
			defaultValue:
				"$6$rounds=50000$BpLnfgDsc2WD8F2q$Zis.ixdg9s/UOJYrs56b5QEZFiZECu0qZVNsIYxBaNJ7ucIL.nlxVCT5tqh8KHG8X4tlwCFm5r6NTOZZ5qRFN/",
			secret: false,
			description:
				"Password hash for the generated default admin user. Replace with a value from `authelia crypto hash generate argon2` before production use.",
			required: true,
		},
	],
	command: `/bin/sh -c "mkdir -p /config && cat >/config/users_database.yml <<EOF
users:
  admin:
    disabled: false
    displayname: 'Admin'
    password: '\${AUTHELIA_DEFAULT_USER_PASSWORD_HASH}'
    email: 'admin@localhost'
    groups:
      - admins
EOF
cat >/config/configuration.yml <<EOF
server:
  address: 'tcp://0.0.0.0:9091'
log:
  level: 'info'
theme: 'dark'
jwt_secret: '\${AUTHELIA_JWT_SECRET}'
default_redirection_url: 'http://localhost'
totp:
  issuer: 'better-openclaw'
authentication_backend:
  file:
    path: '/config/users_database.yml'
access_control:
  default_policy: 'deny'
session:
  secret: '\${AUTHELIA_SESSION_SECRET}'
  cookies:
    - domain: '\${AUTHELIA_DOMAIN}'
      authelia_url: 'http://localhost:9091'
storage:
  encryption_key: '\${AUTHELIA_STORAGE_ENCRYPTION_KEY}'
  local:
    path: '/config/db.sqlite3'
notifier:
  filesystem:
    filename: '/config/notification.txt'
EOF
authelia --config /config/configuration.yml"`,
	healthcheck: {
		test: "curl -sf http://localhost:9091/api/health || exit 1",
		interval: "30s",
		timeout: "10s",
		retries: 5,
		startPeriod: "30s",
	},
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [{ skillId: "authelia-auth", autoInstall: true }],
	openclawEnvVars: [
		{
			key: "AUTHELIA_PORTAL_URL",
			defaultValue: "http://authelia:9091",
			description: "Authelia portal URL for reverse proxy",
			secret: false,
			required: false,
		},
	],

	docsUrl: "https://www.authelia.com/",
	tags: ["auth", "sso", "mfa", "access-control", "reverse-proxy", "security"],
	maturity: "beta",

	requires: [],
	recommends: ["caddy", "traefik"],
	conflictsWith: [],

	minMemoryMB: 256,
	gpuRequired: false,
};
