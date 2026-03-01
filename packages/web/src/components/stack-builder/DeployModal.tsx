/**
 * DeployModal — modal dialog for deploying a generated stack to Dokploy or Coolify.
 *
 * Phases: configure → testing → deploying → result
 *
 * The modal collects PaaS credentials (instance URL + API key), tests the
 * connection via the API relay, deploys the compose stack, and shows
 * step-by-step progress.  Credentials are cached in localStorage per
 * provider (never stored server-side).
 */

"use client";

import { CheckCircle, ExternalLink, Loader2, Server, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
	type DeployResult,
	type DeployStep,
	deployStack,
	testDeployConnection,
} from "@/lib/api-client";
import { cn } from "@/lib/utils";

const PROVIDERS = [
	{
		id: "dokploy",
		name: "Dokploy",
		description: "Self-hosted PaaS alternative to Heroku/Netlify",
		placeholder: "https://dokploy.example.com",
		docsUrl: "https://docs.dokploy.com/docs/api",
		keyInstructions: "Settings > Profile > API/CLI > Generate Token",
	},
	{
		id: "coolify",
		name: "Coolify",
		description: "Self-hosted PaaS alternative to Vercel",
		placeholder: "https://coolify.example.com",
		docsUrl: "https://coolify.io/docs/api-reference/authorization",
		keyInstructions: "Keys & Tokens > API tokens > Create (permission: *)",
	},
] as const;

const STORAGE_KEY_PREFIX = "openclaw-deploy-";

interface DeployModalProps {
	open: boolean;
	onClose: () => void;
	projectName: string;
	composeYaml: string;
	envContent: string;
}

type Phase = "configure" | "testing" | "deploying" | "result";

