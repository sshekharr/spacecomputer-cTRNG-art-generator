#!/usr/bin/env bash
set -e

# ══════════════════════════════════════════════════════
#  COSMIC ART — One-Click Local Dev Setup
# ══════════════════════════════════════════════════════

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${CYAN}"
echo "  ✦ COSMIC ART — Setup"
echo "  Powered by SpaceComputer Orbitport cTRNG"
echo -e "${NC}"

# ── Check Node.js ────────────────────────────────────
if ! command -v node &> /dev/null; then
  echo -e "${RED}✗ Node.js not found. Install Node.js 18+ from https://nodejs.org${NC}"
  exit 1
fi
NODE_VER=$(node -v | sed 's/v//' | cut -d. -f1)
if [ "$NODE_VER" -lt 18 ]; then
  echo -e "${RED}✗ Node.js 18+ required. Current: $(node -v)${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Node.js $(node -v)${NC}"

# ── Check npm ────────────────────────────────────────
if ! command -v npm &> /dev/null; then
  echo -e "${RED}✗ npm not found${NC}"; exit 1
fi
echo -e "${GREEN}✓ npm $(npm -v)${NC}"

# ── Create .env if not present ───────────────────────
if [ ! -f .env ]; then
  echo -e "${YELLOW}→ Creating .env from .env.example${NC}"
  cp .env.example .env
  echo -e "${YELLOW}  Edit .env to add your Orbitport credentials (optional — IPFS fallback works without them)${NC}"
fi

# ── Install dependencies ─────────────────────────────
echo -e "\n${CYAN}→ Installing dependencies...${NC}"
npm install

# ── Done ─────────────────────────────────────────────
echo -e "\n${GREEN}══════════════════════════════════════════"
echo "  ✦ Setup complete!"
echo ""
echo "  Start dev server:  npm run dev"
echo "  Open:              http://localhost:3000"
echo ""
echo "  Production build:  npm run build && npm start"
echo -e "══════════════════════════════════════════${NC}"
