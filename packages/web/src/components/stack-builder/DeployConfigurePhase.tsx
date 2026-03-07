import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { PROVIDERS } from "./use-deploy";

interface DeployConfigurePhaseProps {
	selectedProvider: string;
	setSelectedProvider: (val: string) => void;
	instanceUrl: string;
	setInstanceUrl: (val: string) => void;
	apiKey: string;
	setApiKey: (val: string) => void;
	showApiKey: boolean;
	setShowApiKey: (val: boolean) => void;
	provider: (typeof PROVIDERS)[number];
	testError: string | null;
}

export function DeployConfigurePhase({
	selectedProvider,
	setSelectedProvider,
	instanceUrl,
	setInstanceUrl,
	apiKey,
	setApiKey,
	showApiKey,
	setShowApiKey,
	provider,
	testError,
}: DeployConfigurePhaseProps) {
	return (
		<>
			{/* Provider selector */}
			<div className="mb-4">
				<p className="mb-2 block text-sm font-medium text-foreground">Platform</p>
				<div className="flex gap-2">
					{PROVIDERS.map((p) => (
						<button
							key={p.id}
							type="button"
							onClick={() => setSelectedProvider(p.id)}
							className={cn(
								"flex-1 rounded-lg border px-3 py-2.5 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
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
				<label htmlFor="deploy-url" className="mb-1.5 block text-sm font-medium text-foreground">
					Instance URL
				</label>
				<input
					id="deploy-url"
					type="url"
					value={instanceUrl}
					onChange={(e) => setInstanceUrl(e.target.value)}
					placeholder={provider.placeholder}
					className="w-full rounded-lg border border-border bg-surface/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
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
						className="flex items-center gap-1 text-xs text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm px-1"
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
						className="w-full rounded-lg border border-border bg-surface/50 px-3 py-2 pr-16 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono transition-shadow"
					/>
					<button
						type="button"
						onClick={() => setShowApiKey(!showApiKey)}
						className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-0.5 text-xs text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
					>
						{showApiKey ? "Hide" : "Show"}
					</button>
				</div>
				<p className="mt-1 text-xs text-muted-foreground">{provider.keyInstructions}</p>
			</div>

			{/* Error */}
			{testError && (
				<div className="mb-3 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-sm text-red-500">
					{testError}
				</div>
			)}

			{/* Info */}
			<div className="rounded-lg border border-border bg-surface/30 px-3 py-2 text-xs text-muted-foreground">
				Your credentials are stored locally in your browser and sent through our API only as a
				relay. We never store API keys server-side.
			</div>
		</>
	);
}
