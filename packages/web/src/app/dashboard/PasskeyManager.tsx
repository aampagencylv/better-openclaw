"use client";

import { Fingerprint, Loader2, Monitor, Plus, Shield, Usb } from "lucide-react";
import { useState } from "react";
import { PasskeyCard } from "./PasskeyCard";
import { usePasskeys } from "./usePasskeys";

type AttachmentType = "platform" | "cross-platform";

const ATTACHMENT_OPTIONS: {
	id: AttachmentType;
	label: string;
	description: string;
	icon: React.ReactNode;
}[] = [
	{
		id: "platform",
		label: "This device",
		description: "Face ID, Touch ID, Windows Hello",
		icon: <Monitor className="h-4 w-4" />,
	},
	{
		id: "cross-platform",
		label: "Security key",
		description: "YubiKey, USB/NFC key",
		icon: <Usb className="h-4 w-4" />,
	},
];

export function PasskeyManager() {
	const {
		passkeys,
		isLoading,
		addingPasskey,
		deletingId,
		error,
		clearError,
		handleAddPasskey,
		handleDeletePasskey,
	} = usePasskeys();

	const [showAddForm, setShowAddForm] = useState(false);
	const [passkeyName, setPasskeyName] = useState("");
	const [attachment, setAttachment] = useState<AttachmentType>("platform");

	async function onAdd() {
		const success = await handleAddPasskey(passkeyName.trim(), attachment);
		if (success) {
			setPasskeyName("");
			setShowAddForm(false);
		}
	}

	return (
		<section className="mb-8">
			{/* Section header */}
			<div className="mb-4 flex items-center justify-between">
				<div className="flex items-center gap-2.5">
					<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
						<Shield className="h-4 w-4" />
					</div>
					<div>
						<h2 className="text-sm font-semibold text-foreground">Passkeys</h2>
						<p className="text-xs text-muted-foreground">
							Passwordless sign-in with biometrics or security keys
						</p>
					</div>
				</div>
				<button
					type="button"
					title="Add a new passkey"
					onClick={() => {
						setShowAddForm(true);
						clearError();
					}}
					disabled={addingPasskey}
					className="flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-all hover:bg-primary/20 disabled:opacity-50 focus-visible:ring-1 focus-visible:ring-primary"
				>
					<Plus className="h-3.5 w-3.5" />
					Add Passkey
				</button>
			</div>

			{/* Error alert */}
			{error ? (
				<div
					className="mb-4 flex items-center justify-between rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-400"
					role="alert"
					aria-live="polite"
				>
					<span>{error}</span>
					<button
						type="button"
						title="Dismiss error"
						onClick={clearError}
						className="text-red-400/60 hover:text-red-400 transition-colors text-xs"
					>
						Dismiss
					</button>
				</div>
			) : null}

			{/* Add passkey form */}
			{showAddForm ? (
				<div className="mb-4 rounded-xl border border-primary/20 bg-primary/5 p-5">
					<h3 className="text-sm font-semibold text-foreground mb-3">Register a new passkey</h3>

					{/* Name input */}
					<div className="mb-4">
						<label
							htmlFor="passkey-name"
							className="mb-1.5 block text-xs font-medium text-muted-foreground uppercase tracking-wider"
						>
							Passkey name (optional)
						</label>
						<input
							id="passkey-name"
							type="text"
							value={passkeyName}
							onChange={(e) => setPasskeyName(e.target.value)}
							placeholder="e.g. MacBook Pro, YubiKey 5"
							className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
						/>
					</div>

					{/* Attachment type selector */}
					<div className="mb-4">
						<span className="mb-1.5 block text-xs font-medium text-muted-foreground uppercase tracking-wider">
							Authenticator type
						</span>
						<div className="grid grid-cols-2 gap-2">
							{ATTACHMENT_OPTIONS.map((opt) => (
								<button
									key={opt.id}
									type="button"
									title={opt.label}
									onClick={() => setAttachment(opt.id)}
									className={`flex items-start gap-3 rounded-lg border p-3 text-left transition-all ${
										attachment === opt.id
											? "border-primary/40 bg-primary/10 text-foreground"
											: "border-border bg-surface/30 text-muted-foreground hover:border-border/80"
									}`}
								>
									<div className="mt-0.5 shrink-0">{opt.icon}</div>
									<div>
										<span className="block text-sm font-medium">{opt.label}</span>
										<span className="block text-[11px] text-muted-foreground mt-0.5">
											{opt.description}
										</span>
									</div>
								</button>
							))}
						</div>
					</div>

					{/* Actions */}
					<div className="flex items-center gap-2">
						<button
							type="button"
							title="Register passkey"
							onClick={onAdd}
							disabled={addingPasskey}
							className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-primary/50"
						>
							{addingPasskey ? (
								<>
									<Loader2 className="h-4 w-4 animate-spin" />
									Waiting for device…
								</>
							) : (
								<>
									<Fingerprint className="h-4 w-4" />
									Register Passkey
								</>
							)}
						</button>
						<button
							type="button"
							title="Cancel adding passkey"
							onClick={() => {
								setShowAddForm(false);
								setPasskeyName("");
								clearError();
							}}
							disabled={addingPasskey}
							className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-surface hover:text-foreground disabled:opacity-50"
						>
							Cancel
						</button>
					</div>
				</div>
			) : null}

			{/* Passkey list */}
			{isLoading ? (
				<div className="flex items-center justify-center py-10">
					<Loader2 className="h-5 w-5 animate-spin text-primary" />
				</div>
			) : passkeys.length === 0 ? (
				<div className="rounded-xl border border-dashed border-border bg-surface/10 py-10 text-center">
					<Fingerprint className="mx-auto h-10 w-10 text-muted-foreground/40" />
					<p className="mt-3 text-sm font-medium text-foreground">No passkeys registered</p>
					<p className="mt-1 text-xs text-muted-foreground">
						Add a passkey for fast, passwordless sign-in using biometrics or a security key.
					</p>
				</div>
			) : (
				<div className="space-y-2">
					{passkeys.map((pk) => (
						<PasskeyCard
							key={pk.id}
							passkey={pk}
							isDeleting={deletingId === pk.id}
							onDelete={handleDeletePasskey}
						/>
					))}
				</div>
			)}
		</section>
	);
}
