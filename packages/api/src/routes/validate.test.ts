import { describe, expect, it } from "vitest";
import { app } from "../app.js";

describe("POST /v1/validate", () => {
	it("returns 200 with resolved services for valid input", async () => {
		const res = await app.request("/v1/validate", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				services: ["redis", "postgresql"],
				skillPacks: [],
			}),
		});

		expect(res.status).toBe(200);
		const body = await res.json();
		expect(body).toHaveProperty("valid", true);
		expect(body).toHaveProperty("resolvedServices");
		expect(body.resolvedServices).toContain("redis");
		expect(body.resolvedServices).toContain("postgresql");
		expect(body).toHaveProperty("estimatedMemoryMB");
		expect(typeof body.estimatedMemoryMB).toBe("number");
	});

	it("returns 400 for invalid request body", async () => {
		const res = await app.request("/v1/validate", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ invalid: true }),
		});

		expect(res.status).toBe(400);
		const body = await res.json();
		expect(body).toHaveProperty("error");
		expect(body.error.code).toBe("VALIDATION_ERROR");
	});

	it("includes added dependencies when skill packs require services", async () => {
		const res = await app.request("/v1/validate", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				services: [],
				skillPacks: ["social-media"],
			}),
		});

		expect(res.status).toBe(200);
		const body = await res.json();
		expect(body.resolvedServices).toContain("redis");
		expect(body.addedDependencies.length).toBeGreaterThan(0);
	});

	it("detects conflicts between services", async () => {
		const res = await app.request("/v1/validate", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				services: ["redis", "valkey"],
				skillPacks: [],
			}),
		});

		expect(res.status).toBe(200);
		const body = await res.json();
		expect(body.valid).toBe(false);
		expect(body.conflicts.length).toBeGreaterThan(0);
	});
});
