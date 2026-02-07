import { Hono } from "hono";

const route = new Hono();

route.get("/", (c) => {
	return c.json({
		status: "ok",
		version: "1.0.0",
	});
});

export { route as healthRoute };
