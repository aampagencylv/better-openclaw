// Client-safe manifest data loader
import type { SkillManifestEntry } from "@better-openclaw/core";
import { getAllManifestSkills } from "@better-openclaw/core";

export function getClientManifestSkills(): SkillManifestEntry[] {
	return getAllManifestSkills();
}

export type { SkillManifestEntry };
