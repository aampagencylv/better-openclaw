"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

/* ── Package manager variants ──────────────────────────────────────────────── */
type PM = "pnpm" | "npx" | "bun";

const pmLabels: Record<PM, string> = {
	pnpm: "pnpm",
	npx: "npx",
	bun: "bun",
};

interface Example {
	title: string;
	commands: Record<PM, string>;
}

const examples: Example[] = [
	{
		title: "Default Stack",
		commands: {
			pnpm: "pnpm create better-openclaw my-stack",
			npx: "npx @better-openclaw/cli my-stack",
			bun: "bun create better-openclaw my-stack",
		},
	},
	{
		title: "Research Stack",
		commands: {
			pnpm: "pnpm create better-openclaw my-stack --preset researcher --yes",
			npx: "npx @better-openclaw/cli my-stack --preset researcher --yes",
			bun: "bun create better-openclaw my-stack --preset researcher --yes",
		},
	},
	{
		title: "AI Stack",
		commands: {
			pnpm: "pnpm create better-openclaw my-stack --services ollama,open-webui,qdrant --yes",
			npx: "npx @better-openclaw/cli my-stack --services ollama,open-webui,qdrant --yes",
			bun: "bun create better-openclaw my-stack --services ollama,open-webui,qdrant --yes",
		},
	},
];

/* ── Copy button ───────────────────────────────────────────────────────────── */
function CopyButton({ text }: { text: string }) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		await navigator.clipboard.writeText(text);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<button
			type="button"
			onClick={handleCopy}
			className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-md border border-border/30 bg-surface/30 text-muted-foreground transition-colors hover:text-foreground"
			aria-label="Copy command"
		>
			{copied ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
		</button>
	);
}

/* ── Component ─────────────────────────────────────────────────────────────── */
export function CommonSetups() {
	const [selectedPm, setSelectedPm] = useState<PM>("npx");

	return (
		<section className="py-20 md:py-28">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				{/* Heading */}
				<div className="mb-12 text-center">
					<h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
						Get started in seconds
					</h2>
					<p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
						Pick your package manager. Copy a command. Ship.
					</p>
				</div>

				{/* Tab bar */}
				<div className="mx-auto mb-8 flex max-w-3xl items-center justify-center gap-2">
					{(Object.keys(pmLabels) as PM[]).map((pm) => (
						<button
							key={pm}
							type="button"
							onClick={() => setSelectedPm(pm)}
							className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
								selectedPm === pm
									? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
									: "text-muted-foreground hover:text-foreground hover:bg-muted/50"
							}`}
						>
							{pmLabels[pm]}
						</button>
					))}
				</div>

				{/* Code blocks */}
				<AnimatePresence mode="wait">
					<motion.div
						key={selectedPm}
						initial={{ opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -8 }}
						transition={{ duration: 0.25 }}
						className="mx-auto grid max-w-3xl gap-4"
					>
						{examples.map((ex) => (
							<div key={ex.title}>
								<p className="mb-2 text-sm font-medium text-muted-foreground">{ex.title}</p>
								<div className="relative overflow-hidden rounded-lg border border-border bg-[#0d1117] dark:bg-surface">
									<pre className="overflow-x-auto p-4 pr-14 font-mono text-sm leading-relaxed text-foreground">
										<code>{ex.commands[selectedPm]}</code>
									</pre>
									<CopyButton text={ex.commands[selectedPm]} />
								</div>
							</div>
						))}
					</motion.div>
				</AnimatePresence>
			</div>
		</section>
	);
}
