"use client";

import { getAllPresets } from "@better-openclaw/core";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

// We'll map the actual presets to the highly-styled tabs Axion uses
const corePresets = getAllPresets().slice(0, 4);

const TABS = [
	{
		id: "devops_env",
		label: "DEVOPS_ENV",
		title: "CLOUD INFRASTRUCTURE AUTOMATION",
		metric: "-63% DEPLOY TIME",
		metricColor: "text-emerald-500 border-emerald-500/20 bg-emerald-500/10",
		desc: "Automate provisioning, scaling, and monitoring across distributed cloud environments with real-time telemetry. Eliminates manual intervention for routine ops.",
		bullets: [
			"Zero-touch Provisioning Pipelines",
			"Multi-region State Synchronization",
			"Native GitOps Workflow Integration",
		],
		terminal: [
			"$ applying terraform state...",
			"> success: 42 resources modified",
			"$ initializing nexus agents",
			"> online_nodes: 12",
		],
	},
	{
		id: "ai_ops",
		label: "AI_OPS",
		title: "AUTONOMOUS AI ORCHESTRATION",
		metric: "+18% COMPUTE EFF",
		metricColor: "text-blue-500 border-blue-500/20 bg-blue-500/10",
		desc: "Deploy self-healing AI agents that monitor infrastructure health, predict scaling needs, and execute remediation automatically.",
		bullets: [
			"Predictive Anomaly Detection",
			"Automated Remediation Workflows",
			"Model-driven Resource Allocation",
		],
		terminal: [
			"$ loading model: anomaly-v2",
			"> detection confidence: 99.4%",
			"$ triggering auto-scale group",
			"> scaling complete (+4 nodes)",
		],
	},
	{
		id: "enterprise",
		label: "ENTERPRISE",
		title: "HIGH-SCALE SYSTEM MONITORING",
		metric: "99.99% UPTIME SLA",
		metricColor: "text-primary border-primary/20 bg-primary/10",
		desc: "Deep telemetry and distributed tracing across hybrid cloud environments. End-to-end visibility from ingress to database.",
		bullets: [
			"Distributed Transaction Tracing",
			"Real-time Dependency Graphs",
			"Automated SLA Reporting",
		],
		terminal: [
			"$ initializing tracing daemon...",
			"> connecting to OpenTelemetry",
			"> receiving spans [1.2k/sec]",
			"$ status: OPTIMAL",
		],
	},
	{
		id: "security",
		label: "SECURITY",
		title: "INFRASTRUCTURE SECURITY",
		metric: "SOC2 TYPE II READY",
		metricColor: "text-zinc-300 border-zinc-700 bg-zinc-800/50",
		desc: "Zero-trust architecture by default. Automated vulnerability scanning, secrets management, and compliance auditing built-in.",
		bullets: [
			"Automated CVE Scanning",
			"Ephemeral Secrets Injection",
			"Compliance-ready Audit Trails",
		],
		terminal: [
			"$ running security baseline...",
			"> checking iam roles [OK]",
			"> verifying network isolation [OK]",
			"$ environment secure",
		],
	},
];

