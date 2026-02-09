import Link from "next/link";

export const metadata = {
	title: "Homelab Deployment — better-openclaw Docs",
	description:
		"Deploy OpenClaw stacks on homelab hardware. ARM64 support, GPU passthrough, Unraid, Proxmox, and Raspberry Pi guides.",
};

export default function HomelabDeploymentPage() {
	return (
		<>
			<h1>Homelab Deployment</h1>
			<p>
				Run your OpenClaw stack on your own hardware — bare metal servers, NAS devices, Raspberry
				Pis, or virtualized environments. This guide covers ARM64 support, GPU passthrough, and
				platform-specific tips.
			</p>

			<h2>Supported Platforms</h2>
			<table>
				<thead>
					<tr>
						<th>Platform</th>
						<th>Architecture</th>
						<th>Notes</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>x86_64 bare metal / VM</td>
						<td>AMD64</td>
						<td>Full service support</td>
					</tr>
					<tr>
						<td>Apple Silicon (M1/M2/M3)</td>
						<td>ARM64</td>
						<td>Runs via Docker Desktop or OrbStack</td>
					</tr>
					<tr>
						<td>Raspberry Pi 4/5</td>
						<td>ARM64</td>
						<td>64-bit OS required, limited by RAM</td>
					</tr>
					<tr>
						<td>Unraid</td>
						<td>AMD64</td>
						<td>Docker via Unraid template system</td>
					</tr>
					<tr>
						<td>Proxmox LXC/VM</td>
						<td>AMD64/ARM64</td>
						<td>LXC containers or full VMs</td>
					</tr>
					<tr>
						<td>TrueNAS Scale</td>
						<td>AMD64</td>
						<td>Docker via TrueNAS apps</td>
					</tr>
				</tbody>
			</table>

			<h2>ARM64 Setup</h2>
			<p>
				Most services in better-openclaw have ARM64 builds. Use the <code>--platform</code> flag to
				ensure compatibility:
			</p>
			<pre>
				<code>{`npx create-better-openclaw my-stack \\
  --preset minimal \\
  --platform linux/arm64 \\
  --yes`}</code>
			</pre>
			<p>
				The CLI will warn you if any selected services don&apos;t have ARM64 images. You can check
				platform support for each service in the <Link href="/docs/services">Service Catalog</Link>.
			</p>

			<h3>Raspberry Pi Specifics</h3>
			<ul>
				<li>
					Use <strong>Raspberry Pi OS 64-bit</strong> (Lite is fine for headless)
				</li>
				<li>Pi 4 with 4 GB RAM works for minimal stacks; 8 GB recommended for more services</li>
				<li>Pi 5 is significantly faster for Docker workloads</li>
				<li>Use an SSD (via USB 3.0 or NVMe hat) instead of SD card for data volumes</li>
				<li>Avoid GPU-heavy services (Ollama, Whisper) — Pi lacks the memory</li>
			</ul>
			<pre>
				<code>{`# Install Docker on Raspberry Pi OS
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Install Docker Compose plugin
sudo apt install -y docker-compose-plugin

# Generate a lightweight stack
npx create-better-openclaw pi-stack \\
  --services redis,searxng \\
  --skills researcher \\
  --platform linux/arm64 \\
  --yes

cd pi-stack
cp .env.example .env
docker compose up -d`}</code>
			</pre>

			<h2>GPU Passthrough</h2>
			<p>
				For AI services like Ollama and Whisper, GPU acceleration dramatically improves performance.
				better-openclaw supports NVIDIA GPU passthrough.
			</p>

			<h3>Prerequisites</h3>
			<ol>
				<li>NVIDIA GPU (GTX 1060 or better recommended)</li>
				<li>NVIDIA drivers installed on the host</li>
				<li>
					<code>nvidia-container-toolkit</code> installed
				</li>
			</ol>

			<h3>Install NVIDIA Container Toolkit</h3>
			<pre>
				<code>{`# Ubuntu/Debian
curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | \\
  sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg

curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list | \\
  sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | \\
  sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list

sudo apt update
sudo apt install -y nvidia-container-toolkit
sudo nvidia-ctk runtime configure --runtime=docker
sudo systemctl restart docker

# Verify
docker run --rm --gpus all nvidia/cuda:12.0-base nvidia-smi`}</code>
			</pre>

			<h3>Generate a GPU-Enabled Stack</h3>
			<pre>
				<code>{`npx create-better-openclaw ai-stack \\
  --services ollama,whisper,redis,qdrant \\
  --skills local-ai,memory,voice \\
  --gpu \\
  --yes`}</code>
			</pre>
			<p>
				The generated <code>docker-compose.yml</code> includes the NVIDIA runtime configuration:
			</p>
			<pre>
				<code>{`services:
  ollama:
    image: ollama/ollama:latest
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities: [gpu]
    volumes:
      - ollama_models:/root/.ollama`}</code>
			</pre>

			<h3>AMD ROCm GPUs</h3>
			<p>AMD GPU support is experimental. For Ollama with ROCm:</p>
			<pre>
				<code>{`# Use the ROCm image tag instead
image: ollama/ollama:rocm`}</code>
			</pre>

			<h2>Unraid</h2>
			<p>
				Unraid runs Docker natively through its web UI, but you can also use docker-compose via the
				command line:
			</p>
			<pre>
				<code>{`# SSH into Unraid (or use the terminal in the web UI)
cd /mnt/user/appdata/

# Generate the stack
npx create-better-openclaw openclaw-stack \\
  --preset researcher \\
  --yes

cd openclaw-stack
cp .env.example .env
nano .env  # Configure your API keys

# Start with docker-compose
docker compose up -d`}</code>
			</pre>

			<h3>Unraid Tips</h3>
			<ul>
				<li>
					Store data volumes on the array or a cache pool via <code>/mnt/user/appdata/</code>
				</li>
				<li>
					Use the <strong>Compose Manager</strong> plugin for web UI management
				</li>
				<li>GPU passthrough works if the GPU is not assigned to a VM</li>
				<li>Set up a Cron job under Settings → Scheduler for automated backups</li>
			</ul>

			<h2>Proxmox</h2>

			<h3>Option A: LXC Container (Recommended)</h3>
			<p>LXC containers are lightweight and share the host kernel. Great for Docker workloads:</p>
			<pre>
				<code>{`# Create a privileged LXC container with Docker support
# In Proxmox web UI:
# 1. Create CT → Template: ubuntu-22.04
# 2. Set Resources: 4GB RAM, 2 cores, 50GB disk
# 3. Under Options → Features: enable "nesting" and "keyctl"

# Inside the container:
curl -fsSL https://get.docker.com | sh
apt install -y docker-compose-plugin

# Generate and start your stack
npx create-better-openclaw my-stack --preset researcher --yes
cd my-stack && docker compose up -d`}</code>
			</pre>

			<h3>Option B: Full VM</h3>
			<p>Use a VM if you need GPU passthrough or full isolation:</p>
			<ul>
				<li>Create a VM with Ubuntu 22.04, allocate resources as needed</li>
				<li>
					For GPU passthrough: pass through the entire PCIe device in Proxmox → VM → Hardware → Add
					→ PCI Device
				</li>
				<li>
					Follow the standard <Link href="/docs/deployment/vps">VPS deployment guide</Link> for the
					rest
				</li>
			</ul>

			<h3>Proxmox Tips</h3>
			<ul>
				<li>Use ZFS for automatic snapshots before updates</li>
				<li>Set up Proxmox Backup Server for automated CT/VM backups</li>
				<li>
					Use <code>pct push</code> / <code>pct pull</code> to transfer files to LXC containers
				</li>
			</ul>

			<h2>Network Configuration</h2>
			<p>For accessing your stack from other devices on your LAN:</p>
			<pre>
				<code>{`# Option 1: Access via host IP (simplest)
# http://192.168.1.100:8080

# Option 2: Add a local DNS entry (Pi-hole, AdGuard Home)
# openclaw.local → 192.168.1.100

# Option 3: Reverse proxy with local HTTPS
# Use Caddy with a local CA:
openclaw.local {
    tls internal
    reverse_proxy openclaw-gateway:8080
}`}</code>
			</pre>

			<h2>Persistent Storage Best Practices</h2>
			<ul>
				<li>
					<strong>Always use named Docker volumes</strong> (the default) — never bind-mount to the
					SD card on a Pi
				</li>
				<li>
					<strong>Run backups regularly</strong> with <code>./scripts/backup.sh</code>
				</li>
				<li>
					<strong>Use an SSD or NVMe</strong> for database volumes (Qdrant, Postgres)
				</li>
				<li>
					<strong>Monitor disk usage</strong> with <code>docker system df</code> and prune unused
					images periodically
				</li>
			</ul>

			<h2>Power Management</h2>
			<p>For 24/7 homelab setups, ensure your stack starts on boot:</p>
			<pre>
				<code>{`# Enable Docker to start on boot
sudo systemctl enable docker

# Add restart policies to your services (already included by default)
# In docker-compose.yml:
services:
  openclaw-gateway:
    restart: unless-stopped`}</code>
			</pre>

			<h2>Next Steps</h2>
			<ul>
				<li>
					<Link href="/docs/deployment">Local Docker Guide</Link> — development setup basics
				</li>
				<li>
					<Link href="/docs/deployment/vps">VPS Deployment</Link> — production cloud deployment
				</li>
				<li>
					<Link href="/docs/services">Service Catalog</Link> — check platform support for each
					service
				</li>
			</ul>
		</>
	);
}
