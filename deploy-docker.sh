#!/usr/bin/env bash
set -e

# ══════════════════════════════════════════════════════
#  COSMIC ART — One-Click Docker Deploy
# ══════════════════════════════════════════════════════

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

MODE="${1:-dev}"   # dev | prod

echo -e "${CYAN}"
echo "  ✦ COSMIC ART — Docker Deploy"
echo "  Mode: ${MODE}"
echo -e "${NC}"

# ── Check Docker ─────────────────────────────────────
if ! command -v docker &> /dev/null; then
  echo -e "${RED}✗ Docker not found. Install from https://docs.docker.com/get-docker/${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Docker $(docker --version | awk '{print $3}' | tr -d ',')${NC}"

# ── Create .env if not present ───────────────────────
if [ ! -f .env ]; then
  echo -e "${YELLOW}→ Creating .env from .env.example${NC}"
  cp .env.example .env
  echo -e "${YELLOW}  Edit .env to add Orbitport credentials (optional)${NC}"
fi

if [ "$MODE" = "prod" ]; then
  # ── Production: standalone image ──────────────────
  echo -e "\n${CYAN}→ Building production Docker image...${NC}"
  docker build -t cosmic-art:latest .

  echo -e "\n${CYAN}→ Stopping any existing container...${NC}"
  docker rm -f cosmic-art 2>/dev/null || true

  echo -e "\n${CYAN}→ Starting production container...${NC}"
  docker run -d \
    --name cosmic-art \
    --restart unless-stopped \
    --env-file .env \
    -p 3000:3000 \
    cosmic-art:latest

  echo -e "\n${GREEN}══════════════════════════════════════════"
  echo "  ✦ Production deploy complete!"
  echo ""
  echo "  App:     http://localhost:3000"
  echo "  Health:  http://localhost:3000/api/health"
  echo ""
  echo "  Logs:    docker logs -f cosmic-art"
  echo "  Stop:    docker stop cosmic-art"
  echo -e "══════════════════════════════════════════${NC}"

else
  # ── Development: docker compose ───────────────────
  echo -e "\n${CYAN}→ Starting with docker compose (dev)...${NC}"

  # Stop any existing
  docker compose down 2>/dev/null || true

  echo -e "${CYAN}→ Building and starting...${NC}"
  docker compose up --build

fi
