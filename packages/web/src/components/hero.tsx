"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

/* ── Floating HUD Data ────────────────────────────────────────────────────── */
const activeNodes = [
	{ region: "US-EAST-1", status: "ONLINE" },
	{ region: "EU-WEST-2", status: "ONLINE" },
	{ region: "AP-SOUTH-1", status: "SYNCING" },
];

/* ── Stagger helpers ──────────────────────────────────────────────────────── */
const fadeUp = {
	hidden: { opacity: 0, y: 25 },
	show: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
	},
};

const container = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: { staggerChildren: 0.12, delayChildren: 0.3 },
	},
};

/* ── Particle Component ───────────────────────────────────────────────────── */
function Particles() {
	return (
		<div className="pointer-events-none absolute inset-0 overflow-hidden">
			{/* Particle 1 */}
			<div
				className="absolute bottom-[20%] left-[30%] h-1 w-1 rounded-full bg-primary/80"
				style={{ animation: "particle-drift-1 6s ease-out infinite" }}
			/>
			{/* Particle 2 */}
			<div
				className="absolute bottom-[15%] left-[50%] h-1.5 w-1.5 rounded-full bg-accent/60"
				style={{ animation: "particle-drift-2 8s ease-out infinite 2s" }}
			/>
			{/* Particle 3 */}
			<div
				className="absolute bottom-[25%] left-[45%] h-0.5 w-0.5 rounded-full bg-primary/70"
				style={{ animation: "particle-drift-3 7s ease-out infinite 1s" }}
			/>
			{/* Particle 4 */}
			<div
				className="absolute bottom-[10%] left-[55%] h-1 w-1 rounded-full bg-white/30"
				style={{ animation: "particle-drift-1 9s ease-out infinite 3s" }}
			/>
			{/* Particle 5 */}
			<div
				className="absolute bottom-[30%] left-[40%] h-0.5 w-0.5 rounded-full bg-primary/50"
				style={{ animation: "particle-drift-2 10s ease-out infinite 4s" }}
			/>
			{/* Particle 6 */}
			<div
				className="absolute bottom-[18%] left-[60%] h-1 w-1 rounded-full bg-accent/40"
				style={{ animation: "particle-drift-3 8s ease-out infinite 5s" }}
			/>
		</div>
	);
}

