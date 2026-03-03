/**
 * Tests for stacks + favorites route access control.
 *
 * Rather than importing the real `app` (which requires a live Postgres
 * connection), we build a minimal Hono app here using the testAuth session
 * middleware. This lets us:
 *  - Verify 401 is returned when no session cookie is present
 *  - Verify session headers produced by testUtils are accepted
 */
import { describe, it, expect, beforeAll } from "vitest";
import { Hono } from "hono";
import type { TestHelpers } from "better-auth/plugins";
import { testAuth, getTestHelpers } from "./fixtures/test-auth.js";

// ── Build a minimal test app with session middleware ─────────────────────────

function buildTestApp() {
	const app = new Hono();

	// Replicate session middleware — use testAuth instead of real auth
	const sessionMiddleware = async (c: Parameters<Parameters<typeof app.use>[0]>[0], next: () => Promise<void>) => {
		const session = await testAuth.api.getSession({ headers: c.req.raw.headers });
		if (!session) {
			return c.json({ error: { code: "UNAUTHORIZED", message: "Unauthorized" } }, 401);
		}
		// Attach user to context
		c.set("user" as never, session.user);
		await next();
	};

	// Protected stubs
	app.use("/stacks/*", sessionMiddleware);
	app.use("/favorites/*", sessionMiddleware);

	app.get("/stacks", (c) => c.json({ stacks: [] }));
	app.post("/stacks", (c) => c.json({ stack: {} }, 201));
	app.get("/stacks/:id", (c) => c.json({ stack: {} }));
	app.patch("/stacks/:id", (c) => c.json({ stack: {} }));
	app.delete("/stacks/:id", (c) => c.json({ success: true }));

	app.get("/favorites", (c) => c.json({ favorites: [] }));
	app.post("/favorites", (c) => c.json({ favorite: {} }, 201));
	app.delete("/favorites/:stackId", (c) => c.json({ success: true }));

	return app;
}

const testApp = buildTestApp();

// ── Session middleware — 401 paths ────────────────────────────────────────────

describe("Stacks routes — unauthenticated (401)", () => {
	it("GET /stacks → 401 without session", async () => {
		const res = await testApp.request("/stacks");
		expect(res.status).toBe(401);
	});

	it("POST /stacks → 401 without session", async () => {
		const res = await testApp.request("/stacks", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name: "Test", services: [] }),
		});
		expect(res.status).toBe(401);
	});

	it("PATCH /stacks/:id → 401 without session", async () => {
		const res = await testApp.request("/stacks/some-id", {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name: "Renamed" }),
		});
		expect(res.status).toBe(401);
	});

	it("DELETE /stacks/:id → 401 without session", async () => {
		const res = await testApp.request("/stacks/some-id", { method: "DELETE" });
		expect(res.status).toBe(401);
	});
});

describe("Favorites routes — unauthenticated (401)", () => {
	it("GET /favorites → 401 without session", async () => {
		const res = await testApp.request("/favorites");
		expect(res.status).toBe(401);
	});

	it("POST /favorites → 401 without session", async () => {
		const res = await testApp.request("/favorites", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ stackId: "some-id" }),
		});
		expect(res.status).toBe(401);
	});

	it("DELETE /favorites/:stackId → 401 without session", async () => {
		const res = await testApp.request("/favorites/some-id", { method: "DELETE" });
		expect(res.status).toBe(401);
	});
});

// ── Session middleware — authenticated paths ──────────────────────────────────

describe("Stacks routes — authenticated (200/201)", () => {
	let test: TestHelpers;

	beforeAll(async () => {
		test = await getTestHelpers();
	});

	it("GET /stacks → 200 with valid session", async () => {
		const user = test.createUser({ email: "stacks-get@example.com" });
		await test.saveUser(user);

		const headers = await test.getAuthHeaders({ userId: user.id });
		const res = await testApp.request("/stacks", { headers });

		expect(res.status).toBe(200);
		const body = await res.json();
		expect(body).toHaveProperty("stacks");

		await test.deleteUser(user.id);
	});

	it("POST /stacks → 201 with valid session", async () => {
		const user = test.createUser({ email: "stacks-post@example.com" });
		await test.saveUser(user);

		const { headers } = await test.login({ userId: user.id });
		const res = await testApp.request("/stacks", {
			method: "POST",
			headers: new Headers({ ...Object.fromEntries(headers), "Content-Type": "application/json" }),
			body: JSON.stringify({ name: "My Stack", services: ["redis"] }),
		});

		expect(res.status).toBe(201);

		await test.deleteUser(user.id);
	});
});

describe("Favorites routes — authenticated (200/201)", () => {
	let test: TestHelpers;

	beforeAll(async () => {
		test = await getTestHelpers();
	});

	it("GET /favorites → 200 with valid session", async () => {
		const user = test.createUser({ email: "fav-get@example.com" });
		await test.saveUser(user);

		const headers = await test.getAuthHeaders({ userId: user.id });
		const res = await testApp.request("/favorites", { headers });

		expect(res.status).toBe(200);
		const body = await res.json();
		expect(body).toHaveProperty("favorites");

		await test.deleteUser(user.id);
	});
});
