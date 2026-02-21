"use client";

import { motion } from "framer-motion";

const ingestionNodes = [
	{ name: "POSTGRES_V15", status: "CONFIGURED" },
	{ name: "QDRANT_VECTOR", status: "SYNC" },
	{ name: "N8N_WORKFLOW", status: "READY" },
];

export function CommonSetups() {
	return (
		<section className="relative w-full py-20 lg:py-32 overflow-hidden border-t border-white/5 bg-black">
			{/* Ambient Center Glow */}
			<div className="absolute left-1/2 top-1/2 -z-10 h-[500px] w-[800px] -translate-y-1/2 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(163,135,95,0.15)_0%,transparent_60%)] blur-[60px]" />

			<div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
				
				{/* Top Header */}
				<motion.div
					initial={{ opacity: 0, y: 15 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className="mb-16"
				>
					<div className="flex items-center gap-3 mb-4">
						<span className="h-1.5 w-1.5 bg-primary shadow-[0_0_8px_rgba(163,135,95,0.8)]" />
						<span className="font-mono text-[10px] tracking-widest text-primary uppercase">
							// OPERATIONAL_LOGIC
						</span>
					</div>
					
					<h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
						SYSTEM <span className="text-zinc-600">FLOW</span>
					</h2>
					<p className="mt-4 max-w-xl text-sm leading-relaxed text-zinc-400">
						Operational pipeline outlining how better-openclaw connects, deploys,
						monitors, and scales production autonomous systems.
					</p>
					
					<div className="absolute right-8 top-32 hidden lg:flex items-center gap-2">
						<span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
						<span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">
							PIPELINE ACTIVE v1.2.0
						</span>
					</div>
				</motion.div>

				{/* The Flow Visualization Area */}
				<div className="relative flex flex-col lg:flex-row border border-white/5 bg-black/60 backdrop-blur-md">
					
					{/* Left Column: Ingestion Nodes */}
					<div className="w-full lg:w-[30%] border-b lg:border-b-0 lg:border-r border-white/5 p-8">
						<h3 className="mb-6 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
							AVAILABLE SERVICES
						</h3>
						<div className="flex flex-col gap-4">
							{ingestionNodes.map((node) => (
								<div key={node.name} className="flex items-center justify-between border border-white/5 bg-zinc-900/30 px-4 py-3">
									<div className="flex items-center gap-3">
										<span className="h-1.5 w-1.5 bg-primary" />
										<span className="font-mono text-[11px] text-zinc-300">{node.name}</span>
									</div>
									<span className={`font-mono text-[9px] uppercase tracking-widest ${node.status === "READY" || node.status === "SYNC" ? "text-emerald-500" : "text-primary"}`}>
										{node.status}
									</span>
								</div>
							))}
						</div>
						<div className="mt-8 pt-8 border-t border-white/5 flex justify-between items-center">
							<span className="font-mono text-[9px] text-zinc-500 uppercase">THROUGHPUT</span>
							<span className="font-mono text-[11px] text-zinc-300">1.2 GB/s</span>
						</div>
					</div>

					{/* Center Column: Engine Visualization */}
					<div className="relative flex min-h-[400px] w-full lg:w-[40%] flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-white/5 p-8 overflow-hidden">
						{/* Orbiting particles simulation */}
						<div className="absolute left-1/2 top-1/2 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5 border-dashed animate-[spin_20s_linear_infinite]" />
						<div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5 border-dashed animate-[spin_30s_linear_infinite_reverse]" />
						
						{/* Active dot orbiting */}
						<div className="absolute left-1/2 top-1/2 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 animate-[spin_20s_linear_infinite]">
							<span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_10px_rgba(163,135,95,1)]" />
						</div>

						{/* Center Core */}
						<div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 border border-primary/30 shadow-[0_0_30px_rgba(163,135,95,0.2)]">
							<div className="h-8 w-8 rounded-sm bg-primary/20 border border-primary/50 flex items-center justify-center animate-pulse">
								<span className="h-3 w-3 bg-primary" />
							</div>
						</div>

						<div className="absolute bottom-12 text-center">
							<h4 className="font-sans text-sm font-bold tracking-widest text-white uppercase">
								SUPERSTACK ORCHESTRATION ENGINE
							</h4>
							<p className="mt-2 max-w-[280px] font-mono text-[9px] leading-relaxed text-zinc-500 uppercase">
								Deploying autonomous agents to optimized infrastructure zones.
								Zero-latency handoff protocols active.
							</p>
							<div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1">
								<span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
								<span className="font-mono text-[9px] text-emerald-500 tracking-widest">SYSTEM OPTIMAL</span>
							</div>
						</div>
					</div>

					{/* Right Column: Telemetry & Scale */}
					<div className="w-full lg:w-[30%] flex flex-col p-8">
						<div className="mb-10">
							<h3 className="mb-6 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
								TELEMETRY
							</h3>
							<div className="grid grid-cols-2 gap-4">
								<div className="border border-white/5 bg-zinc-900/30 p-3">
									<span className="font-mono text-[9px] text-zinc-500 block mb-1">LATENCY</span>
									<span className="font-mono text-lg text-white">12ms</span>
								</div>
								<div className="border border-white/5 bg-zinc-900/30 p-3">
									<span className="font-mono text-[9px] text-zinc-500 block mb-1">UPTIME</span>
									<span className="font-mono text-lg text-emerald-500">99.9%</span>
								</div>
							</div>
						</div>

						<div>
							<h3 className="mb-6 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
								AUTO-SCALING
							</h3>
							<div className="space-y-4">
								<div>
									<div className="flex justify-between font-mono text-[9px] mb-2 text-zinc-400">
										<span>COMPUTE_ALLOC</span>
										<span>80%</span>
									</div>
									<div className="h-1 w-full bg-zinc-800">
										<div className="h-full w-[80%] bg-primary shadow-[0_0_8px_rgba(163,135,95,0.8)]" />
									</div>
								</div>
								<div>
									<div className="flex justify-between font-mono text-[9px] mb-2 text-zinc-400">
										<span>MEMORY_POOL</span>
										<span>42%</span>
									</div>
									<div className="h-1 w-full bg-zinc-800">
										<div className="h-full w-[42%] bg-zinc-500" />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Global Logs Ribbon */}
				<div className="mt-px flex h-12 w-full items-center gap-4 border border-t-0 border-white/5 bg-black/40 px-6 backdrop-blur-md">
					<span className="font-mono text-[9px] uppercase tracking-widest text-zinc-600">LOG_STREAM</span>
					<div className="flex gap-4 font-mono text-[10px] text-zinc-400">
						<span className="hidden md:inline">[00:01:21]  init_sequence(target="cluster_alpha")</span>
						<span className="hidden lg:inline text-primary">[00:01:24]  allocating_resources... [OK]</span>
						<span className="text-zinc-300">[00:01:25]  deploy_agents --mode=autonomous --src=Core</span>
					</div>
				</div>

			</div>
		</section>
	);
}
