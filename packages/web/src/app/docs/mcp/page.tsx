import Link from "next/link";

export const metadata = {
	title: "MCP Server — better-openclaw Docs",
	description:
		"Use better-openclaw as a Model Context Protocol (MCP) server. Let AI agents generate Docker Compose stacks, browse services, and manage infrastructure via natural language.",
};

export default function McpPage() {
	return (
		<>
			<h1>MCP Server</h1>
			<p>
				better-openclaw ships with a built-in{" "}
				<a href="https://modelcontextprotocol.io" target="_blank" rel="noopener noreferrer">
					Model Context Protocol (MCP)
				</a>{" "}
				server. This lets AI agents — like Claude, Cursor, Windsurf, or any MCP-compatible client —
				generate Docker Compose stacks, browse the service catalog, and validate infrastructure
				through natural language.
			</p>

			<h2>What is MCP?</h2>
			<p>
				The Model Context Protocol is an open standard (created by Anthropic) that connects AI
				models to external tools and data sources. Think of it as a universal plugin system for AI:
				instead of building custom integrations, any MCP-compatible client can discover and use
				tools exposed by an MCP server.
			</p>
			<p>
				The <code>@better-openclaw/mcp</code> package exposes the full stack-generation pipeline —
				the same engine that powers the CLI and web builder — as MCP tools and resources.
			</p>

			<h2>Quick Setup</h2>

			<h3>Install</h3>
			<pre>
				<code>{`# Global install
npm install -g @better-openclaw/mcp

# Or use npx (no install)
npx @better-openclaw/mcp`}</code>
			</pre>

			<h3>Claude Desktop</h3>
			<p>
				Add to your <code>claude_desktop_config.json</code>:
			</p>
			<pre>
				<code>{`{
  "mcpServers": {
    "better-openclaw": {
      "command": "npx",
      "args": ["-y", "@better-openclaw/mcp"]
    }
  }
}`}</code>
			</pre>

			<h3>Cursor / VS Code</h3>
			<p>
				Add to your <code>.cursor/mcp.json</code> or VS Code MCP settings:
			</p>
			<pre>
				<code>{`{
  "mcpServers": {
    "better-openclaw": {
      "command": "npx",
      "args": ["-y", "@better-openclaw/mcp"]
    }
  }
}`}</code>
			</pre>

			<h2>Available Tools</h2>
			<p>
				The MCP server exposes <strong>10 tools</strong> that AI agents can call:
			</p>
			<table>
				<thead>
					<tr>
						<th>Tool</th>
						<th>Description</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>
							<code>generate-stack</code>
						</td>
						<td>
							Generate a complete Docker Compose stack from a list of services. Returns all files
							(docker-compose.yml, .env, README, scripts, configs).
						</td>
					</tr>
					<tr>
						<td>
							<code>list-services</code>
						</td>
						<td>
							List all available services in the catalog with their categories, ports, and
							descriptions.
						</td>
					</tr>
					<tr>
						<td>
							<code>get-service</code>
						</td>
						<td>
							Get detailed information about a specific service by ID (ports, volumes, health
							checks, dependencies).
						</td>
					</tr>
					<tr>
						<td>
							<code>search-services</code>
						</td>
						<td>Search services by keyword across names, descriptions, and tags.</td>
					</tr>
					<tr>
						<td>
							<code>suggest-services</code>
						</td>
						<td>
							Get service suggestions from a natural language description (e.g. &quot;I need a
							research assistant with vector search&quot;).
						</td>
					</tr>
					<tr>
						<td>
							<code>list-presets</code>
						</td>
						<td>List all available presets (curated service combinations for common use cases).</td>
					</tr>
					<tr>
						<td>
							<code>get-preset</code>
						</td>
						<td>Get full details of a specific preset by ID.</td>
					</tr>
					<tr>
						<td>
							<code>list-skill-packs</code>
						</td>
						<td>List all skill packs (bundles of OpenClaw skills).</td>
					</tr>
					<tr>
						<td>
							<code>resolve-deps</code>
						</td>
						<td>
							Resolve the dependency graph for a set of services (shows what gets auto-added).
						</td>
					</tr>
					<tr>
						<td>
							<code>validate-stack</code>
						</td>
						<td>
							Validate a stack configuration for errors (port conflicts, missing dependencies,
							resource estimates).
						</td>
					</tr>
				</tbody>
			</table>

			<h2>Available Resources</h2>
			<p>MCP resources provide read-only data that clients can browse:</p>
			<table>
				<thead>
					<tr>
						<th>Resource</th>
						<th>URI</th>
						<th>Description</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Services</td>
						<td>
							<code>openclaw://services</code>
						</td>
						<td>Complete service catalog as JSON</td>
					</tr>
					<tr>
						<td>Presets</td>
						<td>
							<code>openclaw://presets</code>
						</td>
						<td>All available preset configurations</td>
					</tr>
					<tr>
						<td>Skills</td>
						<td>
							<code>openclaw://skills</code>
						</td>
						<td>All skill packs with their bindings</td>
					</tr>
				</tbody>
			</table>

			<h2>Example Conversations</h2>

			<h3>Generate a stack from a description</h3>
			<pre>
				<code>{`User: "I want to build a self-hosted research assistant with 
       vector search, web scraping, and local LLM support"

Agent calls: suggest-services("research assistant vector search web scraping local LLM")
  → Returns: qdrant, searxng, browserless, ollama, open-webui, redis

Agent calls: generate-stack({
  projectName: "research-assistant",
  services: ["qdrant", "searxng", "browserless", "ollama", "open-webui", "redis"],
  monitoring: true
})
  → Returns: docker-compose.yml, .env, README.md, scripts/, configs/`}</code>
			</pre>

			<h3>Validate before deploying</h3>
			<pre>
				<code>{`User: "Check if this stack will work on a 4GB server"

Agent calls: validate-stack({
  services: ["postgresql", "redis", "n8n", "ollama"]
})
  → Returns: warnings about memory (Ollama alone needs ~4GB), 
    port conflicts, and dependency graph`}</code>
			</pre>

			<h2>Development</h2>
			<pre>
				<code>{`# Clone the repo
git clone https://github.com/bidewio/better-openclaw.git
cd better-openclaw

# Install dependencies
pnpm install

# Run the MCP server in development mode
pnpm --filter @better-openclaw/mcp dev`}</code>
			</pre>

			<h2>Next Steps</h2>
			<ul>
				<li>
					<Link href="/docs/mcp/tools">MCP Tools Reference</Link> — detailed docs for every tool
				</li>
				<li>
					<Link href="/docs/services">Service Catalog</Link> — browse all available services
				</li>
				<li>
					<Link href="/docs/cli">CLI Reference</Link> — the command-line equivalent of MCP tools
				</li>
			</ul>
		</>
	);
}
