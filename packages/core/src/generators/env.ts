import type { ResolverOutput } from "../types.js";
import { randomBytes } from "node:crypto";

/**
 * Options for environment file generation.
 */
export interface EnvGeneratorOptions {
	generateSecrets: boolean;
	domain?: string;
	openclawVersion?: string;
}

/**
 * Generates `.env.example` and `.env` file contents from resolved services.
 *
 * - `.env.example`: every env var with descriptive comments, placeholders for secrets
 * - `.env`: same vars but secrets filled with cryptographically random values when generateSecrets is true
 */
export function generateEnvFiles(
	resolved: ResolverOutput,
	options: EnvGeneratorOptions,
): { envExample: string; env: string } {
	const version = options.openclawVersion ?? "latest";
	const lines: { comment: string; key: string; exampleValue: string; actualValue: string }[] = [];

	// ── Base OpenClaw Variables ──────────────────────────────────────────────

	lines.push({
		comment: formatComment(
			"OpenClaw version to deploy",
			"OpenClaw Core",
			true,
			false,
		),
		key: "OPENCLAW_VERSION",
		exampleValue: version,
		actualValue: version,
	});

	const gatewayToken = options.generateSecrets
		? randomBytes(24).toString("hex")
		: "";

	lines.push({
		comment: formatComment(
			"Authentication token for the OpenClaw gateway API",
			"OpenClaw Core",
			true,
			true,
		),
		key: "OPENCLAW_GATEWAY_TOKEN",
		exampleValue: "your_gateway_token_here",
		actualValue: gatewayToken,
	});

	lines.push({
		comment: formatComment(
			"Port the OpenClaw gateway listens on",
			"OpenClaw Core",
			true,
			false,
		),
		key: "OPENCLAW_GATEWAY_PORT",
		exampleValue: "18789",
		actualValue: "18789",
	});

	if (options.domain) {
		lines.push({
			comment: formatComment(
				"Primary domain for service routing",
				"OpenClaw Core",
				false,
				false,
			),
			key: "OPENCLAW_DOMAIN",
			exampleValue: "example.com",
			actualValue: options.domain,
		});
	}

	// ── Service-Specific Variables ───────────────────────────────────────────

	const seenKeys = new Set<string>([
		"OPENCLAW_VERSION",
		"OPENCLAW_GATEWAY_TOKEN",
		"OPENCLAW_GATEWAY_PORT",
		"OPENCLAW_DOMAIN",
	]);

	for (const { definition } of resolved.services) {
		const allEnvVars = [
			...definition.environment,
			...definition.openclawEnvVars,
		];

		if (allEnvVars.length === 0) continue;

		// Section separator for this service
		lines.push({
			comment: `\n# ═══════════════════════════════════════════════════════════════════════════════\n# ${definition.icon} ${definition.name}\n# ═══════════════════════════════════════════════════════════════════════════════`,
			key: "",
			exampleValue: "",
			actualValue: "",
		});

		for (const envVar of allEnvVars) {
			if (seenKeys.has(envVar.key)) continue;
			seenKeys.add(envVar.key);

			const secretValue = options.generateSecrets
				? randomBytes(24).toString("hex")
				: "";

			const exampleValue = envVar.secret
				? `your_${envVar.key.toLowerCase()}_here`
				: envVar.defaultValue;

			let actualValue: string;
			if (envVar.secret) {
				actualValue = envVar.defaultValue.startsWith("${")
					? envVar.defaultValue
					: secretValue;
			} else {
				actualValue = envVar.defaultValue;
			}

			lines.push({
				comment: formatComment(
					envVar.description,
					definition.name,
					envVar.required,
					envVar.secret,
				),
				key: envVar.key,
				exampleValue,
				actualValue,
			});
		}
	}

	// ── Build output strings ────────────────────────────────────────────────

	const header = [
		"# ═══════════════════════════════════════════════════════════════════════════════",
		"# OpenClaw Environment Configuration",
		`# Generated at ${new Date().toISOString()}`,
		"# ═══════════════════════════════════════════════════════════════════════════════",
		"",
	].join("\n");

	let envExample = header;
	let env = header;

	for (const line of lines) {
		if (line.key === "") {
			// Section comment
			envExample += `${line.comment}\n`;
			env += `${line.comment}\n`;
		} else {
			envExample += `${line.comment}\n${line.key}=${line.exampleValue}\n\n`;
			env += `${line.comment}\n${line.key}=${line.actualValue}\n\n`;
		}
	}

	return { envExample, env };
}

/**
 * Format a descriptive comment block for an environment variable.
 */
function formatComment(
	description: string,
	serviceName: string,
	required: boolean,
	secret: boolean,
): string {
	return [
		`# ${description}`,
		`# Service: ${serviceName} | Required: ${required ? "Yes" : "No"} | Secret: ${secret ? "Yes" : "No"}`,
	].join("\n");
}
