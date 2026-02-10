import { defineConfig } from 'tsdown';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['esm'],
    unbundle: false,
    target: 'node20',
    sourcemap: true,
    clean: true,
    dts: false, // Turn off dts generation if not needed for an app, speeds up build
});
