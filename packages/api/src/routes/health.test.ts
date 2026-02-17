import { describe, expect, it } from "vitest";
import { app } from "../app.js";

describe("GET /v1/health", () => {
	it("returns 200 with status ok", async () => {
		const res = await app.request("/v1/health");
		expect(res.status).toBe(200);

		const body = await res.json();
		expect(body).toHaveProperty("status", "ok");
		expect(body).toHaveProperty("version");
	});
});
