import { describe, expect, it } from "vitest";
import { buildAnalyticsPayload } from "./track-analytics.js";
import type { GenerationInput, GenerationMetadata } from "./types.js";

const baseInput: GenerationInput = {
	projectName: "test-stack",
	services: ["postgresql", "redis", "n8n"],
	skillPacks: ["research-agent"],
	aiProviders: ["openai"],
	gsdRuntimes: [],
	proxy: "caddy",
	domain: "example.com",
	gpu: false,
	platform: "linux/amd64",
	deployment: "local",
	deploymentType: "docker",
	generateSecrets: true,
	openclawVersion: "latest",
	monitoring: true,
	openclawImage: "official",
	openclawInstallMethod: "docker",
	hardened: true,
	deployTarget: "local",
};

const baseMetadata: GenerationMetadata = {
	serviceCount: 5,
	skillCount: 1,
	estimatedMemoryMB: 2048,
	resolvedServices: ["postgresql", "redis", "n8n", "caddy", "searxng"],
	generatedAt: "2026-03-09T00:00:00.000Z",
};

describe("buildAnalyticsPayload", () => {
	it("builds payload for a preset-based CLI generation", () => {
		const payload = buildAnalyticsPayload(baseInput, baseMetadata, "cli", "researcher");

		expect(payload.source).toBe("cli");
		expect(payload.buildMethod).toBe("preset");
		expect(payload.presetId).toBe("researcher");
		expect(payload.services).toEqual(["postgresql", "redis", "n8n"]);
		expect(payload.skillPacks).toEqual(["research-agent"]);
		expect(payload.serviceCount).toBe(5);
		expect(payload.proxy).toBe("caddy");
		expect(payload.deployment).toBe("local");
		expect(payload.deploymentType).toBe("docker");
		expect(payload.platform).toBe("linux/amd64");
		expect(payload.gpu).toBe(false);
		expect(payload.monitoring).toBe(true);
		expect(payload.hasDomain).toBe(true);
		expect(payload.openclawImage).toBe("official");
		expect(payload.estimatedMemoryMB).toBe(2048);
	});

	it("sets buildMethod to custom when no presetId", () => {
		const payload = buildAnalyticsPayload(baseInput, baseMetadata, "web");

		expect(payload.buildMethod).toBe("custom");
		expect(payload.presetId).toBeNull();
	});

	it("sets buildMethod to custom when presetId is null", () => {
		const payload = buildAnalyticsPayload(baseInput, baseMetadata, "api", null);

		expect(payload.buildMethod).toBe("custom");
		expect(payload.presetId).toBeNull();
	});

	it("sets hasDomain to false when no domain in input", () => {
		const noDomainInput = { ...baseInput, domain: undefined };
		const payload = buildAnalyticsPayload(noDomainInput, baseMetadata, "mcp");

		expect(payload.hasDomain).toBe(false);
	});

	it("preserves all source types", () => {
		for (const source of ["cli", "web", "api", "mcp"] as const) {
			const payload = buildAnalyticsPayload(baseInput, baseMetadata, source);
			expect(payload.source).toBe(source);
		}
	});
});
