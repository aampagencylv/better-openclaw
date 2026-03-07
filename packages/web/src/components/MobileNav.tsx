"use client";

import Link from "next/link";

interface NavLink {
	href: string;
	label: string;
}

interface MobileNavProps {
	links: NavLink[];
	session: { user: { name?: string | null; email?: string | null } } | null;
	onClose: () => void;
	onSignOut: () => void;
}

export function MobileNav({ links, session, onClose, onSignOut }: MobileNavProps) {
	return (
		<div className="border-t border-border bg-background/95 backdrop-blur-xl md:hidden">
			<div className="space-y-1 px-4 py-4">
				<div className="mb-4 inline-flex items-center rounded-sm border border-border bg-secondary/50 px-2.5 py-1">
					<span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
					<span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
						[ ENV: PRODUCTION ]
					</span>
				</div>
				{links.map((link) => (
					<Link
						key={link.href}
						href={link.href}
						className="block py-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
						onClick={onClose}
					>
						{link.label}
					</Link>
				))}
				{session ? (
					<>
						<Link
							href="/dashboard"
							className="block py-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
							onClick={onClose}
						>
							DASHBOARD
						</Link>
						<button
							type="button"
							onClick={onSignOut}
							className="block py-2 font-mono text-[11px] uppercase tracking-widest text-red-400 hover:text-red-300"
						>
							SIGN OUT
						</button>
					</>
				) : (
					<Link
						href="/sign-in"
						className="block py-2 font-mono text-[11px] uppercase tracking-widest text-primary hover:text-primary/80"
						onClick={onClose}
					>
						SIGN IN
					</Link>
				)}
				<Link
					href="/new"
					className="mt-4 block w-full bg-primary px-4 py-3 text-center font-mono text-[11px] font-semibold uppercase tracking-widest text-primary-foreground"
					onClick={onClose}
				>
					START BUILDING &rarr;
				</Link>
			</div>
		</div>
	);
}
