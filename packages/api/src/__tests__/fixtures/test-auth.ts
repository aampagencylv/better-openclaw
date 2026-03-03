/**
 * Test auth instance — uses better-auth's in-memory adapter so tests
 * run without any real database connection. The testUtils() plugin provides
 * factory helpers (createUser, saveUser) and auth helpers (login, getAuthHeaders).
 *
 * Import `testAuth` and `getTestHelpers()` from here in every auth test.
 */
import { betterAuth } from "better-auth";
import { memoryAdapter } from "better-auth/adapters/memory";
import { testUtils } from "better-auth/plugins";
import { magicLink } from "better-auth/plugins";
import { passkey } from "@better-auth/passkey";
import type { TestHelpers } from "better-auth/plugins";

const db = {
	user: [] as Record<string, unknown>[],
	session: [] as Record<string, unknown>[],
	account: [] as Record<string, unknown>[],
	verification: [] as Record<string, unknown>[],
};

export const testAuth = betterAuth({
	database: memoryAdapter(db),
	secret: "test-secret-key-32-chars-minimum!!",
	baseURL: "http://localhost:3456",
	basePath: "/v1/auth",
	emailAndPassword: {
		enabled: true,
		autoSignIn: true,
	},
	emailVerification: {
		sendOnSignUp: false, // skip email in tests
	},
	plugins: [
		testUtils(),
		magicLink({
			sendMagicLink: async () => {
				// captured via ctx.test.lastOtp in tests
			},
		}),
		passkey(),
	],
});

/** Get test helpers from the auth context (call inside beforeAll/it). */
export async function getTestHelpers(): Promise<TestHelpers> {
	const ctx = await testAuth.$context;
	return ctx.test as TestHelpers;
}
