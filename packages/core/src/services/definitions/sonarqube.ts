import type { ServiceDefinition } from "../../types.js";

export const sonarqubeDefinition: ServiceDefinition = {
	id: "sonarqube",
	name: "SonarQube",
	description:
		"Continuous code quality and security analysis platform detecting bugs, vulnerabilities, and code smells across 30+ languages.",
	category: "dev-tools",
	icon: "🔍",

	image: "sonarqube",
	imageTag: "community",
	ports: [
		{
			host: 9100,
			container: 9000,
			description: "SonarQube web UI",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "sonarqube-data",
			containerPath: "/opt/sonarqube/data",
			description: "SonarQube data",
		},
		{
			name: "sonarqube-extensions",
			containerPath: "/opt/sonarqube/extensions",
			description: "SonarQube plugins",
		},
		{
			name: "sonarqube-logs",
			containerPath: "/opt/sonarqube/logs",
			description: "SonarQube logs",
		},
	],
	environment: [
		{
			key: "SONAR_JDBC_URL",
			defaultValue: "jdbc:postgresql://postgresql:5432/sonarqube",
			secret: false,
			description: "JDBC connection URL",
			required: true,
		},
		{
			key: "SONAR_JDBC_USERNAME",
			defaultValue: "sonarqube",
			secret: false,
			description: "Database username",
			required: true,
		},
		{
			key: "SONAR_JDBC_PASSWORD",
			defaultValue: "${SONARQUBE_DB_PASSWORD}",
			secret: true,
			description: "Database password",
			required: true,
		},
	],
	healthcheck: {
		test: "curl -sf http://localhost:9000/api/system/status | grep -q UP || exit 1",
		interval: "30s",
		timeout: "10s",
		retries: 5,
		startPeriod: "120s",
	},
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://docs.sonarsource.com/sonarqube/",
	tags: ["code-quality", "static-analysis", "security", "linting"],
	maturity: "stable",

	requires: ["postgresql"],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 2048,
	gpuRequired: false,
};
