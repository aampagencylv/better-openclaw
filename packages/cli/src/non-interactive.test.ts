import { rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { runNonInteractive } from "./non-interactive.js";

// Suppress console output during tests
vi.spyOn(console, "log").mockImplementation(() => {});

const testDir = join(tmpdir(), `openclaw-ni-test-${Date.now()}`);

afterEach(async () => {
	try {
		await rm(testDir, { recursive: true, force: true });
	} catch {
		// ignore
	}
});

describe("runNonInteractive", () => {
	it("throws on unknown preset", async () => {
		await expect(runNonInteractive({ preset: "nonexistent-preset-xyz" })).rejects.toThrow(
			/Unknown preset/,
		);
	});

	it("throws on unknown service", async () => {
		await expect(runNonInteractive({ services: "nonexistent-service-xyz" })).rejects.toThrow(
			/Unknown service/,
		);
	});

	it("throws on unknown skill pack", async () => {
		await expect(runNonInteractive({ skills: "nonexistent-pack-xyz" })).rejects.toThrow(
			/Unknown skill pack/,
		);
	});

	it("throws on invalid proxy type", async () => {
		await expect(
			runNonInteractive({
				services: "redis",
				proxy: "nginx",
			}),
		).rejects.toThrow(/Invalid proxy type/);
	});

	it("throws on invalid deployment type", async () => {
		await expect(
			runNonInteractive({
				services: "redis",
				deploymentType: "kubernetes",
			}),
		).rejects.toThrow(/Invalid deployment type/);
	});

	it("generates with --yes flag using minimal preset", async () => {
		await expect(
			runNonInteractive({
				yes: true,
				projectDirectory: testDir,
				dryRun: true,
			}),
		).resolves.toBeUndefined();
	});

	it("generates from a valid preset in dry-run mode", async () => {
		await expect(
			runNonInteractive({
				preset: "minimal",
				projectDirectory: testDir,
				dryRun: true,
			}),
		).resolves.toBeUndefined();
	});

	it("generates with explicit services in dry-run mode", async () => {
		await expect(
			runNonInteractive({
				services: "redis,postgresql",
				projectDirectory: testDir,
				dryRun: true,
			}),
		).resolves.toBeUndefined();
	});
});
