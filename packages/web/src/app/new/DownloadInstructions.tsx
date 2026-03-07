"use client";

import { CheckCircle, Copy } from "lucide-react";

interface DownloadInstructionsProps {
	projectName: string;
	deploymentType?: "docker" | "bare-metal";
	platform?: string;
	onDismiss: () => void;
	onDeployToServer: () => void;
	onDeployClawexa: () => void;
}

export function DownloadInstructions({
	projectName,
	deploymentType,
	platform,
	onDismiss,
	onDeployToServer,
	onDeployClawexa,
}: DownloadInstructionsProps) {
	const name = projectName || "my-stack";
	const isBareMetal = deploymentType === "bare-metal";
	const isWindows = platform === "windows/amd64";

	const commands = [
		`cd ${name}`,
		"cp .env.example .env        # Edit with your API keys",
		isBareMetal
			? isWindows
				? ".\\install.ps1        # Install Docker and start (Windows)"
				: "./install.sh          # Install Docker and start (Linux/macOS)"
			: "docker compose up -d        # Start everything",
		"docker compose logs -f openclaw-gateway   # Watch OpenClaw boot",
	];

	return (
		<div className="border-b border-accent/20 bg-accent/5 px-6 py-4" aria-live="polite">
			<div className="mx-auto max-w-3xl">
				<div className="flex items-start gap-3">
					<CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
					<div className="flex-1">
						<p className="font-semibold text-accent">Stack downloaded successfully!</p>
						<p className="mt-1 text-sm text-muted-foreground">
							Extract the ZIP and follow these steps:
						</p>
						{isBareMetal ? (
							<p className="mt-2 rounded bg-surface/80 px-3 py-2 font-mono text-xs text-foreground">
								{isWindows ? ".\\install.ps1" : "./install.sh"} — Run on your server to install
								Docker and start the stack.
							</p>
						) : null}
						<div className="mt-3 space-y-2">
							{commands.map((cmd) => (
								<div
									key={cmd}
									className="flex items-center gap-2 rounded bg-surface/80 px-3 py-1.5 font-mono text-xs text-foreground"
								>
									<span className="text-muted-foreground">$</span>
									<code className="flex-1">{cmd}</code>
									<button
										type="button"
										onClick={() => navigator.clipboard.writeText(cmd.split("#")[0]?.trim() ?? cmd)}
										className="text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-1 focus-visible:ring-primary"
										title="Copy command"
										aria-label={`Copy command: ${cmd.split("#")[0]?.trim() ?? cmd}`}
									>
										<Copy className="h-3 w-3" />
									</button>
								</div>
							))}
						</div>
						<div className="mt-3 flex flex-wrap items-center gap-2">
							<button
								type="button"
								onClick={onDismiss}
								className="text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none"
							>
								Dismiss
							</button>
							<span className="text-muted-foreground" aria-hidden="true">
								·
							</span>
							<button
								type="button"
								onClick={onDeployToServer}
								className="text-xs text-primary hover:underline focus-visible:outline-none"
							>
								Deploy to Dokploy / Coolify
							</button>
							<span className="text-muted-foreground" aria-hidden="true">
								·
							</span>
							<button
								type="button"
								onClick={onDeployClawexa}
								className="text-xs text-primary hover:underline focus-visible:outline-none"
							>
								Deploy to clawexa.net
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
