import { ArrowLeft, LogOut, Plus } from "lucide-react";
import Link from "next/link";

interface DashboardHeaderProps {
	userName: string | null | undefined;
	userEmail: string | null | undefined;
	onSignOut: () => void;
}

export function DashboardHeader({ userName, userEmail, onSignOut }: DashboardHeaderProps) {
	return (
		<header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-md">
			<div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 md:px-6">
				<div className="flex items-center gap-4">
					<Link
						href="/"
						className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
					>
						<ArrowLeft className="h-4 w-4" />
						Home
					</Link>
					<div className="h-4 w-px bg-border" aria-hidden="true" />
					<span className="text-lg font-bold text-foreground">Dashboard</span>
				</div>
				<div className="flex items-center gap-3">
					<span className="hidden text-sm text-muted-foreground sm:block">
						{userName || userEmail}
					</span>
					<button
						type="button"
						onClick={onSignOut}
						className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
						aria-label="Sign out"
					>
						<LogOut className="h-3.5 w-3.5" />
						Sign out
					</button>
					<Link
						href="/new"
						className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-all hover:bg-primary/90"
					>
						<Plus className="h-3.5 w-3.5" />
						New Stack
					</Link>
				</div>
			</div>
		</header>
	);
}
