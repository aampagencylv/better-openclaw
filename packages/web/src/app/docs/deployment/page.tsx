import Link from "next/link";

export const metadata = {
	title: "Deployment — better-openclaw Docs",
	description:
		"Docker and bare-metal (native + Docker hybrid) deployment. Local setup, configuration, and native install scripts.",
};

export default function DeploymentPage() {
	return (
		<>
			<h1>Deployment</h1>
			<p>
				You can run your stack in three ways: <strong>Docker</strong> (all services in containers),{" "}
				<strong>direct install</strong> (OpenClaw on host, companion services in Docker), or{" "}
				<strong>bare-metal</strong> (native + Docker hybrid). This page covers all three.
			</p>

			<h2>Local / Docker Desktop</h2>
			<p>
				The simplest way to run your OpenClaw stack. Ideal for development, testing, and personal
				use. Requires{" "}
				<a
					href="https://www.docker.com/products/docker-desktop/"
					target="_blank"
					rel="noopener noreferrer"
				>
					Docker Desktop
				</a>{" "}
				(macOS/Windows) or Docker Engine (Linux).
			</p>

			<h3>Quick Start</h3>
			<pre>
				<code>{`# Generate your stack
npx create-better-openclaw my-stack --preset researcher --yes

# Start it up
cd my-stack
cp .env.example .env   # Add your API keys
docker compose up -d

# Check status
docker compose ps
docker compose logs -f openclaw-gateway`}</code>
			</pre>

			<h2>Configuration</h2>

			<h3>Environment Variables</h3>
			<p>
				The generated <code>.env.example</code> file contains all configuration variables. Copy it
				to <code>.env</code> and fill in your values:
			</p>
			<pre>
				<code>{`# Required: At least one LLM API key
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Optional: Service-specific config
QDRANT_API_KEY=               # Auto-generated if --generateSecrets
REDIS_PASSWORD=               # Auto-generated if --generateSecrets
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=      # Auto-generated if --generateSecrets`}</code>
			</pre>

			<h4>Ports</h4>
			<p>Default port assignments for common services:</p>
			<table>
				<thead>
					<tr>
						<th>Service</th>
						<th>Port</th>
						<th>URL</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>OpenClaw Gateway</td>
						<td>8080</td>
						<td>
							<code>http://localhost:8080</code>
						</td>
					</tr>
					<tr>
						<td>OpenClaw Web UI</td>
						<td>3000</td>
						<td>
							<code>http://localhost:3000</code>
						</td>
					</tr>
					<tr>
						<td>Qdrant</td>
						<td>6333</td>
						<td>
							<code>http://localhost:6333/dashboard</code>
						</td>
					</tr>
					<tr>
						<td>Redis</td>
						<td>6379</td>
						<td>—</td>
					</tr>
					<tr>
						<td>n8n</td>
						<td>5678</td>
						<td>
							<code>http://localhost:5678</code>
						</td>
					</tr>
					<tr>
						<td>Grafana</td>
						<td>3001</td>
						<td>
							<code>http://localhost:3001</code>
						</td>
					</tr>
					<tr>
						<td>SearXNG</td>
						<td>8888</td>
						<td>
							<code>http://localhost:8888</code>
						</td>
					</tr>
					<tr>
						<td>Ollama</td>
						<td>11434</td>
						<td>
							<code>http://localhost:11434</code>
						</td>
					</tr>
				</tbody>
			</table>

			<h3>Common Operations</h3>
			<pre>
				<code>{`# Start all services
docker compose up -d

# Stop all services
docker compose down

# Stop and remove volumes (⚠️ deletes data)
docker compose down -v

# Restart a single service
docker compose restart qdrant

# View logs for a specific service
docker compose logs -f n8n

# Scale a service (if supported)
docker compose up -d --scale worker=3`}</code>
			</pre>

			<h3>Helper Scripts</h3>
			<p>
				Generated stacks include convenience scripts in the <code>scripts/</code> directory:
			</p>
			<table>
				<thead>
					<tr>
						<th>Script</th>
						<th>Description</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>
							<code>scripts/start.sh</code>
						</td>
						<td>Start all services with health check validation</td>
					</tr>
					<tr>
						<td>
							<code>scripts/stop.sh</code>
						</td>
						<td>Gracefully stop all services</td>
					</tr>
					<tr>
						<td>
							<code>scripts/update.sh</code>
						</td>
						<td>Pull latest images and restart</td>
					</tr>
					<tr>
						<td>
							<code>scripts/backup.sh</code>
						</td>
						<td>Backup all named volumes to tar archives</td>
					</tr>
					<tr>
						<td>
							<code>scripts/status.sh</code>
						</td>
						<td>Show service status, resource usage, and disk</td>
					</tr>
				</tbody>
			</table>

			<h2>Troubleshooting</h2>

			<h4>Port Conflict</h4>
			<p>
				If a port is already in use, edit <code>docker-compose.yml</code> and change the host port:
			</p>
			<pre>
				<code>{`services:
  qdrant:
    ports:
      - "6334:6333"  # Changed host port to 6334`}</code>
			</pre>

			<h4>Service Won&apos;t Start</h4>
			<pre>
				<code>{`# Check the service logs
docker compose logs qdrant

# Check resource usage
docker stats

# Restart with fresh state
docker compose down
docker compose up -d`}</code>
			</pre>

			<h4>Insufficient Memory</h4>
			<p>
				Docker Desktop has a default memory limit. Increase it in Docker Desktop → Settings →
				Resources → Memory.
			</p>
			<ul>
				<li>Minimal stack: 2 GB</li>
				<li>Standard stack: 4 GB</li>
				<li>Full stack or AI services: 8 GB+</li>
			</ul>

			<h2 id="direct-install">Direct Install (OpenClaw on Host)</h2>
			<p>
				With the <strong>direct install</strong> method, OpenClaw itself runs directly on your host
				(not in Docker), while companion services like PostgreSQL, Redis, Qdrant, etc. still run in
				Docker containers.
			</p>
			<p>This approach is ideal when you:</p>
			<ul>
				<li>Need direct access to host GPU drivers for AI workloads</li>
				<li>Want the OpenClaw process to have full access to host filesystem</li>
				<li>Prefer a lighter Docker footprint</li>
				<li>Are running on a machine where Docker performance overhead matters</li>
			</ul>
			<h3>Quick Start</h3>
			<pre>
				<code>{`# Generate a stack with direct install
npx create-better-openclaw my-stack --openclaw-install direct --yes

cd my-stack
cp .env.example .env   # Add your API keys

# Install OpenClaw on the host
./scripts/install-openclaw.sh

# Start companion services
docker compose up -d

# Run onboarding
openclaw onboard`}</code>
			</pre>
			<p>
				The generated <code>docker-compose.yml</code> will <strong>not</strong> contain the{" "}
				<code>openclaw-gateway</code> or <code>openclaw-cli</code> services — only your selected
				companion services.
			</p>

			<h2 id="bare-metal">Bare-metal (native + Docker hybrid)</h2>
			<p>
				With <code>--deployment-type bare-metal</code> (or by choosing &quot;Bare-metal&quot; in the{" "}
				<Link href="/new">stack builder</Link>), you get a <strong>native + Docker hybrid</strong>:
			</p>
			<ul>
				<li>
					<strong>Services that have a native recipe</strong> (e.g. Redis on Linux) run on the host
					via install/run scripts in <code>native/</code> (e.g. <code>native/install-linux.sh</code>
					).
				</li>
				<li>
					<strong>All other services</strong> (including the OpenClaw gateway) run in Docker. The
					generated <code>docker-compose.yml</code> only includes those; the gateway connects to
					native services via <code>host.docker.internal</code>.
				</li>
				<li>
					A <strong>top-level installer</strong> (<code>install.sh</code> or{" "}
					<code>install.ps1</code>) installs and starts native services first, then runs{" "}
					<code>docker compose up</code> for the rest.
				</li>
			</ul>
			<p>
				Currently <strong>Redis</strong> supports a native Linux recipe (apt/dnf + systemd). More
				services may be added over time. Node/Python apps, La Suite Meet, Ollama, and similar remain
				Docker-only.
			</p>
			<pre>
				<code>{`# Generate a bare-metal stack (e.g. Redis native, rest in Docker)
npx create-better-openclaw my-stack --preset minimal --deployment-type bare-metal --platform linux/amd64 --yes

cd my-stack
cp .env.example .env
./install.sh          # Linux/macOS: installs native services, then docker compose up
# or: .\\install.ps1  # Windows`}</code>
			</pre>

			<h2>Security Notes</h2>
			<ul>
				<li>
					Local stacks bind to <code>localhost</code> by default — not exposed to the network
				</li>
				<li>
					Never commit <code>.env</code> files to version control
				</li>
				<li>
					Use <code>--generateSecrets</code> even for local dev to practice good habits
				</li>
			</ul>

			<h2>Next Steps</h2>
			<ul>
				<li>
					<Link href="/docs/deployment/vps">VPS Deployment</Link> — deploy to production
				</li>
				<li>
					<Link href="/docs/deployment/homelab">Homelab Deployment</Link> — ARM64, GPU passthrough
				</li>
				<li>
					<Link href="/docs/services">Service Catalog</Link> — explore all available services
				</li>
			</ul>
		</>
	);
}