export function PresetsSection() {
	const [activeTab, setActiveTab] = useState(0);

	return (
		<section className="relative w-full py-20 lg:py-32 overflow-hidden border-t border-white/5">
			{/* Dramatic Background Splat */}
			<div className="absolute left-1/3 top-1/2 -z-10 h-[600px] w-[1000px] -translate-y-1/2 -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(163,135,95,0.08)_0%,transparent_60%)] blur-[100px]" />
			<div className="absolute right-0 bottom-0 -z-10 h-[400px] w-[800px] bg-[radial-gradient(ellipse_at_bottom_right,rgba(255,255,255,0.05)_0%,transparent_60%)] blur-[80px]" />

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
							// SYSTEM_APPLICATIONS
						</span>
					</div>

					<h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
						DEPLOYMENT <span className="text-zinc-600">SCENARIOS</span>
					</h2>
					<p className="mt-4 max-w-xl text-sm leading-relaxed text-zinc-400">
						Operational contexts where better-openclaw engine delivers measurable value across
						enterprise infrastructure.
					</p>

					<div className="mt-8 flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest text-zinc-500">
						<span className="h-1.5 w-1.5 rounded-full bg-emerald-500/50" />
						USED IN PRODUCTION ACROSS DISTRIBUTED ENTERPRISE STACKS
					</div>
				</motion.div>

				{/* Two-Column Layout */}
				<div className="flex flex-col lg:flex-row border border-white/5 bg-black/40 backdrop-blur-md">
					{/* Left: Tab List */}
					<div className="w-full lg:w-[35%] flex flex-col border-b lg:border-b-0 lg:border-r border-white/5">
						{TABS.map((tab, idx) => {
							const isActive = activeTab === idx;
							return (
								<button
									key={tab.id}
									onClick={() => setActiveTab(idx)}
									className={`group relative flex flex-col items-start justify-center border-b border-white/5 p-6 text-left transition-colors last:border-b-0 hover:bg-zinc-900/30
										${isActive ? "bg-zinc-900/50" : ""}
									`}
								>
									{/* Active glow edge */}
									{isActive && (
										<motion.div
											layoutId="activeTabIndicator"
											className="absolute left-0 top-0 h-full w-[2px] bg-primary shadow-[0_0_12px_rgba(163,135,95,0.8)]"
										/>
									)}

									<span
										className={`font-mono text-[10px] uppercase tracking-widest mb-3 transition-colors ${isActive ? "text-primary" : "text-zinc-600 group-hover:text-zinc-400"}`}
									>
										{tab.label}
									</span>
									<span
										className={`font-sans text-sm font-bold uppercase tracking-wide transition-colors ${isActive ? "text-white" : "text-zinc-400 group-hover:text-zinc-300"}`}
									>
										{tab.title}
									</span>

									{tab.metric && (
										<div
											className={`mt-4 inline-flex items-center rounded-sm border px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-widest transition-opacity ${isActive ? "opacity-100" : "opacity-40 group-hover:opacity-80"} ${tab.metricColor}`}
										>
											{tab.metric}
										</div>
									)}
								</button>
							);
						})}
					</div>

					{/* Right: Tab Content */}
					<div className="relative w-full min-h-[500px] lg:w-[65%] p-8 md:p-12 overflow-hidden">
						<AnimatePresence mode="wait">
							<motion.div
								key={activeTab}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								transition={{ duration: 0.3 }}
								className="flex h-full flex-col"
							>
								<h3 className="mb-6 font-sans text-xl font-bold uppercase tracking-wide text-white md:text-3xl max-w-[400px]">
									{TABS[activeTab].title}
								</h3>

								<p className="max-w-[500px] font-mono text-[11px] leading-relaxed text-zinc-400">
									{TABS[activeTab].desc}
								</p>

								<ul className="mt-8 flex flex-col gap-4 font-mono text-[10px] tracking-widest text-zinc-300">
									{TABS[activeTab].bullets.map((bullet, i) => (
										<li key={i} className="flex items-center gap-3">
											<span className="h-1 w-1 bg-primary shadow-[0_0_8px_rgba(163,135,95,0.8)]" />
											{bullet}
										</li>
									))}
								</ul>

								<div className="mt-auto pt-12 flex items-center gap-4">
									<Link
										href="/new"
										className="flex h-12 items-center justify-center bg-primary px-8 font-mono text-[10px] font-bold uppercase tracking-widest text-black transition-all hover:bg-[#b5986e]"
									>
										REQUEST DEMO
									</Link>
									<Link
										href="/docs"
										className="flex h-12 items-center justify-center border border-zinc-700 px-8 font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-400 transition-colors hover:text-white"
									>
										READ DOCUMENTATION
									</Link>
								</div>
							</motion.div>
						</AnimatePresence>

						{/* Mock Terminal Card float right */}
						<div className="absolute right-8 top-12 hidden w-[320px] rounded-sm border border-zinc-800 bg-[#0A0A0A] xl:block">
							<div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2">
								<span className="font-mono text-[9px] uppercase tracking-widest text-zinc-600">
									TERMINAL_OUT
								</span>
								<div className="flex gap-1.5">
									<span className="h-1.5 w-1.5 rounded-full bg-zinc-700" />
									<span className="h-1.5 w-1.5 rounded-full bg-zinc-700" />
								</div>
							</div>
							<div className="p-4 font-mono text-[10px] text-zinc-400 leading-relaxed">
								<AnimatePresence mode="wait">
									<motion.div
										key={activeTab}
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										className="flex flex-col gap-1"
									>
										{TABS[activeTab].terminal.map((line, i) => (
											<span
												key={i}
												className={line.startsWith(">") ? "text-zinc-500" : "text-primary"}
											>
												{line}
											</span>
										))}
										<span className="mt-2 text-emerald-500 uppercase">System Active _</span>
									</motion.div>
								</AnimatePresence>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
