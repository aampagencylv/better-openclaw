import type { ServiceDefinition } from "../../types.js";

export const supersetDefinition: ServiceDefinition = {
	id: "superset",
	name: "Apache Superset",
	description:
		"Modern data exploration and visualization platform. Create interactive dashboards, run SQL queries, and explore data from any database.",
	category: "business-intelligence",
	icon: "📈",

	image: "apache/superset",
	imageTag: "4.1.1",
	ports: [
		{
			host: 8088,
			container: 8088,
			description: "Superset web UI",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "superset-data",
			containerPath: "/app/superset_home",
			description: "Persistent Superset application data and configurations",
		},
	],
	environment: [
		{
			key: "SUPERSET_SECRET_KEY",
			defaultValue: "${SUPERSET_SECRET_KEY}",
			secret: true,
			description: "Secret key for Superset session encryption and CSRF protection",
			required: true,
		},
		{
			key: "SQLALCHEMY_DATABASE_URI",
			defaultValue:
				"postgresql+psycopg2://superset:${SUPERSET_DB_PASSWORD}@postgresql:5432/superset",
			secret: true,
			description: "SQLAlchemy connection URI for the Superset metadata database",
			required: true,
		},
	],
	healthcheck: {
		test: "curl -sf http://localhost:8088/health || exit 1",
		interval: "30s",
		timeout: "10s",
		retries: 3,
		startPeriod: "30s",
	},
	dependsOn: ["postgresql", "redis"],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [
		{
			key: "SUPERSET_HOST",
			defaultValue: "superset",
			secret: false,
			description: "Superset hostname",
			required: false,
		},
		{
			key: "SUPERSET_PORT",
			defaultValue: "8088",
			secret: false,
			description: "Superset internal port",
			required: false,
		},
	],

	docsUrl: "https://superset.apache.org/docs/intro",
	tags: ["visualization", "dashboards", "sql", "analytics", "charts"],
	maturity: "stable",

	requires: ["postgresql", "redis"],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 1024,
	gpuRequired: false,
};
