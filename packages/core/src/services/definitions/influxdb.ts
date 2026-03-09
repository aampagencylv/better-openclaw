import type { ServiceDefinition } from "../../types.js";

export const influxdbDefinition: ServiceDefinition = {
	id: "influxdb",
	name: "InfluxDB",
	description:
		"Purpose-built time-series database for metrics, events, and real-time analytics with built-in dashboards and alerting.",
	category: "database",
	icon: "📈",

	image: "influxdb",
	imageTag: "2.7-alpine",
	ports: [
		{
			host: 8086,
			container: 8086,
			description: "InfluxDB HTTP API",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "influxdb-data",
			containerPath: "/var/lib/influxdb2",
			description: "Persistent InfluxDB data",
		},
		{
			name: "influxdb-config",
			containerPath: "/etc/influxdb2",
			description: "InfluxDB configuration",
		},
	],
	environment: [
		{
			key: "DOCKER_INFLUXDB_INIT_MODE",
			defaultValue: "setup",
			secret: false,
			description: "Init mode",
			required: true,
		},
		{
			key: "DOCKER_INFLUXDB_INIT_USERNAME",
			defaultValue: "openclaw",
			secret: false,
			description: "Admin username",
			required: true,
		},
		{
			key: "DOCKER_INFLUXDB_INIT_PASSWORD",
			defaultValue: "",
			secret: true,
			description: "Admin password",
			required: true,
		},
		{
			key: "DOCKER_INFLUXDB_INIT_ORG",
			defaultValue: "openclaw",
			secret: false,
			description: "Organization name",
			required: true,
		},
		{
			key: "DOCKER_INFLUXDB_INIT_BUCKET",
			defaultValue: "default",
			secret: false,
			description: "Default bucket",
			required: true,
		},
	],
	healthcheck: {
		test: "influx ping || exit 1",
		interval: "30s",
		timeout: "10s",
		retries: 3,
		startPeriod: "30s",
	},
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [
		{
			key: "INFLUXDB_HOST",
			defaultValue: "influxdb",
			secret: false,
			description: "InfluxDB hostname",
			required: false,
		},
		{
			key: "INFLUXDB_PORT",
			defaultValue: "8086",
			secret: false,
			description: "InfluxDB port",
			required: false,
		},
	],

	docsUrl: "https://docs.influxdata.com/influxdb/v2/",
	tags: ["time-series", "metrics", "iot", "monitoring", "analytics"],
	maturity: "stable",

	requires: [],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 256,
	gpuRequired: false,
};
