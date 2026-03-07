import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		// Ensure DATABASE_URL is set before app/auth/db are imported.
		// CI provides it via env; locally use a default for route tests.
		env: {
			DATABASE_URL:
				process.env.DATABASE_URL ??
				"postgresql://postgres:postgres@localhost:5432/better_openclaw_test",
		},
	},
});
