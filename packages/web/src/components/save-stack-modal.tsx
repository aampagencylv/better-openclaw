"use client";

import { Loader2, Save, X } from "lucide-react";
import { useState } from "react";
import { saveStack } from "@/lib/api-client";

interface SaveStackModalProps {
	projectName: string;
	services: string[];
	config: Record<string, unknown>;
	onClose: () => void;
	onSaved: (stackId: string) => void;
}

export function SaveStackModal({
	projectName,
	services,
	config,
	onClose,
	onSaved,
}: SaveStackModalProps) {
	const [name, setName] = useState(projectName);
	const [description, setDescription] = useState("");
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function handleSave(e: React.FormEvent) {
		e.preventDefault();
		if (!name.trim()) return;
		setError(null);
		setIsSaving(true);
		try {
			const result = await saveStack({
				name: name.trim(),
				description: description.trim() || undefined,
				services,
				config,
			});
			onSaved(result.id);
			onClose();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to save stack");
		} finally {
			setIsSaving(false);
		}
	}

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm"
			role="dialog"
			aria-modal="true"
			aria-labelledby="save-modal-title"
		>
			<div className="w-full max-w-md rounded-xl border border-border bg-background shadow-2xl">
				<div className="flex items-center justify-between border-b border-border px-5 py-4">
					<h2 id="save-modal-title" className="font-semibold text-foreground">
						Save Stack
					</h2>
					<button
						type="button"
						onClick={onClose}
						className="rounded-lg p-1 text-muted-foreground hover:bg-surface hover:text-foreground transition-colors"
						aria-label="Close"
					>
						<X className="h-4 w-4" />
					</button>
				</div>

				<form onSubmit={handleSave} className="p-5">
					{error && (
						<div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">
							{error}
						</div>
					)}

					<div className="mb-4">
						<label
							htmlFor="stack-name"
							className="mb-1.5 block text-xs font-medium text-muted-foreground uppercase tracking-wider"
						>
							Stack Name *
						</label>
						<input
							id="stack-name"
							type="text"
							required
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="my-ai-stack"
							className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
						/>
					</div>

					<div className="mb-4">
						<label
							htmlFor="stack-desc"
							className="mb-1.5 block text-xs font-medium text-muted-foreground uppercase tracking-wider"
						>
							Description <span className="text-muted-foreground/50">(optional)</span>
						</label>
						<textarea
							id="stack-desc"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="A brief description of this stack…"
							rows={2}
							className="w-full resize-none rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
						/>
					</div>

					<div className="mb-5 rounded-lg border border-border bg-surface/50 px-3 py-2">
						<p className="text-xs text-muted-foreground">
							<span className="font-mono text-foreground">{services.length}</span> services selected
						</p>
					</div>

					<div className="flex justify-end gap-2">
						<button
							type="button"
							onClick={onClose}
							className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-surface hover:text-foreground transition-colors"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={isSaving || !name.trim()}
							className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-60"
						>
							{isSaving ? (
								<>
									<Loader2 className="h-4 w-4 animate-spin" />
									Saving…
								</>
							) : (
								<>
									<Save className="h-4 w-4" />
									Save Stack
								</>
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
