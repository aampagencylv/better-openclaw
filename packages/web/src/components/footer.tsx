import Link from "next/link";

const productLinks = [
	{ href: "/new", label: "Builder" },
	{ href: "/docs", label: "Docs" },
	{ href: "/api-docs", label: "API" },
	{ href: "/showcase", label: "Showcase" },
];

const resourceLinks = [
	{ href: "https://github.com/bidewio/better-openclaw", label: "GitHub", external: true },
	{ href: "https://www.npmjs.com/package/better-openclaw", label: "npm", external: true },
	{ href: "https://github.com/openclaw", label: "OpenClaw", external: true },
];

const companyLinks = [
	{ href: "/about", label: "About" },
	{ href: "/blog", label: "Blog" },
	{ href: "/careers", label: "Careers", badge: "HIRING" },
];

const legalLinks = [
	{ href: "/privacy", label: "Privacy Policy" },
	{ href: "/terms", label: "Terms of Service" },
];

function FooterColumn({
	title,
	links,
}: {
	title: string;
	links: { href: string; label: string; external?: boolean; badge?: string }[];
}) {
	return (
		<div>
			<h4 className="mb-6 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
				{title}
			</h4>
			<ul className="space-y-4">
				{links.map((link) => {
					const cls =
						"font-sans text-[13px] text-zinc-400 transition-colors hover:text-white flex items-center gap-2";
					return (
						<li key={link.label}>
							{link.external ? (
								<a href={link.href} target="_blank" rel="noopener noreferrer" className={cls}>
									{link.label}
								</a>
							) : (
								<Link href={link.href} className={cls}>
									{link.label}
									{link.badge && (
										<span className="font-mono text-[8px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-sm uppercase tracking-widest">
											{link.badge}
										</span>
									)}
								</Link>
							)}
						</li>
					);
				})}
			</ul>
		</div>
	);
}

