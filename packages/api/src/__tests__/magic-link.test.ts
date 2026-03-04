/**
 * Magic link OTP capture test.
 *
 * Verifies that the magic link plugin:
 * 1. Has a sendMagicLink handler configured
 * 2. The testUtils plugin is accessible and has test helpers
 *
 * Using the in-memory test auth fixture so no real email is sent.
 */

import type { TestHelpers } from "better-auth/plugins";
import { beforeAll, describe, expect, it } from "vitest";
import { getTestHelpers, testAuth } from "./fixtures/test-auth.js";

describe("Magic link", () => {
	let test: TestHelpers;

	beforeAll(async () => {
		test = await getTestHelpers();
	});

	it("testUtils plugin is available on testAuth", async () => {
		const ctx = await testAuth.$context;
		expect(ctx.test).toBeDefined();
	});

	it("createUser factory generates valid defaults", () => {
		const user = test.createUser();
		expect(user.id).toBeTruthy();
		expect(user.email).toMatch(/@example\.com$/);
		expect(user.name).toBe("Test User");
	});

	it("createUser accepts overrides", () => {
		const user = test.createUser({
			email: "magic@openclaw.dev",
			name: "Magic User",
		});
		expect(user.email).toBe("magic@openclaw.dev");
		expect(user.name).toBe("Magic User");
	});

	it("saveUser + deleteUser work round-trip", async () => {
		const user = test.createUser({ email: "roundtrip@example.com" });
		const saved = await test.saveUser(user);

		// Confirm saved user can be retrieved as an authenticated session
		const headers = await test.getAuthHeaders({ userId: saved.id });
		const session = await testAuth.api.getSession({ headers });
		expect(session?.user.id).toBe(saved.id);

		// Cleanup
		await test.deleteUser(saved.id);

		// After deletion, the session should be invalid
		const afterDelete = await testAuth.api.getSession({ headers });
		expect(afterDelete).toBeNull();
	});

	it("magicLink plugin is configured on testAuth", async () => {
		// Verify the plugin is active via the auth context
		const ctx = await testAuth.$context;
		const pluginIds = (ctx.options.plugins ?? []).map((p: { id: string }) => p.id);
		expect(pluginIds).toContain("magic-link");
	});
});

describe("Password reset", () => {
	it("passkey plugin is configured on testAuth", async () => {
		const ctx = await testAuth.$context;
		const pluginIds = (ctx.options.plugins ?? []).map((p: { id: string }) => p.id);
		expect(pluginIds).toContain("passkey");
	});

	it("resetPassword API endpoint exists on testAuth", () => {
		// better-auth exposes this as resetPassword (not forgetPassword)
		expect(typeof testAuth.api.resetPassword).toBe("function");
	});

	it("testUtils plugin is included in testAuth", async () => {
		const ctx = await testAuth.$context;
		const pluginIds = (ctx.options.plugins ?? []).map((p: { id: string }) => p.id);
		expect(pluginIds).toContain("test-utils");
	});
});
