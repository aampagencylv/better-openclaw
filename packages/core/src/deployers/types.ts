/**
 * Common types for PaaS deployers (Dokploy, Coolify, etc.)
 *
 * This module defines the contract that all PaaS deployment providers must
 * implement. The deployer system is designed to be extensible — adding a new
 * provider only requires implementing the `PaasDeployer` interface and
 * registering it in `deployers/index.ts`.
 *
 * Architecture:
 *   Web UI / CLI  -->  API relay (/v1/deploy)  -->  PaaS instance (Dokploy/Coolify)
 *
 * The API server acts as a relay to avoid CORS issues when deploying from the
 * browser. The CLI calls the deployer directly (no relay needed).
 */

/** Credentials and connection info for a PaaS target. */
export interface DeployTarget {
	/** Base URL of the PaaS instance (e.g. "https://dokploy.example.com") */
	instanceUrl: string;
	/** API key / bearer token */
	apiKey: string;
}

/** Input for a deploy operation. */
export interface DeployInput {
	/** Target PaaS connection */
	target: DeployTarget;
	/** Project name to create or use */
	projectName: string;
	/** Raw docker-compose.yml content */
	composeYaml: string;
	/** Raw .env file content (key=value lines) */
	envContent: string;
	/** Optional description */
	description?: string;
}

/** Step-level status for deploy progress. */
export interface DeployStep {
	step: string;
	status: "pending" | "running" | "done" | "error";
	detail?: string;
}

/** Result of a deploy operation. */
export interface DeployResult {
	success: boolean;
	/** URL to the deployed project/compose in the PaaS dashboard */
	dashboardUrl?: string;
	/** PaaS-assigned project ID */
	projectId?: string;
	/** PaaS-assigned compose/service ID */
	composeId?: string;
	/** Step-by-step progress */
	steps: DeployStep[];
	/** Error message if failed */
	error?: string;
}

/** Interface that all PaaS deployers implement. */
export interface PaasDeployer {
	/** Human-readable name */
	readonly name: string;
	/** Identifier (e.g. "dokploy", "coolify") */
	readonly id: string;
	/** Test connection to the PaaS instance */
	testConnection(target: DeployTarget): Promise<{ ok: boolean; error?: string }>;
	/** Deploy a compose stack */
	deploy(input: DeployInput): Promise<DeployResult>;
}
