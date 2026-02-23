// Client-safe manifest data loader
// Next.js bundler handles JSON imports at build time, so this works in "use client" components.
// We re-export manifest data as a typed array for the SkillSelectorModal.

import manifestData from "../../../../skills/manifest.json";

export interface SkillManifestEntry {
	id: string;
	path: string;
	emoji: string;
	services: string[];
}

const manifest = manifestData as { skills: SkillManifestEntry[] };

export function getClientManifestSkills(): SkillManifestEntry[] {
	return manifest.skills;
}
