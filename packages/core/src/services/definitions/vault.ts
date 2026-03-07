import type { ServiceDefinition } from "../../types.js";

export const vaultDefinition: ServiceDefinition = {
	id: "vault",
	name: "HashiCorp Vault",
	description:
		"Industry-standard secrets management with dynamic credentials, encryption-as-a-service, audit logging, and access control policies.",
	category: "security",
	icon: "🔐",

	image: "hashicorp/vault",
	imageTag: "1.18",
	ports: [
		{
			host: 8200,
			container: 8200,
			description: "Vault API and web UI",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "vault-data",
			containerPath: "/vault/data",
			description: "Vault data and audit logs",
		},
		{
			name: "vault-config",
			containerPath: "/vault/config",
			description: "Vault server configuration",
		},
	],
	environment: [
		{
			key: "VAULT_ADDR",
			defaultValue: "http://0.0.0.0:8200",
			secret: false,
			description: "Vault listener address",
			required: true,
		},
		{
			key: "VAULT_DEV_ROOT_TOKEN_ID",
			defaultValue: "${VAULT_ROOT_TOKEN}",
			secret: true,
			description: "Root token for dev mode",
			required: false,
		},
	],
	command: "server -dev",
	healthcheck: {
		test: "vault status || exit 1",
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

	docsUrl: "https://developer.hashicorp.com/vault/docs",
	tags: ["secrets", "vault", "encryption", "credentials", "access-control", "security"],
	maturity: "stable",

	requires: [],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 256,
	gpuRequired: false,
};
