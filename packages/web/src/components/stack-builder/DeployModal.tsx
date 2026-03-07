"use client";

import { Server, X } from "lucide-react";
import { DeployConfigurePhase } from "./DeployConfigurePhase";
import { DeployProgressPhase } from "./DeployProgressPhase";
import { DeployResultPhase } from "./DeployResultPhase";
import { DeploySelectServerPhase } from "./DeploySelectServerPhase";
import { useDeploy } from "./use-deploy";

interface DeployModalProps {
	open: boolean;
	onClose: () => void;
	projectName: string;
	composeYaml: string;
	envContent: string;
}

export function DeployModal({
	open,
	onClose,
	projectName,
	composeYaml,
	envContent,
}: DeployModalProps) {
	const deployState = useDeploy({ open, projectName, composeYaml, envContent });
	const {
		phase,
		setPhase,
		provider,
		handleTestConnection,
		handleDeploy,
		selectedProvider,
		setSelectedProvider,
		instanceUrl,
		setInstanceUrl,
		apiKey,
		setApiKey,
		showApiKey,
		setShowApiKey,
		testError,
		loadingServers,
		servers,
		selectedServerId,
		setSelectedServerId,
		deployResult,
	} = deployState;

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
						className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
						aria-label="Close"
					>
						<X className="h-4 w-4" />
					</button>
				</div>

				{/* Body */}
				<div className="px-5 py-4">
					{phase === "configure" && (
						<DeployConfigurePhase
							selectedProvider={selectedProvider}
							setSelectedProvider={setSelectedProvider}
							instanceUrl={instanceUrl}
							setInstanceUrl={setInstanceUrl}
							apiKey={apiKey}
							setApiKey={setApiKey}
							showApiKey={showApiKey}
							setShowApiKey={setShowApiKey}
							provider={provider}
							testError={testError}
						/>
					)}

					{(phase === "testing" || phase === "deploying") && (
						<DeployProgressPhase phase={phase} provider={provider} />
					)}

					{phase === "select-server" && (
						<DeploySelectServerPhase
							provider={provider}
							loadingServers={loadingServers}
							servers={servers}
							selectedServerId={selectedServerId}
							setSelectedServerId={setSelectedServerId}
						/>
					)}

					{phase === "result" && (
						<DeployResultPhase deployResult={deployResult} provider={provider} />
					)}
				</div>

				{/* Footer */}
				<div className="flex justify-end gap-2 border-t border-border px-5 py-3">
					{phase === "configure" && (
						<>
							<button
								type="button"
								onClick={onClose}
								className="rounded-lg border border-border bg-muted px-3 py-2 text-sm font-medium text-foreground hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
							>
								Cancel
							</button>
							<button
								type="button"
								onClick={handleTestConnection}
								disabled={!instanceUrl.trim() || !apiKey.trim()}
								className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors shadow-sm"
							>
								Test Connection
							</button>
						</>
					)}
					{phase === "select-server" && (
						<>
							<button
								type="button"
								onClick={() => setPhase("configure")}
								className="rounded-lg border border-border bg-muted px-3 py-2 text-sm font-medium text-foreground hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
							>
								Back
							</button>
							<button
								type="button"
								onClick={handleDeploy}
								className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors shadow-sm"
							>
								Deploy
							</button>
						</>
					)}
					{phase === "result" && (
						<button
							type="button"
							onClick={onClose}
							className="rounded-lg border border-border bg-muted px-3 py-2 text-sm font-medium text-foreground hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
						>
							Close
						</button>
					)}
				</div>
			</div>
		</div>
	);
}
