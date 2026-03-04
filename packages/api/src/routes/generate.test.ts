import { describe, expect, it } from "vitest";
import { app } from "../app.js";

describe("POST /api/v1/generate", () => {
	it("returns 400 for invalid input", async () => {
		const res = await app.request("/api/v1/generate", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ invalid: true }),
		});

		expect(res.status).toBe(400);
		const body = await res.json();
		expect(body).toHaveProperty("error");
		expect(body.error.code).toBe("VALIDATION_ERROR");
		expect(body.error).toHaveProperty("details");
	});

	it("generates files for valid input (default format)", async () => {
		const res = await app.request("/api/v1/generate", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				projectName: "test-project",
				services: ["redis"],
				skillPacks: [],
				proxy: "none",
				gpu: false,
				platform: "linux/amd64",
				deployment: "local",
				deploymentType: "docker",
				generateSecrets: true,
				openclawVersion: "latest",
				monitoring: false,
			}),
		});

		expect(res.status).toBe(200);
		const body = await res.json();
		expect(body).toHaveProperty("files");
		expect(body).toHaveProperty("metadata");
		expect(body.files).toHaveProperty("docker-compose.yml");
		expect(body.metadata).toHaveProperty("serviceCount");
		expect(body.metadata.serviceCount).toBeGreaterThan(0);
	});

	it("returns complete format when requested", async () => {
		const res = await app.request("/api/v1/generate?format=complete", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				projectName: "test-project",
				services: ["redis"],
				skillPacks: [],
				proxy: "none",
				gpu: false,
				platform: "linux/amd64",
				deployment: "local",
				deploymentType: "docker",
				generateSecrets: true,
				openclawVersion: "latest",
				monitoring: false,
			}),
		});

		expect(res.status).toBe(200);
		const body = await res.json();
		expect(body).toHaveProperty("formatVersion", "1");
		expect(body).toHaveProperty("input");
		expect(body).toHaveProperty("files");
		expect(body).toHaveProperty("metadata");
	});

	it("returns ZIP when format=zip", async () => {
		const res = await app.request("/api/v1/generate?format=zip", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				projectName: "test-project",
				services: ["redis"],
				skillPacks: [],
				proxy: "none",
				gpu: false,
				platform: "linux/amd64",
				deployment: "local",
				deploymentType: "docker",
				generateSecrets: true,
				openclawVersion: "latest",
				monitoring: false,
			}),
		});

		expect(res.status).toBe(200);
		expect(res.headers.get("Content-Type")).toBe("application/zip");
		expect(res.headers.get("Content-Disposition")).toContain("test-project.zip");
	});

	it("returns 409 for conflicting services", async () => {
		const res = await app.request("/api/v1/generate", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				projectName: "conflict-test",
				services: ["redis", "valkey"],
				skillPacks: [],
				proxy: "none",
				gpu: false,
				platform: "linux/amd64",
				deployment: "local",
				deploymentType: "docker",
				generateSecrets: true,
				openclawVersion: "latest",
				monitoring: false,
			}),
		});

		// generate() throws on conflicts, which should result in 409
		expect(res.status).toBe(409);
		const body = await res.json();
		expect(body.error.code).toBe("CONFLICT_ERROR");
	});
});
