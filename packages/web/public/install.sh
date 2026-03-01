#!/bin/bash
# better-openclaw one-liner installer
# Usage: curl -fsSL https://better-openclaw.com/install.sh | bash -s -- --preset researcher
#
# Options:
#   --preset <name>   Use a preset (minimal, creator, researcher, devops, full, coding-team, ai-playground, la-suite-meet, content-creator)
#   --services <ids>  Comma-separated service IDs to install
#   --dir <path>      Output directory (default: my-openclaw-stack)
#   --up              Auto-run docker compose up -d after generation
#   --proxy <type>    Reverse proxy: none, caddy, traefik (default: none)
#   --domain <fqdn>   Domain for reverse proxy SSL
#   --dry-run         Preview without writing files
#   --help            Show this help message

set -euo pipefail

# ── Colors ─────────────────────────────────────────────────────────────────────
BOLD='\033[1m'
GREEN='\033[38;2;0;229;204m'
RED='\033[38;2;230;57;70m'
YELLOW='\033[38;2;255;176;32m'
MUTED='\033[38;2;90;100;128m'
ACCENT='\033[38;2;255;77;77m'
NC='\033[0m'

ui_success() { echo -e "${GREEN}✓${NC} $*"; }
ui_error()   { echo -e "${RED}✗${NC} $*" >&2; }
ui_warn()    { echo -e "${YELLOW}!${NC} $*"; }
ui_info()    { echo -e "${MUTED}·${NC} $*"; }

# ── Defaults ───────────────────────────────────────────────────────────────────
PRESET=""
SERVICES=""
DIR="my-openclaw-stack"
AUTO_UP=false
PROXY=""
DOMAIN=""
DRY_RUN=false
MIN_NODE_VERSION=18

# ── Parse arguments ────────────────────────────────────────────────────────────
while [[ $# -gt 0 ]]; do
  case "$1" in
    --preset)   PRESET="$2";   shift 2 ;;
    --services) SERVICES="$2"; shift 2 ;;
    --dir)      DIR="$2";      shift 2 ;;
    --up)       AUTO_UP=true;  shift   ;;
    --proxy)    PROXY="$2";    shift 2 ;;
    --domain)   DOMAIN="$2";   shift 2 ;;
    --dry-run)  DRY_RUN=true;  shift   ;;
    --help|-h)
      echo "better-openclaw installer"
      echo ""
      echo "Usage: curl -fsSL https://better-openclaw.com/install.sh | bash -s -- [OPTIONS]"
      echo ""
      echo "Options:"
      echo "  --preset <name>    Use a preset stack template"
      echo "  --services <ids>   Comma-separated service IDs (e.g. postgresql,redis,n8n)"
      echo "  --dir <path>       Output directory (default: my-openclaw-stack)"
      echo "  --up               Auto-run docker compose up -d after generation"
      echo "  --proxy <type>     Reverse proxy: none, caddy, traefik"
      echo "  --domain <fqdn>    Domain for reverse proxy auto-SSL"
      echo "  --dry-run          Preview without writing files"
      echo ""
      echo "Presets: minimal, creator, researcher, devops, full, coding-team,"
      echo "         ai-playground, la-suite-meet, content-creator"
      echo ""
      echo "Examples:"
      echo "  curl -fsSL https://better-openclaw.com/install.sh | bash"
      echo "  curl -fsSL https://better-openclaw.com/install.sh | bash -s -- --preset researcher --up"
      echo "  curl -fsSL https://better-openclaw.com/install.sh | bash -s -- --services postgresql,redis,n8n --proxy caddy --domain example.com"
      exit 0
      ;;
    *)
      ui_error "Unknown option: $1"
      echo "Run with --help for usage info."
      exit 1
      ;;
  esac
done

# ── Banner ─────────────────────────────────────────────────────────────────────
echo ""
echo -e "${ACCENT}${BOLD}  better-openclaw installer${NC}"
echo -e "${MUTED}  Build your OpenClaw superstack in seconds.${NC}"
echo ""

# ── Validate arguments ─────────────────────────────────────────────────────────
if [[ -z "$PRESET" && -z "$SERVICES" ]]; then
  PRESET="minimal"
  ui_info "No --preset or --services specified, defaulting to: minimal"
fi

# ── System checks ──────────────────────────────────────────────────────────────
echo -e "${ACCENT}${BOLD}[1/3] Checking prerequisites${NC}"
echo ""

# Check Node.js
check_node() {
  if ! command -v node &> /dev/null; then
    return 1
  fi
  local version major
  version="$(node -v 2>/dev/null || true)"
  major="${version#v}"
  major="${major%%.*}"
  if [[ "$major" =~ ^[0-9]+$ ]] && [[ "$major" -ge "$MIN_NODE_VERSION" ]]; then
    return 0
  fi
  return 1
}

if check_node; then
  ui_success "Node.js $(node -v) found"
