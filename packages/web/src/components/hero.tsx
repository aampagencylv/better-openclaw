"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

/* ── Typewriter terminal lines ─────────────────────────────────────────────── */
const terminalLines = [
	{ text: "$ npx create-better-openclaw my-stack", style: "text-foreground" },
	{ text: "✓ Selected: Redis, Qdrant, n8n, FFmpeg", style: "text-accent" },
	{
		text: "✓ Resolved 2 dependencies: PostgreSQL, Prometheus",
		style: "text-accent",
	},
	{
		text: "✓ Generated docker-compose.yml (6 services)",
		style: "text-accent",
	},
	{ text: "✓ Created .env with secure secrets", style: "text-accent" },
	{ text: "✓ Installed 4 OpenClaw skills", style: "text-accent" },
	{ text: "", style: "" },
	{
		text: "Your stack is ready! cd my-stack && docker compose up -d",
		style: "text-primary font-semibold",
	},
];

/* ── Stats ─────────────────────────────────────────────────────────────────── */
const stats = [
	{ count: "58+", label: "Services" },
	{ count: "10", label: "Skill Packs" },
	{ count: "17", label: "Categories" },
	{ count: "100%", label: "Open Source" },
];

/* ── Stagger helpers ───────────────────────────────────────────────────────── */
const container = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: { staggerChildren: 0.12, delayChildren: 0.1 },
	},
};

const fadeUp = {
	hidden: { opacity: 0, y: 20 },
	show: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.5, ease: "easeOut" as const },
	},
};

/* ── Typewriter hook ───────────────────────────────────────────────────────── */
function useTypewriter(lines: typeof terminalLines) {
	const [displayed, setDisplayed] = useState<string[]>([]);

	useEffect(() => {
		let lineIdx = 0;
		let charIdx = 0;
		let cancelled = false;

		function tick() {
			if (cancelled) return;
			if (lineIdx >= lines.length) return;

			const line = lines[lineIdx].text;
			charIdx++;

			setDisplayed((prev) => {
				const next = [...prev];
				next[lineIdx] = line.slice(0, charIdx);
				return next;
			});

			if (charIdx >= line.length) {
				lineIdx++;
				charIdx = 0;
				setTimeout(tick, 260);
			} else {
				setTimeout(tick, 22);
			}
		}

		// start after a brief delay so the hero text is visible first
		const initial = setTimeout(tick, 800);
		return () => {
			cancelled = true;
			clearTimeout(initial);
		};
	}, [lines]);

	return displayed;
}

/* ── Component ─────────────────────────────────────────────────────────────── */
export function Hero() {
	const typed = useTypewriter(terminalLines);

	return (
		<section className="relative overflow-hidden pt-28 pb-16 md:pb-24">
			{/* Background glow */}
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50" />

			<motion.div
				variants={container}
				initial="hidden"
				animate="show"
				className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
			>
				{/* ── Headline ────────────────────────────────────────────────── */}
				<motion.h1
					variants={fadeUp}
					className="mx-auto max-w-4xl text-center text-4xl font-extrabold tracking-tight text-foreground md:text-5xl lg:text-6xl"
				>
					Build your <span className="text-gradient">OpenClaw superstack</span> in seconds
				</motion.h1>

				{/* ── Subtitle ────────────────────────────────────────────────── */}
				<motion.p
					variants={fadeUp}
					className="mx-auto mt-6 max-w-2xl text-center text-lg text-muted-foreground md:text-xl"
				>
					Generate production-ready Docker&nbsp;Compose stacks with 58+ companion services,
					pre-wired skills, and one command.
				</motion.p>

				{/* ── CTA buttons ─────────────────────────────────────────────── */}
				<motion.div
					variants={fadeUp}
					className="mt-10 flex flex-wrap items-center justify-center gap-4"
				>
					<Link
						href="/new"
						className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/25"
					>
						Start Building
					</Link>
					<Link
						href="/docs"
						className="inline-flex items-center justify-center rounded-lg border border-border px-6 py-3 text-base font-semibold text-foreground transition-colors hover:bg-muted/50"
					>
						View Docs
					</Link>
				</motion.div>

				{/* ── Terminal mockup ─────────────────────────────────────────── */}
				<motion.div variants={fadeUp} className="mx-auto mt-14 max-w-3xl">
					<div className="overflow-hidden rounded-xl border border-border bg-[#0d1117] shadow-2xl dark:bg-surface">
						{/* Title bar */}
						<div className="flex items-center gap-2 border-b border-border/40 bg-[#161b22] px-4 py-3 dark:bg-surface/80">
							<span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
							<span className="h-3 w-3 rounded-full bg-[#febc2e]" />
							<span className="h-3 w-3 rounded-full bg-[#28c840]" />
							<span className="ml-auto font-mono text-xs text-muted-foreground">
								better-openclaw — bash
							</span>
						</div>

						{/* Lines */}
						<div className="p-5 font-mono text-sm leading-relaxed md:p-6">
							{terminalLines.map((line, i) => (
								<div key={i} className={`min-h-[1.5em] ${line.style}`}>
									{typed[i] ?? ""}
									{/* blinking cursor on the line currently being typed */}
									{i === typed.length - 1 && (typed[i]?.length ?? 0) < line.text.length && (
										<span className="ml-0.5 inline-block h-4 w-[7px] animate-pulse bg-foreground/60 align-middle" />
									)}
								</div>
							))}
						</div>
					</div>
				</motion.div>

				{/* ── Stats row ───────────────────────────────────────────────── */}
				<motion.div
					variants={fadeUp}
					className="mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4"
				>
					{stats.map((s) => (
						<div key={s.label} className="text-center">
							<p className="font-mono text-3xl font-bold text-foreground">{s.count}</p>
							<p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
						</div>
					))}
				</motion.div>
			</motion.div>
		</section>
	);
}
