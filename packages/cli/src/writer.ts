import { execSync } from "node:child_process";
import { chmod, mkdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import pc from "picocolors";

/**
 * Writes the generated project files to disk.
 *
 * - Creates the project directory and all necessary subdirectories
 * - Writes each file with its content
 * - Makes `.sh` files executable (chmod +x)
 * - In dry-run mode, only logs what would be created
 * - Optionally creates a tar.gz or zip archive of the output
 */
export async function writeProject(
	projectDir: string,
	files: Record<string, string>,
	options?: { dryRun?: boolean; outputFormat?: string },
): Promise<void> {
	const sortedPaths = Object.keys(files).sort();

	if (options?.dryRun) {
		console.log(pc.bold("\nDry run — files that would be created:\n"));
		for (const filePath of sortedPaths) {
			console.log(`  ${pc.cyan(join(projectDir, filePath))}`);
		}
		console.log(pc.dim(`\n  Total: ${sortedPaths.length} files`));
		return;
	}

	// Create root project directory
	await mkdir(projectDir, { recursive: true });

	// Collect all unique directories we need to create
	const dirs = new Set<string>();
	for (const filePath of sortedPaths) {
		const fullPath = join(projectDir, filePath);
		const dir = dirname(fullPath);
		dirs.add(dir);
	}

	// Create all directories
	for (const dir of dirs) {
		await mkdir(dir, { recursive: true });
	}

	// Write all files
	for (const filePath of sortedPaths) {
		const fullPath = join(projectDir, filePath);
		const content = files[filePath]!;
		await writeFile(fullPath, content, "utf-8");

		// Make shell scripts executable
		if (filePath.endsWith(".sh")) {
			try {
				await chmod(fullPath, 0o755);
			} catch {
				// chmod may not be supported on all platforms (e.g. Windows)
			}
		}
	}

	// Create archive if requested
	const fmt = options?.outputFormat;
	if (fmt === "tar" || fmt === "zip") {
		await createArchive(projectDir, fmt);
	}
}

/**
 * Creates a tar.gz or zip archive from the project directory.
 */
async function createArchive(projectDir: string, format: "tar" | "zip"): Promise<void> {
	const absDir = resolve(projectDir);
	const parentDir = dirname(absDir);
	const baseName = absDir.split(/[\\/]/).pop()!;

	try {
		if (format === "tar") {
			const archivePath = `${absDir}.tar.gz`;
			execSync(`tar -czf "${archivePath}" -C "${parentDir}" "${baseName}"`, {
				stdio: "pipe",
			});
			console.log(pc.green(`  Archive created: ${archivePath}`));
		} else {
			// zip
			const archivePath = `${absDir}.zip`;
			if (process.platform === "win32") {
				// Use PowerShell Compress-Archive on Windows
				execSync(
					`powershell -NoProfile -Command "Compress-Archive -Path '${absDir}\\*' -DestinationPath '${archivePath}' -Force"`,
					{ stdio: "pipe" },
				);
			} else {
				execSync(`cd "${parentDir}" && zip -r "${archivePath}" "${baseName}"`, { stdio: "pipe" });
			}
			console.log(pc.green(`  Archive created: ${archivePath}`));
		}
	} catch (err) {
		console.log(
			pc.yellow(
				`  Warning: Could not create ${format} archive. ${err instanceof Error ? err.message : String(err)}`,
			),
		);
		console.log(pc.dim(`  The project files are still available in ${projectDir}`));
	}
}
