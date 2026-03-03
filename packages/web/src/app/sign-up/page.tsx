"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";

export default function SignUpPage() {
	const router = useRouter();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	async function handleSignUp(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		setIsLoading(true);
		try {
			const result = await signUp.email({ name, email, password });
			if (result.error) {
				setError(result.error.message ?? "Sign up failed");
			} else {
				router.push("/dashboard");
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Sign up failed");
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-background p-4">
			{/* Ambient glow */}
			<div className="pointer-events-none fixed inset-0 z-0">
				<div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,150,50,0.15)_0%,transparent_100%)] blur-[80px]" />
			</div>

			<div className="relative z-10 w-full max-w-sm">
				<div className="mb-8 text-center">
					<Link href="/" className="inline-flex items-center gap-2 transition-opacity hover:opacity-80">
						<span className="text-2xl">🦞</span>
						<span className="text-xl font-bold tracking-tight text-foreground">better-openclaw</span>
					</Link>
				</div>

				<div className="rounded-xl border border-border bg-background/80 p-8 shadow-2xl backdrop-blur-md">
					<h1 className="mb-1 text-xl font-bold text-foreground">Create account</h1>
					<p className="mb-6 text-sm text-muted-foreground">Start saving and managing your stacks</p>

					{error && (
						<div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">
							{error}
						</div>
					)}

					<form onSubmit={handleSignUp} className="space-y-4">
						<div>
							<label htmlFor="name" className="mb-1.5 block text-xs font-medium text-muted-foreground uppercase tracking-wider">
								Name
							</label>
							<input
								id="name"
								type="text"
								required
								autoComplete="name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="Your name"
								className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
							/>
						</div>
						<div>
							<label htmlFor="email" className="mb-1.5 block text-xs font-medium text-muted-foreground uppercase tracking-wider">
								Email
							</label>
							<input
								id="email"
								type="email"
								required
								autoComplete="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="you@example.com"
								className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
							/>
						</div>
						<div>
							<label htmlFor="password" className="mb-1.5 block text-xs font-medium text-muted-foreground uppercase tracking-wider">
								Password
							</label>
							<input
								id="password"
								type="password"
								required
								minLength={8}
								autoComplete="new-password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="Min. 8 characters"
								className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
							/>
						</div>
						<button
							type="submit"
							disabled={isLoading}
							className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-60"
						>
							{isLoading ? <><Loader2 className="h-4 w-4 animate-spin" />Creating account…</> : "Create account"}
						</button>
					</form>

					<p className="mt-5 text-center text-xs text-muted-foreground">
						Already have an account?{" "}
						<Link href="/sign-in" className="text-primary hover:underline font-medium">
							Sign in
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
