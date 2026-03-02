#!/usr/bin/env bash
set -e

# ══════════════════════════════════════════════════════
#  COSMIC ART — One-Click Vercel Deploy
# ══════════════════════════════════════════════════════

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${CYAN}"
echo "  ✦ COSMIC ART — Vercel Deploy"
echo -e "${NC}"

# ── Check Vercel CLI ─────────────────────────────────
if ! command -v vercel &> /dev/null; then
  echo -e "${YELLOW}→ Vercel CLI not found. Installing...${NC}"
  npm install -g vercel
fi
echo -e "${GREEN}✓ Vercel CLI $(vercel --version 2>/dev/null | head -1)${NC}"

# ── Check .env ───────────────────────────────────────
if [ ! -f .env ]; then
  cp .env.example .env
  echo -e "${YELLOW}→ Created .env — add your Orbitport credentials before deploying if you have them${NC}"
fi

# ── Set Vercel environment variables if credentials exist ──
if [ -f .env ]; then
  source .env 2>/dev/null || true
  if [ -n "$ORBITPORT_CLIENT_ID" ]; then
    echo -e "${CYAN}→ Setting Orbitport env vars in Vercel...${NC}"
    echo "$ORBITPORT_CLIENT_ID" | vercel env add ORBITPORT_CLIENT_ID production 2>/dev/null || true
    echo "$ORBITPORT_CLIENT_SECRET" | vercel env add ORBITPORT_CLIENT_SECRET production 2>/dev/null || true
    echo "$ORBITPORT_AUTH_URL" | vercel env add ORBITPORT_AUTH_URL production 2>/dev/null || true
    echo "$ORBITPORT_API_URL" | vercel env add ORBITPORT_API_URL production 2>/dev/null || true
    echo -e "${GREEN}✓ Environment variables set${NC}"
  else
    echo -e "${YELLOW}  No Orbitport credentials found — app will use IPFS/fallback mode${NC}"
  fi
fi

# ── Deploy ───────────────────────────────────────────
echo -e "\n${CYAN}→ Deploying to Vercel...${NC}"
vercel --prod

echo -e "\n${GREEN}══════════════════════════════════════════"
echo "  ✦ Vercel deploy complete!"
echo ""
echo "  Your app is live on Vercel."
echo "  Check the URL above ↑"
echo ""
echo "  To set credentials later:"
echo "  vercel env add ORBITPORT_CLIENT_ID"
echo -e "══════════════════════════════════════════${NC}"
