import { defineConfig } from "tsdown";

export default defineConfig({
	entry: ["src/index.ts", "src/schema.ts"],
	format: ["esm", "cjs"],
	sourcemap: true,
	clean: true,
	dts: true,
	inlineOnly: false,
});
