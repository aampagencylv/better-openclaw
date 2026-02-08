import type { MiddlewareHandler } from "hono";

interface RateLimitEntry {
	count: number;
	resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Cleanup expired entries every 5 minutes
setInterval(
	() => {
		const now = Date.now();
		for (const [key, entry] of store) {
			if (entry.resetAt <= now) store.delete(key);
		}
	},
	5 * 60 * 1000,
);

export function rateLimiter(): MiddlewareHandler {
	return async (c, next): Promise<Response | void> => {
		const apiKey = c.req.header("X-API-Key");
		const limit = apiKey ? 300 : 30;
		const windowMs = 60 * 1000; // 1 minute

		// Use IP + API key as identifier
		const ip = c.req.header("x-forwarded-for") || c.req.header("x-real-ip") || "unknown";
		const key = apiKey ? `key:${apiKey}` : `ip:${ip}`;

		const now = Date.now();
		let entry = store.get(key);

		if (!entry || entry.resetAt <= now) {
			entry = { count: 0, resetAt: now + windowMs };
			store.set(key, entry);
		}

		entry.count++;

		const remaining = Math.max(0, limit - entry.count);
		const resetSeconds = Math.ceil((entry.resetAt - now) / 1000);

		c.header("X-RateLimit-Limit", String(limit));
		c.header("X-RateLimit-Remaining", String(remaining));
		c.header("X-RateLimit-Reset", String(resetSeconds));

		if (entry.count > limit) {
			return c.json(
				{
					error: {
						code: "RATE_LIMITED",
						message: `Rate limit exceeded. Try again in ${resetSeconds} seconds.`,
					},
				},
				429,
				{ "Retry-After": String(resetSeconds) },
			);
		}

		await next();
	};
}
