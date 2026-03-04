import { createAuthClient } from "better-auth/react";
import { magicLinkClient } from "better-auth/client/plugins";
import { passkeyClient } from "@better-auth/passkey/client";
import { dashClient, sentinelClient } from "@better-auth/infra/client";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3456";

export const authClient = createAuthClient({
	baseURL: API_BASE,
	headers: {
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
		"Access-Control-Allow-Headers": "Set-Cookie, Cookie, Content-Type, Authorization, x-api-key, baggage, sentry-trace, sentry-release, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, Access-Control-Allow-Origin",
	},
	plugins: [
		magicLinkClient(),
		passkeyClient(),
		dashClient(),
		sentinelClient({
			autoSolveChallenge: true, // Automatically solve PoW challenges
		})
	],
});

export const {
	useSession,
	signIn,
	signOut,
	signUp,
} = authClient;
