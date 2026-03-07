import { Loader2 } from "lucide-react";
import type { DeployPhase, PROVIDERS } from "./use-deploy";

interface DeployProgressPhaseProps {
	phase: DeployPhase;
	provider: (typeof PROVIDERS)[number];
}

export function DeployProgressPhase({ phase, provider }: DeployProgressPhaseProps) {
	if (phase === "testing") {
		return (
			<div className="flex flex-col items-center gap-3 py-8">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
				<p className="text-sm text-muted-foreground">Testing connection to {provider.name}...</p>
			</div>
		);
	}

	if (phase === "deploying") {
		return (
			<div className="flex flex-col items-center gap-3 py-8">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
				<p className="text-sm font-medium text-foreground">Deploying to {provider.name}...</p>
				<p className="text-xs text-muted-foreground text-center">
					Creating project, uploading compose file, setting env vars...
				</p>
			</div>
		);
	}

	return null;
}
