import { existsSync } from "node:fs";
import { readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { writeProject } from "./writer.js";

const testDir = join(tmpdir(), `openclaw-writer-test-${Date.now()}`);

afterEach(async () => {
	try {
		await rm(testDir, { recursive: true, force: true });
	} catch {
		// ignore cleanup errors
	}
});

describe("writeProject", () => {
	it("creates files in the project directory", async () => {
		const files = {
			"docker-compose.yml": "version: '3.8'\nservices: {}",
			".env": "KEY=value",
		};

		await writeProject(testDir, files);

		const compose = await readFile(join(testDir, "docker-compose.yml"), "utf-8");
		expect(compose).toContain("version: '3.8'");

		const env = await readFile(join(testDir, ".env"), "utf-8");
		expect(env).toBe("KEY=value");
	});

	it("creates nested subdirectories", async () => {
		const files = {
			"config/grafana/dashboards/main.json": '{"dashboard": true}',
			"scripts/install.sh": "#!/bin/bash\necho hello",
		};

		await writeProject(testDir, files);

		const dashboard = await readFile(join(testDir, "config/grafana/dashboards/main.json"), "utf-8");
		expect(dashboard).toContain("dashboard");

		expect(existsSync(join(testDir, "scripts/install.sh"))).toBe(true);
	});

	it("does not write files in dry-run mode", async () => {
		const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

		const files = {
			"docker-compose.yml": "content",
			".env": "content",
		};

		await writeProject(testDir, files, { dryRun: true });

		// Directory should not exist (or be empty)
		expect(existsSync(join(testDir, "docker-compose.yml"))).toBe(false);

		// Should have logged the file paths
		expect(consoleSpy).toHaveBeenCalled();

		consoleSpy.mockRestore();
	});

	it("handles empty file map", async () => {
		await writeProject(testDir, {});
		expect(existsSync(testDir)).toBe(true);
	});
});
