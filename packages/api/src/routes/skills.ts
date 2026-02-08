import { getAllSkillPacks, getCompatibleSkillPacks } from "@better-openclaw/core";
import { Hono } from "hono";

const route = new Hono();

route.get("/", (c) => {
	try {
		const servicesParam = c.req.query("services");

		if (servicesParam) {
			const serviceIds = servicesParam
				.split(",")
				.map((s) => s.trim())
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
