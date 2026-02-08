const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3456/v1";

export interface ServiceResponse {
	id: string;
	name: string;
	description: string;
	category: string;
	icon: string;
	maturity: string;
	minMemoryMB?: number;
	tags: string[];
	requires: string[];
	recommends: string[];
	conflictsWith: string[];
	gpuRequired: boolean;
}

export interface SkillPackResponse {
	id: string;
	name: string;
	description: string;
	requiredServices: string[];
	skills: string[];
	icon?: string;
	tags: string[];
}

export interface PresetResponse {
	id: string;
	name: string;
	description: string;
	services: string[];
	skillPacks: string[];
	estimatedMemoryMB?: number;
}

export interface ValidateResponse {
	valid: boolean;
	resolvedServices: string[];
	addedDependencies: { service: string; reason: string }[];
	warnings: { type: string; message: string }[];
	conflicts: { type: string; message: string }[];
	estimatedMemoryMB: number;
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
	const res = await fetch(`${API_BASE}${path}`, {
		headers: { "Content-Type": "application/json" },
		...options,
	});

	if (!res.ok) {
		const body = await res.json().catch(() => null);
		throw new Error(body?.error?.message ?? `API error: ${res.status} ${res.statusText}`);
	}

	return res.json() as Promise<T>;
}

export async function fetchServices(): Promise<ServiceResponse[]> {
	return apiFetch<ServiceResponse[]>("/services");
}

export async function fetchSkillPacks(services?: string[]): Promise<SkillPackResponse[]> {
	const params = services?.length ? `?services=${encodeURIComponent(services.join(","))}` : "";
	return apiFetch<SkillPackResponse[]>(`/skills${params}`);
}

export async function fetchPresets(): Promise<PresetResponse[]> {
	return apiFetch<PresetResponse[]>("/presets");
}

export async function validateStack(config: {
	services: string[];
	skillPacks?: string[];
	proxy?: string;
	gpu?: boolean;
	platform?: string;
}): Promise<ValidateResponse> {
	return apiFetch<ValidateResponse>("/validate", {
		method: "POST",
		body: JSON.stringify(config),
	});
}

export interface GenerateResponse {
	files: Record<string, string>;
	metadata: {
		serviceCount: number;
		skillCount: number;
		estimatedMemoryMB: number;
		generatedAt: string;
	};
}

export async function generateStack(config: {
	projectName: string;
	services: string[];
	skillPacks?: string[];
	proxy?: string;
	domain?: string;
	gpu?: boolean;
	platform?: string;
	deployment?: string;
	monitoring?: boolean;
}): Promise<GenerateResponse> {
	return apiFetch<GenerateResponse>("/generate", {
		method: "POST",
		body: JSON.stringify(config),
	});
}
