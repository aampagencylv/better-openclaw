"use client";

import { Loader2 } from "lucide-react";
import { Suspense } from "react";

import { StackBuilderProvider, useStackBuilder } from "./StackBuilderProvider";
import { StackCanvas } from "./StackCanvas";
import { StackHeader } from "./StackHeader";
import { StackModals } from "./StackModals";
import { StackPreview } from "./StackPreview";

export default function NewStackPage() {
	return (
		<Suspense
			fallback={
				<div className="flex min-h-screen items-center justify-center bg-background">
					<Loader2 className="h-8 w-8 animate-spin text-primary" />
				</div>
			}
		>
			<StackBuilderProvider>
				<NewStackPageInner />
			</StackBuilderProvider>
		</Suspense>
	);
}

function NewStackPageInner() {
	const { isLoadingStack } = useStackBuilder();

	return (
		<div className="flex min-h-screen flex-col relative">
			{/* Loading overlay when hydrating a saved stack */}
			{isLoadingStack && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
					<div className="flex flex-col items-center gap-3">
						<Loader2 className="h-8 w-8 animate-spin text-primary" />
						<p className="text-sm text-muted-foreground">Loading saved stack…</p>
					</div>
				</div>
			)}

			<StackHeader />

			{/* Main content - two panel layout */}
			<div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col lg:flex-row">
				<StackCanvas />
				<StackPreview />
			</div>

			<StackModals />
		</div>
	);
}
