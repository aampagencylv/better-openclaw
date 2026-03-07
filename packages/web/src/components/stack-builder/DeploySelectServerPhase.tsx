import { CheckCircle, Loader2, Monitor } from "lucide-react";
import type { PaasServer } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import type { PROVIDERS } from "./use-deploy";

interface DeploySelectServerPhaseProps {
	provider: (typeof PROVIDERS)[number];
	loadingServers: boolean;
	servers: PaasServer[];
	selectedServerId: string;
	setSelectedServerId: (val: string) => void;
}

export function DeploySelectServerPhase({
	provider,
	loadingServers,
	servers,
	selectedServerId,
	setSelectedServerId,
}: DeploySelectServerPhaseProps) {
	return (
		<div className="py-2">
			<div className="mb-3 flex items-center gap-2 text-sm font-medium text-emerald-500">
				<CheckCircle className="h-4 w-4" />
				Connected to {provider.name}
			</div>

			{loadingServers ? (
				<div className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
					<Loader2 className="h-4 w-4 animate-spin" />
					Fetching servers...
				</div>
			) : servers.length > 0 ? (
				<div className="mb-3">
					<p className="mb-2 block text-sm font-medium text-foreground">Select Server</p>
					<div className="space-y-2">
						{servers.map((s) => (
							<button
								key={s.id}
								type="button"
								onClick={() => setSelectedServerId(s.id)}
								className={cn(
									"w-full rounded-lg border px-3 py-2.5 text-left transition-all flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
									selectedServerId === s.id
										? "border-primary bg-primary/10 text-foreground"
										: "border-border bg-surface/50 text-muted-foreground hover:border-border hover:bg-surface",
								)}
							>
								<Monitor className="h-4 w-4 shrink-0" />
								<div className="flex-1 min-w-0">
									<span className="block text-sm font-semibold truncate">{s.name}</span>
									{s.ip && (
										<span className="block text-xs text-muted-foreground font-mono">{s.ip}</span>
									)}
								</div>
								{selectedServerId === s.id && (
									<CheckCircle className="h-4 w-4 shrink-0 text-primary" />
								)}
							</button>
						))}
					</div>
				</div>
			) : (
				<div className="rounded-lg border border-border bg-surface/30 px-3 py-2 text-xs text-muted-foreground">
					No remote servers found. Your stack will be deployed to the {provider.name} host server.
				</div>
			)}
		</div>
	);
}
