/**
 * Generates the `scripts/install-openclaw.sh` and `scripts/install-openclaw.ps1`
 * scripts that install OpenClaw directly on the host via the official installer.
 */

export interface OpenclawInstallScriptOptions {
	projectName: string;
}

export function generateOpenclawInstallScript(
	options: OpenclawInstallScriptOptions,
): Record<string, string> {
	const files: Record<string, string> = {};

	// Bash script (macOS / Linux)
	files["scripts/install-openclaw.sh"] = [
		"#!/usr/bin/env bash",
		"set -euo pipefail",
		"",
		`# Install OpenClaw directly on this host for project: ${options.projectName}`,
		"# This script downloads and runs the official OpenClaw installer.",
		"# It will install Node.js 22+ (if needed) and OpenClaw globally via npm.",
		"",
		'echo "╔══════════════════════════════════════════╗"',
		'echo "║    OpenClaw — Direct Host Installation   ║"',
		'echo "╚══════════════════════════════════════════╝"',
		'echo ""',
		"",
		"# Run the official installer",
		'curl -fsSL --proto "=https" --tlsv1.2 https://openclaw.ai/install.sh | bash',
		"",
		'echo ""',
		'echo "OpenClaw installed successfully!"',
		'echo ""',
		'echo "Next steps:"',
		'echo "  1. Start your companion services:  docker compose up -d"',
		'echo "  2. Run onboarding:                  openclaw onboard"',
		'echo "  3. Launch the dashboard:             openclaw dashboard"',
		'echo ""',
		"",
	].join("\n");

	// PowerShell script (Windows / WSL)
	files["scripts/install-openclaw.ps1"] = [
		"# Install OpenClaw directly on this host (Windows via WSL)",
		`# Project: ${options.projectName}`,
		"#",
		"# This script sets up WSL if needed, then runs the official Linux installer inside it.",
		"",
		'Write-Host "OpenClaw - Direct Host Installation" -ForegroundColor Cyan',
		'Write-Host ""',
		"",
		"# Check if WSL is available",
		"$wslCheck = Get-Command wsl -ErrorAction SilentlyContinue",
		"if (-not $wslCheck) {",
		'    Write-Host "WSL is not installed. Installing WSL..." -ForegroundColor Yellow',
		"    wsl --install",
		'    Write-Host "Please restart your computer and re-run this script." -ForegroundColor Yellow',
		"    exit 1",
		"}",
		"",
		'Write-Host "Running OpenClaw installer inside WSL..." -ForegroundColor Green',
		"wsl bash -c \"curl -fsSL --proto '=https' --tlsv1.2 https://openclaw.ai/install.sh | bash\"",
		"",
		'Write-Host ""',
		'Write-Host "OpenClaw installed successfully inside WSL!" -ForegroundColor Green',
		'Write-Host ""',
		'Write-Host "Next steps:"',
		'Write-Host "  1. Start your companion services:  docker compose up -d"',
		'Write-Host "  2. Run onboarding (in WSL):         openclaw onboard"',
		'Write-Host "  3. Launch the dashboard:             openclaw dashboard"',
		'Write-Host ""',
		"",
	].join("\n");

	return files;
}
