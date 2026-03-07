"use client";

import { LayoutDashboard, LogIn } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface SessionData {
	user: {
		name?: string | null;
		email?: string | null;
		image?: string | null;
	};
}

interface UserMenuProps {
	session: SessionData | null;
	isOpen: boolean;
	onToggle: () => void;
	onClose: () => void;
	onSignOut: () => void;
}

export function UserMenu({ session, isOpen, onToggle, onClose, onSignOut }: UserMenuProps) {
	if (!session) {
		return (
			<Link
				href="/sign-in"
				className="hidden sm:inline-flex items-center justify-center border border-border px-4 py-2 font-mono text-xs font-semibold uppercase tracking-widest text-foreground transition-all hover:bg-surface"
			>
				SIGN IN
			</Link>
		);
	}

	return (
		<div className="relative">
			<button
				title="User menu"
				type="button"
				onClick={onToggle}
				className="hidden sm:flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-all hover:bg-surface"
				aria-haspopup="true"
			>
				{session.user.image ? (
					<Image
						src={session.user.image}
						alt={session.user.name ?? "User"}
						width={20}
						height={20}
						unoptimized
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

			{isOpen ? (
				<>
					<button
						type="button"
						aria-label="Close user menu backdrop"
						className="fixed inset-0 z-40"
						onClick={onClose}
					/>
					<div
						className="absolute right-0 top-full mt-2 z-50 w-44 rounded-xl border border-border bg-background shadow-lg"
						role="menu"
					>
						<Link
							href="/dashboard"
							onClick={onClose}
							className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-surface rounded-t-xl transition-colors"
							role="menuitem"
						>
							<LayoutDashboard className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
							Dashboard
						</Link>
						<div className="h-px bg-border" />
						<button
							type="button"
							onClick={onSignOut}
							className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-surface rounded-b-xl transition-colors"
							role="menuitem"
						>
							<LogIn className="h-4 w-4 rotate-180" aria-hidden="true" />
							Sign out
						</button>
					</div>
				</>
			) : null}
		</div>
	);
}