export function Hero() {
	const [uptime, setUptime] = useState("99.99%");
	const [latency, setLatency] = useState(12);

	useEffect(() => {
		const interval = setInterval(() => {
			const r = Math.random();
			if (r > 0.8) setUptime(`99.9${Math.floor(Math.random() * 9)}%`);
			else setUptime("99.99%");
			setLatency(Math.floor(8 + Math.random() * 8));
		}, 3000);
		return () => clearInterval(interval);
	}, []);

	return (
		<div className="relative flex min-h-[calc(100vh-3.5rem)] w-full flex-col items-center justify-center overflow-hidden">
			
			{/* ─── AXION-STYLE ACCRETION DISK & BEAM BACKGROUND ──────────────────────── */}
			<div className="absolute inset-0 -z-20 overflow-hidden bg-black">
				{/* Deep Ambient Space */}
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(30,20,10,1)_0%,rgba(0,0,0,1)_100%)]" />

				{/* 1. The Core Horizon (Intense bottom glow) */}
				<div className="absolute bottom-0 left-1/2 w-[1200px] h-[600px] -translate-x-1/2 translate-y-1/2 rounded-[100%] bg-[radial-gradient(closest-side,rgba(255,200,100,0.8)_0%,rgba(200,100,20,0.4)_40%,transparent_100%)] blur-[80px]" />
				
				{/* 2. Concentric Accretion Rings (Ellipses) */}
				<div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[60%] w-[140vw] min-w-[1200px] aspect-[2.5/1] flex items-center justify-center">
					{/* Outer Ring */}
					<div className="absolute w-full h-full rounded-[100%] border-[2px] border-primary/20 shadow-[0_0_100px_rgba(163,135,95,0.2)_inset]" />
					{/* Mid Ring */}
					<div className="absolute w-[80%] h-[80%] rounded-[100%] border-[4px] border-[#c2a67a]/40 shadow-[0_0_80px_rgba(194,166,122,0.3)_inset]" style={{ animation: "pulse-glow 8s ease-in-out infinite" }} />
					{/* Inner Ring (Intense) */}
					<div className="absolute w-[60%] h-[60%] rounded-[100%] border-[8px] border-[#ffb347]/60 shadow-[0_0_120px_rgba(255,179,71,0.5)_inset,0_0_120px_rgba(255,179,71,0.5)]" style={{ animation: "pulse-glow 4s ease-in-out infinite" }} />
					{/* Core Ring */}
					<div className="absolute w-[40%] h-[40%] rounded-[100%] bg-[#ff9b26]/5 border-[16px] border-[#ffecd2]/80 shadow-[0_0_150px_rgba(255,236,210,0.8)_inset,0_0_150px_rgba(255,236,210,0.8)] blur-[2px]" />
				</div>

				{/* 3. The Vertical Light Beam */}
				{/* Main bright core */}
				<div className="absolute top-0 left-1/2 w-[4px] h-[100%] -translate-x-1/2 bg-gradient-to-b from-transparent via-[#ffecd2] to-[#ffecd2]" style={{ animation: "beam-pulse 3s ease-in-out infinite" }} />
				{/* Inner glow */}
				<div className="absolute top-0 left-1/2 w-[40px] h-[100%] -translate-x-1/2 bg-gradient-to-b from-transparent via-[#ffb347]/40 to-[#ffb347]/80 blur-[8px]" />
				{/* Outer wide beam */}
				<div className="absolute top-0 left-1/2 w-[300px] h-[100%] -translate-x-1/2 bg-gradient-to-b from-transparent via-[#a3875f]/10 to-[#ffb347]/30 blur-[40px]" style={{ animation: "pulse-glow 6s ease-in-out infinite" }} />
				
				{/* 4. Vignette / Darkening overlay for contrast at top and edges */}
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />
			</div>

			{/* ─── Floating Particles ──────────────────────────────────────────── */}
			<Particles />

			{/* ─── Scan Line Effect ────────────────────────────────────────────── */}
			<div className="pointer-events-none absolute inset-0 overflow-hidden">
				<div
					className="absolute left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"
					style={{ animation: "scan-line 8s linear infinite" }}
				/>
			</div>

			{/* ─── Content ────────────────────────────────────────────────────── */}
			<motion.div
				variants={container}
				initial="hidden"
				animate="show"
				className="relative z-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center xl:items-start"
			>
				{/* Status Bar */}
				<motion.div variants={fadeUp} className="mb-8 flex items-center gap-3">
					<div className="h-px w-10 bg-primary/50" />
					<span className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
						CLUSTER : READY // SYSTEM ONLINE
					</span>
					<div
						className="ml-2 h-2 w-2 rounded-full bg-emerald-500"
						style={{ animation: "pulse-dot 2s ease-in-out infinite" }}
					/>
				</motion.div>

				{/* Huge Typography */}
				<motion.h1 variants={fadeUp} className="max-w-[900px] text-center xl:text-left">
					<span className="block text-6xl font-bold tracking-tight text-white md:text-8xl lg:text-9xl">
						SCALE WITH
					</span>
					<span
						className="block text-6xl font-bold tracking-tight md:text-8xl lg:text-9xl"
						style={{
							color: "transparent",
							WebkitTextStroke: "1.5px rgba(163,135,95,0.5)",
							animation: "border-breathe 4s ease-in-out infinite",
						}}
					>
						AUTONOMY
					</span>
				</motion.h1>

				<motion.p
					variants={fadeUp}
					className="mt-10 max-w-[650px] text-center xl:text-left text-lg text-zinc-400 md:text-xl leading-relaxed"
				>
					Deploy autonomous agents optimized for infrastructure scalability. Engineered for
					precision and zero-latency performance.
				</motion.p>

				{/* Tech Bullets */}
				<motion.ul variants={fadeUp} className="mt-10 flex flex-col gap-4 font-mono text-sm font-medium tracking-widest uppercase text-zinc-300">
					{["GLOBAL DISTRIBUTED INFRASTRUCTURE", "AUTONOMOUS AGENT ORCHESTRATION", "SUB-10MS EXECUTION LATENCY"].map((text, i) => (
						<li key={text} className="flex items-center gap-3">
							<span
								className="h-1 w-1 bg-primary"
								style={{ animation: `pulse-dot 2s ease-in-out infinite ${i * 0.3}s` }}
							/>
							{text}
						</li>
					))}
				</motion.ul>

				{/* CTAs */}
				<motion.div variants={fadeUp} className="mt-14 flex flex-col sm:flex-row items-center gap-6">
					<Link
						href="/new"
						className="group relative flex h-16 items-center justify-center overflow-hidden bg-primary px-10 font-mono text-sm font-bold uppercase tracking-widest text-black transition-all hover:bg-[#b5986e] hover:shadow-[0_0_30px_rgba(163,135,95,0.3)]"
					>
						{/* Shimmer sweep on hover */}
						<span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
						<span className="relative">INITIALIZE BUILD &rarr;</span>
					</Link>
					<Link
						href="/docs"
						className="group flex h-16 items-center justify-center border border-zinc-700 bg-transparent px-10 font-mono text-sm font-bold uppercase tracking-widest text-zinc-300 transition-all hover:border-primary/40 hover:bg-zinc-800/50 hover:text-white"
						style={{ animation: "border-breathe 6s ease-in-out infinite" }}
					>
						VIEW DOCUMENTATION
						<span className="ml-3 flex h-6 w-6 items-center justify-center border border-zinc-600 rounded-sm text-xs transition-colors group-hover:border-primary/40">?</span>
					</Link>
				</motion.div>

				<motion.div variants={fadeUp} className="mt-10">
					<span className="font-mono text-[11px] uppercase tracking-widest text-zinc-600">
						NO CREDIT CARD REQ. // INSTANT PROVISIONING
					</span>
				</motion.div>
			</motion.div>

			{/* ─── Floating HUD Widgets (right side) ──────────────────────────── */}
			<motion.div
				initial={{ opacity: 0, x: 40 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
				className="hidden xl:flex absolute right-10 top-1/2 -translate-y-1/2 flex-col gap-6"
				style={{ animation: "float-y-slow 6s ease-in-out infinite" }}
			>
				{/* Active Nodes Widget */}
				<div
					className="w-[340px] border border-white/10 bg-black/60 p-6 backdrop-blur-xl"
					style={{ animation: "screen-flicker 10s ease-in-out infinite" }}
				>
					<div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
						<span className="font-mono text-xs tracking-widest text-zinc-500 uppercase">ACTIVE_NODES</span>
						<span className="flex gap-1">
							<span className="h-1 w-1 bg-zinc-500" style={{ animation: "pulse-dot 3s infinite" }} />
							<span className="h-1 w-1 bg-zinc-500" style={{ animation: "pulse-dot 3s infinite 0.5s" }} />
						</span>
					</div>
					<div className="flex flex-col gap-4 font-mono text-sm text-zinc-300">
						{activeNodes.map((n, i) => (
							<motion.div
								key={n.region}
								initial={{ opacity: 0, x: 10 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 1.2 + i * 0.15 }}
								className="flex justify-between items-center"
							>
								<span>{n.region}</span>
								<span className={n.status === "ONLINE" ? "text-emerald-500" : "text-primary"} style={n.status === "SYNCING" ? { animation: "data-refresh 2s infinite" } : undefined}>
									{n.status}
								</span>
							</motion.div>
						))}
					</div>
				</div>

				{/* System Health Widget */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 1.5, duration: 0.8 }}
					className="w-[340px] border border-white/10 bg-black/60 p-6 backdrop-blur-xl relative overflow-hidden"
				>
					{/* Corner accent */}
					<div
						className="absolute right-3 top-3 h-4 w-4 border border-primary/30 flex items-center justify-center"
						style={{ animation: "pulse-glow 4s ease-in-out infinite" }}
					>
						<span className="h-2 w-2 bg-primary" />
					</div>

					<span className="block font-mono text-xs tracking-widest text-zinc-500 uppercase mb-3">SYSTEM_HEALTH</span>
					<span className="block text-5xl font-bold tracking-tight text-white mb-6" style={{ animation: "data-refresh 5s ease-in-out infinite" }}>
						{uptime}
					</span>

					<div className="flex flex-col gap-2">
						<div className="flex justify-between font-mono text-[9px] text-zinc-500 uppercase">
							<span>LOAD_STREAM</span>
						</div>
						<div className="h-1 w-full bg-zinc-800 overflow-hidden">
							<motion.div
								className="h-full bg-primary shadow-[0_0_8px_rgba(163,135,95,0.8)]"
								initial={{ width: "0%" }}
								animate={{ width: "24%" }}
								transition={{ duration: 2, delay: 1.8, ease: [0.16, 1, 0.3, 1] }}
							/>
						</div>
						<div className="flex justify-between font-mono text-[9px] uppercase mt-1">
							<span className="text-zinc-400">LATENCY: {latency}ms</span>
							<span className="text-emerald-500">OPTIMAL</span>
						</div>
					</div>

					{/* Scan line inside widget */}
					<div className="absolute inset-0 pointer-events-none overflow-hidden">
						<div
							className="absolute left-0 w-full h-px bg-primary/10"
							style={{ animation: "scan-line 5s linear infinite 2s" }}
						/>
					</div>
				</motion.div>
			</motion.div>
		</div>
	);
}
