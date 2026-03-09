"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { signOut, useSession } from "@/lib/auth-client";
import { DesktopNav } from "./DesktopNav";
import { MobileNav } from "./MobileNav";
import { UserMenu } from "./UserMenu";

const navLinks = [
	{ href: "/new", label: "BUILDER" },
	{ href: "/docs", label: "DOCS" },
	{ href: "/blog", label: "BLOG" },
	{ href: "/api-docs", label: "API" },
	{ href: "/showcase", label: "SHOWCASE" },
	{ href: "/analytics", label: "ANALYTICS" },
	{ href: "https://clawexa.net", label: "CLOUD", external: true },
];

export function Navbar() {
	const [mobileOpen, setMobileOpen] = useState(false);
	const [userMenuOpen, setUserMenuOpen] = useState(false);
	const { data: session } = useSession();
	const router = useRouter();

	async function handleSignOut() {
		await signOut();
		router.push("/");
		setUserMenuOpen(false);
	}

	async function handleMobileSignOut() {
		await signOut();
		router.push("/");
		setMobileOpen(false);
	}

	return (
		<nav className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
			<div className="mx-auto flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
				{/* Left side: Logo & Badge */}
				<div className="flex items-center gap-6">
					<Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
						<span className="text-2xl font-bold tracking-tight text-foreground">
							better-openclaw
						</span>
					</Link>

					{/* Production Badge */}
					<div className="hidden items-center rounded-sm border border-border bg-secondary/50 px-2.5 py-1 md:flex">
						<span
							className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"
							aria-hidden="true"
						/>
						<span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
							[ ENV: PRODUCTION ]
						</span>
					</div>
				</div>

				<DesktopNav links={navLinks} />

				{/* Right side */}
				<div className="flex items-center gap-4">
					<a
						href="https://github.com/bidewio/better-openclaw"
						target="_blank"
						rel="noopener noreferrer"
						className="hidden md:flex items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
						aria-label="GitHub repository"
					>
						<span className="font-mono text-xs tracking-widest uppercase">GITHUB</span>
					</a>

					<ThemeToggle />

					<UserMenu
						session={session}
						isOpen={userMenuOpen}
						onToggle={() => setUserMenuOpen(!userMenuOpen)}
						onClose={() => setUserMenuOpen(false)}
						onSignOut={handleSignOut}
					/>

					<Link
						href="/new"
						className="hidden sm:inline-flex items-center justify-center bg-primary px-6 py-2.5 font-mono text-xs font-semibold uppercase tracking-widest text-primary-foreground transition-all hover:bg-primary/90"
					>
						START BUILDING &rarr;
					</Link>

					{/* Mobile menu toggle */}
					<button
						title="Toggle menu"
						type="button"
						className="flex md:hidden h-9 w-9 items-center justify-center text-muted-foreground"
						onClick={() => setMobileOpen(!mobileOpen)}
						aria-label="Toggle menu"
					>
						{mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
					</button>
				</div>
			</div>

			{mobileOpen ? (
				<MobileNav
					links={navLinks}
					session={session}
					onClose={() => setMobileOpen(false)}
					onSignOut={handleMobileSignOut}
				/>
			) : null}
		</nav>
	);
}
