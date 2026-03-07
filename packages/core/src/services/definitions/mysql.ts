import type { ServiceDefinition } from "../../types.js";

export const mysqlDefinition: ServiceDefinition = {
	id: "mysql",
	name: "MySQL",
	description:
		"Popular open-source relational database engine used by many web applications and self-hosted platforms.",
	category: "database",
	icon: "🐬",

	image: "mysql",
	imageTag: "8.4",
	ports: [
		{
			host: 3306,
			container: 3306,
			description: "MySQL server port",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "mysql-data",
			containerPath: "/var/lib/mysql",
			description: "Persistent MySQL data",
		},
	],
	environment: [
		{
			key: "MYSQL_ROOT_PASSWORD",
			defaultValue: "",
			secret: true,
			description: "MySQL root password",
			required: true,
		},
		{
			key: "MYSQL_DATABASE",
			defaultValue: "openclaw",
			secret: false,
			description: "Default database created on first run",
			required: true,
		},
		{
			key: "MYSQL_USER",
			defaultValue: "openclaw",
			secret: false,
			description: "Default MySQL user created on first run",
			required: true,
		},
		{
			key: "MYSQL_PASSWORD",
			defaultValue: "",
			secret: true,
			description: "Password for the default MySQL user",
			required: true,
		},
	],
	healthcheck: {
		test: "mysqladmin ping -h 127.0.0.1 -u root -p$MYSQL_ROOT_PASSWORD || exit 1",
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

	docsUrl: "https://dev.mysql.com/doc/refman/8.4/en/docker-mysql-more-topics.html",
	tags: ["sql", "relational", "database", "web-apps"],
	maturity: "stable",

	requires: [],
	recommends: [],
	conflictsWith: ["mariadb"],

	minMemoryMB: 256,
	gpuRequired: false,
};
