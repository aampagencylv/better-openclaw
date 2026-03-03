import { createAuthClient } from "better-auth/react";
import { magicLinkClient } from "better-auth/client/plugins";
import { passkeyClient } from "@better-auth/passkey/client";
import { dashClient, sentinelClient } from "@better-auth/infra/client";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3456/v1";

export const authClient = createAuthClient({
	baseURL: API_BASE,
	basePath: "/auth",
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
