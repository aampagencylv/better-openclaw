import { describe, expect, it } from "vitest";
import { app } from "../app.js";

describe("GET /api/v1/services", () => {
	it("returns list of services", async () => {
		const res = await app.request("/api/v1/services");
		expect(res.status).toBe(200);
		const body = await res.json();
		expect(body).toHaveProperty("services");
		expect(body).toHaveProperty("categories");
		expect(body).toHaveProperty("total");
		expect(body.total).toBeGreaterThan(0);
		expect(body.services.length).toBe(body.total);
	});

	it("filters by category", async () => {
		const res = await app.request("/api/v1/services?category=database");
		expect(res.status).toBe(200);
		const body = await res.json();
		for (const svc of body.services) {
			expect(svc.category).toBe("database");
		}
	});
});

describe("GET /api/v1/services/:id", () => {
	it("returns service details for valid ID", async () => {
		const res = await app.request("/api/v1/services/redis");
		expect(res.status).toBe(200);
		const body = await res.json();
		expect(body).toHaveProperty("service");
		expect(body.service.id).toBe("redis");
		expect(body.service).toHaveProperty("name");
		expect(body.service).toHaveProperty("description");
		expect(body.service).toHaveProperty("image");
	});

	it("returns 404 for unknown service", async () => {
		const res = await app.request("/api/v1/services/nonexistent-service");
		expect(res.status).toBe(404);
		const body = await res.json();
		expect(body.error.code).toBe("NOT_FOUND");
	});
});
