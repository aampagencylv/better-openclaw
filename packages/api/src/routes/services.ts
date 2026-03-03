import type { ServiceCategory, ServiceDefinition } from "@better-openclaw/core";
import {
	getAllServices,
	getServiceById,
	getServicesByCategory,
	SERVICE_CATEGORIES,
} from "@better-openclaw/core";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

const route = new OpenAPIHono();

const servicesGet = createRoute({
	method: "get",
	path: "/",
	tags: ["Services"],
	summary: "List all available services",
	request: {
		query: z.object({
			category: z.string().optional(),
			maturity: z.string().optional(),
		}),
	},
	responses: {
		200: {
			description: "List of services with categories and total count",
			content: {
				"application/json": {
					schema: z.object({
						services: z.array(z.any()),
						categories: z.array(z.any()),
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

// biome-ignore lint/suspicious/noExplicitAny: Hono OpenAPI handler typing workaround
route.openapi(servicesGet, (c: any) => {
	try {
		const { category, maturity } = c.req.valid("query");

		let services = category ? getServicesByCategory(category as ServiceCategory) : getAllServices();

		if (maturity) {
			services = services.filter((s: ServiceDefinition) => s.maturity === maturity);
		}

		return c.json({
			services,
			categories: SERVICE_CATEGORIES,
			total: services.length,
		});
	} catch (err) {
		const message = err instanceof Error ? err.message : "Failed to fetch services";
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

// ─── GET /services/:id ──────────────────────────────────────────────────────

const serviceGetById = createRoute({
	method: "get",
	path: "/{id}",
	tags: ["Services"],
	summary: "Get a service by ID",
	request: {
		params: z.object({
			id: z.string().min(1),
		}),
	},
	responses: {
		200: {
			description: "Service details",
			content: {
				"application/json": {
					schema: z.object({
						service: z.any(),
					}),
				},
			},
		},
		404: {
			description: "Service not found",
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
route.openapi(serviceGetById, (c: any) => {
	const { id } = c.req.valid("param");
	const service = getServiceById(id);

	if (!service) {
		return c.json(
			{
				error: {
					code: "NOT_FOUND",
					message: `Service "${id}" not found`,
				},
			},
			404,
		);
	}

	return c.json({ service });
});

export { route as servicesRoute };
