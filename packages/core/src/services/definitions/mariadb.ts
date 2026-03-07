import type { ServiceDefinition } from "../../types.js";

export const mariadbDefinition: ServiceDefinition = {
	id: "mariadb",
	name: "MariaDB",
	description:
		"Community-developed relational database compatible with MySQL. Common backing store for self-hosted apps and control-plane services.",
	category: "database",
	icon: "🦭",

	image: "mariadb",
	imageTag: "11.8",
	ports: [
		{
			host: 3307,
			container: 3306,
			description: "MariaDB server port",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "mariadb-data",
			containerPath: "/var/lib/mysql",
			description: "Persistent MariaDB data",
		},
	],
	environment: [
		{
			key: "MARIADB_ROOT_PASSWORD",
			defaultValue: "",
			secret: true,
			description: "MariaDB root password",
			required: true,
		},
		{
			key: "MARIADB_DATABASE",
			defaultValue: "openclaw",
			secret: false,
			description: "Default database created on first run",
			required: true,
		},
		{
			key: "MARIADB_USER",
			defaultValue: "openclaw",
			secret: false,
			description: "Default MariaDB user created on first run",
			required: true,
		},
		{
			key: "MARIADB_PASSWORD",
			defaultValue: "",
			secret: true,
			description: "Password for the default MariaDB user",
			required: true,
		},
	],
	healthcheck: {
		test: "mariadb-admin ping -h 127.0.0.1 -u root -p$MARIADB_ROOT_PASSWORD || exit 1",
		interval: "15s",
		timeout: "5s",
		retries: 5,
		startPeriod: "30s",
	},
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://mariadb.com/kb/en/docker-official-image-frequently-asked-questions/",
	tags: ["sql", "mysql-compatible", "relational", "database"],
	maturity: "stable",

	requires: [],
	recommends: [],
	conflictsWith: ["mysql"],

	minMemoryMB: 256,
	gpuRequired: false,
};
