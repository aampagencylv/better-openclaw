"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Loader2, CheckCircle, ArrowLeft, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
	const [email, setEmail] = useState("");
	const [sent, setSent] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		setIsLoading(true);
		try {
			const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3456/v1";
			const res = await fetch(`${API_BASE}/auth/forget-password`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email,
					redirectTo: `${window.location.origin}/reset-password`,
				}),
			});
			if (!res.ok) {
				const body = await res.json().catch(() => ({}));
				setError(body.message ?? "Failed to send reset email");
			} else {
				setSent(true);
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to send reset email");
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-background p-4">
			<div className="pointer-events-none fixed inset-0 z-0">
				<div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,150,50,0.12)_0%,transparent_100%)] blur-[80px]" />
			</div>

			<div className="relative z-10 w-full max-w-sm">
				<div className="mb-8 text-center">
					<Link href="/" className="inline-flex items-center gap-2 transition-opacity hover:opacity-80">
						<span className="text-2xl">🦞</span>
						<span className="text-xl font-bold tracking-tight text-foreground">better-openclaw</span>
					</Link>
				</div>

				<div className="rounded-xl border border-border bg-background/80 p-8 shadow-2xl backdrop-blur-md">
					{sent ? (
						<div className="text-center">
							<div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20">
								<CheckCircle className="h-7 w-7 text-emerald-400" />
							</div>
							<h1 className="text-xl font-bold text-foreground">Check your email</h1>
							<p className="mt-2 text-sm text-muted-foreground">
								We sent a password reset link to <strong className="text-foreground">{email}</strong>.
								The link expires in 1 hour.
							</p>
							<Link
								href="/sign-in"
								className="mt-6 inline-flex items-center gap-2 text-sm text-primary hover:underline"
							>
								<ArrowLeft className="h-3.5 w-3.5" />
								Back to sign in
							</Link>
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
							<h1 className="mb-1 text-xl font-bold text-foreground">Forgot password?</h1>
							<p className="mb-6 text-sm text-muted-foreground">
								Enter your email and we'll send you a reset link.
							</p>

							{error && (
								<div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">
									{error}
								</div>
							)}

							<form onSubmit={handleSubmit} className="space-y-4">
								<div>
									<label htmlFor="email" className="mb-1.5 block text-xs font-medium text-muted-foreground uppercase tracking-wider">
										Email address
									</label>
									<div className="relative">
										<Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
										<input
											id="email"
											type="email"
											required
											autoFocus
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											placeholder="you@example.com"
											className="w-full rounded-lg border border-border bg-surface py-2.5 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
										/>
									</div>
								</div>
								<button
									type="submit"
									disabled={isLoading}
									className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-60"
								>
									{isLoading ? (
										<><Loader2 className="h-4 w-4 animate-spin" />Sending…</>
									) : (
										"Send reset link"
									)}
								</button>
							</form>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
