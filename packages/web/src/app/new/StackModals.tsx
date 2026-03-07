"use client";

import { SaveStackModal } from "@/components/save-stack-modal";
import { DeployModal } from "@/components/stack-builder/DeployModal";
import { SkillSelectorModal } from "@/components/stack-builder/SkillSelectorModal";
import { useStackBuilder } from "./StackBuilderProvider";

export function StackModals() {
	const {
		showDeploymentModal,
		setShowDeploymentModal,
		deploymentType,
		setDeploymentType,
		platform,
		setPlatform,
		handleDownload,
		isGenerating,
		pendingRemovalId,
		cancelMandatoryRemoval,
		confirmMandatoryRemoval,
		allServices,
		showDeployToServerModal,
		setShowDeployToServerModal,
		projectName,
		composeYaml,
		envContent,
		showSkillModal,
		setShowSkillModal,
		selectedIndividualSkills,
		setSelectedIndividualSkills,
		showSaveModal,
		setShowSaveModal,
		selectedServices,
		selectedSkillPacks,
		selectedAiProviders,
		selectedGsdRuntimes,
		setSavedStackId,
	} = useStackBuilder();

	return (
		<>
			{/* Deployment options modal (before building) */}
			{showDeploymentModal && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-background/50 p-4 backdrop-blur-sm"
					role="dialog"
					aria-modal="true"
					aria-labelledby="deployment-modal-title"
				>
					<div className="w-full max-w-md rounded-xl border border-border bg-background p-5 shadow-lg">
						<h2 id="deployment-modal-title" className="text-lg font-semibold text-foreground">
							Deployment options
						</h2>
						<p className="mt-1 text-sm text-muted-foreground">
							Choose how you want to run the stack and your target platform.
						</p>

						<div className="mt-4">
							<p className="block text-sm font-medium text-foreground">Deployment</p>
							<div className="mt-2 flex gap-4">
								<label className="flex cursor-pointer items-center gap-2 relative">
									<input
										type="radio"
										name="deploymentType"
										checked={deploymentType === "docker"}
										onChange={() => {
											setDeploymentType("docker");
											if (platform.startsWith("windows/") || platform.startsWith("macos/")) {
												setPlatform("linux/amd64");
											}
										}}
										className="peer sr-only"
									/>
									<div className="h-4 w-4 rounded-full border border-border flex items-center justify-center peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-checked:border-primary">
										{deploymentType === "docker" && (
											<div className="h-2 w-2 rounded-full bg-primary" />
										)}
									</div>
									<span className="text-sm text-foreground">Docker</span>
								</label>
								<label className="flex cursor-pointer items-center gap-2 relative">
									<input
										type="radio"
										name="deploymentType"
										checked={deploymentType === "bare-metal"}
										onChange={() => setDeploymentType("bare-metal")}
										className="peer sr-only"
									/>
									<div className="h-4 w-4 rounded-full border border-border flex items-center justify-center peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-checked:border-primary">
										{deploymentType === "bare-metal" && (
											<div className="h-2 w-2 rounded-full bg-primary" />
										)}
									</div>
									<span className="text-sm text-foreground">Bare-metal (native + Docker)</span>
								</label>
							</div>
							<p className="mt-1.5 text-xs text-muted-foreground">
								Docker: all services in containers. Bare-metal: some services (e.g. Redis) run
								natively on the host; the rest run in Docker. You get{" "}
								<code className="rounded bg-muted px-1 py-0.5">install.sh</code> /{" "}
								<code className="rounded bg-muted px-1 py-0.5">install.ps1</code> and{" "}
								<code className="rounded bg-muted px-1 py-0.5">native/</code> scripts.
							</p>
						</div>

						<div className="mt-4">
							<label
								htmlFor="platform-select"
								className="block text-sm font-medium text-foreground"
							>
								Platform
							</label>
							<select
								id="platform-select"
								value={platform}
								onChange={(e) => setPlatform(e.target.value)}
								className="mt-2 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground transition-colors hover:border-border-hover focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
							>
								{deploymentType === "docker" ? (
									<>
										<option value="linux/amd64">Linux (amd64)</option>
										<option value="linux/arm64">Linux (arm64)</option>
									</>
								) : (
									<>
										<option value="linux/amd64">Linux (amd64)</option>
										<option value="linux/arm64">Linux (arm64)</option>
										<option value="windows/amd64">Windows</option>
										<option value="macos/amd64">macOS (Intel)</option>
										<option value="macos/arm64">macOS (Apple Silicon)</option>
									</>
								)}
							</select>
						</div>

						<div className="mt-6 flex justify-end gap-2">
							<button
								type="button"
								onClick={() => setShowDeploymentModal(false)}
								className="rounded-lg border border-border bg-muted px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
							>
								Cancel
							</button>
							<button
								type="button"
								onClick={() => {
									setShowDeploymentModal(false);
									handleDownload({ deploymentType, platform });
								}}
								disabled={isGenerating}
								className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:opacity-50"
							>
								Generate and download
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Mandatory service removal confirmation */}
			{pendingRemovalId &&
				(() => {
					const svc = allServices.find((s) => s.id === pendingRemovalId);
					const name = svc?.name ?? pendingRemovalId;
					return (
						<div
							className="fixed inset-0 z-50 flex items-center justify-center bg-background/50 p-4 backdrop-blur-sm"
							role="dialog"
							aria-modal="true"
							aria-labelledby="mandatory-removal-title"
						>
							<div className="w-full max-w-sm rounded-xl border border-border bg-background p-5 shadow-lg">
								<h2 id="mandatory-removal-title" className="text-lg font-semibold text-foreground">
									Remove {name}?
								</h2>
								<p className="mt-2 text-sm text-muted-foreground">
									{svc?.removalWarning ??
										`${name} is recommended for your stack. Removing it may affect functionality.`}{" "}
									Remove anyway?
								</p>
								<div className="mt-5 flex justify-end gap-2">
									<button
										type="button"
										onClick={cancelMandatoryRemoval}
										className="rounded-lg border border-border bg-muted px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
									>
										Cancel
									</button>
									<button
										type="button"
										onClick={confirmMandatoryRemoval}
										className="rounded-lg bg-destructive px-3 py-2 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
									>
										Remove
									</button>
								</div>
							</div>
						</div>
					);
				})()}

			{/* Deploy to Server Modal (Dokploy / Coolify) */}
			<DeployModal
				open={showDeployToServerModal}
				onClose={() => setShowDeployToServerModal(false)}
				projectName={projectName || "my-stack"}
				composeYaml={composeYaml}
				envContent={envContent}
			/>

			{/* Skill Selector Modal */}
			<SkillSelectorModal
				open={showSkillModal}
				onClose={() => setShowSkillModal(false)}
				selectedSkills={selectedIndividualSkills}
				onApply={(skills) => setSelectedIndividualSkills(skills)}
			/>

			{/* Save Stack Modal */}
			{showSaveModal && (
				<SaveStackModal
					projectName={projectName || "my-stack"}
					services={Array.from(selectedServices)}
					config={{
						projectName: projectName || "my-stack",
						services: Array.from(selectedServices),
						skillPacks: Array.from(selectedSkillPacks),
						aiProviders: Array.from(selectedAiProviders),
						gsdRuntimes: Array.from(selectedGsdRuntimes),
						individualSkills: Array.from(selectedIndividualSkills.values()).map((skill) => ({
							...skill,
						})),
						proxy: "none",
						gpu: false,
						platform: "linux/amd64",
						deployment: "local",
						deploymentType: "docker",
						monitoring: false,
					}}
					onClose={() => setShowSaveModal(false)}
					onSaved={(id) => setSavedStackId(id)}
				/>
			)}
		</>
	);
}
