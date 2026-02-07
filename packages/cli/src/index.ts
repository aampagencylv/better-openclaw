#!/usr/bin/env node
import { Command } from "commander";
import pc from "picocolors";
import { runWizard } from "./wizard.js";
import { runNonInteractive } from "./non-interactive.js";

const program = new Command()
	.name("create-better-openclaw")
	.description("Scaffold production-ready OpenClaw stacks with Docker Compose")
	.version("1.0.0")
	.argument("[project-directory]", "Directory name for the generated project")
	.option("-y, --yes", "Use default configuration (skip wizard)")
	.option("--services <ids>", "Comma-separated service IDs")
	.option("--skills <packs>", "Comma-separated skill pack IDs")
	.option("--preset <name>", "Use a preset stack configuration")
	.option("--proxy <type>", "Reverse proxy: none, caddy, traefik", "none")
	.option("--domain <domain>", "Domain for reverse proxy auto-SSL")
	.option("--monitoring", "Include monitoring stack")
	.option("--no-monitoring", "Exclude monitoring")
	.option("--gpu", "Enable GPU passthrough for AI services")
	.option("--platform <arch>", "Target platform", "linux/amd64")
	.option("--output-format <fmt>", "Output format: directory, tar, zip", "directory")
	.option("--dry-run", "Show what would be generated without writing files")
	.option("--open", "Open web UI stack builder in browser")
	.action(async (projectDirectory: string | undefined, options: Record<string, unknown>) => {
		// Handle --open flag: open web UI in browser and exit
		if (options.open) {
			const url = "https://better-openclaw.dev/new";
			const { exec } = await import("node:child_process");
			const command =
				process.platform === "win32"
					? "start"
					: process.platform === "darwin"
						? "open"
						: "xdg-open";
			exec(`${command} ${url}`, (err) => {
				if (err) {
					console.log(
						pc.dim(`Open ${url} in your browser to use the visual stack builder.`),
					);
				} else {
					console.log(pc.green(`Opened ${url} in your browser.`));
				}
			});
			return;
		}

		const isNonInteractive =
			options.yes || options.preset || options.services;

		// If stdin is not a TTY and no non-interactive flags, error out
		if (!process.stdin.isTTY && !isNonInteractive) {
			console.error(
				pc.red("Error: stdin is not a TTY and no non-interactive flags were provided."),
			);
			console.error("");
			console.error("Run with one of the following:");
			console.error(`  ${pc.cyan("--yes")}            Use default configuration`);
			console.error(`  ${pc.cyan("--preset <name>")}  Use a preset (minimal, creator, researcher, devops, full)`);
			console.error(`  ${pc.cyan("--services <ids>")} Provide comma-separated service IDs`);
			console.error("");
			console.error(`Or run in an interactive terminal to use the wizard.`);
			process.exit(1);
		}

		if (isNonInteractive) {
			try {
				await runNonInteractive({
					projectDirectory,
					services: options.services as string | undefined,
					skills: options.skills as string | undefined,
					preset: options.preset as string | undefined,
					proxy: options.proxy as string | undefined,
					domain: options.domain as string | undefined,
					gpu: options.gpu as boolean | undefined,
					monitoring: options.monitoring as boolean | undefined,
					platform: options.platform as string | undefined,
					dryRun: options.dryRun as boolean | undefined,
					yes: options.yes as boolean | undefined,
					outputFormat: options.outputFormat as string | undefined,
				});
			} catch (err) {
				console.error(pc.red(`\nError: ${err instanceof Error ? err.message : String(err)}`));
				process.exit(1);
			}
		} else {
			try {
				await runWizard(projectDirectory);
			} catch (err) {
				if (err instanceof Error && err.message === "USER_CANCELLED") {
					// User cancelled gracefully, already handled inside wizard
					process.exit(0);
				}
				console.error(pc.red(`\nError: ${err instanceof Error ? err.message : String(err)}`));
				process.exit(1);
			}
		}
	});

program.parse();
