"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, authClient } from "@/lib/auth-client";
import { Github, Loader2, Mail, Fingerprint, Zap } from "lucide-react";

type Mode = "password" | "magic" | "passkey";

export default function SignInPage() {
	const router = useRouter();
	const [mode, setMode] = useState<Mode>("password");

	// Email + password state
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isOAuthLoading, setIsOAuthLoading] = useState<string | null>(null);
	const [magicSent, setMagicSent] = useState(false);
	const [passkeyLoading, setPasskeyLoading] = useState(false);

	async function handleEmailSignIn(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		setIsLoading(true);
		try {
			const result = await signIn.email({ email, password });
			if (result.error) {
				setError(result.error.message ?? "Sign in failed");
			} else {
				router.push("/dashboard");
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Sign in failed");
		} finally {
			setIsLoading(false);
		}
	}

	async function handleMagicLink(e: React.FormEvent) {
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
				setMagicSent(true);
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to send magic link");
		} finally {
			setIsLoading(false);
		}
	}

	async function handlePasskey() {
		setError(null);
		setPasskeyLoading(true);
		try {
			await authClient.signIn.passkey({
				fetchOptions: {
					onSuccess: () => {
						router.push("/dashboard");
					},
					onError: (ctx) => {
						setError(ctx.error.message ?? "Passkey authentication failed");
					},
				},
			});
		} catch (err) {
			const msg = err instanceof Error ? err.message : "Passkey flow cancelled";
			if (!msg.toLowerCase().includes("cancel") && !msg.includes("Not allowed")) {
				setError(msg);
			}
		} finally {
			setPasskeyLoading(false);
		}
	}

	async function handleOAuth(provider: "github" | "google") {
		setIsOAuthLoading(provider);
		try {
			await signIn.social({ provider, callbackURL: "/dashboard" });
		} catch (err) {
			setError(err instanceof Error ? err.message : "OAuth sign in failed");
			setIsOAuthLoading(null);
		}
	}

	const tabs: { id: Mode; label: string; icon: React.ReactNode }[] = [
		{ id: "password", label: "Password", icon: <Mail className="h-3.5 w-3.5" /> },
		{ id: "magic", label: "Magic Link", icon: <Zap className="h-3.5 w-3.5" /> },
		{ id: "passkey", label: "Passkey", icon: <Fingerprint className="h-3.5 w-3.5" /> },
	];

	return (
		<div className="flex min-h-screen items-center justify-center bg-background p-4">
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
					<h1 className="mb-1 text-xl font-bold text-foreground">Sign in</h1>
					<p className="mb-5 text-sm text-muted-foreground">Welcome back — choose your sign-in method</p>

					{/* Method tabs */}
					<div className="mb-5 flex gap-1 rounded-lg border border-border bg-surface/30 p-1">
						{tabs.map((tab) => (
							<button
								key={tab.id}
								type="button"
								onClick={() => { setMode(tab.id); setError(null); setMagicSent(false); }}
								className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium transition-all ${
									mode === tab.id
										? "bg-background text-foreground shadow-sm"
										: "text-muted-foreground hover:text-foreground"
								}`}
							>
								{tab.icon}
								{tab.label}
							</button>
						))}
					</div>

					{/* Error */}
					{error && (
						<div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">
							{error}
						</div>
					)}

					{/* Password mode */}
					{mode === "password" && (
						<form onSubmit={handleEmailSignIn} className="space-y-4">
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
								<div className="mb-1.5 flex items-center justify-between">
									<label htmlFor="password" className="block text-xs font-medium text-muted-foreground uppercase tracking-wider">
										Password
									</label>
									<Link href="/forgot-password" className="text-[11px] text-primary hover:underline">
										Forgot password?
									</Link>
								</div>
								<input
									id="password"
									type="password"
									required
									autoComplete="current-password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder="••••••••"
									className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
								/>
							</div>
							<button
								type="submit"
								disabled={isLoading}
								className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-60"
							>
								{isLoading ? <><Loader2 className="h-4 w-4 animate-spin" />Signing in…</> : "Sign in"}
							</button>
						</form>
					)}

					{/* Magic link mode */}
					{mode === "magic" && (
						magicSent ? (
							<div className="py-4 text-center">
								<p className="text-3xl mb-3">📬</p>
								<p className="font-medium text-foreground">Check your inbox</p>
								<p className="mt-1 text-sm text-muted-foreground">
									We sent a magic link to <strong>{email}</strong>. It expires in 15 minutes.
								</p>
								<button
									type="button"
									onClick={() => setMagicSent(false)}
									className="mt-4 text-xs text-muted-foreground hover:text-foreground"
								>
									Resend link
								</button>
							</div>
						) : (
							<form onSubmit={handleMagicLink} className="space-y-4">
								<div>
									<label htmlFor="magic-email" className="mb-1.5 block text-xs font-medium text-muted-foreground uppercase tracking-wider">
										Email address
									</label>
									<input
										id="magic-email"
										type="email"
										required
										autoComplete="email"
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
									{isLoading ? <><Loader2 className="h-4 w-4 animate-spin" />Sending…</> : <><Zap className="h-4 w-4" />Send magic link</>}
								</button>
							</form>
						)
					)}

					{/* Passkey mode */}
					{mode === "passkey" && (
						<div className="space-y-4">
							<div className="rounded-lg border border-border bg-surface/30 p-4 text-center">
								<Fingerprint className="mx-auto mb-2 h-10 w-10 text-primary/60" />
								<p className="text-sm text-foreground font-medium">Sign in with your passkey</p>
								<p className="mt-1 text-xs text-muted-foreground">
									Use Face ID, Touch ID, or a hardware security key to sign in without a password.
								</p>
							</div>
							<button
								type="button"
								onClick={handlePasskey}
								disabled={passkeyLoading}
								className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-60"
							>
								{passkeyLoading ? (
									<><Loader2 className="h-4 w-4 animate-spin" />Waiting for passkey…</>
								) : (
									<><Fingerprint className="h-4 w-4" />Sign in with Passkey</>
								)}
							</button>
						</div>
					)}

					{/* Divider */}
					<div className="my-5 flex items-center gap-3">
						<div className="h-px flex-1 bg-border" />
						<span className="text-xs text-muted-foreground">or</span>
						<div className="h-px flex-1 bg-border" />
					</div>

					{/* OAuth buttons */}
					<div className="space-y-2">
						<button
							type="button"
							onClick={() => handleOAuth("github")}
							disabled={!!isOAuthLoading}
							className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-60"
						>
							{isOAuthLoading === "github" ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								<Github className="h-4 w-4" />
							)}
							Continue with GitHub
						</button>
						<button
							type="button"
							onClick={() => handleOAuth("google")}
							disabled={!!isOAuthLoading}
							className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-60"
						>
							{isOAuthLoading === "google" ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								<svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
									<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
									<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
									<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
									<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
								</svg>
							)}
							Continue with Google
						</button>
					</div>

					<p className="mt-5 text-center text-xs text-muted-foreground">
						Don&apos;t have an account?{" "}
						<Link href="/sign-up" className="text-primary hover:underline font-medium">
							Sign up
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
