import { randomUUID } from "node:crypto";
import type { MiddlewareHandler } from "hono";

/**
 * Assigns a unique request ID to each request via the X-Request-Id header.
 * If the client sends one, it is preserved; otherwise a new UUID is generated.
 */
export const requestId = (): MiddlewareHandler => {
	return async (c, next) => {
		const id = c.req.header("X-Request-Id") ?? randomUUID();
		c.header("X-Request-Id", id);
		await next();
	};
};
