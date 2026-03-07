import type { ServiceDefinition } from "../../types.js";

export const opensearchDefinition: ServiceDefinition = {
	id: "opensearch",
	name: "OpenSearch",
	description:
		"Distributed search and analytics engine for full-text search, log indexing, vector retrieval, and large-scale data exploration.",
	category: "search",
	icon: "🔍",

	image: "opensearchproject/opensearch",
	imageTag: "2.19.1",
	ports: [
		{
			host: 9200,
			container: 9200,
			description: "OpenSearch HTTP API",
			exposed: true,
		},
		{
			host: 9600,
			container: 9600,
			description: "OpenSearch performance analyzer",
			exposed: false,
		},
	],
	volumes: [
		{
			name: "opensearch-data",
			containerPath: "/usr/share/opensearch/data",
			description: "Persistent OpenSearch index data",
		},
	],
	environment: [
		{
			key: "discovery.type",
			defaultValue: "single-node",
			secret: false,
			description: "Run OpenSearch in single-node mode",
			required: true,
		},
		{
			key: "OPENSEARCH_INITIAL_ADMIN_PASSWORD",
			defaultValue: "",
			secret: true,
			description: "Initial admin password for OpenSearch",
			required: true,
		},
		{
			key: "OPENSEARCH_JAVA_OPTS",
			defaultValue: "-Xms512m -Xmx512m",
			secret: false,
			description: "JVM heap settings for OpenSearch",
			required: true,
		},
		{
			key: "DISABLE_INSTALL_DEMO_CONFIG",
			defaultValue: "true",
			secret: false,
			description: "Disable demo configuration",
			required: true,
		},
		{
			key: "DISABLE_SECURITY_PLUGIN",
			defaultValue: "false",
			secret: false,
			description: "Whether to disable the built-in security plugin",
			required: true,
		},
	],
	healthcheck: {
		test: "curl -sf http://localhost:9200/_cluster/health || exit 1",
		interval: "20s",
		timeout: "10s",
		retries: 10,
		startPeriod: "60s",
	},
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://opensearch.org/docs/latest/install-and-configure/install-opensearch/docker/",
	tags: ["search", "analytics", "logs", "full-text", "vector-search"],
	maturity: "stable",

	requires: [],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 1024,
	gpuRequired: false,
};
