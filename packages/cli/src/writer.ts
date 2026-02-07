import { mkdir, writeFile, chmod } from "node:fs/promises";
import { dirname, join } from "node:path";
import pc from "picocolors";

/**
 * Writes the generated project files to disk.
 *
 * - Creates the project directory and all necessary subdirectories
 * - Writes each file with its content
 * - Makes `.sh` files executable (chmod +x)
 * - In dry-run mode, only logs what would be created
 */
export async function writeProject(
	projectDir: string,
	files: Record<string, string>,
	options?: { dryRun?: boolean },
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
}
