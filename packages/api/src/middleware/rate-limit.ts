import type { MiddlewareHandler } from "hono";

interface RateLimitEntry {
	count: number;
	resetAt: number;
}

interface RateLimitConfig {
	windowMs: number;
	maxAnon: number;
	maxApiKey: number;
}

function getConfig(prefix: string): RateLimitConfig {
	const defaultWindowMs = 60 * 1000; // 1 minute
	const defaultMaxAnon = 30;
	const defaultMaxApiKey = 300;

	const windowMs = Number(
		process.env[`${prefix}RATE_LIMIT_WINDOW_MS`] ?? process.env.RATE_LIMIT_WINDOW_MS ?? defaultWindowMs,
	);
	const maxAnon = Number(
		process.env[`${prefix}RATE_LIMIT_MAX_ANON`] ?? process.env.RATE_LIMIT_MAX_ANON ?? defaultMaxAnon,
	);
	const maxApiKey = Number(
		process.env[`${prefix}RATE_LIMIT_MAX_API_KEY`] ??
			process.env.RATE_LIMIT_MAX_API_KEY ??
			defaultMaxApiKey,
	);

	return { windowMs, maxAnon, maxApiKey };
}

const stores = new Map<string, Map<string, RateLimitEntry>>();

function getStore(prefix: string): Map<string, RateLimitEntry> {
	let store = stores.get(prefix);
	if (!store) {
		store = new Map();
		stores.set(prefix, store);
		// Cleanup expired entries every 5 minutes
		setInterval(
			() => {
				const now = Date.now();
				for (const [key, entry] of store!) {
					if (entry.resetAt <= now) store!.delete(key);
				}
			},
			5 * 60 * 1000,
		);
	}
	return store;
}

function createRateLimiter(keyPrefix: string, configOverrides?: Partial<RateLimitConfig>): MiddlewareHandler {
	const config = { ...getConfig(keyPrefix), ...configOverrides };
	const store = getStore(keyPrefix);

	return async (c, next): Promise<Response | void> => {
		const apiKey = c.req.header("X-API-Key");
		const limit = apiKey ? config.maxApiKey : config.maxAnon;

		const ip =
			c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ||
			c.req.header("x-real-ip") ||
			"unknown";
		const key = apiKey ? `key:${apiKey}` : `ip:${ip}`;

		const now = Date.now();
		let entry = store.get(key);

		if (!entry || entry.resetAt <= now) {
			entry = { count: 0, resetAt: now + config.windowMs };
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

/** Global rate limiter. Uses RATE_LIMIT_* env vars; defaults 30/min anon, 300/min with X-API-Key. */
export function rateLimiter(): MiddlewareHandler {
	return createRateLimiter("");
}

/** Stricter rate limiter for expensive routes (e.g. POST /generate). Uses RATE_LIMIT_GENERATE_* or same env; defaults 5/min anon, 10/min with key. */
export function generateRateLimiter(): MiddlewareHandler {
	const windowMs = Number(process.env.RATE_LIMIT_GENERATE_WINDOW_MS ?? process.env.RATE_LIMIT_WINDOW_MS ?? 60_000);
	const maxAnon = Number(process.env.RATE_LIMIT_GENERATE_MAX_ANON ?? 5);
	const maxApiKey = Number(process.env.RATE_LIMIT_GENERATE_MAX_API_KEY ?? 10);
	return createRateLimiter("generate_", { windowMs, maxAnon, maxApiKey });
}
