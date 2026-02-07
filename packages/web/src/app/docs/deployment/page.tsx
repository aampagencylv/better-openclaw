import Link from "next/link";

export const metadata = {
	title: "Deployment Guide — better-openclaw",
	description: "Deploy your OpenClaw stack to VPS, homelab, or cloud providers",
};

export default function DeploymentGuidePage() {
	return (
		<div className="min-h-screen bg-background text-foreground">
			<header className="border-b border-border">
				<div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
					<Link href="/" className="text-xl font-bold text-primary">
						better-openclaw
					</Link>
					<nav className="flex gap-6 text-sm text-muted-foreground">
						<Link href="/new" className="hover:text-foreground transition-colors">
							Builder
						</Link>
						<Link href="/docs" className="text-foreground">
							Docs
						</Link>
					</nav>
				</div>
			</header>

			<main className="mx-auto max-w-4xl px-6 py-12">
				<h1 className="text-4xl font-bold mb-4">Deployment Guide</h1>
				<p className="text-lg text-muted-foreground mb-12">
					Step-by-step instructions for deploying your OpenClaw stack to different environments.
				</p>

				<section className="mb-12">
					<h2 className="text-2xl font-bold mb-4">Local / Docker Desktop</h2>
					<div className="space-y-4 text-muted-foreground">
						<p>Best for development and personal use. Requires Docker Desktop installed.</p>
						<pre className="bg-surface border border-border rounded-lg p-4 overflow-x-auto">
							<code className="text-sm font-mono text-accent">
								{`# Generate your stack
npx create-better-openclaw my-stack --preset researcher --yes

# Start it up
cd my-stack
cp .env.example .env   # Add your API keys
docker compose up -d

# Check status
docker compose ps
docker compose logs -f openclaw-gateway`}
							</code>
						</pre>
					</div>
				</section>

				<section className="mb-12">
					<h2 className="text-2xl font-bold mb-4">VPS / Cloud Server</h2>
					<div className="space-y-4 text-muted-foreground">
						<p>
							For production deployments on DigitalOcean, Hetzner, Contabo, AWS EC2, or any VPS.
						</p>

						<h3 className="text-lg font-semibold text-foreground mt-6">1. Server Setup</h3>
						<pre className="bg-surface border border-border rounded-lg p-4 overflow-x-auto">
							<code className="text-sm font-mono text-accent">
								{`# Install Docker (Ubuntu/Debian)
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Install Docker Compose plugin
sudo apt install docker-compose-plugin`}
							</code>
						</pre>

						<h3 className="text-lg font-semibold text-foreground mt-6">2. Generate with Caddy</h3>
						<pre className="bg-surface border border-border rounded-lg p-4 overflow-x-auto">
							<code className="text-sm font-mono text-accent">
								{`npx create-better-openclaw my-stack \\
  --preset researcher \\
  --proxy caddy \\
  --domain openclaw.example.com \\
  --yes`}
							</code>
						</pre>

						<h3 className="text-lg font-semibold text-foreground mt-6">3. DNS Configuration</h3>
						<p>
							Point your domain to your server&apos;s IP address with an A record.
							Caddy will automatically obtain SSL certificates from Let&apos;s Encrypt.
						</p>

						<h3 className="text-lg font-semibold text-foreground mt-6">4. Deploy</h3>
						<pre className="bg-surface border border-border rounded-lg p-4 overflow-x-auto">
							<code className="text-sm font-mono text-accent">
								{`scp -r my-stack/ user@your-server:~/
ssh user@your-server
cd my-stack
cp .env.example .env  # Edit with production values
chmod +x scripts/*.sh
./scripts/start.sh`}
							</code>
						</pre>
					</div>
				</section>

				<section className="mb-12">
					<h2 className="text-2xl font-bold mb-4">Homelab</h2>
					<div className="space-y-4 text-muted-foreground">
						<p>
							For self-hosted setups on Unraid, Proxmox, bare metal, or Raspberry Pi.
						</p>

						<h3 className="text-lg font-semibold text-foreground mt-6">ARM64 Support</h3>
						<p>
							Most services have ARM64 builds. Use the <code className="text-accent">--platform linux/arm64</code> flag
							to ensure compatibility with Apple Silicon or Raspberry Pi.
						</p>
						<pre className="bg-surface border border-border rounded-lg p-4 overflow-x-auto">
							<code className="text-sm font-mono text-accent">
								{`npx create-better-openclaw my-stack \\
  --preset minimal \\
  --platform linux/arm64 \\
  --yes`}
							</code>
						</pre>

						<h3 className="text-lg font-semibold text-foreground mt-6">GPU Passthrough</h3>
						<p>
							For Ollama, Whisper, and other AI services, enable GPU passthrough:
						</p>
						<pre className="bg-surface border border-border rounded-lg p-4 overflow-x-auto">
							<code className="text-sm font-mono text-accent">
								{`npx create-better-openclaw my-stack \\
  --services ollama,whisper,redis \\
  --skills local-ai \\
  --gpu \\
  --yes`}
							</code>
						</pre>
					</div>
				</section>

				<section className="mb-12">
					<h2 className="text-2xl font-bold mb-4">Maintenance</h2>
					<div className="space-y-4 text-muted-foreground">
						<p>Generated stacks include helper scripts for common operations:</p>

						<div className="grid gap-3">
							{[
								{ script: "scripts/start.sh", desc: "Start all services with health check validation" },
								{ script: "scripts/stop.sh", desc: "Gracefully stop all services" },
								{ script: "scripts/update.sh", desc: "Pull latest images and restart" },
								{ script: "scripts/backup.sh", desc: "Backup all named volumes to tar archives" },
								{ script: "scripts/status.sh", desc: "Show service status, resource usage, and disk" },
							].map((item) => (
								<div key={item.script} className="flex gap-3 items-start p-3 rounded bg-surface border border-border">
									<code className="text-sm font-mono text-accent whitespace-nowrap">{item.script}</code>
									<span className="text-sm">{item.desc}</span>
								</div>
							))}
						</div>
					</div>
				</section>

				<section>
					<h2 className="text-2xl font-bold mb-4">Security Best Practices</h2>
					<ul className="space-y-2 text-muted-foreground list-disc list-inside">
						<li>Always use <code className="text-accent">--generateSecrets</code> for production (enabled by default)</li>
						<li>Never commit <code className="text-accent">.env</code> files to version control</li>
						<li>Use Caddy or Traefik for automatic HTTPS in production</li>
						<li>Bind services to <code className="text-accent">127.0.0.1</code> and route through the reverse proxy</li>
						<li>Regularly run <code className="text-accent">./scripts/update.sh</code> to pull security patches</li>
						<li>Use <code className="text-accent">./scripts/backup.sh</code> before major updates</li>
						<li>Review the generated <code className="text-accent">.env.example</code> file for all configuration options</li>
					</ul>
				</section>
			</main>
		</div>
	);
}
