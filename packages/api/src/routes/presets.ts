import { getAllPresets } from "@better-openclaw/core";
import { Hono } from "hono";

const route = new Hono();

route.get("/", (c) => {
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
