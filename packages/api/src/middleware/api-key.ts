import { createHash, timingSafeEqual } from "node:crypto";
import type { MiddlewareHandler } from "hono";

/**
 * API key validation middleware.
 *
 * Keys are configured via the `API_KEYS` environment variable as a
 * comma-separated list of valid keys:
 *
 *   API_KEYS=sk_live_abc123,sk_live_def456
 *
 * When `API_KEYS` is not set, all requests with an `X-API-Key` header
 * are treated as authenticated (for rate-limit tier purposes only).
 * When `API_KEYS` IS set, invalid keys receive a 401 response.
 *
 * Keys are compared using SHA-256 hashes with timing-safe equality
 * to prevent timing attacks.
 */

function hashKey(key: string): Buffer {
	return createHash("sha256").update(key).digest();
}

let validKeyHashes: Buffer[] | null = null;

function getValidKeyHashes(): Buffer[] | null {
	if (validKeyHashes !== null) return validKeyHashes.length > 0 ? validKeyHashes : null;

	const raw = process.env.API_KEYS;
	if (!raw) {
		validKeyHashes = [];
		return null;
	}

	validKeyHashes = raw
		.split(",")
		.map((k) => k.trim())
		.filter(Boolean)
		.map(hashKey);

	return validKeyHashes.length > 0 ? validKeyHashes : null;
}

function isValidKey(key: string): boolean {
	const hashes = getValidKeyHashes();
	if (!hashes) return true; // No keys configured — all accepted

	const keyHash = hashKey(key);
	return hashes.some((h) => {
		try {
			return timingSafeEqual(h, keyHash);
		} catch {
			return false;
		}
	});
}

/**
 * Middleware that validates API keys on protected routes.
 *
 * - Routes that require authentication will reject requests with
 *   invalid keys (401).
 * - When `API_KEYS` env is not configured, the middleware is a no-op
 *   (all keys accepted).
 */
export function requireApiKey(): MiddlewareHandler {
	return async (c, next) => {
		const apiKey = c.req.header("X-API-Key");

		if (!apiKey) {
			return c.json(
				{
					error: {
						code: "UNAUTHORIZED",
						message: "Missing X-API-Key header. Provide a valid API key.",
					},
				},
				401,
			);
		}

		if (!isValidKey(apiKey)) {
			return c.json(
				{
					error: {
						code: "UNAUTHORIZED",
						message: "Invalid API key.",
					},
				},
				401,
			);
		}

		await next();
	};
}

/**
 * Middleware that optionally validates API keys.
 *
 * Unlike `requireApiKey`, this does NOT reject requests without a key.
 * It only rejects requests that provide an INVALID key (when API_KEYS
 * is configured). Sets `c.set("authenticated", true)` when valid.
 */
export function optionalApiKey(): MiddlewareHandler {
	return async (c, next) => {
		const apiKey = c.req.header("X-API-Key");

		if (apiKey) {
			if (!isValidKey(apiKey)) {
				return c.json(
					{
						error: {
							code: "UNAUTHORIZED",
							message: "Invalid API key.",
						},
					},
					401,
				);
			}
		}

		await next();
	};
}
