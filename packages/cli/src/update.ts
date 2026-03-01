import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import pc from "picocolors";

/**
 * Runs `better-openclaw update` — pulls latest images and restarts the stack.
 */
export async function runUpdate(options: {
	dir: string;
	dryRun?: boolean;
	json?: boolean;
}): Promise<void> {
	const dir = resolve(options.dir);
	const composePath = join(dir, "docker-compose.yml");

	if (!existsSync(composePath)) {
		if (options.json) {
			console.log(JSON.stringify({ error: "No docker-compose.yml found", dir }));
		} else {
			console.error(pc.red(`No docker-compose.yml found in "${dir}".`));
			console.error(pc.dim("Run 'better-openclaw generate' first to create a stack."));
		}
		process.exit(1);
	}

	try {
		execSync("docker compose version", { stdio: "pipe" });
	} catch {
		if (options.json) {
			console.log(JSON.stringify({ error: "Docker Compose not found" }));
		} else {
			console.error(pc.red("Docker Compose is not installed or not in PATH."));
		}
		process.exit(1);
	}

	if (options.dryRun) {
		if (!options.json) {
			console.log(pc.cyan("\nDry run — would perform the following:"));
			console.log(pc.dim("  1. docker compose pull"));
			console.log(pc.dim("  2. docker compose up -d"));
			console.log("");
		} else {
			console.log(JSON.stringify({ dryRun: true, steps: ["pull", "up -d"] }));
		}
		return;
	}

	if (!options.json) {
		console.log(pc.cyan("\nPulling latest images..."));
	}

	try {
		const pullOutput = execSync("docker compose pull", {
			cwd: dir,
			stdio: options.json ? ["pipe", "pipe", "pipe"] : ["pipe", "inherit", "inherit"],
			encoding: "utf-8",
		});

		if (!options.json) {
			console.log(pc.cyan("\nRestarting services with new images..."));
		}

		execSync("docker compose up -d", {
			cwd: dir,
			stdio: options.json ? ["pipe", "pipe", "pipe"] : ["pipe", "inherit", "inherit"],
			encoding: "utf-8",
		});

		if (options.json) {
			console.log(JSON.stringify({ success: true, dir }));
		} else {
			console.log(pc.green(pc.bold("\nStack updated successfully!")));
			console.log(pc.dim("Run 'better-openclaw status' to check service health.\n"));
		}
	} catch (err) {
		if (options.json) {
			console.log(
				JSON.stringify({
					error: err instanceof Error ? err.message : "Update failed",
				}),
			);
		} else {
			console.error(pc.red(`\nUpdate failed: ${err instanceof Error ? err.message : String(err)}`));
		}
		process.exit(1);
	}
}
