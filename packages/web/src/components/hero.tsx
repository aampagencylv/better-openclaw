"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

/* ── Floating HUD Data ────────────────────────────────────────────────────── */
const activeNodes = [
	{ region: "US-EAST-1", status: "ONLINE" },
	{ region: "EU-WEST-2", status: "ONLINE" },
	{ region: "AP-SOUTH-1", status: "SYNCING" },
];

/* ── Stagger helpers ──────────────────────────────────────────────────────── */
const fadeUp = {
	hidden: { opacity: 0, y: 15 },
	show: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
	},
};

const container = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: { staggerChildren: 0.1 },
	},
};

export function Hero() {
	const [uptime, setUptime] = useState("99.99%");

	useEffect(() => {
		// Animate the uptime decimals slightly to simulate live monitoring
		const interval = setInterval(() => {
			const r = Math.random();
			if (r > 0.8) setUptime(`99.9${Math.floor(Math.random() * 9)}%`);
			else setUptime("99.99%");
		}, 3000);
		return () => clearInterval(interval);
	}, []);

	return (
		<div className="relative flex min-h-[calc(100vh-3.5rem)] w-full flex-col items-center justify-center overflow-hidden">
			{/* Dramatic Central Glow replacing the orange beam wrapper */}
			{/* Core Beam */}
			<div className="absolute left-1/2 top-0 -z-10 h-full w-[20%] -translate-x-1/2 bg-[linear-gradient(to_bottom,rgba(163,135,95,0.4),rgba(163,135,95,0.05),transparent)] blur-[100px]" />
			{/* Halo */}
			<div className="absolute left-1/2 top-1/4 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(163,135,95,0.15)_0%,transparent_70%)] blur-[40px]" />

			<motion.div
				variants={container}
				initial="hidden"
				animate="show"
				className="relative z-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center xl:items-start"
			>
				{/* Top Status */}
				<motion.div variants={fadeUp} className="mb-6 flex items-center gap-3">
					<div className="h-[1px] w-8 bg-primary/50" />
					<span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
						CLUSTER : READY // SYSTEM ONLINE
					</span>
				</motion.div>

				{/* Huge Axion-Style Typography */}
				<motion.h1 variants={fadeUp} className="max-w-[800px] text-center xl:text-left">
					<span className="block text-5xl font-bold tracking-tight text-white md:text-7xl lg:text-8xl">
						SCALE WITH
					</span>
					<span
						className="block text-5xl font-bold tracking-tight text-transparent md:text-7xl lg:text-8xl"
						style={{ WebkitTextStroke: "1px rgba(255,255,255,0.2)" }}
					>
						AUTONOMY
					</span>
				</motion.h1>

				<motion.p
					variants={fadeUp}
					className="mt-8 max-w-[600px] text-center xl:text-left text-base text-zinc-400 md:text-lg leading-relaxed"
				>
					Deploy autonomous agents optimized for infrastructure scalability. Engineered for
					precision and zero-latency performance.
				</motion.p>

				{/* Tech Bullets */}
				<motion.ul
					variants={fadeUp}
					className="mt-8 flex flex-col gap-3 font-mono text-[11px] font-medium tracking-widest uppercase text-zinc-300"
				>
					<li className="flex items-center gap-3">
						<span className="h-1 w-1 bg-primary shadow-[0_0_8px_rgba(163,135,95,0.8)]" />
						GLOBAL DISTRIBUTED INFRASTRUCTURE
					</li>
					<li className="flex items-center gap-3">
						<span className="h-1 w-1 bg-primary shadow-[0_0_8px_rgba(163,135,95,0.8)]" />
						AUTONOMOUS AGENT ORCHESTRATION
					</li>
					<li className="flex items-center gap-3">
						<span className="h-1 w-1 bg-primary shadow-[0_0_8px_rgba(163,135,95,0.8)]" />
						SUB-10MS EXECUTION LATENCY
					</li>
				</motion.ul>

				{/* CTAs */}
				<motion.div
					variants={fadeUp}
					className="mt-12 flex flex-col sm:flex-row items-center gap-6"
				>
					<Link
						href="/new"
						className="group relative flex h-14 items-center justify-center overflow-hidden bg-primary px-8 font-mono text-[11px] font-bold uppercase tracking-widest text-black transition-all hover:bg-[#b5986e]"
					>
						INITIALIZE BUILD &rarr;
					</Link>
					<Link
						href="/docs"
						className="flex h-14 items-center justify-center border border-zinc-700 bg-transparent px-8 font-mono text-[11px] font-bold uppercase tracking-widest text-zinc-300 transition-all hover:bg-zinc-800/50 hover:text-white"
					>
						VIEW DOCUMENTATION
						<span className="ml-3 flex h-5 w-5 items-center justify-center border border-zinc-600 rounded-sm text-[10px]">
							?
						</span>
					</Link>
				</motion.div>

				<motion.div variants={fadeUp} className="mt-8">
					<span className="font-mono text-[9px] uppercase tracking-widest text-zinc-600">
						NO CREDIT CARD REQ. // INSTANT PROVISIONING
					</span>
				</motion.div>
			</motion.div>

			{/* Floating Widgets (simulating the right side of Axion header) */}
			<motion.div
				initial={{ opacity: 0, x: 20 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 1, delay: 0.5 }}
				className="hidden xl:flex absolute right-10 top-1/2 -translate-y-1/2 flex-col gap-6"
			>
				{/* Active Nodes Widget */}
				<div className="w-[300px] border border-white/10 bg-black/40 p-5 backdrop-blur-md">
					<div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
						<span className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase">
							ACTIVE_NODES
						</span>
						<span className="flex gap-1">
							<span className="h-1 w-1 bg-zinc-500" />
							<span className="h-1 w-1 bg-zinc-500" />
						</span>
					</div>
					<div className="flex flex-col gap-3 font-mono text-[11px] text-zinc-300">
						{activeNodes.map((n) => (
							<div key={n.region} className="flex justify-between items-center">
								<span>{n.region}</span>
								<span
									className={
										n.status === "ONLINE" ? "text-emerald-500" : "text-primary animate-pulse"
									}
								>
									{n.status}
								</span>
							</div>
						))}
					</div>
				</div>

				{/* System Health Widget */}
				<div className="w-[300px] border border-white/10 bg-black/40 p-5 backdrop-blur-md relative overflow-hidden">
					{/* Small top right accent */}
					<div className="absolute right-3 top-3 h-4 w-4 border border-primary/30 flex items-center justify-center">
						<span className="h-2 w-2 bg-primary" />
					</div>

					<span className="block font-mono text-[10px] tracking-widest text-zinc-500 uppercase mb-2">
						SYSTEM_HEALTH
					</span>
					<span className="block text-4xl font-bold tracking-tight text-white mb-6">{uptime}</span>

					<div className="flex flex-col gap-2">
						<div className="flex justify-between font-mono text-[9px] text-zinc-500 uppercase">
							<span>LOAD_STREAM</span>
						</div>
						<div className="h-1 w-full bg-zinc-800">
							<div className="h-full w-[24%] bg-primary shadow-[0_0_8px_rgba(163,135,95,0.8)]" />
						</div>
						<div className="flex justify-between font-mono text-[9px] uppercase mt-1">
							<span className="text-zinc-400">LATENCY: 12ms</span>
							<span className="text-emerald-500">OPTIMAL</span>
						</div>
					</div>
				</div>
			</motion.div>
		</div>
	);
}
