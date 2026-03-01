/**
 * Coolify PaaS deployer — deploys Docker Compose stacks via the Coolify v4 REST API.
 *
 * API docs: https://coolify.io/docs/api-reference/api/
 * Auth: Authorization: Bearer <token>
 * Base path: /api/v1
 */

import type { DeployInput, DeployResult, DeployStep, DeployTarget, PaasDeployer } from "./types.js";

/** Shape returned by Coolify's project endpoints. */
interface CoolifyProject {
	uuid: string;
	name: string;
	environments?: { uuid: string; name: string }[];
}

/** Shape returned by Coolify's server listing. */
interface CoolifyServer {
	uuid: string;
	name: string;
	ip: string;
}

/** Shape returned when creating a Coolify service (compose stack). */
interface CoolifyService {
	uuid: string;
}

/** Shape returned by Coolify's deploy trigger endpoint. */
interface CoolifyDeployment {
	message: string;
	resource_uuid: string;
	deployment_uuid: string;
}

/** Build a full Coolify API URL (base + /api/v1 + path). */
function apiUrl(target: DeployTarget, path: string): string {
	const base = target.instanceUrl.replace(/\/+$/, "");
	return `${base}/api/v1${path}`;
}

/**
 * Typed fetch wrapper for the Coolify v4 API.
 * Handles JSON serialisation, Bearer auth, and error extraction.
 */
async function coolifyFetch<T>(
	target: DeployTarget,
	path: string,
	options: { method?: string; body?: unknown } = {},
): Promise<T> {
	const res = await fetch(apiUrl(target, path), {
		method: options.method ?? "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${target.apiKey}`,
		},
		body: options.body ? JSON.stringify(options.body) : undefined,
	});

	if (!res.ok) {
		const text = await res.text().catch(() => "");
		let detail = text;
		try {
			const json = JSON.parse(text);
			detail = json.message || json.error || text;
		} catch {
			// use raw text
		}
		throw new Error(`Coolify API ${res.status}: ${detail}`);
	}

	const text = await res.text();
	if (!text) return undefined as T;
	return JSON.parse(text) as T;
}

/**
 * Parse .env content into key-value pairs for Coolify's bulk env API.
 */
function parseEnvContent(envContent: string): {
	key: string;
	value: string;
	is_preview: boolean;
	is_build_time: boolean;
	is_literal: boolean;
}[] {
	const result: {
		key: string;
		value: string;
		is_preview: boolean;
		is_build_time: boolean;
		is_literal: boolean;
	}[] = [];

	for (const line of envContent.split("\n")) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith("#")) continue;

		const eqIdx = trimmed.indexOf("=");
		if (eqIdx <= 0) continue;

		const key = trimmed.slice(0, eqIdx);
		const value = trimmed.slice(eqIdx + 1);

		result.push({
			key,
			value,
			is_preview: false,
			is_build_time: false,
			is_literal: true,
		});
	}

	return result;
}

/**
 * Deploys Docker Compose stacks to a Coolify v4 instance.
 *
 * Deploy flow (5 steps):
 *   1. Discover the first available server
 *   2. Create a Coolify project
 *   3. Create a compose service with the raw docker-compose YAML
 *   4. Push .env variables via the bulk env API
 *   5. Trigger the deployment
 */
export class CoolifyDeployer implements PaasDeployer {
	readonly name = "Coolify";
	readonly id = "coolify";

	async testConnection(target: DeployTarget): Promise<{ ok: boolean; error?: string }> {
		try {
			await coolifyFetch<unknown>(target, "/version");
			return { ok: true };
		} catch (err) {
			return { ok: false, error: err instanceof Error ? err.message : String(err) };
		}
	}

	async deploy(input: DeployInput): Promise<DeployResult> {
		const step1: DeployStep = { step: "Discover server", status: "pending" };
		const step2: DeployStep = { step: "Create project", status: "pending" };
		const step3: DeployStep = { step: "Create compose service", status: "pending" };
		const step4: DeployStep = { step: "Set environment variables", status: "pending" };
		const step5: DeployStep = { step: "Trigger deployment", status: "pending" };
		const steps: DeployStep[] = [step1, step2, step3, step4, step5];

		const result: DeployResult = { success: false, steps };

		try {
			// Step 1: Discover default server
			step1.status = "running";
			const servers = await coolifyFetch<CoolifyServer[]>(input.target, "/servers");
			if (!servers || servers.length === 0) {
				throw new Error("No servers found in Coolify instance");
			}
			const server = servers[0] as CoolifyServer;
			step1.status = "done";
			step1.detail = `Server: ${server.name} (${server.ip})`;

			// Step 2: Create project
			step2.status = "running";
			const project = await coolifyFetch<CoolifyProject>(input.target, "/projects", {
				method: "POST",
				body: {
					name: input.projectName,
					description: input.description ?? `OpenClaw stack: ${input.projectName}`,
				},
			});
			result.projectId = project.uuid;
			step2.status = "done";
			step2.detail = `Project: ${project.uuid}`;

			// Get the default environment
			const projectDetail = await coolifyFetch<CoolifyProject>(
				input.target,
				`/projects/${project.uuid}`,
			);
			const envUuid = projectDetail.environments?.[0]?.uuid;
			const envName = projectDetail.environments?.[0]?.name ?? "production";
			if (!envUuid) {
				throw new Error("No default environment found in project");
			}

			// Step 3: Create compose service with docker_compose_raw
			step3.status = "running";
			const service = await coolifyFetch<CoolifyService>(input.target, "/services", {
				method: "POST",
				body: {
					project_uuid: project.uuid,
					server_uuid: server.uuid,
					environment_name: envName,
					environment_uuid: envUuid,
					docker_compose_raw: input.composeYaml,
					name: input.projectName,
					description: input.description ?? "Deployed via OpenClaw web builder",
					instant_deploy: false,
				},
			});
			result.composeId = service.uuid;
			step3.status = "done";
			step3.detail = `Service: ${service.uuid}`;

			// Step 4: Set environment variables
			step4.status = "running";
			const envVars = parseEnvContent(input.envContent);
			if (envVars.length > 0) {
				await coolifyFetch(input.target, `/services/${service.uuid}/envs`, {
					method: "PATCH",
					body: envVars,
				});
			}
			step4.status = "done";
			step4.detail = `${envVars.length} variables set`;

			// Step 5: Trigger deployment
			step5.status = "running";
			const deployments = await coolifyFetch<{ deployments: CoolifyDeployment[] }>(
				input.target,
				`/deploy?uuid=${service.uuid}&force=true`,
			);
			step5.status = "done";
			step5.detail = deployments?.deployments?.[0]?.deployment_uuid ?? "Deployment triggered";

			result.success = true;
			const base = input.target.instanceUrl.replace(/\/+$/, "");
			result.dashboardUrl = `${base}/project/${project.uuid}`;
		} catch (err) {
			const failedStep = steps.find((s) => s.status === "running");
			if (failedStep) {
				failedStep.status = "error";
				failedStep.detail = err instanceof Error ? err.message : String(err);
			}
			result.error = err instanceof Error ? err.message : String(err);
		}

		return result;
	}
}
