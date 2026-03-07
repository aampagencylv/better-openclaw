import type { ServiceDefinition } from "../../types.js";

export const airflowDefinition: ServiceDefinition = {
	id: "airflow",
	name: "Apache Airflow",
	description:
		"Industry-standard DAG-based workflow orchestration platform for scheduling, monitoring, and managing data pipelines and ETL jobs.",
	category: "automation",
	icon: "🌬️",

	image: "apache/airflow",
	imageTag: "2.10.4",
	ports: [
		{
			host: 8080,
			container: 8080,
			description: "Airflow web UI",
			exposed: true,
		},
	],
	volumes: [
		{
			name: "airflow-dags",
			containerPath: "/opt/airflow/dags",
			description: "Airflow DAG definitions",
		},
		{
			name: "airflow-logs",
			containerPath: "/opt/airflow/logs",
			description: "Airflow task logs",
		},
	],
	environment: [
		{
			key: "AIRFLOW__CORE__EXECUTOR",
			defaultValue: "LocalExecutor",
			secret: false,
			description: "Airflow executor type",
			required: true,
		},
		{
			key: "AIRFLOW__DATABASE__SQL_ALCHEMY_CONN",
			defaultValue: "postgresql+psycopg2://airflow:${AIRFLOW_DB_PASSWORD}@postgresql:5432/airflow",
			secret: true,
			description: "Database connection string",
			required: true,
		},
		{
			key: "AIRFLOW__CORE__FERNET_KEY",
			defaultValue: "${AIRFLOW_FERNET_KEY}",
			secret: true,
			description: "Fernet encryption key for connections",
			required: true,
		},
		{
			key: "AIRFLOW__WEBSERVER__SECRET_KEY",
			defaultValue: "${AIRFLOW_SECRET_KEY}",
			secret: true,
			description: "Secret key for webserver sessions",
			required: true,
		},
		{
			key: "_AIRFLOW_WWW_USER_CREATE",
			defaultValue: "true",
			secret: false,
			description: "Create default admin user on startup",
			required: false,
		},
		{
			key: "_AIRFLOW_WWW_USER_USERNAME",
			defaultValue: "admin",
			secret: false,
			description: "Default admin username",
			required: false,
		},
		{
			key: "_AIRFLOW_WWW_USER_PASSWORD",
			defaultValue: "${AIRFLOW_ADMIN_PASSWORD}",
			secret: true,
			description: "Default admin password",
			required: false,
		},
	],
	command: "standalone",
	healthcheck: {
		test: "curl -sf http://localhost:8080/health || exit 1",
		interval: "30s",
		timeout: "10s",
		retries: 5,
		startPeriod: "60s",
	},
	dependsOn: ["postgresql"],
	restartPolicy: "unless-stopped",
	networks: ["openclaw-network"],

	skills: [],
	openclawEnvVars: [],

	docsUrl: "https://airflow.apache.org/docs/",
	tags: ["etl", "dag", "pipeline", "orchestration", "scheduling", "data"],
	maturity: "stable",

	requires: ["postgresql"],
	recommends: ["redis"],
	conflictsWith: [],

	minMemoryMB: 1024,
	gpuRequired: false,
};
