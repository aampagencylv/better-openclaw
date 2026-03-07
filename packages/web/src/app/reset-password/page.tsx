"use client";

import { CheckCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { authClient } from "@/lib/auth-client";

function ResetPasswordForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const token = searchParams.get("token") ?? "";

	const [password, setPassword] = useState("");
	const [confirm, setConfirm] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [done, setDone] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (password !== confirm) {
			setError("Passwords don't match");
			return;
		}
		if (password.length < 8) {
			setError("Password must be at least 8 characters");
			return;
		}
		setError(null);
		setIsLoading(true);
		try {
			const result = await authClient.resetPassword({ newPassword: password, token });
			if (result.error) {
				setError(result.error.message ?? "Reset failed");
			} else {
				setDone(true);
				setTimeout(() => router.push("/sign-in"), 2500);
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Reset failed");
		} finally {
			setIsLoading(false);
		}
	}

	if (!token) {
		return (
			<div className="text-center">
				<p className="text-sm text-red-400">
					Invalid or missing reset token. Please request a new link.
				</p>
				<Link
					href="/forgot-password"
					className="mt-4 inline-block text-sm text-primary hover:underline"
				>
					Request new link
				</Link>
			</div>
		);
	}

	return (
		<>
			{done ? (
				<div className="text-center">
					<div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20">
						<CheckCircle className="h-7 w-7 text-emerald-400" />
					</div>
					<h1 className="text-xl font-bold text-foreground">Password updated!</h1>
					<p className="mt-2 text-sm text-muted-foreground">Redirecting you to sign in…</p>
				</div>
			) : (
				<>
					<h1 className="mb-1 text-xl font-bold text-foreground">Set new password</h1>
					<p className="mb-6 text-sm text-muted-foreground">
						Choose a strong password for your account.
					</p>

					{error && (
						<div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">
							{error}
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label
								htmlFor="password"
								className="mb-1.5 block text-xs font-medium text-muted-foreground uppercase tracking-wider"
							>
								New password
							</label>
							<div className="relative">
								<input
									id="password"
									type={showPassword ? "text" : "password"}
									required
									minLength={8}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder="Min. 8 characters"
									className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground"
								>
									{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
								</button>
							</div>
						</div>
						<div>
							<label
								htmlFor="confirm"
								className="mb-1.5 block text-xs font-medium text-muted-foreground uppercase tracking-wider"
							>
								Confirm password
							</label>
							<input
								id="confirm"
								type={showPassword ? "text" : "password"}
								required
								value={confirm}
								onChange={(e) => setConfirm(e.target.value)}
								placeholder="Repeat new password"
								className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
							/>
						</div>
						<button
							type="submit"
							disabled={isLoading}
							className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-60"
						>
							{isLoading ? (
								<>
									<Loader2 className="h-4 w-4 animate-spin" />
									Updating…
								</>
							) : (
								"Update password"
							)}
						</button>
					</form>
				</>
			)}
		</>
	);
}

export default function ResetPasswordPage() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-background p-4">
			<div className="pointer-events-none fixed inset-0 z-0">
				<div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,150,50,0.12)_0%,transparent_100%)] blur-[80px]" />
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
				<div className="rounded-xl border border-border bg-background/80 p-8 shadow-2xl backdrop-blur-md">
					<Suspense fallback={<Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />}>
						<ResetPasswordForm />
					</Suspense>
				</div>
			</div>
		</div>
	);
}
