import type { ServiceDefinition } from "../../types.js";

export const graylogDefinition: ServiceDefinition = {
	id: "graylog",
	name: "Graylog",
	description:
		"Centralized log management platform with powerful search, dashboards, alerting, and GELF/Syslog ingestion.",
	category: "monitoring",
	icon: "📝",

	image: "graylog/graylog",
	imageTag: "6.1",
	ports: [
		{
			host: 9600,
			container: 9000,
			description: "Graylog web UI",
			exposed: true,
		},
		{
			host: 12201,
			container: 12201,
			description: "GELF UDP input",
			exposed: true,
		},
		{
			host: 1514,
			container: 1514,
			description: "Syslog TCP input",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "graylog-data",
			containerPath: "/usr/share/graylog/data",
			description: "Graylog persistent data",
		},
	],
	environment: [
		{
			key: "GRAYLOG_PASSWORD_SECRET",
			defaultValue: "",
			secret: true,
			description: "Secret for password encryption (min 16 chars)",
			required: true,
		},
		{
			key: "GRAYLOG_ROOT_PASSWORD_SHA2",
			defaultValue: "",
			secret: true,
			description: "SHA256 hash of root password",
			required: true,
		},
		{
			key: "GRAYLOG_HTTP_EXTERNAL_URI",
			defaultValue: "http://localhost:9600/",
			secret: false,
			description: "External URI for the web interface",
			required: true,
		},
		{
			key: "GRAYLOG_ELASTICSEARCH_HOSTS",
			defaultValue: "http://opensearch:9200",
			secret: false,
			description: "Elasticsearch/OpenSearch connection",
			required: true,
		},
		{
			key: "GRAYLOG_MONGODB_URI",
			defaultValue: "mongodb://mongodb:27017/graylog",
			secret: false,
			description: "MongoDB connection URI",
			required: true,
		},
	],
	healthcheck: {
		test: "curl -sf http://localhost:9000/api/system/lbstatus || exit 1",
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

	docsUrl: "https://go2docs.graylog.org/",
	tags: ["log-management", "syslog", "gelf", "centralized-logging", "search"],
	maturity: "stable",

	requires: ["opensearch"],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 1024,
	gpuRequired: false,
};
