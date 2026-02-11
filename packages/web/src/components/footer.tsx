import Link from "next/link";

const productLinks = [
	{ href: "/new", label: "Builder" },
	{ href: "/docs", label: "Docs" },
	{ href: "/api-docs", label: "API" },
	{ href: "/showcase", label: "Showcase" },
];

const resourceLinks = [
	{
		href: "https://github.com/bidewio/better-openclaw",
		label: "GitHub",
		external: true,
	},
	{
		href: "https://www.npmjs.com/package/better-openclaw",
		label: "npm",
		external: true,
	},
	{
		href: "https://github.com/openclaw",
		label: "OpenClaw",
		external: true,
	},
];

const communityLinks = [
	{ href: "/showcase#submit", label: "Submit a Stack" },
	{
		href: "https://github.com/bidewio/better-openclaw/issues/new",
		label: "Propose a Service",
		external: true,
	},
	{
		href: "https://discord.gg/better-openclaw",
		label: "Discord",
		external: true,
	},
];

function FooterColumn({
	title,
	links,
}: {
	title: string;
	links: { href: string; label: string; external?: boolean }[];
}) {
	return (
		<div>
			<h4 className="mb-4 text-sm font-semibold text-foreground">{title}</h4>
			<ul className="space-y-2.5">
				{links.map((link) => {
					const cls = "text-sm text-muted-foreground transition-colors hover:text-foreground";
					return (
						<li key={link.label}>
							{link.external ? (
								<a href={link.href} target="_blank" rel="noopener noreferrer" className={cls}>
									{link.label}
								</a>
							) : (
								<Link href={link.href} className={cls}>
									{link.label}
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
		<footer className="border-t border-border bg-surface/30">
			<div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
				{/* Columns */}
				<div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
					{/* Brand */}
					<div>
						<Link href="/" className="inline-flex items-center gap-2">
							<span className="text-2xl" aria-hidden>
								🦞
							</span>
							<span className="text-lg font-bold tracking-tight text-foreground">
								better-openclaw
							</span>
						</Link>
						<p className="mt-3 text-sm leading-relaxed text-muted-foreground">
							Open-source OpenClaw stack builder. CLI, API, and web UI for scaffolding
							production-ready Docker&nbsp;Compose stacks.
						</p>
					</div>

					<FooterColumn title="Product" links={productLinks} />
					<FooterColumn title="Resources" links={resourceLinks} />
					<FooterColumn title="Community" links={communityLinks} />
					<FooterColumn
						title="Legal"
						links={[
							{ href: "/privacy", label: "Privacy Policy" },
							{ href: "/terms", label: "Terms of Service" },
						]}
					/>
				</div>

				{/* Bottom bar */}
				<div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-sm text-muted-foreground sm:flex-row">
					<p>&copy; {new Date().getFullYear()} better-openclaw. All rights reserved.</p>
					<p>
						Built by{" "}
						<a
							href="https://bidew.io"
							target="_blank"
							rel="noopener noreferrer"
							className="text-primary hover:underline"
						>
							bidew.io
						</a>
					</p>
				</div>
			</div>
		</footer>
	);
}
