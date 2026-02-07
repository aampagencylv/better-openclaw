import { Hono } from "hono";
import {
	getAllServices,
	getServicesByCategory,
	SERVICE_CATEGORIES,
} from "@better-openclaw/core";
import type { ServiceCategory } from "@better-openclaw/core";

const route = new Hono();

route.get("/", (c) => {
	try {
		const category = c.req.query("category");
		const maturity = c.req.query("maturity");

		let services = category
			? getServicesByCategory(category as ServiceCategory)
			: getAllServices();

		// Filter by maturity if provided
		if (maturity) {
			services = services.filter((s) => s.maturity === maturity);
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
