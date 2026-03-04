"use client";

import { Github, LayoutDashboard, LogIn, Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { signOut, useSession } from "@/lib/auth-client";

const navLinks = [
	{ href: "/new", label: "BUILDER" },
	{ href: "/docs", label: "DOCS" },
	{ href: "/blog", label: "BLOG" },
	{ href: "/api-docs", label: "API" },
	{ href: "/showcase", label: "SHOWCASE" },
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
						<span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
						<span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
							[ ENV: PRODUCTION ]
						</span>
					</div>
				</div>

				{/* Center: Desktop nav */}
				<div className="hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:flex items-center gap-6">
					{navLinks.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className="font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
						>
							{link.label}
						</Link>
					))}
				</div>

				{/* Right side */}
				<div className="flex items-center gap-4">
					<a
						href="https://github.com/bidewio/better-openclaw"
						target="_blank"
						rel="noopener noreferrer"
						className="hidden md:flex items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
						aria-label="GitHub"
					>
						<span className="font-mono text-xs tracking-widest uppercase">GITHUB</span>
					</a>

					<ThemeToggle />

					{/* Auth section */}
					{session ? (
						<div className="relative">
							<button
								type="button"
								onClick={() => setUserMenuOpen(!userMenuOpen)}
								className="hidden sm:flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-all hover:bg-surface"
							>
								{session.user.image ? (
									<img
										src={session.user.image}
										alt={session.user.name ?? "User"}
										className="h-5 w-5 rounded-full"
									/>
								) : (
									<div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">
										{(session.user.name ?? session.user.email)?.[0]?.toUpperCase()}
									</div>
								)}
								<span className="max-w-[100px] truncate text-xs">
									{session.user.name ?? session.user.email}
								</span>
							</button>

							{userMenuOpen && (
								<>
									<div
										className="fixed inset-0 z-40"
										onClick={() => setUserMenuOpen(false)}
										onKeyDown={(e) => e.key === "Escape" && setUserMenuOpen(false)}
									/>
									<div className="absolute right-0 top-full mt-2 z-50 w-44 rounded-xl border border-border bg-background shadow-lg">
										<Link
											href="/dashboard"
											onClick={() => setUserMenuOpen(false)}
											className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-surface rounded-t-xl transition-colors"
										>
											<LayoutDashboard className="h-4 w-4 text-muted-foreground" />
											Dashboard
										</Link>
										<div className="h-px bg-border" />
										<button
											type="button"
											onClick={handleSignOut}
											className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-surface rounded-b-xl transition-colors"
										>
											<LogIn className="h-4 w-4 rotate-180" />
											Sign out
										</button>
									</div>
								</>
							)}
						</div>
					) : (
						<Link
							href="/sign-in"
							className="hidden sm:inline-flex items-center justify-center border border-border px-4 py-2 font-mono text-xs font-semibold uppercase tracking-widest text-foreground transition-all hover:bg-surface"
						>
							SIGN IN
						</Link>
					)}

					<Link
						href="/new"
						className="hidden sm:inline-flex items-center justify-center bg-primary px-6 py-2.5 font-mono text-xs font-semibold uppercase tracking-widest text-primary-foreground transition-all hover:bg-primary/90"
					>
						START BUILDING &rarr;
					</Link>

					{/* Mobile menu toggle */}
					<button
						type="button"
						className="flex md:hidden h-9 w-9 items-center justify-center text-muted-foreground"
						onClick={() => setMobileOpen(!mobileOpen)}
						aria-label="Toggle menu"
					>
						{mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
					</button>
				</div>
			</div>

			{/* Mobile nav */}
			{mobileOpen && (
				<div className="border-t border-border bg-background/95 backdrop-blur-xl md:hidden">
					<div className="space-y-1 px-4 py-4">
						<div className="mb-4 inline-flex items-center rounded-sm border border-border bg-secondary/50 px-2.5 py-1">
							<span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
							<span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
								[ ENV: PRODUCTION ]
							</span>
						</div>
						{navLinks.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className="block py-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
								onClick={() => setMobileOpen(false)}
							>
								{link.label}
							</Link>
						))}
						{session ? (
							<>
								<Link
									href="/dashboard"
									className="block py-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
									onClick={() => setMobileOpen(false)}
								>
									DASHBOARD
								</Link>
								<button
									type="button"
									onClick={async () => {
										await signOut();
										router.push("/");
										setMobileOpen(false);
									}}
									className="block py-2 font-mono text-[11px] uppercase tracking-widest text-red-400 hover:text-red-300"
								>
									SIGN OUT
								</button>
							</>
						) : (
							<Link
								href="/sign-in"
								className="block py-2 font-mono text-[11px] uppercase tracking-widest text-primary hover:text-primary/80"
								onClick={() => setMobileOpen(false)}
							>
								SIGN IN
							</Link>
						)}
						<Link
							href="/new"
							className="mt-4 block w-full bg-primary px-4 py-3 text-center font-mono text-[11px] font-semibold uppercase tracking-widest text-primary-foreground"
							onClick={() => setMobileOpen(false)}
						>
							START BUILDING &rarr;
						</Link>
					</div>
				</div>
			)}
		</nav>
	);
}
