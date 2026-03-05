/**
 * PaaS deployer registry — barrel export + lookup helpers.
 *
 * To add a new provider, implement `PaasDeployer` and register it in
 * `deployerRegistry` below.
 */

export { CoolifyDeployer } from "./coolify.js";
export { DokployDeployer } from "./dokploy.js";
export type {
	DeployInput,
	DeployResult,
	DeployStep,
	DeployTarget,
	PaasDeployer,
	PaasServer,
} from "./types.js";

import { CoolifyDeployer } from "./coolify.js";
import { DokployDeployer } from "./dokploy.js";
import type { PaasDeployer } from "./types.js";

/** Registry of all available PaaS deployers. */
export const deployerRegistry: Record<string, PaasDeployer> = {
	dokploy: new DokployDeployer(),
	coolify: new CoolifyDeployer(),
};

/** Get a deployer by ID, or undefined if not found. */
export function getDeployer(id: string): PaasDeployer | undefined {
	return deployerRegistry[id];
}

/** List all available deployer IDs. */
export function getAvailableDeployers(): string[] {
	return Object.keys(deployerRegistry);
}
