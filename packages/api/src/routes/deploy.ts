/**
 * Deploy routes — relay endpoints for deploying stacks to self-hosted PaaS providers.
 *
 * The API server acts as a proxy between the web UI (browser) and the user's
 * Dokploy/Coolify instance to avoid CORS restrictions.  The CLI calls the
 * deployer directly and does not need this relay.
 *
 * Endpoints:
 *   POST /deploy/test      — Test connectivity to a PaaS instance
 *   POST /deploy           — Deploy a compose stack (relay to PaaS)
 *   GET  /deploy/providers — List available PaaS providers
 */

import { getAvailableDeployers, getDeployer } from "@better-openclaw/core";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

const route = new OpenAPIHono();

// ── Test Connection ─────────────────────────────────────────────────────────

const testConnectionPost = createRoute({
	method: "post",
	path: "/test",
	tags: ["Deploy"],
	summary: "Test connection to a PaaS instance",
	request: {
		body: {
			required: true,
			content: {
				"application/json": {
					schema: z.object({
						provider: z.string().describe('PaaS provider ID (e.g. "dokploy", "coolify")'),
						instanceUrl: z.string().url().describe("Base URL of the PaaS instance"),
						apiKey: z.string().min(1).describe("API key or bearer token"),
					}),
				},
			},
		},
	},
	responses: {
		200: {
			description: "Connection test result",
			content: {
				"application/json": {
					schema: z.object({
						ok: z.boolean(),
						provider: z.string(),
						error: z.string().optional(),
					}),
				},
			},
		},
		400: {
			description: "Invalid provider",
			content: {
				"application/json": {
					schema: z.object({
						error: z.object({ code: z.string(), message: z.string() }),
					}),
				},
			},
		},
	},
});

// biome-ignore lint/suspicious/noExplicitAny: Hono OpenAPI handler typing workaround
route.openapi(testConnectionPost, async (c: any) => {
	const { provider, instanceUrl, apiKey } = c.req.valid("json");

	const deployer = getDeployer(provider);
	if (!deployer) {
		return c.json(
			{
				error: {
					code: "INVALID_PROVIDER" as const,
					message: `Unknown provider "${provider}". Available: ${getAvailableDeployers().join(", ")}`,
				},
			},
			400,
		);
	}

	const result = await deployer.testConnection({ instanceUrl, apiKey });
	return c.json({ ok: result.ok, provider, error: result.error });
});

// ── Deploy ──────────────────────────────────────────────────────────────────

const deployPost = createRoute({
	method: "post",
	path: "/",
	tags: ["Deploy"],
	summary: "Deploy a compose stack to a PaaS provider",
	description:
		"Proxies the deployment to a self-hosted PaaS (Dokploy or Coolify). " +
		"The API server acts as a relay to avoid CORS issues between the web UI and the user's PaaS instance.",
	request: {
		body: {
			required: true,
			content: {
				"application/json": {
					schema: z.object({
						provider: z.string().describe('PaaS provider ID (e.g. "dokploy", "coolify")'),
						instanceUrl: z.string().url().describe("Base URL of the PaaS instance"),
						apiKey: z.string().min(1).describe("API key or bearer token"),
						projectName: z.string().min(1).describe("Project name"),
						composeYaml: z.string().min(1).describe("Raw docker-compose.yml content"),
						envContent: z.string().describe("Raw .env file content"),
						description: z.string().optional().describe("Optional project description"),
						serverId: z.string().optional().describe("Optional server ID to deploy to"),
					}),
				},
			},
		},
	},
	responses: {
		200: {
			description: "Deploy result",
			content: {
				"application/json": {
					schema: z.object({
						success: z.boolean(),
						dashboardUrl: z.string().optional(),
						projectId: z.string().optional(),
						composeId: z.string().optional(),
						steps: z.array(
							z.object({
								step: z.string(),
								status: z.enum(["pending", "running", "done", "error"]),
								detail: z.string().optional(),
							}),
						),
						error: z.string().optional(),
					}),
				},
			},
		},
		400: {
			description: "Invalid provider",
			content: {
				"application/json": {
					schema: z.object({
						error: z.object({ code: z.string(), message: z.string() }),
					}),
				},
			},
		},
	},
});

