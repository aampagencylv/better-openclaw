import Link from "next/link";

export const metadata = {
	title: "Adding Custom Services — better-openclaw Docs",
	description:
		"How to add custom service definitions to better-openclaw. ServiceDefinition interface, configuration options, and examples.",
};

export default function AddingServicesPage() {
	return (
		<>
			<h1>Adding Custom Services</h1>
			<p>
				better-openclaw is designed to be extensible. You can add your own service definitions to
				the catalog, either for personal use or to contribute back to the project. This guide
				explains the <code>ServiceDefinition</code> interface and how to create a new service.
			</p>

			<h2>Where Services Live</h2>
			<p>
				Service definitions are TypeScript files in the <code>packages/core/src/services/</code>{" "}
				directory. Each service has its own file:
			</p>
			<pre>
				<code>{`packages/core/src/services/
├── databases/
│   ├── qdrant.ts
│   ├── redis.ts
│   ├── postgres.ts
│   └── ...
├── automation/
│   ├── n8n.ts
│   ├── activepieces.ts
│   └── ...
├── search/
│   ├── searxng.ts
│   └── ...
├── ai/
│   ├── ollama.ts
│   ├── whisper.ts
│   └── ...
└── index.ts            # Re-exports all services`}</code>
			</pre>

			<h2>The ServiceDefinition Interface</h2>
			<p>
				Every service must conform to the <code>ServiceDefinition</code> interface:
			</p>
			<pre>
				<code>{`interface ServiceDefinition {
  // ── Identity ──────────────────────────────────
  id: string;                    // Unique kebab-case identifier
  name: string;                  // Display name
  description: string;           // One-sentence description
  icon: string;                  // Emoji icon
  category: ServiceCategory;     // Category ID
  tags: string[];                // Searchable tags
  maturity: "stable" | "beta" | "experimental";

  // ── Docker ────────────────────────────────────
  image: string;                 // Docker image name
  imageTag: string;              // Image tag (usually "latest")
  ports: Port[];                 // Port mappings
  volumes: Volume[];             // Volume mounts
  environment: EnvVar[];         // Environment variables
  healthcheck?: Healthcheck;     // Docker healthcheck
  command?: string;              // Override default CMD
  entrypoint?: string;           // Override default ENTRYPOINT

  // ── Dependencies ──────────────────────────────
  requires: string[];            // Required service IDs
  conflictsWith: string[];       // Conflicting service IDs
  optionalDeps: string[];        // Optional service IDs

  // ── Resources ─────────────────────────────────
  minMemoryMB: number;           // Minimum RAM requirement
  gpuCapable: boolean;           // Supports GPU acceleration
  platforms: string[];           // Supported platforms (linux/amd64, linux/arm64)

  // ── Documentation ─────────────────────────────
  docsUrl: string;               // Official documentation URL
  setupNotes?: string;           // Post-setup instructions

  // ── OpenClaw Integration ──────────────────────
  openclawConfig?: {
    skillFiles?: string[];       // Skill YAML files to include
    envMapping?: Record<string, string>; // Map service vars to OpenClaw vars
  };
}`}</code>
			</pre>

			<h3>Port Type</h3>
			<pre>
				<code>{`interface Port {
  host: number;         // Port on the host machine
  container: number;    // Port inside the container
  protocol?: "tcp" | "udp";  // Default: "tcp"
}`}</code>
			</pre>

			<h3>Volume Type</h3>
			<pre>
				<code>{`interface Volume {
  name: string;         // Named volume identifier
  containerPath: string; // Mount path inside container
  description: string;  // What this volume stores
}`}</code>
			</pre>

			<h3>EnvVar Type</h3>
			<pre>
				<code>{`interface EnvVar {
  name: string;         // Variable name
  description: string;  // What this variable configures
  default?: string;     // Default value
  required: boolean;    // Must be set by user
  secret: boolean;      // Should be auto-generated
}`}</code>
			</pre>

			<h2>Example: Adding a Custom Service</h2>
			<p>
				Let&apos;s walk through adding <strong>Meilisearch</strong> as a new service:
			</p>
			<pre>
				<code>{`// packages/core/src/services/search/meilisearch.ts

import type { ServiceDefinition } from "../types";

export const meilisearch: ServiceDefinition = {
  // Identity
  id: "meilisearch",
  name: "Meilisearch",
  description: "Lightning-fast, typo-tolerant full-text search engine",
  icon: "🔎",
  category: "search",
  tags: ["search", "full-text", "typo-tolerant", "instant"],
  maturity: "stable",

  // Docker
  image: "getmeili/meilisearch",
  imageTag: "v1.6",
  ports: [
    { host: 7700, container: 7700 },
  ],
  volumes: [
    {
      name: "meilisearch_data",
      containerPath: "/meili_data",
      description: "Search index and database storage",
    },
  ],
  environment: [
    {
      name: "MEILI_MASTER_KEY",
      description: "Master API key for administration",
      required: true,
      secret: true,
    },
    {
      name: "MEILI_ENV",
      description: "Environment: development or production",
      default: "production",
      required: false,
      secret: false,
    },
    {
      name: "MEILI_NO_ANALYTICS",
      description: "Disable telemetry",
      default: "true",
      required: false,
      secret: false,
    },
  ],
  healthcheck: {
    test: ["CMD", "curl", "-f", "http://localhost:7700/health"],
    interval: "10s",
    timeout: "5s",
    retries: 3,
  },

  // Dependencies
  requires: [],
  conflictsWith: [],
  optionalDeps: [],

  // Resources
  minMemoryMB: 256,
  gpuCapable: false,
  platforms: ["linux/amd64", "linux/arm64"],

  // Documentation
  docsUrl: "https://www.meilisearch.com/docs",
  setupNotes: "Access the dashboard at http://localhost:7700",

  // OpenClaw Integration
  openclawConfig: {
    envMapping: {
      MEILI_MASTER_KEY: "OPENCLAW_MEILISEARCH_API_KEY",
    },
  },
};`}</code>
			</pre>

			<h2>Registering the Service</h2>
			<p>After creating the service file, register it in the category&apos;s index:</p>
			<pre>
				<code>{`// packages/core/src/services/search/index.ts
export { searxng } from "./searxng";
export { meilisearch } from "./meilisearch";  // Add this line`}</code>
			</pre>
			<p>Then add it to the main service registry:</p>
			<pre>
				<code>{`// packages/core/src/services/index.ts
import { meilisearch } from "./search/meilisearch";

// Add to the allServices array
const allServices: ServiceDefinition[] = [
  // ... existing services
  meilisearch,
];`}</code>
			</pre>

			<h2>Testing Your Service</h2>
			<pre>
				<code>{`# Build the core package
cd packages/core
pnpm build

# Verify the service appears in the list
pnpm --filter cli start -- --help

# Generate a test stack with your service
pnpm --filter cli start -- test-stack \\
  --services meilisearch,redis \\
  --dry-run

# Run the generated docker-compose to verify it works
cd test-stack
docker compose up -d
docker compose ps
curl http://localhost:7700/health`}</code>
			</pre>

			<h2>Service Guidelines</h2>
			<ul>
				<li>
					<strong>Use official Docker images</strong> whenever possible
				</li>
				<li>
					<strong>Pin image tags</strong> to specific versions (not <code>latest</code>) for
					stability
				</li>
				<li>
					<strong>Mark secrets</strong> with <code>secret: true</code> so the CLI auto-generates
					them
				</li>
				<li>
					<strong>Include a healthcheck</strong> so Docker can monitor the service
				</li>
				<li>
					<strong>Declare dependencies</strong> accurately — missing deps cause confusing startup
					errors
				</li>
				<li>
					<strong>Test on both AMD64 and ARM64</strong> if you claim multi-platform support
				</li>
				<li>
					<strong>
						Add the <code>openclawConfig</code>
					</strong>{" "}
					if the service integrates with OpenClaw skills
				</li>
			</ul>

			<h2>Next Steps</h2>
			<ul>
				<li>
					<Link href="/docs/services">Service Catalog</Link> — see all existing services for
					reference
				</li>
				<li>
					<Link href="/docs/skill-packs">Skill Packs</Link> — learn how skills connect to services
				</li>
				<li>
					<Link href="/docs/contributing">Contributing Guide</Link> — submit your service as a PR
				</li>
			</ul>
		</>
	);
}
