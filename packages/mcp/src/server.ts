import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerPresetsResource } from "./resources/presets.js";
import { registerServicesResource } from "./resources/services.js";
import { registerSkillsResource } from "./resources/skills.js";
import { registerGenerateStack } from "./tools/generate-stack.js";
import { registerGetPreset } from "./tools/get-preset.js";
import { registerGetService } from "./tools/get-service.js";
import { registerListPresets } from "./tools/list-presets.js";
import { registerListServices } from "./tools/list-services.js";
import { registerListSkillPacks } from "./tools/list-skill-packs.js";
import { registerResolveDeps } from "./tools/resolve-deps.js";
import { registerSearchServices } from "./tools/search-services.js";
import { registerSuggestServices } from "./tools/suggest-services.js";
import { registerValidateStack } from "./tools/validate-stack.js";

export function createServer(): McpServer {
	const server = new McpServer({
		name: "better-openclaw",
		version: "1.0.0",
	});

	// Tools
	registerListServices(server);
	registerGetService(server);
	registerSearchServices(server);
	registerListPresets(server);
	registerGetPreset(server);
	registerListSkillPacks(server);
	registerResolveDeps(server);
	registerValidateStack(server);
	registerGenerateStack(server);
	registerSuggestServices(server);

	// Resources
	registerServicesResource(server);
	registerPresetsResource(server);
	registerSkillsResource(server);

	return server;
}
