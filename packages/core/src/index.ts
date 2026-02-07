// ─── Schemas ────────────────────────────────────────────────────────────────
export {
	ServiceCategorySchema,
	MaturitySchema,
	PlatformSchema,
	RestartPolicySchema,
	ProxyTypeSchema,
	DeploymentTargetSchema,
	OutputFormatSchema,
	PortMappingSchema,
	VolumeMappingSchema,
	EnvVariableSchema,
	HealthCheckSchema,
	ResourceLimitsSchema,
	DeploySchema,
	SkillBindingSchema,
	ServiceDefinitionSchema,
	SkillPackSchema,
	PresetSchema,
	GenerationInputSchema,
	ResolvedServiceSchema,
	AddedDependencySchema,
	WarningSchema,
	ErrorSchema,
	ResolverOutputSchema,
	ComposeOptionsSchema,
	ValidateRequestSchema,
	ValidateResponseSchema,
	ApiErrorSchema,
} from "./schema.js";

// ─── Types ──────────────────────────────────────────────────────────────────
export type {
	ServiceCategory,
	Maturity,
	Platform,
	RestartPolicy,
	ProxyType,
	DeploymentTarget,
	OutputFormat,
	PortMapping,
	VolumeMapping,
	EnvVariable,
	HealthCheck,
	ResourceLimits,
	Deploy,
	SkillBinding,
	ServiceDefinition,
	SkillPack,
	Preset,
	GenerationInput,
	ComposeOptions,
	ResolvedService,
	AddedDependency,
	Warning,
	ResolverError,
	ResolverOutput,
	ValidateRequest,
	ValidateResponse,
	ApiError,
	ResolverInput,
	GeneratedFiles,
	GenerationMetadata,
	GenerationResult,
	CategoryInfo,
} from "./types.js";

export { SERVICE_CATEGORIES } from "./types.js";

// ─── Service Registry ───────────────────────────────────────────────────────
export { serviceRegistry, getServiceById, getServicesByCategory, getAllServices } from "./services/registry.js";

// ─── Skill Packs ────────────────────────────────────────────────────────────
export { skillPackRegistry, getSkillPackById, getAllSkillPacks, getCompatibleSkillPacks } from "./skills/registry.js";

// ─── Presets ────────────────────────────────────────────────────────────────
export { presetRegistry, getPresetById, getAllPresets } from "./presets/registry.js";

// ─── Core Engines ───────────────────────────────────────────────────────────
export { resolve } from "./resolver.js";
export { compose } from "./composer.js";
export { validate } from "./validator.js";
export { generateEnvFiles } from "./generators/env.js";
export { generateSkillFiles } from "./generators/skills.js";
export { generateReadme } from "./generators/readme.js";
export { generateScripts } from "./generators/scripts.js";
export { generateCaddyfile } from "./generators/caddy.js";
export { generatePrometheusConfig } from "./generators/prometheus.js";
export { generateGrafanaConfig } from "./generators/grafana.js";
export { generate } from "./generate.js";
