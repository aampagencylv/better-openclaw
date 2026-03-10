import { dashClient, sentinelClient } from "@better-auth/infra/client";
import { passkeyClient } from "@better-auth/passkey/client";
import { magicLinkClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

const API_BASE =
	process.env.NEXT_PUBLIC_AUTH_API_URL ||
	(typeof window !== "undefined" ? window.location.origin : "http://localhost:3456");

export const authClient = createAuthClient({
	baseURL: API_BASE,
	plugins: [
		magicLinkClient(),
		passkeyClient(),
		dashClient(),
		sentinelClient({
			autoSolveChallenge: true, // Automatically solve PoW challenges
		}),
	],
});

export const { useSession, signIn, signOut, signUp } = authClient;
