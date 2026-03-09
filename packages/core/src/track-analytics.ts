import type { GenerationInput, GenerationMetadata } from "./types.js";

export interface AnalyticsPayload {
	source: "cli" | "web" | "api" | "mcp";
	buildMethod: "preset" | "custom";
	presetId: string | null;
	services: string[];
	skillPacks: string[];
	serviceCount: number;
	proxy: string;
	deployment: string;
	deploymentType: string;
	platform: string;
	gpu: boolean;
	monitoring: boolean;
	hasDomain: boolean;
	openclawImage: string;
	estimatedMemoryMB: number;
}

/**
 * Build an analytics payload from generation input and metadata.
 * Pure function — does not send anything.
 */
export function buildAnalyticsPayload(
	input: GenerationInput,
	metadata: GenerationMetadata,
	source: AnalyticsPayload["source"],
	presetId?: string | null,
): AnalyticsPayload {
	return {
		source,
		buildMethod: presetId ? "preset" : "custom",
		presetId: presetId ?? null,
		services: input.services,
		skillPacks: input.skillPacks,
		serviceCount: metadata.serviceCount,
		proxy: input.proxy,
		deployment: input.deployment,
		deploymentType: input.deploymentType,
		platform: input.platform,
		gpu: input.gpu,
		monitoring: input.monitoring,
		hasDomain: Boolean(input.domain),
		openclawImage: input.openclawImage,
		estimatedMemoryMB: metadata.estimatedMemoryMB,
	};
}

const DEFAULT_API_URL = "https://better-openclaw.dev/api/v1/analytics/event";

/**
 * Fire-and-forget POST to the analytics endpoint.
 * Respects DISABLE_ANALYTICS=true env var.
 * Silently catches all errors — tracking must never crash the main flow.
 */
export async function trackAnalytics(
	payload: AnalyticsPayload,
	apiUrl: string = DEFAULT_API_URL,
): Promise<void> {
	if (process.env.DISABLE_ANALYTICS === "true") return;

	try {
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 5000);
		await fetch(apiUrl, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
			signal: controller.signal,
		});
		clearTimeout(timeout);
	} catch {
		// Silent — tracking must never block or crash generation
	}
}
