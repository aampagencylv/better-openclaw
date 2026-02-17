import { getAllPresets } from "@better-openclaw/core";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

const route = new OpenAPIHono();

const presetsGet = createRoute({
	method: "get",
	path: "/",
	tags: ["Presets"],
	summary: "List preset configurations",
	responses: {
		200: {
			description: "List of presets",
			content: {
				"application/json": {
					schema: z.object({
						presets: z.array(z.any()),
						total: z.number().int(),
					}),
				},
			},
		},
		500: {
			description: "Internal error",
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

route.openapi(presetsGet, (c) => {
	try {
		const presets = getAllPresets();
		return c.json({
			presets,
			total: presets.length,
		});
	} catch (err) {
		const message = err instanceof Error ? err.message : "Failed to fetch presets";
		return c.json(
			{
				error: {
					code: "INTERNAL_ERROR",
					message,
				},
			},
			500,
		);
	}
});

export { route as presetsRoute };
