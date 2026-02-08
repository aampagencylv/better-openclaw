import Link from "next/link";

export const metadata = {
  title: "Local Deployment — better-openclaw Docs",
  description:
    "Deploy your OpenClaw stack locally with Docker Desktop. Development setup, configuration, and maintenance.",
};

export default function DeploymentPage() {
  return (
    <>
      <h1>Local / Docker Desktop</h1>
      <p>
        The simplest way to run your OpenClaw stack. Ideal for development,
        testing, and personal use. Requires{" "}
        <a
          href="https://www.docker.com/products/docker-desktop/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Docker Desktop
        </a>{" "}
        (macOS/Windows) or Docker Engine (Linux).
      </p>

      <h2>Quick Start</h2>
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
        The generated <code>.env.example</code> file contains all configuration
        variables. Copy it to <code>.env</code> and fill in your values:
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

      <h3>Ports</h3>
      <p>
        Default port assignments for common services:
      </p>
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

      <h2>Common Operations</h2>
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

      <h2>Helper Scripts</h2>
      <p>
        Generated stacks include convenience scripts in the <code>scripts/</code>{" "}
        directory:
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

      <h3>Port Conflict</h3>
      <p>
        If a port is already in use, edit <code>docker-compose.yml</code> and
        change the host port:
      </p>
      <pre>
        <code>{`services:
  qdrant:
    ports:
      - "6334:6333"  # Changed host port to 6334`}</code>
      </pre>

      <h3>Service Won&apos;t Start</h3>
      <pre>
        <code>{`# Check the service logs
docker compose logs qdrant

# Check resource usage
docker stats

# Restart with fresh state
docker compose down
docker compose up -d`}</code>
      </pre>

      <h3>Insufficient Memory</h3>
      <p>
        Docker Desktop has a default memory limit. Increase it in Docker Desktop
        → Settings → Resources → Memory.
      </p>
      <ul>
        <li>Minimal stack: 2 GB</li>
        <li>Standard stack: 4 GB</li>
        <li>Full stack or AI services: 8 GB+</li>
      </ul>

      <h2>Security Notes</h2>
      <ul>
        <li>
          Local stacks bind to <code>localhost</code> by default — not exposed
          to the network
        </li>
        <li>
          Never commit <code>.env</code> files to version control
        </li>
        <li>
          Use <code>--generateSecrets</code> even for local dev to practice
          good habits
        </li>
      </ul>

      <h2>Next Steps</h2>
      <ul>
        <li>
          <Link href="/docs/deployment/vps">VPS Deployment</Link> — deploy to
          production
        </li>
        <li>
          <Link href="/docs/deployment/homelab">Homelab Deployment</Link> — ARM64,
          GPU passthrough
        </li>
        <li>
          <Link href="/docs/services">Service Catalog</Link> — explore all
          available services
        </li>
      </ul>
    </>
  );
}