// biome-ignore lint/suspicious/noExplicitAny: Hono OpenAPI handler typing workaround
route.openapi(deployPost, async (c: any) => {
	const {
		provider,
		instanceUrl,
		apiKey,
		projectName,
		composeYaml,
		envContent,
		description,
		serverId,
	} = c.req.valid("json");

	const deployer = getDeployer(provider);
	if (!deployer) {
		return c.json(
			{
				error: {
					code: "INVALID_PROVIDER" as const,
					message: `Unknown provider "${provider}". Available: ${getAvailableDeployers().join(", ")}`,
				},
			},
			400,
		);
	}

	const result = await deployer.deploy({
		target: { instanceUrl, apiKey },
		projectName,
		composeYaml,
		envContent,
		description,
		serverId,
	});

	return c.json(result);
});

// ── List Providers ──────────────────────────────────────────────────────────

const providersGet = createRoute({
	method: "get",
	path: "/providers",
	tags: ["Deploy"],
	summary: "List available PaaS providers",
	responses: {
		200: {
			description: "Available PaaS providers",
			content: {
				"application/json": {
					schema: z.object({
						providers: z.array(
							z.object({
								id: z.string(),
								name: z.string(),
							}),
						),
					}),
				},
			},
		},
	},
});

// biome-ignore lint/suspicious/noExplicitAny: Hono OpenAPI handler typing workaround
route.openapi(providersGet, async (c: any) => {
	const ids = getAvailableDeployers();
	const providers = ids.map((id) => {
		const deployer = getDeployer(id);
		return { id, name: deployer?.name ?? id };
	});
	return c.json({ providers });
});

// ── List Servers ────────────────────────────────────────────────────────────

const serversPost = createRoute({
	method: "post",
	path: "/servers",
	tags: ["Deploy"],
	summary: "List available servers on a PaaS instance",
	description:
		"Fetches the list of servers managed by the PaaS instance. " +
		"Requires valid credentials. Not all providers support multiple servers.",
	request: {
		body: {
			required: true,
			content: {
				"application/json": {
					schema: z.object({
						provider: z.string().describe('PaaS provider ID (e.g. "dokploy", "coolify")'),
						instanceUrl: z.string().url().describe("Base URL of the PaaS instance"),
						apiKey: z.string().min(1).describe("API key or bearer token"),
					}),
				},
			},
		},
	},
	responses: {
		200: {
			description: "List of available servers",
			content: {
				"application/json": {
					schema: z.object({
						servers: z.array(
							z.object({
								id: z.string(),
								name: z.string(),
								ip: z.string().optional(),
							}),
						),
					}),
				},
			},
		},
		400: {
			description: "Invalid provider or provider does not support server listing",
			content: {
				"application/json": {
					schema: z.object({
						error: z.object({ code: z.string(), message: z.string() }),
					}),
				},
			},
		},
	},
});

// biome-ignore lint/suspicious/noExplicitAny: Hono OpenAPI handler typing workaround
route.openapi(serversPost, async (c: any) => {
	const { provider, instanceUrl, apiKey } = c.req.valid("json");

	const deployer = getDeployer(provider);
	if (!deployer) {
		return c.json(
			{
				error: {
					code: "INVALID_PROVIDER" as const,
					message: `Unknown provider "${provider}". Available: ${getAvailableDeployers().join(", ")}`,
				},
			},
			400,
		);
	}

	if (!deployer.listServers) {
		return c.json({ servers: [] });
	}

	const servers = await deployer.listServers({ instanceUrl, apiKey });
	return c.json({ servers });
});

export { route as deployRoute };
