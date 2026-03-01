import { getAllPresets, getPresetById, getServiceById } from "@better-openclaw/core";
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

// ─── GET /presets/:id ────────────────────────────────────────────────────────

const presetGetById = createRoute({
	method: "get",
	path: "/{id}",
	tags: ["Presets"],
	summary: "Get a preset by ID with service details",
	request: {
		params: z.object({
			id: z.string().min(1),
		}),
	},
	responses: {
		200: {
			description: "Preset details with resolved services",
			content: {
				"application/json": {
					schema: z.object({
						preset: z.any(),
						services: z.array(z.any()),
					}),
				},
			},
		},
		404: {
			description: "Preset not found",
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

route.openapi(presetGetById, (c) => {
	const { id } = c.req.valid("param");
	const preset = getPresetById(id);

	if (!preset) {
		return c.json(
			{
				error: {
					code: "NOT_FOUND",
					message: `Preset "${id}" not found`,
				},
			},
			404,
		);
	}

	const services = preset.services.map((svcId) => getServiceById(svcId)).filter(Boolean);

	return c.json({ preset, services });
});

export { route as presetsRoute };
