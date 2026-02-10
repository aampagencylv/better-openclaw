import type { ServiceCategory, ServiceDefinition } from "@better-openclaw/core";
import { getAllServices, getServicesByCategory, SERVICE_CATEGORIES } from "@better-openclaw/core";
import { Hono } from "hono";

const route = new Hono();

route.get("/", (c) => {
	try {
		const category = c.req.query("category");
		const maturity = c.req.query("maturity");

		let services = category ? getServicesByCategory(category as ServiceCategory) : getAllServices();

		// Filter by maturity if provided
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

export { route as servicesRoute };