export function Footer() {
	return (
		<footer className="w-full bg-black">
			{/* Validation Console Pre-Footer */}
			<div className="border-t border-white/5 py-24 pl-4 sm:pl-6 lg:pl-8 pr-4 sm:pr-6 lg:pr-8">
				<div className="mx-auto max-w-7xl">
					<div className="mb-12 flex items-center gap-3">
						<span className="h-1.5 w-1.5 bg-zinc-600" />
						<span className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase">
							// SYSTEM_AUDIT_PROTOCOL_V4
						</span>
					</div>
					<h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl mb-6">
						VALIDATION <span className="text-zinc-600">CONSOLE</span>
					</h2>
					<p className="max-w-xl text-sm leading-relaxed text-zinc-400 mb-16">
						Live system audit interface verifying production readiness, compliance, and operational
						integrity for better-openclaw deployments.
					</p>

					{/* Badges Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border border-white/5 bg-black/40">
						{/* Col 1 */}
						<div className="border-b md:border-b-0 md:border-r border-white/5 p-8 flex flex-col justify-between">
							<div className="mb-8 inline-flex items-center gap-2 rounded-sm border border-emerald-500/20 bg-emerald-500/10 px-3 py-1">
								<span className="h-1 w-1 rounded-full bg-emerald-500" />
								<span className="font-mono text-[9px] uppercase tracking-widest text-emerald-500">
									PRODUCTION ENVIRONMENT ACTIVE
								</span>
							</div>
							<h3 className="font-sans text-3xl font-bold text-white mb-2">ENTERPRISE</h3>
							<h3 className="font-sans text-3xl font-bold text-zinc-600 mb-8">INTEGRITY</h3>
							<p className="font-mono text-[10px] text-zinc-500 leading-relaxed">
								System infrastructure verified for high-availability environments. Zero-trust
								architecture enforced across all active nodes.
							</p>
						</div>
						{/* Col 2 */}
						<div className="border-b lg:border-b-0 lg:border-r border-white/5 p-8 flex flex-col justify-between">
							<div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
								<span className="font-mono text-[10px] uppercase text-zinc-500">
									COMPLIANCE_LOG
								</span>
								<span className="font-mono text-[10px] text-zinc-500">ID: 8842-XC</span>
							</div>
							<div className="space-y-4 font-mono text-[10px] uppercase tracking-widest text-zinc-400">
								<div className="flex justify-between items-center bg-zinc-900/40 px-3 py-2 border border-white/5">
									<span>SOC2 Type II</span>
									<span className="text-emerald-500">[VERIFIED]</span>
								</div>
								<div className="flex justify-between items-center bg-zinc-900/40 px-3 py-2 border border-white/5">
									<span>ISO 27001</span>
									<span className="text-emerald-500">[ACTIVE]</span>
								</div>
								<div className="flex justify-between items-center bg-zinc-900/40 px-3 py-2 border border-white/5">
									<span>GDPR / CCPA</span>
									<span className="text-emerald-500">[COMPLIANT]</span>
								</div>
							</div>
						</div>
						{/* Col 3 */}
						<div className="p-8 flex flex-col justify-between">
							<span className="font-mono text-[10px] uppercase text-zinc-500 mb-8 border-b border-white/5 pb-4">
								SECURITY_PROTOCOL
							</span>
							<h4 className="text-3xl font-sans text-white mb-4">AES-256</h4>
							<p className="font-mono text-[10px] text-zinc-500 leading-relaxed">
								End-to-end encryption active for data at rest and in transit.
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Pre-Footer Map / Ready Section */}
			<div className="relative border-t border-white/5 py-32 overflow-hidden flex flex-col items-center justify-center">
				{/* Background Map glow */}
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(163,135,95,0.08)_0%,transparent_60%)] -z-10" />

				<div className="inline-flex items-center gap-2 rounded-sm border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 mb-6">
					<span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
					<span className="font-mono text-[9px] uppercase tracking-widest text-emerald-500">
						READY TO LAUNCH
					</span>
				</div>

				<h2 className="mb-4 text-center text-4xl font-bold tracking-tight text-white md:text-5xl">
					SYSTEM <span className="text-zinc-600">READY</span>
				</h2>

				<div className="mt-12 flex flex-col md:flex-row gap-6 border border-white/5 bg-black/60 p-6 xl:p-10 backdrop-blur-md max-w-4xl mx-auto items-center">
					<div className="flex-1">
						<ul className="space-y-4 font-mono text-[11px] text-zinc-300">
							<li className="flex items-center gap-3">
								<span className="flex h-4 w-4 items-center justify-center rounded-sm border border-zinc-700 text-[8px] text-zinc-500">
									1
								</span>
								Create workspace (30s)
							</li>
							<li className="flex items-center gap-3">
								<span className="flex h-4 w-4 items-center justify-center rounded-sm border border-zinc-700 text-[8px] text-zinc-500">
									2
								</span>
								Connect repo & deploy agent
							</li>
							<li className="flex items-center gap-3">
								<span className="flex h-4 w-4 items-center justify-center rounded-sm border border-zinc-700 text-[8px] text-zinc-500">
									3
								</span>
								Monitor nodes in real-time
							</li>
						</ul>
					</div>
					<div className="flex-1 w-full flex flex-col gap-4">
						<Link
							href="/new"
							className="flex h-12 w-full items-center justify-center bg-primary px-8 font-mono text-[10px] font-bold uppercase tracking-widest text-black transition-all hover:bg-[#b5986e]"
						>
							INITIALIZE BUILD &rarr;
						</Link>
						<Link
							href="/demo"
							className="flex h-12 w-full items-center justify-center border border-zinc-700 px-8 font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-400 transition-colors hover:text-white hover:bg-zinc-900/50"
						>
							REQUEST DEMO
						</Link>
					</div>
				</div>
			</div>

			{/* Main Footer Links */}
			<div className="border-t border-white/5">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
					<div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-5">
						{/* Brand Left */}
						<div className="lg:col-span-1 border border-white/5 bg-zinc-900/20 p-6 flex flex-col justify-between">
							<div>
								<span className="text-xl font-bold tracking-tight text-white mb-2 block">
									<span className="text-primary mr-2">🦞</span> better-openclaw
								</span>
								<div className="mt-8">
									<span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500 block mb-2">
										SYSTEM_STATUS
									</span>
									<span className="font-mono text-[11px] text-emerald-500">OPERATIONAL</span>
									<span className="font-mono text-[9px] text-zinc-600 ml-2">v1.2.0</span>
								</div>
							</div>
							<div className="mt-12 flex gap-4 text-zinc-500">
								{/* Social Icons (mocked as simple text/icons for now) */}
								<a href="https://github.com/bidewio" className="hover:text-white">
									GH
								</a>
								<a href="https://x.com" className="hover:text-white">
									X
								</a>
								<a href="https://discord.gg/better-openclaw" className="hover:text-white">
									DC
								</a>
							</div>
						</div>

						{/* Center Columns */}
						<div className="lg:col-span-3 grid grid-cols-2 lg:grid-cols-3 gap-8">
							<FooterColumn title="PRODUCT" links={productLinks} />
							<FooterColumn title="RESOURCES" links={resourceLinks} />
							<div className="space-y-8">
								<FooterColumn title="COMPANY" links={companyLinks} />
								<FooterColumn title="LEGAL" links={legalLinks} />
							</div>
						</div>

						{/* Right CTA */}
						<div className="lg:col-span-1">
							<h4 className="mb-4 font-mono text-[10px] uppercase tracking-widest text-primary">
								// SET_STARTED
							</h4>
							<h3 className="font-sans text-xl font-bold text-white mb-2">START BUILDING</h3>
							<p className="font-mono text-[10px] text-zinc-500 leading-relaxed mb-6">
								Initialize your instance and deploy your first agent in seconds.
							</p>
							<Link
								href="/new"
								className="flex h-12 w-full items-center justify-center bg-primary px-8 font-mono text-[10px] font-bold uppercase tracking-widest text-black transition-all hover:bg-[#b5986e]"
							>
								GET API KEY &rarr;
							</Link>
						</div>
					</div>
				</div>
			</div>

			{/* Sub Footer Meta */}
			<div className="border-t border-white/5 py-6">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
					<p className="font-mono text-[9px] uppercase tracking-widest text-zinc-600">
						&copy; {new Date().getFullYear()} AXION INC. REIMAGINED FOR BETTER-OPENCLAW
					</p>
					<div className="flex items-center gap-6 font-mono text-[9px] uppercase tracking-widest text-zinc-600">
						<span className="flex items-center gap-2">
							<span className="h-1.5 w-1.5 bg-emerald-500 rounded-full" /> ALL SYSTEMS NORMAL
						</span>
						<a href="https://bidew.io" className="hover:text-zinc-400">
							MADE IN BIDEW
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
}
