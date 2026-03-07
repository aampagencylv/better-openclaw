import type { ServiceDefinition } from "../../types.js";

export const rabbitmqDefinition: ServiceDefinition = {
	id: "rabbitmq",
	name: "RabbitMQ",
	description:
		"Message broker and event backbone for asynchronous workflows, background jobs, queue-based integrations, and agent task orchestration.",
	category: "communication",
	icon: "🐇",

	image: "rabbitmq",
	imageTag: "4.0-management",
	ports: [
		{
			host: 5672,
			container: 5672,
			description: "RabbitMQ AMQP port",
			exposed: true,
		},
		{
			host: 15672,
			container: 15672,
			description: "RabbitMQ management UI",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "rabbitmq-data",
			containerPath: "/var/lib/rabbitmq",
			description: "Persistent RabbitMQ queues and broker state",
		},
	],
	environment: [
		{
			key: "RABBITMQ_DEFAULT_USER",
			defaultValue: "openclaw",
			secret: false,
			description: "Default RabbitMQ username",
			required: true,
		},
		{
			key: "RABBITMQ_DEFAULT_PASS",
			defaultValue: "${RABBITMQ_PASSWORD}",
			secret: true,
			description: "Default RabbitMQ password",
			required: true,
		},
		{
			key: "RABBITMQ_DEFAULT_VHOST",
			defaultValue: "/",
			secret: false,
			description: "Default RabbitMQ virtual host",
			required: true,
		},
	],
	healthcheck: {
		test: "rabbitmq-diagnostics -q ping || exit 1",
		interval: "20s",
		timeout: "10s",
		retries: 5,
		startPeriod: "30s",
	},
	dependsOn: [],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://www.rabbitmq.com/docs/download",
	tags: ["queue", "message-broker", "pubsub", "events", "async"],
	maturity: "stable",

	requires: [],
	recommends: [],
	conflictsWith: [],

	minMemoryMB: 256,
	gpuRequired: false,
};
