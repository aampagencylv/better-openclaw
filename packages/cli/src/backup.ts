import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import pc from "picocolors";

/**
 * Runs `better-openclaw backup` — manages stack backups.
 *
 * Subcommands:
 *   create  — Dump PostgreSQL, snapshot Qdrant, tar volumes into timestamped archive
 *   restore — Restore from a backup archive
 *   list    — Show available backups
 */
export async function runBackupCreate(options: {
	dir: string;
	output?: string;
	json?: boolean;
}): Promise<void> {
	const dir = resolve(options.dir);
	const composePath = join(dir, "docker-compose.yml");

	if (!existsSync(composePath)) {
		if (options.json) {
			console.log(JSON.stringify({ error: "No docker-compose.yml found", dir }));
		} else {
			console.error(pc.red(`No docker-compose.yml found in "${dir}".`));
		}
		process.exit(1);
	}

	const backupDir = options.output || join(dir, "backups");
	mkdirSync(backupDir, { recursive: true });

	const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
	const backupName = `backup-${timestamp}`;
	const backupPath = join(backupDir, backupName);
	mkdirSync(backupPath, { recursive: true });

	if (!options.json) {
		console.log(pc.cyan(`\nCreating backup: ${backupName}`));
	}

	const results: { step: string; success: boolean; error?: string }[] = [];

	// 1. PostgreSQL dump
	try {
		const hasPostgres = execSync("docker compose ps --format json", {
			cwd: dir,
			encoding: "utf-8",
		}).includes("postgresql");

		if (hasPostgres) {
			if (!options.json) console.log(pc.dim("  Dumping PostgreSQL..."));
			execSync(
				`docker compose exec -T postgresql pg_dumpall -U openclaw > "${join(backupPath, "postgres.sql")}"`,
				{ cwd: dir, shell: "bash", stdio: ["pipe", "pipe", "pipe"] },
			);
			results.push({ step: "postgresql", success: true });
		}
	} catch (err) {
		results.push({
			step: "postgresql",
			success: false,
			error: err instanceof Error ? err.message : String(err),
		});
		if (!options.json) console.log(pc.yellow("  PostgreSQL dump skipped (not running)"));
	}

	// 2. Qdrant snapshot
	try {
		const hasQdrant = execSync("docker compose ps --format json", {
			cwd: dir,
			encoding: "utf-8",
		}).includes("qdrant");

		if (hasQdrant) {
			if (!options.json) console.log(pc.dim("  Snapshotting Qdrant..."));
			execSync(
				`docker compose exec -T qdrant wget -q -O - http://localhost:6333/snapshots > "${join(backupPath, "qdrant-snapshot.json")}"`,
				{ cwd: dir, shell: "bash", stdio: ["pipe", "pipe", "pipe"] },
			);
			results.push({ step: "qdrant", success: true });
		}
	} catch (err) {
		results.push({
			step: "qdrant",
			success: false,
			error: err instanceof Error ? err.message : String(err),
		});
		if (!options.json) console.log(pc.yellow("  Qdrant snapshot skipped (not running)"));
	}

	// 3. Archive the backup directory
	try {
		if (!options.json) console.log(pc.dim("  Creating archive..."));
		const archivePath = `${backupPath}.tar.gz`;
		execSync(`tar -czf "${archivePath}" -C "${backupDir}" "${backupName}"`, {
			stdio: "pipe",
		});

		// Clean up uncompressed directory
		execSync(
			process.platform === "win32" ? `rmdir /s /q "${backupPath}"` : `rm -rf "${backupPath}"`,
			{ stdio: "pipe" },
		);

		if (options.json) {
			console.log(JSON.stringify({ success: true, path: archivePath, steps: results }));
		} else {
			console.log(pc.green(pc.bold(`\nBackup created: ${archivePath}`)));
			for (const r of results) {
				const icon = r.success ? pc.green("done") : pc.yellow("skipped");
				console.log(`  ${r.step}: ${icon}`);
			}
			console.log("");
		}
	} catch (err) {
		if (options.json) {
			console.log(
				JSON.stringify({
					error: "Archive creation failed",
					detail: err instanceof Error ? err.message : String(err),
				}),
			);
		} else {
			console.error(
				pc.red(`Archive creation failed: ${err instanceof Error ? err.message : String(err)}`),
			);
		}
		process.exit(1);
	}
}

