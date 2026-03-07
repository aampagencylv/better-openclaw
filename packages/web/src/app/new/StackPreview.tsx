"use client";

import { DependencyGraph } from "@/components/stack-builder/DependencyGraph";
import { PreviewPanel } from "@/components/stack-builder/PreviewPanel";
import { useStackBuilder } from "./StackBuilderProvider";

export function StackPreview() {
	const { composeYaml, resolverOutput, projectName, selectedServices } = useStackBuilder();

	return (
		<div className="w-full shrink-0 bg-background/50 p-4 md:p-6 lg:sticky lg:top-[57px] lg:h-[calc(100vh-57px)] lg:w-[520px] lg:overflow-y-auto xl:w-[580px]">
			<div className="mb-4">
				<h2 className="text-xl font-bold text-foreground">Stack Preview</h2>
				<p className="mt-1 text-sm text-muted-foreground">
					Live preview of your generated configuration.
				</p>
			</div>

			<PreviewPanel
				composeYaml={composeYaml}
				resolverOutput={resolverOutput}
				projectName={projectName}
				selectedServiceIds={Array.from(selectedServices)}
			/>

			{/* Dependency Graph */}
			{resolverOutput && resolverOutput.services.length > 1 && (
				<div className="mt-6">
					<h3 className="mb-3 text-sm font-semibold text-foreground">Dependency Graph</h3>
					<DependencyGraph resolverOutput={resolverOutput} />
				</div>
			)}
		</div>
	);
}
