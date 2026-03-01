/**
 * Stack manifest generator — produces a JSON manifest describing the
 * chosen services, skills, and configuration for a generated stack.
 *
 * This manifest is consumed by Mission Control to render dynamic
 * services/skills pages for managing the deployed stack.
 */

import type { GenerationInput, ResolverOutput } from "../types.js";

export interface StackManifestService {
	id: string;
	name: string;
	category: string;
	icon: string;
	image: string;
	imageTag: string;
	ports: { container: number; host?: number; exposed: boolean; description: string }[];
	docsUrl: string;
	addedBy: string;
	dependencyOf?: string;
}

export interface StackManifestSkill {
	id: string;
	name: string;
	path: string;
	serviceIds: string[];
}

export interface StackManifest {
	formatVersion: string;
	generatedAt: string;
	projectName: string;
	deployment?: string;
	deploymentType?: string;
	platform?: string;
	proxy?: string;
	domain?: string;
	services: StackManifestService[];
	skills: StackManifestSkill[];
	metadata: {
		serviceCount: number;
		skillCount: number;
		estimatedMemoryMB: number;
	};
}

/**
 * Generate stack-manifest.json from resolved output and generation input.
 * Returns a single-file record: { "stack-manifest.json": string }.
 */
export function generateStackManifest(
	resolved: ResolverOutput,
	input: GenerationInput,
): Record<string, string> {
	// Build a lookup of dependency chains: serviceId → requiredBy
	const depMap = new Map<string, string>();
	for (const dep of resolved.addedDependencies) {
		const depId = dep.serviceId ?? dep.service;
		if (dep.requiredBy) {
			depMap.set(depId, dep.requiredBy);
		}
	}

	const services: StackManifestService[] = resolved.services.map((svc) => {
		const def = svc.definition;
		return {
			id: def.id,
			name: def.name,
			category: def.category,
			icon: def.icon,
			image: def.image,
			imageTag: def.imageTag,
			ports: def.ports.map((p) => ({
				container: p.container,
				host: p.host,
				exposed: p.exposed,
				description: p.description,
			})),
			docsUrl: def.docsUrl,
			addedBy: svc.addedBy,
			...(svc.addedBy !== "user" && depMap.has(def.id) ? { dependencyOf: depMap.get(def.id) } : {}),
		};
	});

	// Collect skills from service definitions (SkillBinding has skillId, not name)
	const skills: StackManifestSkill[] = [];
	const seenSkillIds = new Set<string>();
	for (const svc of resolved.services) {
		for (const skill of svc.definition.skills) {
			const skillKey = `${svc.definition.id}-${skill.skillId}`;
			if (seenSkillIds.has(skillKey)) continue;
			seenSkillIds.add(skillKey);
			skills.push({
				id: skillKey,
				name: skill.skillId,
				path: `openclaw/skills/${skill.skillId}.md`,
				serviceIds: [svc.definition.id],
			});
		}
	}

	const skillCount = skills.length;

	const manifest: StackManifest = {
		formatVersion: "1",
		generatedAt: new Date().toISOString(),
		projectName: input.projectName,
		deployment: input.deployment,
		deploymentType: input.deploymentType,
		platform: input.platform,
		proxy: input.proxy,
		domain: input.domain,
		services,
		skills,
		metadata: {
			serviceCount: resolved.services.length,
			skillCount,
			estimatedMemoryMB: resolved.estimatedMemoryMB,
		},
	};

	return {
		"stack-manifest.json": JSON.stringify(manifest, null, 2),
	};
}