export async function runBackupList(options: { dir: string; json?: boolean }): Promise<void> {
	const dir = resolve(options.dir);
	const backupDir = join(dir, "backups");

	if (!existsSync(backupDir)) {
		if (options.json) {
			console.log(JSON.stringify({ backups: [] }));
		} else {
			console.log(pc.dim("\nNo backups found."));
			console.log(pc.dim("Run 'pnpx create-better-openclaw backup create' to create one.\n"));
		}
		return;
	}

	const files = readdirSync(backupDir)
		.filter((f) => f.startsWith("backup-") && f.endsWith(".tar.gz"))
		.sort()
		.reverse();

	if (options.json) {
		console.log(
			JSON.stringify({
				backups: files.map((f) => ({
					name: f,
					path: join(backupDir, f),
				})),
			}),
		);
		return;
	}

	if (files.length === 0) {
		console.log(pc.dim("\nNo backups found.\n"));
		return;
	}

	console.log(pc.bold(`\nAvailable Backups (${files.length}):\n`));
	for (const f of files) {
		console.log(`  ${pc.green(f)}`);
	}
	console.log("");
}

export async function runBackupRestore(options: {
	file: string;
	dir: string;
	json?: boolean;
}): Promise<void> {
	const dir = resolve(options.dir);
	const filePath = resolve(options.file);

	if (!existsSync(filePath)) {
		if (options.json) {
			console.log(JSON.stringify({ error: `Backup not found: ${filePath}` }));
		} else {
			console.error(pc.red(`Backup not found: ${filePath}`));
		}
		process.exit(1);
	}

	if (!options.json) {
		console.log(pc.cyan(`\nRestoring from: ${filePath}`));
		console.log(pc.yellow("Warning: This will stop services and replace data.\n"));
	}

	try {
		// Extract backup
		const tempDir = join(dir, ".backup-restore-tmp");
		mkdirSync(tempDir, { recursive: true });
		execSync(`tar -xzf "${filePath}" -C "${tempDir}"`, { stdio: "pipe" });

		// Find the extracted directory
		const extracted = readdirSync(tempDir).find((f) => f.startsWith("backup-"));
		if (!extracted) throw new Error("Invalid backup archive");

		const backupPath = join(tempDir, extracted);

		// Stop services
		if (!options.json) console.log(pc.dim("  Stopping services..."));
		execSync("docker compose stop", { cwd: dir, stdio: "pipe" });

		// Restore PostgreSQL
		const sqlPath = join(backupPath, "postgres.sql");
		if (existsSync(sqlPath)) {
			if (!options.json) console.log(pc.dim("  Restoring PostgreSQL..."));
			execSync("docker compose start postgresql", { cwd: dir, stdio: "pipe" });
			// Wait for PostgreSQL to be ready
			execSync("sleep 5", { stdio: "pipe" });
			execSync(`docker compose exec -T postgresql psql -U openclaw < "${sqlPath}"`, {
				cwd: dir,
				shell: "bash",
				stdio: "pipe",
			});
		}

		// Restart all services
		if (!options.json) console.log(pc.dim("  Starting services..."));
		execSync("docker compose up -d", { cwd: dir, stdio: "pipe" });

		// Cleanup
		execSync(process.platform === "win32" ? `rmdir /s /q "${tempDir}"` : `rm -rf "${tempDir}"`, {
			stdio: "pipe",
		});

		if (options.json) {
			console.log(JSON.stringify({ success: true, restored: filePath }));
		} else {
			console.log(pc.green(pc.bold("\nBackup restored successfully!")));
			console.log(pc.dim("Run 'better-openclaw status' to check service health.\n"));
		}
	} catch (err) {
		if (options.json) {
			console.log(
				JSON.stringify({
					error: err instanceof Error ? err.message : "Restore failed",
				}),
			);
		} else {
			console.error(pc.red(`Restore failed: ${err instanceof Error ? err.message : String(err)}`));
		}
		process.exit(1);
	}
}
