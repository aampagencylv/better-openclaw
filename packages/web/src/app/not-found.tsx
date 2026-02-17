import Link from "next/link";

export default function NotFound() {
	return (
		<div className="flex min-h-screen items-center justify-center p-8">
			<div className="max-w-md text-center">
				<p className="text-6xl">🦞</p>
				<h1 className="mt-4 text-3xl font-bold text-foreground">404 — Page Not Found</h1>
				<p className="mt-2 text-muted-foreground">
					The page you're looking for doesn't exist or has been moved.
				</p>
				<div className="mt-6 flex justify-center gap-3">
					<Link
						href="/"
						className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
					>
						Go Home
					</Link>
					<Link
						href="/new"
						className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-surface"
					>
						Build a Stack
					</Link>
				</div>
			</div>
		</div>
	);
}
