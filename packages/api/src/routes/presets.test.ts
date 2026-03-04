import { describe, expect, it } from "vitest";
import { app } from "../app.js";

describe("GET /api/v1/presets", () => {
	it("returns list of presets", async () => {
		const res = await app.request("/api/v1/presets");
		expect(res.status).toBe(200);
		const body = await res.json();
		expect(body).toHaveProperty("presets");
		expect(body).toHaveProperty("total");
		expect(body.total).toBeGreaterThan(0);
		expect(body.presets.length).toBe(body.total);
	});
});

describe("GET /api/v1/presets/:id", () => {
	it("returns preset details with services for valid ID", async () => {
		const res = await app.request("/api/v1/presets/minimal");
		expect(res.status).toBe(200);
		const body = await res.json();
		expect(body).toHaveProperty("preset");
		expect(body).toHaveProperty("services");
		expect(body.preset.id).toBe("minimal");
		expect(body.preset).toHaveProperty("name");
		expect(body.preset).toHaveProperty("services");
		expect(body.services.length).toBeGreaterThan(0);
	});

	it("returns preset with all service details resolved", async () => {
		const res = await app.request("/api/v1/presets/researcher");
		expect(res.status).toBe(200);
		const body = await res.json();
		expect(body.preset.id).toBe("researcher");
		for (const svc of body.services) {
			expect(svc).toHaveProperty("id");
			expect(svc).toHaveProperty("image");
		}
	});

	it("returns 404 for unknown preset", async () => {
		const res = await app.request("/api/v1/presets/nonexistent-preset");
		expect(res.status).toBe(404);
		const body = await res.json();
		expect(body.error.code).toBe("NOT_FOUND");
	});
});
