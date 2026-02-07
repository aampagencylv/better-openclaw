/**
 * Generates helper shell scripts for managing the OpenClaw Docker Compose stack.
 *
 * Returns a map of file paths (relative to project root) to file contents.
 */
export function generateScripts(): Record<string, string> {
	const files: Record<string, string> = {};

	// ── scripts/start.sh ────────────────────────────────────────────────────

	files["scripts/start.sh"] = `#!/usr/bin/env bash
set -euo pipefail

# ─── OpenClaw Start Script ──────────────────────────────────────────────────
# Validates prerequisites and starts all services.

SCRIPT_DIR="$(cd "$(dirname "\${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

echo "🐾 OpenClaw — Starting services..."
echo ""

# Check Docker
if ! command -v docker &> /dev/null; then
  echo "❌ Docker is not installed. Please install Docker first."
  echo "   https://docs.docker.com/get-docker/"
  exit 1
fi

# Check Docker Compose
if ! docker compose version &> /dev/null; then
  echo "❌ Docker Compose (v2) is not available."
  echo "   https://docs.docker.com/compose/install/"
  exit 1
fi

# Check if Docker daemon is running
if ! docker info &> /dev/null 2>&1; then
  echo "❌ Docker daemon is not running. Please start Docker."
  exit 1
fi

# Validate .env exists
if [ ! -f ".env" ]; then
  echo "❌ .env file not found!"
  echo "   Run: cp .env.example .env"
  echo "   Then edit .env with your configuration."
  exit 1
fi

# Check for empty secret values
EMPTY_SECRETS=0
while IFS='=' read -r key value; do
  # Skip comments and empty lines
  [[ "$key" =~ ^#.*$ ]] && continue
  [[ -z "$key" ]] && continue
  # Check for empty values on known secret patterns
  if [[ "$key" =~ (PASSWORD|TOKEN|SECRET) ]] && [[ -z "$value" ]]; then
    echo "⚠️  Warning: $key is empty in .env"
    EMPTY_SECRETS=$((EMPTY_SECRETS + 1))
  fi
done < .env

if [ "$EMPTY_SECRETS" -gt 0 ]; then
  echo ""
  echo "⚠️  $EMPTY_SECRETS secret(s) are empty. Consider generating values before starting."
  echo ""
fi

# Pull latest images
echo "📦 Pulling latest images..."
docker compose pull --quiet

# Start services
echo "🚀 Starting services..."
docker compose up -d

# Wait for health checks
echo ""
echo "⏳ Waiting for services to become healthy..."
sleep 5

RETRIES=0
MAX_RETRIES=30
while [ $RETRIES -lt $MAX_RETRIES ]; do
  UNHEALTHY=$(docker compose ps --format json 2>/dev/null | grep -c '"unhealthy"' || true)
  STARTING=$(docker compose ps --format json 2>/dev/null | grep -c '"starting"' || true)

  if [ "$UNHEALTHY" -eq 0 ] && [ "$STARTING" -eq 0 ]; then
    break
  fi

  RETRIES=$((RETRIES + 1))
  sleep 2
done

echo ""
docker compose ps
echo ""

if [ $RETRIES -ge $MAX_RETRIES ]; then
  echo "⚠️  Some services may still be starting. Check: docker compose ps"
else
  echo "✅ All services are running!"
fi
`;

	// ── scripts/stop.sh ─────────────────────────────────────────────────────

	files["scripts/stop.sh"] = `#!/usr/bin/env bash
set -euo pipefail

# ─── OpenClaw Stop Script ───────────────────────────────────────────────────
# Gracefully stops all services.

SCRIPT_DIR="$(cd "$(dirname "\${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

echo "🐾 OpenClaw — Stopping services..."
echo ""

# Graceful shutdown with timeout
docker compose down --timeout 30

echo ""
echo "✅ All services stopped."
`;

	// ── scripts/update.sh ───────────────────────────────────────────────────

	files["scripts/update.sh"] = `#!/usr/bin/env bash
set -euo pipefail

# ─── OpenClaw Update Script ─────────────────────────────────────────────────
# Pulls latest images and restarts services.

SCRIPT_DIR="$(cd "$(dirname "\${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

echo "🐾 OpenClaw — Updating services..."
echo ""

# Pull latest images
echo "📦 Pulling latest images..."
docker compose pull

echo ""
echo "🔄 Restarting services with new images..."
docker compose up -d --remove-orphans

echo ""
echo "⏳ Waiting for services to stabilize..."
sleep 10

docker compose ps

echo ""
echo "✅ Update complete!"
`;

	// ── scripts/backup.sh ───────────────────────────────────────────────────

	files["scripts/backup.sh"] = `#!/usr/bin/env bash
set -euo pipefail

# ─── OpenClaw Backup Script ─────────────────────────────────────────────────
# Backs up all named Docker volumes to a timestamped directory.

SCRIPT_DIR="$(cd "$(dirname "\${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="$PROJECT_DIR/backups/$TIMESTAMP"
mkdir -p "$BACKUP_DIR"

echo "🐾 OpenClaw — Backing up volumes..."
echo "   Backup directory: $BACKUP_DIR"
echo ""

# Get project name from docker compose
PROJECT_NAME=$(docker compose config --format json 2>/dev/null | grep -o '"name":"[^"]*"' | head -1 | cut -d'"' -f4 || echo "openclaw")

# List all volumes for this project
VOLUMES=$(docker volume ls --filter "name=\${PROJECT_NAME}" --format "{{.Name}}" 2>/dev/null || true)

if [ -z "$VOLUMES" ]; then
  echo "⚠️  No volumes found for project: $PROJECT_NAME"
  echo "   Trying to list all openclaw volumes..."
  VOLUMES=$(docker volume ls --filter "name=openclaw" --format "{{.Name}}" 2>/dev/null || true)
fi

if [ -z "$VOLUMES" ]; then
  echo "❌ No volumes found to back up."
  exit 1
fi

BACKED_UP=0
for VOLUME in $VOLUMES; do
  echo "📦 Backing up: $VOLUME"
  docker run --rm \\
    -v "\${VOLUME}:/source:ro" \\
    -v "$BACKUP_DIR:/backup" \\
    alpine tar czf "/backup/\${VOLUME}.tar.gz" -C /source .

  SIZE=$(du -sh "$BACKUP_DIR/\${VOLUME}.tar.gz" | cut -f1)
  echo "   ✓ $VOLUME ($SIZE)"
  BACKED_UP=$((BACKED_UP + 1))
done

TOTAL_SIZE=$(du -sh "$BACKUP_DIR" | cut -f1)
echo ""
echo "✅ Backed up $BACKED_UP volume(s) ($TOTAL_SIZE total)"
echo "   Location: $BACKUP_DIR"
`;

	// ── scripts/status.sh ───────────────────────────────────────────────────

	files["scripts/status.sh"] = `#!/usr/bin/env bash
set -euo pipefail

# ─── OpenClaw Status Script ─────────────────────────────────────────────────
# Shows the current status of all services.

SCRIPT_DIR="$(cd "$(dirname "\${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

echo "🐾 OpenClaw — Service Status"
echo ""

# Show compose status
docker compose ps

echo ""
echo "── Resource Usage ──────────────────────────────────────────────────────"
echo ""

# Show resource usage
docker compose top 2>/dev/null || true

echo ""
echo "── Disk Usage ─────────────────────────────────────────────────────────"
echo ""

# Show volume sizes
docker system df -v 2>/dev/null | head -30 || docker system df 2>/dev/null || true

echo ""
echo "── Network ────────────────────────────────────────────────────────────"
echo ""

docker network ls --filter "name=openclaw" --format "table {{.Name}}\\t{{.Driver}}\\t{{.Scope}}" 2>/dev/null || true
`;

	return files;
}