else
  ui_error "Node.js v${MIN_NODE_VERSION}+ is required but not found."
  echo ""
  echo "  Install options:"
  if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "    brew install node@22"
  elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "    curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -"
    echo "    sudo apt-get install -y nodejs"
  fi
  echo "    # Or use fnm/nvm:"
  echo "    curl -fsSL https://fnm.vercel.app/install | bash && fnm install 22"
  echo ""
  exit 1
fi

# Check npx
if ! command -v npx &> /dev/null; then
  ui_error "npx is not available (comes with Node.js)."
  echo "  Reinstall Node.js v${MIN_NODE_VERSION}+ and try again."
  exit 1
fi
ui_success "npx available"

# Check Docker (warn but don't fail — user may generate only)
if command -v docker &> /dev/null; then
  if docker compose version &> /dev/null; then
    ui_success "Docker with Compose v2 found"
  else
    ui_warn "Docker found but Compose v2 plugin is missing"
    echo "  Install: https://docs.docker.com/compose/install/"
  fi
else
  ui_warn "Docker is not installed — you'll need it to run the stack"
  echo "  Install: https://docs.docker.com/get-docker/"
fi

# Check disk space (warn if < 5GB free)
if command -v df &> /dev/null; then
  FREE_KB=$(df -k . 2>/dev/null | awk 'NR==2 {print $4}' || echo "0")
  if [[ "$FREE_KB" =~ ^[0-9]+$ ]] && [[ "$FREE_KB" -lt 5242880 ]]; then
    FREE_GB=$((FREE_KB / 1048576))
    ui_warn "Low disk space: ~${FREE_GB}GB free (5GB+ recommended for Docker images)"
  fi
fi

echo ""

# ── Generate ───────────────────────────────────────────────────────────────────
echo -e "${ACCENT}${BOLD}[2/3] Generating stack${NC}"
echo ""

# Build npx command
NPX_ARGS=("create-better-openclaw@latest" "generate" "$DIR" "--yes")

if [[ -n "$PRESET" ]]; then
  NPX_ARGS+=("--preset" "$PRESET")
  ui_info "Preset: $PRESET"
fi

if [[ -n "$SERVICES" ]]; then
  NPX_ARGS+=("--services" "$SERVICES")
  ui_info "Services: $SERVICES"
fi

if [[ -n "$PROXY" ]]; then
  NPX_ARGS+=("--proxy" "$PROXY")
  ui_info "Proxy: $PROXY"
fi

if [[ -n "$DOMAIN" ]]; then
  NPX_ARGS+=("--domain" "$DOMAIN")
  ui_info "Domain: $DOMAIN"
fi

if [[ "$DRY_RUN" == true ]]; then
  NPX_ARGS+=("--dry-run")
  ui_info "Mode: dry-run"
fi

echo ""

# Run the generator
if ! npx "${NPX_ARGS[@]}"; then
  ui_error "Stack generation failed"
  echo ""
  echo "  Troubleshooting:"
  echo "    1. Check your Node.js version: node -v (need v${MIN_NODE_VERSION}+)"
  echo "    2. Try clearing npm cache: npm cache clean --force"
  echo "    3. Run with verbose output: npx --verbose ${NPX_ARGS[*]}"
  exit 1
fi

echo ""
ui_success "Stack generated in ./$DIR"

# ── Post-generation ────────────────────────────────────────────────────────────
echo ""
echo -e "${ACCENT}${BOLD}[3/3] Next steps${NC}"
echo ""

if [[ "$DRY_RUN" == true ]]; then
  ui_info "Dry run — no files written. Re-run without --dry-run to generate."
  exit 0
fi

if [[ "$AUTO_UP" == true ]]; then
  if command -v docker &> /dev/null && docker compose version &> /dev/null; then
    ui_info "Starting stack..."
    cd "$DIR"
    docker compose up -d

    echo ""
    ui_success "Stack is running!"
    echo ""
    echo "  Gateway: http://localhost:18789"
    echo ""
    echo "  Useful commands:"
    echo "    cd $DIR"
    echo "    docker compose logs -f         # Follow all logs"
    echo "    docker compose ps              # Service status"
    echo "    docker compose restart          # Restart all services"
    echo ""
    echo "  Channel setup (optional):"
    echo "    docker compose run --rm openclaw-cli channels login          # WhatsApp QR"
    echo "    docker compose run --rm openclaw-cli channels add --channel telegram --token <TOKEN>"
  else
    ui_warn "Skipping 'docker compose up' — Docker Compose v2 not available"
    echo ""
    echo "  After installing Docker:"
    echo "    cd $DIR && docker compose up -d"
  fi
else
  echo "  cd $DIR"
  echo "  docker compose up -d"
  echo ""
  echo "  Then access OpenClaw gateway at http://localhost:18789"
  echo ""
  echo "  Manage your stack:"
  echo "    docker compose logs -f           # Follow all logs"
  echo "    docker compose ps                # Service status"
  echo "    better-openclaw status           # Pretty status table"
fi

echo ""
