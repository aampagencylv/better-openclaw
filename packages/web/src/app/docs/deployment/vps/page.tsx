import Link from "next/link";

export const metadata = {
	title: "VPS Deployment — better-openclaw Docs",
	description:
		"Deploy your OpenClaw stack to a VPS or cloud server. DigitalOcean, Hetzner, AWS EC2 guides with Caddy HTTPS.",
};

export default function VpsDeploymentPage() {
	return (
		<>
			<h1>VPS / Cloud Deployment</h1>
			<p>
				This guide covers deploying your OpenClaw stack to a VPS (Virtual Private Server) or cloud
				instance. Works with DigitalOcean, Hetzner, Contabo, Linode, AWS EC2, or any provider that
				gives you a Linux VM.
			</p>

			<h2>Recommended Specs</h2>
			<table>
				<thead>
					<tr>
						<th>Stack Size</th>
						<th>RAM</th>
						<th>CPU</th>
						<th>Disk</th>
						<th>Monthly Cost (est.)</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Minimal (2-3 services)</td>
						<td>2 GB</td>
						<td>1 vCPU</td>
						<td>25 GB</td>
						<td>$5-10</td>
					</tr>
					<tr>
						<td>Standard (5-8 services)</td>
						<td>4 GB</td>
						<td>2 vCPU</td>
						<td>50 GB</td>
						<td>$12-20</td>
					</tr>
					<tr>
						<td>Full (10+ services)</td>
						<td>8 GB</td>
						<td>4 vCPU</td>
						<td>100 GB</td>
						<td>$24-48</td>
					</tr>
					<tr>
						<td>AI (Ollama, Whisper)</td>
						<td>16 GB+</td>
						<td>4+ vCPU</td>
						<td>100+ GB</td>
						<td>$48+</td>
					</tr>
				</tbody>
			</table>

			<h2>Step 1: Provision the Server</h2>
			<p>
				Create a VPS with Ubuntu 22.04 or later. Most providers have a one-click Docker image or you
				can install manually:
			</p>
			<pre>
				<code>{`# SSH into your server
ssh root@your-server-ip

# Update packages
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sh

# Install Docker Compose plugin
apt install -y docker-compose-plugin

# Add your user to the docker group
usermod -aG docker $USER

# Log out and back in, then verify
docker info
docker compose version`}</code>
			</pre>

			<h2>Step 2: Generate the Stack</h2>
			<p>
				Generate your stack <strong>locally</strong> with a reverse proxy configured:
			</p>
			<pre>
				<code>{`# With automatic HTTPS via Caddy (recommended)
npx create-better-openclaw my-stack \\
  --preset researcher \\
  --proxy caddy \\
  --domain openclaw.example.com \\
  --generateSecrets \\
  --yes`}</code>
			</pre>

			<h3>Alternative: Traefik</h3>
			<pre>
				<code>{`npx create-better-openclaw my-stack \\
  --preset researcher \\
  --proxy traefik \\
  --domain openclaw.example.com \\
  --yes`}</code>
			</pre>

			<h2>Step 3: Configure DNS</h2>
			<p>Point your domain to your server&apos;s IP address:</p>
			<table>
				<thead>
					<tr>
						<th>Type</th>
						<th>Name</th>
						<th>Value</th>
						<th>TTL</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>A</td>
						<td>openclaw.example.com</td>
						<td>203.0.113.42</td>
						<td>300</td>
					</tr>
				</tbody>
			</table>
			<p>If using a wildcard for subdomains (e.g. separate UIs for Grafana, n8n):</p>
			<table>
				<thead>
					<tr>
						<th>Type</th>
						<th>Name</th>
						<th>Value</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>A</td>
						<td>*.openclaw.example.com</td>
						<td>203.0.113.42</td>
					</tr>
				</tbody>
			</table>
			<p>Wait for DNS propagation (usually 1-5 minutes with low TTL). Verify with:</p>
			<pre>
				<code>{`dig openclaw.example.com +short
# Should return: 203.0.113.42`}</code>
			</pre>

			<h2>Step 4: Deploy to Server</h2>
			<pre>
				<code>{`# Copy the stack to your server
scp -r my-stack/ user@your-server:~/

# SSH into the server
ssh user@your-server

# Enter the stack directory
cd my-stack

# Configure environment variables
cp .env.example .env
nano .env  # Add your API keys and secrets

# Make scripts executable
chmod +x scripts/*.sh

# Start the stack
./scripts/start.sh`}</code>
			</pre>

			<h2>Step 5: Verify</h2>
			<pre>
				<code>{`# Check service status
docker compose ps

# Check logs
docker compose logs -f openclaw-gateway

# Test the health endpoint
curl https://openclaw.example.com/healthz

# Check SSL certificate
curl -vI https://openclaw.example.com 2>&1 | grep "SSL certificate"
`}</code>
			</pre>

			<h2>Caddy Configuration</h2>
			<p>
				The generated <code>Caddyfile</code> handles HTTPS automatically via Let&apos;s Encrypt:
			</p>
			<pre>
				<code>{`openclaw.example.com {
    reverse_proxy openclaw-gateway:8080
}

# If you have service UIs (Grafana, n8n, etc.)
grafana.openclaw.example.com {
    reverse_proxy grafana:3000
}

n8n.openclaw.example.com {
    reverse_proxy n8n:5678
}`}</code>
			</pre>
			<p>Caddy automatically obtains and renews SSL certificates. No manual setup needed.</p>

			<h2>Firewall Setup</h2>
			<p>Only expose ports 80 (HTTP → HTTPS redirect) and 443 (HTTPS):</p>
			<pre>
				<code>{`# UFW (Ubuntu)
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP (redirects to HTTPS)
ufw allow 443/tcp   # HTTPS
ufw enable

# Verify
ufw status`}</code>
			</pre>
			<p>
				<strong>Important:</strong> Do NOT expose service ports directly (6333 for Qdrant, 6379 for
				Redis, etc.). Route everything through the reverse proxy.
			</p>

			<h2>Updating Your Stack</h2>
			<pre>
				<code>{`# SSH into server
ssh user@your-server
cd my-stack

# Backup first
./scripts/backup.sh

# Pull latest images
./scripts/update.sh

# Or manually
docker compose pull
docker compose up -d`}</code>
			</pre>

			<h2>Monitoring</h2>
			<pre>
				<code>{`# Resource usage
docker stats

# Disk usage
df -h
docker system df

# Service status with the helper script
./scripts/status.sh`}</code>
			</pre>

			<h2>Provider-Specific Tips</h2>

			<h3>DigitalOcean</h3>
			<ul>
				<li>Use the &quot;Docker on Ubuntu&quot; marketplace image</li>
				<li>Enable monitoring in the Droplet settings</li>
				<li>Use DigitalOcean Spaces for off-server backups</li>
			</ul>

			<h3>Hetzner</h3>
			<ul>
				<li>Best price/performance ratio in EU</li>
				<li>Use the Falkenstein or Helsinki DC for low latency</li>
				<li>CAX-series ARM servers are extremely cost-effective</li>
			</ul>

			<h3>AWS EC2</h3>
			<ul>
				<li>
					Use a <code>t3.medium</code> or larger for standard stacks
				</li>
				<li>Attach an EBS volume for persistent data</li>
				<li>Configure Security Groups instead of UFW</li>
			</ul>

			<h2>Next Steps</h2>
			<ul>
				<li>
					<Link href="/docs/deployment/homelab">Homelab Deployment</Link> — ARM64, GPU passthrough,
					Unraid/Proxmox
				</li>
				<li>
					<Link href="/docs/deployment">Local Docker Guide</Link> — development setup
				</li>
				<li>
					<Link href="/docs/contributing">Contributing</Link> — help improve better-openclaw
				</li>
			</ul>
		</>
	);
}
