"use client";

import { Check, ChevronDown, Copy, ExternalLink } from "lucide-react";
import { useState } from "react";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

interface Endpoint {
	method: "GET" | "POST";
	path: string;
	description: string;
	params?: { name: string; type: string; description: string }[];
	body?: Record<string, unknown>;
	response?: Record<string, unknown>;
	curl: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3456/api/v1";

const endpoints: Endpoint[] = [
	{
		method: "GET",
		path: "/api/v1/health",
		description: "Health check endpoint. Returns 200 when the API server is running.",
		response: { status: "ok", version: "1.0.0", uptime: 12345 },
		curl: `curl ${BASE_URL}/health`,
	},
	{
		method: "GET",
		path: "/api/v1/services",
		description: "List all available companion services that can be added to a stack.",
		params: [
			{
				name: "category",
				type: "string",
				description: 'Filter by service category (e.g. "ai", "monitoring", "database")',
			},
			{
				name: "maturity",
				type: "string",
				description: 'Filter by maturity level: "stable", "beta", or "experimental"',
			},
		],
		response: {
			services: [
				{
					id: "qdrant",
					name: "Qdrant",
					category: "vector-db",
					maturity: "stable",
				},
			],
		},
		curl: `curl "${BASE_URL}/services?category=ai"`,
	},
	{
		method: "GET",
		path: "/api/v1/skills",
		description:
			"List available skill packs. Optionally filter to only those compatible with the given services.",
		params: [
			{
				name: "services",
				type: "string",
				description: "Comma-separated list of service IDs to filter compatible skill packs",
			},
		],
		response: {
			skills: [
				{
					id: "researcher",
					name: "Researcher",
					services: ["qdrant", "searxng", "browserless"],
				},
			],
		},
		curl: `curl "${BASE_URL}/skills?services=qdrant,searxng"`,
	},
	{
		method: "GET",
		path: "/api/v1/presets",
		description:
			"List all preset configurations. Presets are curated combinations of services and skill packs.",
		response: {
			presets: [
				{
					id: "researcher",
					name: "Researcher",
					services: ["qdrant", "searxng", "browserless", "ollama"],
					skillPacks: ["researcher"],
				},
			],
		},
		curl: `curl ${BASE_URL}/presets`,
	},
	{
		method: "POST",
		path: "/api/v1/validate",
		description:
			"Validate a stack configuration without generating files. Returns any errors or warnings.",
		body: {
			services: ["qdrant", "ollama"],
			skillPacks: ["researcher"],
			proxy: "traefik",
			gpu: false,
			platform: "linux/amd64",
		},
		response: {
			valid: true,
			warnings: ["Skill pack 'researcher' recommends 'searxng' which is not selected"],
			errors: [],
		},
		curl: `curl -X POST ${BASE_URL}/validate \\
  -H "Content-Type: application/json" \\
  -d '{"services":["qdrant","ollama"],"skillPacks":["researcher"],"proxy":"traefik","gpu":false,"platform":"linux/amd64"}'`,
	},
	{
		method: "POST",
		path: "/api/v1/generate",
		description:
			"Generate a complete Docker Compose stack (or bare-metal: native + Docker hybrid). Returns a ZIP archive with all configuration files. Use deploymentType: 'bare-metal' for install scripts and native services.",
		body: {
			projectName: "my-stack",
			services: ["qdrant", "ollama", "n8n"],
			skillPacks: ["researcher"],
			proxy: "traefik",
			domain: "mystack.local",
			gpu: false,
			platform: "linux/amd64",
			deployment: "docker-compose",
			deploymentType: "docker",
			generateSecrets: true,
		},
		response: {
			success: true,
			files: ["docker-compose.yml", ".env", "traefik/traefik.yml", "README.md"],
		},
		curl: `curl -X POST ${BASE_URL}/generate \\
  -H "Content-Type: application/json" \\
  -d '{"projectName":"my-stack","services":["qdrant","ollama","n8n"],"skillPacks":["researcher"],"proxy":"traefik","domain":"mystack.local","gpu":false,"platform":"linux/amd64","deployment":"docker-compose","deploymentType":"docker","generateSecrets":true}' \\
  -o stack.zip`,
	},
	{
		method: "GET",
		path: "/api/v1/openapi.json",
		description: "Download the full OpenAPI 3.0 specification for this API.",
		response: {
			openapi: "3.0.0",
			info: { title: "better-openclaw API", version: "1.0.0" },
			"...": "...",
		},
		curl: `curl ${BASE_URL}/openapi.json`,
	},
];

function MethodBadge({ method }: { method: "GET" | "POST" }) {
	return (
		<span
			className={`inline-flex min-w-14 items-center justify-center rounded-md px-2 py-0.5 text-xs font-bold tracking-wide ${
				method === "GET" ? "bg-accent/15 text-accent" : "bg-primary/15 text-primary"
			}`}
		>
			{method}
		</span>
	);
}

function CopyButton({ text }: { text: string }) {
	const [copied, setCopied] = useState(false);

	function handleCopy() {
		navigator.clipboard.writeText(text);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	}

	return (
		<button
			type="button"
			onClick={handleCopy}
			className="flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground hover:border-primary/30"
		>
			{copied ? (
				<>
					<Check className="h-3 w-3 text-accent" />
					Copied
				</>
			) : (
				<>
					<Copy className="h-3 w-3" />
					Copy curl
				</>
			)}
		</button>
	);
}

function EndpointCard({ endpoint }: { endpoint: Endpoint }) {
	const [expanded, setExpanded] = useState(false);

	return (
		<div className="rounded-xl border border-border bg-surface transition-all hover:border-primary/30">
			{/* Header (clickable) */}
			<button
				type="button"
				onClick={() => setExpanded(!expanded)}
				className="flex w-full items-center gap-3 px-5 py-4 text-left"
			>
				<MethodBadge method={endpoint.method} />
				<code className="flex-1 font-mono text-sm text-foreground">{endpoint.path}</code>
				<span className="hidden text-sm text-muted-foreground sm:block">
					{endpoint.description.slice(0, 50)}
					{endpoint.description.length > 50 ? "..." : ""}
				</span>
				<ChevronDown
					className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
						expanded ? "rotate-180" : ""
					}`}
				/>
			</button>

			{/* Expanded details */}
			{expanded && (
				<div className="border-t border-border px-5 pb-5 pt-4 space-y-5">
					<p className="text-sm leading-relaxed text-muted-foreground">{endpoint.description}</p>

					{/* Parameters table */}
					{endpoint.params && endpoint.params.length > 0 && (
						<div>
							<h4 className="mb-2 text-sm font-semibold text-foreground">Query Parameters</h4>
							<div className="overflow-x-auto rounded-lg border border-border">
								<table className="w-full text-sm">
									<thead>
										<tr className="border-b border-border bg-muted/30">
											<th className="px-3 py-2 text-left font-medium text-muted-foreground">
												Name
											</th>
											<th className="px-3 py-2 text-left font-medium text-muted-foreground">
												Type
											</th>
											<th className="px-3 py-2 text-left font-medium text-muted-foreground">
												Description
											</th>
										</tr>
									</thead>
									<tbody>
										{endpoint.params.map((param) => (
											<tr key={param.name} className="border-b border-border last:border-0">
												<td className="px-3 py-2 font-mono text-xs text-accent">{param.name}</td>
												<td className="px-3 py-2 text-xs text-muted-foreground">{param.type}</td>
												<td className="px-3 py-2 text-xs text-muted-foreground">
													{param.description}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					)}

					{/* Request body */}
					{endpoint.body && (
						<div>
							<h4 className="mb-2 text-sm font-semibold text-foreground">Request Body</h4>
							<pre className="overflow-x-auto rounded-lg border border-border bg-background p-4">
								<code className="text-xs font-mono text-accent">
									{JSON.stringify(endpoint.body, null, 2)}
								</code>
							</pre>
						</div>
					)}

					{/* Response example */}
					{endpoint.response && (
						<div>
							<h4 className="mb-2 text-sm font-semibold text-foreground">Response Example</h4>
							<pre className="overflow-x-auto rounded-lg border border-border bg-background p-4">
								<code className="text-xs font-mono text-accent">
									{JSON.stringify(endpoint.response, null, 2)}
								</code>
							</pre>
						</div>
					)}

					{/* Curl */}
					<div>
						<div className="mb-2 flex items-center justify-between">
							<h4 className="text-sm font-semibold text-foreground">cURL</h4>
							<CopyButton text={endpoint.curl} />
						</div>
						<pre className="overflow-x-auto rounded-lg border border-border bg-background p-4">
							<code className="text-xs font-mono text-muted-foreground whitespace-pre">
								{endpoint.curl}
							</code>
						</pre>
					</div>
				</div>
			)}
		</div>
	);
}

export default function ApiDocsPage() {
	return (
		<div className="min-h-screen bg-background text-foreground">
			<Navbar />

			<main className="pt-14">
				{/* Header */}
				<section className="border-b border-border">
					<div className="mx-auto max-w-7xl px-6 py-20 text-center lg:px-8">
						<h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
							API <span className="text-gradient">Reference</span>
						</h1>
						<p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
							REST API for programmatic stack generation. Base URL:{" "}
							<code className="rounded-md border border-border bg-muted px-2 py-0.5 font-mono text-sm text-accent">
								{BASE_URL}
							</code>
						</p>
					</div>
				</section>

				{/* Endpoints */}
				<section className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
					<div className="space-y-3">
						{endpoints.map((ep) => (
							<EndpointCard key={ep.path + ep.method} endpoint={ep} />
						))}
					</div>

					{/* OpenAPI link */}
					<div className="mt-12 rounded-xl border border-border bg-surface p-6 text-center">
						<p className="mb-3 text-sm text-muted-foreground">Want the full specification?</p>
						<a
							href={`${BASE_URL}/openapi.json`}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-all hover:border-primary/30 hover:text-primary"
						>
							Download OpenAPI Spec
							<ExternalLink className="h-4 w-4" />
						</a>
					</div>
				</section>
			</main>

			<Footer />
		</div>
	);
}
