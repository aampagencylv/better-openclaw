import { getAllServices } from "@better-openclaw/core";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

const startedAt = Date.now();

const route = new OpenAPIHono();

const healthGet = createRoute({
	method: "get",
	path: "/",
	tags: ["System"],
	summary: "Health check",
	responses: {
		200: {
			description: "API is healthy",
			content: {
				"application/json": {
					schema: z.object({
						status: z.string(),
						version: z.string(),
						uptime: z.string(),
						serviceCount: z.number().int(),
						memoryUsageMB: z.number().int(),
					}),
				},
			},
		},
		503: {
			description: "API is degraded",
			content: {
				"application/json": {
					schema: z.object({
						status: z.string(),
						version: z.string(),
					}),
				},
			},
		},
	},
});

route.openapi(healthGet, (c) => {
	try {
		const serviceCount = getAllServices().length;
		const uptimeMs = Date.now() - startedAt;

		return c.json({
			status: "ok",
			version: "1.0.0",
			uptime: `${Math.floor(uptimeMs / 1000)}s`,
			serviceCount,
			memoryUsageMB: Math.round(process.memoryUsage.rss() / 1024 / 1024),
		});
	} catch {
		return c.json({ status: "degraded", version: "1.0.0" }, 503);
	}
});

export { route as healthRoute };
