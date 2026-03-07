"use client";

import { ArrowLeft, CheckCircle, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { authClient } from "@/lib/auth-client";

function MagicLinkContent() {
	const _router = useRouter();
	const searchParams = useSearchParams();
	const defaultEmail = searchParams.get("email") ?? "";

	const [email, setEmail] = useState(defaultEmail);
	const [sent, setSent] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		setIsLoading(true);
		try {
			const result = await authClient.signIn.magicLink({
				email,
				callbackURL: "/dashboard",
			});
			if (result?.error) {
				setError(result.error.message ?? "Failed to send magic link");
			} else {
				setSent(true);
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to send magic link");
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div className="rounded-xl border border-border bg-background/80 p-8 shadow-2xl backdrop-blur-md">
			{sent ? (
				<div className="text-center">
					<div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20">
						<CheckCircle className="h-7 w-7 text-emerald-400" />
					</div>
					<h1 className="text-xl font-bold text-foreground">Magic link sent!</h1>
					<p className="mt-2 text-sm text-muted-foreground">
						We emailed a sign-in link to <strong className="text-foreground">{email}</strong>. Check
						your inbox — the link expires in 15 minutes.
					</p>
					<button
						type="button"
						onClick={() => setSent(false)}
						className="mt-4 text-xs text-muted-foreground hover:text-foreground transition-colors"
					>
						Resend link
					</button>
				</div>
			) : (
				<>
					<Link
						href="/sign-in"
						className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
					>
						<ArrowLeft className="h-3 w-3" />
						Back to sign in
					</Link>
					<div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
						<Mail className="h-6 w-6 text-primary" />
					</div>
					<h1 className="mb-1 text-xl font-bold text-foreground">Sign in with magic link</h1>
					<p className="mb-6 text-sm text-muted-foreground">
						No password needed. We'll email you a one-click sign-in link.
					</p>

					{error && (
						<div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">
							{error}
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label
								htmlFor="email"
								className="mb-1.5 block text-xs font-medium text-muted-foreground uppercase tracking-wider"
							>
								Email address
							</label>
							<input
								id="email"
								type="email"
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="you@example.com"
								className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
							/>
						</div>
						<button
							type="submit"
							disabled={isLoading || !email}
							className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-60"
						>
							{isLoading ? (
								<>
									<Loader2 className="h-4 w-4 animate-spin" />
									Sending…
								</>
							) : (
								<>
									<Mail className="h-4 w-4" />
									Send magic link
								</>
							)}
						</button>
					</form>
				</>
			)}
		</div>
	);
}

export default function MagicLinkPage() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-background p-4">
			<div className="pointer-events-none fixed inset-0 z-0">
				<div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(184,115,51,0.12)_0%,transparent_100%)] blur-[80px]" />
			</div>
			<div className="relative z-10 w-full max-w-sm">
				<div className="mb-8 text-center">
					<Link
						href="/"
						className="inline-flex items-center gap-2 transition-opacity hover:opacity-80"
					>
						<span className="text-2xl">🦞</span>
						<span className="text-xl font-bold tracking-tight text-foreground">
							better-openclaw
						</span>
					</Link>
				</div>
				<Suspense fallback={<Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />}>
					<MagicLinkContent />
				</Suspense>
			</div>
		</div>
	);
}
