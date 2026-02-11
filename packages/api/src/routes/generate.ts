import { GenerationInputSchema, generate } from "@better-openclaw/core";
import archiver from "archiver";
import { Hono } from "hono";
import { Writable } from "node:stream";

const route = new Hono();

/** Build a ZIP buffer from generated files (projectName as root folder). */
function buildZipBuffer(
	projectName: string,
	files: Record<string, string>,
): Promise<Buffer> {
	return new Promise((resolve, reject) => {
		const archive = archiver("zip", { zlib: { level: 9 } });
		const chunks: Buffer[] = [];
		const collector = new Writable({
			write(chunk: Buffer, _enc, cb) {
				chunks.push(chunk);
				cb();
			},
		});
		archive.pipe(collector);
		archive.on("error", reject);
		archive.on("end", () => resolve(Buffer.concat(chunks)));

		for (const [path, content] of Object.entries(files)) {
			archive.append(Buffer.from(content, "utf8"), { name: `${projectName}/${path}` });
		}
		archive.finalize();
	});
}

route.post("/", async (c) => {
	try {
		const body = await c.req.json();

		const parsed = GenerationInputSchema.safeParse(body);
		if (!parsed.success) {
			return c.json(
				{
					error: {
						code: "VALIDATION_ERROR",
						message: "Invalid generation input",
						details: parsed.error.issues.map((issue: { path: PropertyKey[]; message: string }) => ({
							field: issue.path.join("."),
							message: issue.message,
						})),
					},
				},
				400,
			);
		}

		const result = generate(parsed.data);
		const accept = c.req.header("Accept") ?? "";
		const format = c.req.query("format");

		// ZIP: return binary ZIP (Accept: application/zip or ?format=zip)
		const wantsZip =
			accept.includes("application/zip") || format?.toLowerCase() === "zip";
		if (wantsZip) {
			const projectName = parsed.data.projectName ?? "project";
			const zipBuffer = await buildZipBuffer(projectName, result.files);
			return c.body(new Uint8Array(zipBuffer), 200, {
				"Content-Disposition": `attachment; filename="${projectName}.zip"`,
				"Content-Type": "application/zip",
			});
		}

		// Complete JSON: input + files + metadata for clawexa.net or export (?format=complete)
		const wantsComplete =
			format?.toLowerCase() === "complete" ||
			accept.includes("application/vnd.openclaw.complete+json");
		if (wantsComplete) {
			return c.json({
				formatVersion: "1",
				input: parsed.data,
				files: result.files,
				metadata: result.metadata,
			});
		}

		// Default: files + metadata only
		return c.json({
			files: result.files,
			metadata: result.metadata,
		});
	} catch (err) {
		const message = err instanceof Error ? err.message : "Generation failed";
		const isConfigError =
			message.includes("Invalid stack configuration") || message.includes("Validation failed");
		return c.json(
			{
				error: {
					code: isConfigError ? "CONFLICT_ERROR" : "GENERATION_ERROR",
					message,
				},
			},
			isConfigError ? 409 : 500,
		);
	}
});

export { route as generateRoute };
