"use client";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<div className="flex min-h-screen items-center justify-center p-8">
			<div className="max-w-md text-center">
				<p className="text-6xl">🦞</p>
				<h1 className="mt-4 text-2xl font-bold text-foreground">Something went wrong</h1>
				<p className="mt-2 text-sm text-muted-foreground">
					{error.message || "An unexpected error occurred."}
				</p>
				<button
					type="button"
					onClick={reset}
					className="mt-6 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
				>
					Try again
				</button>
			</div>
		</div>
	);
}
