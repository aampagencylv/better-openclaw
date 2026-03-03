import { getAllSkillPacks, getCompatibleSkillPacks } from "@better-openclaw/core";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

const route = new OpenAPIHono();

const skillsGet = createRoute({
	method: "get",
	path: "/",
	tags: ["Skills"],
	summary: "List available skill packs",
	request: {
		query: z.object({
			services: z.string().optional(),
		}),
	},
	responses: {
		200: {
			description: "List of skill packs",
			content: {
				"application/json": {
					schema: z.object({
						skillPacks: z.array(z.any()),
						total: z.number().int(),
						filteredBy: z.array(z.string()).optional(),
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

// biome-ignore lint/suspicious/noExplicitAny: Hono OpenAPI handler typing workaround
route.openapi(skillsGet, (c: any) => {
	try {
		const { services: servicesParam } = c.req.valid("query");

		if (servicesParam) {
			const serviceIds = (servicesParam as string)
				.split(",")
				.map((s: string) => s.trim())
				.filter(Boolean);
			const compatible = getCompatibleSkillPacks(serviceIds);
			return c.json({
				skillPacks: compatible,
				total: compatible.length,
				filteredBy: serviceIds,
			});
		}

		const skillPacks = getAllSkillPacks();
		return c.json({
			skillPacks,
			total: skillPacks.length,
		});
	} catch (err) {
		const message = err instanceof Error ? err.message : "Failed to fetch skill packs";
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

export { route as skillsRoute };
