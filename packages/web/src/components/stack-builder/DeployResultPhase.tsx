import { CheckCircle, ExternalLink, Loader2, X } from "lucide-react";
import type { DeployResult, DeployStep } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import type { PROVIDERS } from "./use-deploy";

interface DeployResultPhaseProps {
	deployResult: DeployResult | null;
	provider: (typeof PROVIDERS)[number];
}

export function DeployResultPhase({ deployResult, provider }: DeployResultPhaseProps) {
	if (!deployResult) return null;

	return (
		<div className="py-4">
			{deployResult.success ? (
				<div className="mb-4 flex items-start gap-3">
					<CheckCircle className="mt-0.5 h-6 w-6 shrink-0 text-emerald-500" />
					<div>
						<p className="font-semibold text-emerald-500">Deployed successfully!</p>
						<p className="mt-1 text-sm text-muted-foreground">
							Your stack is being deployed on {provider.name}.
						</p>
					</div>
				</div>
			) : (
				<div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-sm text-red-500">
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
					className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
				>
					Open {provider.name} Dashboard
					<ExternalLink className="h-4 w-4" />
				</a>
			)}
		</div>
	);
}

/** Renders a single deploy step with status icon, label, and optional detail. */
function StepRow({ step }: { step: DeployStep }) {
	return (
		<div className="flex items-center gap-2 rounded-lg bg-surface/50 px-3 py-2">
			<span className="shrink-0">
				{step.status === "done" && <CheckCircle className="h-4 w-4 text-emerald-500" />}
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
							? "text-red-500"
							: "text-muted-foreground",
				)}
			>
				{step.step}
			</span>
			{step.detail && (
				<span className="text-xs text-muted-foreground truncate max-w-[200px]" title={step.detail}>
					{step.detail}
				</span>
			)}
		</div>
	);
}
