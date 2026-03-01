/**
 * Dokploy PaaS deployer — deploys Docker Compose stacks via the Dokploy REST API.
 *
 * API docs: https://docs.dokploy.com/docs/api
 * Auth: x-api-key header
 * Endpoints use dot-notation (e.g. /api/project.create, /api/compose.deploy)
 */

import type { DeployInput, DeployResult, DeployStep, DeployTarget, PaasDeployer } from "./types.js";

/** Shape returned by Dokploy's project endpoints. */
interface DokployProject {
	projectId: string;
	name: string;
	description: string;
	environments?: { environmentId: string; name: string }[];
}

/** Shape returned by Dokploy's compose endpoints. */
interface DokployCompose {
	composeId: string;
	name: string;
	status?: string;
}

/** Build a full Dokploy API URL from a dot-notation endpoint (e.g. "project.create"). */
function apiUrl(target: DeployTarget, endpoint: string): string {
	const base = target.instanceUrl.replace(/\/+$/, "");
	return `${base}/api/${endpoint}`;
}

/**
 * Typed fetch wrapper for the Dokploy API.
 * Handles JSON serialisation, x-api-key auth, and error extraction.
 */
async function dokployFetch<T>(
	target: DeployTarget,
	endpoint: string,
	options: { method?: string; body?: unknown } = {},
): Promise<T> {
	const res = await fetch(apiUrl(target, endpoint), {
		method: options.method ?? "GET",
		headers: {
			"Content-Type": "application/json",
			"x-api-key": target.apiKey,
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
		throw new Error(`Dokploy API ${res.status}: ${detail}`);
	}

	const text = await res.text();
	if (!text) return undefined as T;
	return JSON.parse(text) as T;
}

/**
 * Deploys Docker Compose stacks to a Dokploy instance.
 *
 * Deploy flow (4 steps):
 *   1. Create a Dokploy project
 *   2. Create a compose stack inside the project's default environment
 *   3. Push .env variables to the compose stack
 *   4. Trigger the deployment
 */
export class DokployDeployer implements PaasDeployer {
	readonly name = "Dokploy";
	readonly id = "dokploy";

	async testConnection(target: DeployTarget): Promise<{ ok: boolean; error?: string }> {
		try {
			await dokployFetch<DokployProject[]>(target, "project.all");
			return { ok: true };
		} catch (err) {
			return { ok: false, error: err instanceof Error ? err.message : String(err) };
		}
	}

	async deploy(input: DeployInput): Promise<DeployResult> {
		const step1: DeployStep = { step: "Create project", status: "pending" };
		const step2: DeployStep = { step: "Create compose stack", status: "pending" };
		const step3: DeployStep = { step: "Set environment variables", status: "pending" };
		const step4: DeployStep = { step: "Trigger deployment", status: "pending" };
		const steps: DeployStep[] = [step1, step2, step3, step4];

		const result: DeployResult = { success: false, steps };

		try {
			// Step 1: Create project
			step1.status = "running";
			const project = await dokployFetch<DokployProject>(input.target, "project.create", {
				method: "POST",
				body: {
					name: input.projectName,
					description: input.description ?? `OpenClaw stack: ${input.projectName}`,
				},
			});
			result.projectId = project.projectId;
			step1.status = "done";
			step1.detail = `Project ID: ${project.projectId}`;

			// Get the default environment ID
			const projectDetail = await dokployFetch<DokployProject>(
				input.target,
				`project.one?projectId=${project.projectId}`,
			);
			const envId = projectDetail.environments?.[0]?.environmentId;
			if (!envId) {
				throw new Error("No default environment found in project");
			}

			// Step 2: Create compose stack
			step2.status = "running";
			const compose = await dokployFetch<DokployCompose>(input.target, "compose.create", {
				method: "POST",
				body: {
					name: input.projectName,
					environmentId: envId,
					composeFile: input.composeYaml,
				},
			});
			result.composeId = compose.composeId;
			step2.status = "done";
			step2.detail = `Compose ID: ${compose.composeId}`;

			// Step 3: Set environment variables
			step3.status = "running";
			await dokployFetch(input.target, "compose.update", {
				method: "POST",
				body: {
					composeId: compose.composeId,
					env: input.envContent,
				},
			});
			step3.status = "done";

			// Step 4: Trigger deployment
			step4.status = "running";
			await dokployFetch(input.target, "compose.deploy", {
				method: "POST",
				body: {
					composeId: compose.composeId,
					title: `Initial deploy: ${input.projectName}`,
					description: input.description ?? "Deployed via OpenClaw web builder",
				},
			});
			step4.status = "done";

			result.success = true;
			const base = input.target.instanceUrl.replace(/\/+$/, "");
			result.dashboardUrl = `${base}/dashboard/project/${project.projectId}`;
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
