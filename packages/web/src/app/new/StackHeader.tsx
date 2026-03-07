"use client";

import { ClawexaModal } from "./ClawexaModal";
import { DownloadInstructions } from "./DownloadInstructions";
import { ErrorBanners } from "./ErrorBanners";
import { HeaderActions } from "./HeaderActions";
import { useStackBuilder } from "./StackBuilderProvider";

export function StackHeader() {
	const {
		generateError,
		resolverError,
		downloadComplete,
		setDownloadComplete,
		lastDownloadOptions,
		projectName,
		setShowDeployToServerModal,
		setShowClawexaModal,
	} = useStackBuilder();

	return (
		<>
			<HeaderActions />

			<ErrorBanners generateError={generateError} resolverError={resolverError} />

			{downloadComplete ? (
				<DownloadInstructions
					projectName={projectName}
					deploymentType={lastDownloadOptions?.deploymentType}
					platform={lastDownloadOptions?.platform}
					onDismiss={() => setDownloadComplete(false)}
					onDeployToServer={() => setShowDeployToServerModal(true)}
					onDeployClawexa={() => setShowClawexaModal(true)}
				/>
			) : null}

			<ClawexaModal />
		</>
	);
}
