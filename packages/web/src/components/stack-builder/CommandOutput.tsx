"use client";

import { Check, Copy, Terminal } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type PM = "npx" | "pnpm" | "bun";

const pmLabels: Record<PM, string> = {
	npx: "npx",
	pnpm: "pnpm",
	bun: "bun",
};

/**
 * Convert an `npx`-prefixed command into the equivalent for each package manager.
 *
 * The component accepts the full `npx …` command for backwards-compat, then
 * derives the pnpm / bun variants automatically.
 *
 * npx better-openclaw init … → pnpm dlx better-openclaw init …
 * npx better-openclaw init … → bunx better-openclaw init …
 */
function deriveCommand(baseCommand: string, pm: PM): string {
	if (pm === "npx") return baseCommand;

	// Strip leading "npx " if present to get the bare command
	const bare = baseCommand.replace(/^npx\s+/, "");

	if (pm === "pnpm") return `pnpm dlx ${bare}`;
	if (pm === "bun") return `bunx ${bare}`;
	return baseCommand;
}

interface CommandOutputProps {
	command: string;
}

export function CommandOutput({ command }: CommandOutputProps) {
	const [selectedPm, setSelectedPm] = useState<PM>("npx");
	const [copied, setCopied] = useState(false);

	const displayCommand = useMemo(() => deriveCommand(command, selectedPm), [command, selectedPm]);

	const handleCopy = useCallback(async () => {
		try {
			await navigator.clipboard.writeText(displayCommand);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch {
			// Fallback for non-secure contexts
			const textarea = document.createElement("textarea");
			textarea.value = displayCommand;
			document.body.appendChild(textarea);
			textarea.select();
			document.execCommand("copy");
			document.body.removeChild(textarea);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	}, [displayCommand]);

	return (
		<div className="overflow-hidden rounded-xl border border-border bg-surface/80">
			{/* Header: terminal icon, PM tabs, copy button */}
			<div className="flex items-center justify-between border-b border-border px-4 py-2">
				<div className="flex items-center gap-3">
					<div className="flex items-center gap-2 text-xs text-muted-foreground">
						<Terminal className="h-3.5 w-3.5" />
						<span className="hidden sm:inline">CLI</span>
					</div>

					{/* Package manager tabs */}
					<div className="flex items-center gap-1 rounded-lg bg-muted/50 p-0.5">
						{(Object.keys(pmLabels) as PM[]).map((pm) => (
							<button
								key={pm}
								type="button"
								onClick={() => {
									setSelectedPm(pm);
									setCopied(false);
								}}
								className={cn(
									"rounded-md px-2.5 py-0.5 text-[11px] font-medium transition-all",
									selectedPm === pm
										? "bg-background text-foreground shadow-sm"
										: "text-muted-foreground hover:text-foreground",
								)}
							>
								{pmLabels[pm]}
							</button>
						))}
					</div>
				</div>

				<button
					type="button"
					onClick={handleCopy}
					className={cn(
						"flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all",
						copied
							? "bg-accent/10 text-accent"
							: "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground",
					)}
				>
					{copied ? (
						<>
							<Check className="h-3 w-3" />
							Copied!
						</>
					) : (
						<>
							<Copy className="h-3 w-3" />
							Copy
						</>
					)}
				</button>
			</div>

			{/* Command display */}
			<div className="p-4">
				<code className="font-mono text-sm text-accent break-all">{displayCommand}</code>
			</div>
		</div>
	);
}
