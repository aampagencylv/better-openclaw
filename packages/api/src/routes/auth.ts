import { Hono } from "hono";
import { auth } from "../lib/auth.js";

const route = new Hono();

// Mount the better-auth handler — handles all /auth/* requests
route.on(["GET", "POST"], "/*", (c) => {
	return auth.handler(c.req.raw);
});

export { route as authRoute };
