export interface RateLimitResult {
	count: number;
	resetAt: number; // epoch ms
}

export interface RateLimitStore {
	increment(key: string, windowMs: number): Promise<RateLimitResult>;
}

// ---------------------------------------------------------------------------
// In-memory store
// ---------------------------------------------------------------------------

interface MemoryEntry {
	count: number;
	resetAt: number;
}

export class MemoryRateLimitStore implements RateLimitStore {
	private map = new Map<string, MemoryEntry>();
	private cleanupTimer: ReturnType<typeof setInterval>;

	constructor() {
		// Cleanup expired entries every 5 minutes
		this.cleanupTimer = setInterval(
			() => {
				const now = Date.now();
				for (const [key, entry] of this.map) {
					if (entry.resetAt <= now) this.map.delete(key);
				}
			},
			5 * 60 * 1000,
		);
		// Allow the process to exit without waiting for the timer
		if (this.cleanupTimer.unref) this.cleanupTimer.unref();
	}

	async increment(key: string, windowMs: number): Promise<RateLimitResult> {
		const now = Date.now();
		let entry = this.map.get(key);

		if (!entry || entry.resetAt <= now) {
			entry = { count: 0, resetAt: now + windowMs };
			this.map.set(key, entry);
		}

		entry.count++;
		return { count: entry.count, resetAt: entry.resetAt };
	}
}

// ---------------------------------------------------------------------------
// Redis store
// ---------------------------------------------------------------------------

export class RedisRateLimitStore implements RateLimitStore {
	private redisUrl: string;
	private client: any = null;
	private connectPromise: Promise<void> | null = null;
	private useFallback = false;
	private fallback = new MemoryRateLimitStore();

	constructor(redisUrl: string) {
		this.redisUrl = redisUrl;
	}

	private async getClient(): Promise<any> {
		if (this.client) return this.client;
		if (this.connectPromise) {
			await this.connectPromise;
			return this.client;
		}

		this.connectPromise = (async () => {
			const { default: Redis } = await import("ioredis");
			this.client = new Redis(this.redisUrl, {
				maxRetriesPerRequest: 1,
				lazyConnect: true,
				connectTimeout: 3000,
			});

			this.client.on("error", () => {
				this.useFallback = true;
			});

			this.client.on("connect", () => {
				this.useFallback = false;
			});

			await this.client.connect();
		})();

		await this.connectPromise;
		return this.client;
	}

	async increment(key: string, windowMs: number): Promise<RateLimitResult> {
		if (this.useFallback) {
			return this.fallback.increment(key, windowMs);
		}

		try {
			const client = await this.getClient();

			const pipeline = client.multi();
			pipeline.incr(key);
			pipeline.pttl(key);
			const results = await pipeline.exec();

			// results = [[err, count], [err, pttl]]
			const count: number = results[0][1] as number;
			const pttl: number = results[1][1] as number;

			// Set expiry only on first increment (PTTL returns -1 when no expiry)
			if (pttl === -1) {
				await client.pexpire(key, windowMs);
			}

			const resetAt =
				pttl > 0 ? Date.now() + pttl : Date.now() + windowMs;

			return { count, resetAt };
		} catch {
			this.useFallback = true;
			return this.fallback.increment(key, windowMs);
		}
	}
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

export function createRateLimitStore(): RateLimitStore {
	const redisUrl = process.env.REDIS_URL;
	if (redisUrl) {
		return new RedisRateLimitStore(redisUrl);
	}
	return new MemoryRateLimitStore();
}