export function DeployModal({
	open,
	onClose,
	projectName,
	composeYaml,
	envContent,
}: DeployModalProps) {
	const [selectedProvider, setSelectedProvider] = useState<string>("dokploy");
	const [instanceUrl, setInstanceUrl] = useState("");
	const [apiKey, setApiKey] = useState("");
	const [phase, setPhase] = useState<Phase>("configure");
	const [testError, setTestError] = useState<string | null>(null);
	const [deployResult, setDeployResult] = useState<DeployResult | null>(null);
	const [showApiKey, setShowApiKey] = useState(false);

	const provider = PROVIDERS.find((p) => p.id === selectedProvider) ?? PROVIDERS[0];

	// Load saved credentials from localStorage
	useEffect(() => {
		if (!open) return;
		const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}${selectedProvider}`);
		if (saved) {
			try {
				const parsed = JSON.parse(saved);
				setInstanceUrl(parsed.instanceUrl ?? "");
				setApiKey(parsed.apiKey ?? "");
			} catch {
				// ignore
			}
		}
	}, [open, selectedProvider]);

	// Reset phase when modal opens
	useEffect(() => {
		if (open) {
			setPhase("configure");
			setTestError(null);
			setDeployResult(null);
		}
	}, [open]);

	const saveCredentials = useCallback(() => {
		localStorage.setItem(
			`${STORAGE_KEY_PREFIX}${selectedProvider}`,
			JSON.stringify({ instanceUrl, apiKey }),
		);
	}, [selectedProvider, instanceUrl, apiKey]);

	const handleTestAndDeploy = useCallback(async () => {
		if (!instanceUrl.trim() || !apiKey.trim()) return;

		setTestError(null);
		setPhase("testing");

		try {
			const testResult = await testDeployConnection({
				provider: selectedProvider,
				instanceUrl: instanceUrl.trim(),
				apiKey: apiKey.trim(),
			});

			if (!testResult.ok) {
				setTestError(testResult.error ?? "Connection failed");
				setPhase("configure");
				return;
			}

			// Save credentials on successful test
			saveCredentials();

			// Proceed to deploy
			setPhase("deploying");
			const result = await deployStack({
				provider: selectedProvider,
				instanceUrl: instanceUrl.trim(),
				apiKey: apiKey.trim(),
				projectName,
				composeYaml,
				envContent,
			});

			setDeployResult(result);
			setPhase("result");
		} catch (err) {
			setTestError(err instanceof Error ? err.message : "Deployment failed");
			setPhase("configure");
		}
	}, [
		selectedProvider,
		instanceUrl,
		apiKey,
		projectName,
		composeYaml,
		envContent,
		saveCredentials,
	]);

	if (!open) return null;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm p-4"
			role="dialog"
			aria-modal="true"
			aria-labelledby="deploy-modal-title"
		>
			<div className="w-full max-w-lg rounded-xl border border-border bg-background shadow-2xl">
				{/* Header */}
				<div className="flex items-center justify-between border-b border-border px-5 py-4">
					<div className="flex items-center gap-2">
						<Server className="h-5 w-5 text-primary" />
						<h2 id="deploy-modal-title" className="text-lg font-semibold text-foreground">
							Deploy to Server
						</h2>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="rounded-lg p-1.5 text-muted-foreground hover:bg-surface hover:text-foreground"
						aria-label="Close"
					>
						<X className="h-4 w-4" />
					</button>
				</div>

				{/* Body */}
				<div className="px-5 py-4">
					{phase === "configure" && (
						<>
							{/* Provider selector */}
							<div className="mb-4">
								<label className="mb-2 block text-sm font-medium text-foreground">Platform</label>
								<div className="flex gap-2">
									{PROVIDERS.map((p) => (
										<button
											key={p.id}
											type="button"
											onClick={() => setSelectedProvider(p.id)}
											className={cn(
												"flex-1 rounded-lg border px-3 py-2.5 text-left transition-all",
												selectedProvider === p.id
													? "border-primary bg-primary/10 text-foreground"
													: "border-border bg-surface/50 text-muted-foreground hover:border-border hover:bg-surface",
											)}
										>
											<span className="block text-sm font-semibold">{p.name}</span>
											<span className="block text-xs text-muted-foreground">{p.description}</span>
										</button>
									))}
								</div>
							</div>

							{/* Instance URL */}
							<div className="mb-3">
								<label
									htmlFor="deploy-url"
									className="mb-1.5 block text-sm font-medium text-foreground"
								>
									Instance URL
								</label>
								<input
									id="deploy-url"
									type="url"
									value={instanceUrl}
									onChange={(e) => setInstanceUrl(e.target.value)}
									placeholder={provider.placeholder}
									className="w-full rounded-lg border border-border bg-surface/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
								/>
							</div>

							{/* API Key */}
							<div className="mb-3">
								<div className="mb-1.5 flex items-center justify-between">
									<label htmlFor="deploy-key" className="text-sm font-medium text-foreground">
										API Key
									</label>
									<a
										href={provider.docsUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center gap-1 text-xs text-primary hover:underline"
									>
										How to get this
										<ExternalLink className="h-3 w-3" />
									</a>
								</div>
								<div className="relative">
									<input
										id="deploy-key"
										type={showApiKey ? "text" : "password"}
										value={apiKey}
										onChange={(e) => setApiKey(e.target.value)}
										placeholder="Paste your API key"
										className="w-full rounded-lg border border-border bg-surface/50 px-3 py-2 pr-16 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 font-mono"
									/>
									<button
										type="button"
										onClick={() => setShowApiKey(!showApiKey)}
										className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-0.5 text-xs text-muted-foreground hover:text-foreground"
									>
										{showApiKey ? "Hide" : "Show"}
									</button>
								</div>
								<p className="mt-1 text-xs text-muted-foreground">{provider.keyInstructions}</p>
							</div>

							{/* Error */}
							{testError && (
								<div className="mb-3 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-sm text-red-400">
									{testError}
								</div>
							)}

							{/* Info */}
							<div className="rounded-lg border border-border bg-surface/30 px-3 py-2 text-xs text-muted-foreground">
								Your credentials are stored locally in your browser and sent through our API only as
								a relay. We never store API keys server-side.
							</div>
						</>
					)}

					{phase === "testing" && (
						<div className="flex flex-col items-center gap-3 py-8">
							<Loader2 className="h-8 w-8 animate-spin text-primary" />
							<p className="text-sm text-muted-foreground">
								Testing connection to {provider.name}...
							</p>
						</div>
					)}

					{phase === "deploying" && (
						<div className="flex flex-col items-center gap-3 py-8">
							<Loader2 className="h-8 w-8 animate-spin text-primary" />
							<p className="text-sm font-medium text-foreground">Deploying to {provider.name}...</p>
							<p className="text-xs text-muted-foreground">
								Creating project, uploading compose file, setting env vars...
							</p>
						</div>
					)}

					{phase === "result" && deployResult && (
						<div className="py-4">
							{deployResult.success ? (
								<div className="mb-4 flex items-start gap-3">
									<CheckCircle className="mt-0.5 h-6 w-6 shrink-0 text-green-500" />
									<div>
										<p className="font-semibold text-green-500">Deployed successfully!</p>
										<p className="mt-1 text-sm text-muted-foreground">
											Your stack is being deployed on {provider.name}.
										</p>
									</div>
								</div>
							) : (
								<div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-sm text-red-400">
									Deployment failed: {deployResult.error}
								</div>
							)}

							{/* Steps */}
							<div className="space-y-2">
								{deployResult.steps.map((step) => (
									<StepRow key={step.step} step={step} />
								))}
							</div>

							{/* Dashboard link */}
							{deployResult.dashboardUrl && (
								<a
									href={deployResult.dashboardUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
								>
									Open {provider.name} Dashboard
									<ExternalLink className="h-4 w-4" />
								</a>
							)}
						</div>
					)}
				</div>

				{/* Footer */}
				<div className="flex justify-end gap-2 border-t border-border px-5 py-3">
					{phase === "configure" && (
						<>
							<button
								type="button"
								onClick={onClose}
								className="rounded-lg border border-border bg-muted px-3 py-2 text-sm font-medium text-foreground hover:bg-muted/80"
							>
								Cancel
							</button>
							<button
								type="button"
								onClick={handleTestAndDeploy}
								disabled={!instanceUrl.trim() || !apiKey.trim()}
								className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Test & Deploy
							</button>
						</>
					)}
					{phase === "result" && (
						<button
							type="button"
							onClick={onClose}
							className="rounded-lg border border-border bg-muted px-3 py-2 text-sm font-medium text-foreground hover:bg-muted/80"
						>
							Close
						</button>
					)}
				</div>
			</div>
		</div>
	);
}

/** Renders a single deploy step with status icon, label, and optional detail. */
function StepRow({ step }: { step: DeployStep }) {
	return (
		<div className="flex items-center gap-2 rounded-lg bg-surface/50 px-3 py-2">
			<span className="shrink-0">
				{step.status === "done" && <CheckCircle className="h-4 w-4 text-green-500" />}
				{step.status === "error" && <X className="h-4 w-4 text-red-500" />}
				{step.status === "running" && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
				{step.status === "pending" && (
					<div className="h-4 w-4 rounded-full border-2 border-border" />
				)}
			</span>
			<span
				className={cn(
					"flex-1 text-sm",
					step.status === "done"
						? "text-foreground"
						: step.status === "error"
							? "text-red-400"
							: "text-muted-foreground",
				)}
			>
				{step.step}
			</span>
			{step.detail && (
				<span className="text-xs text-muted-foreground truncate max-w-[200px]">{step.detail}</span>
			)}
		</div>
	);
}
