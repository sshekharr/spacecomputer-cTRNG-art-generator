# 🌌 COSMIC ART — Step-by-Step Setup Guide

> Generative art powered by true cosmic randomness from satellites in orbit.

---

## Prerequisites

Before you begin, make sure you have:

| Tool | Version | Check | Install |
|------|---------|-------|---------|
| Node.js | 18+ | `node -v` | https://nodejs.org |
| npm | 9+ | `npm -v` | Comes with Node |
| Git | any | `git -v` | https://git-scm.com |
| Docker | any | `docker -v` | https://docs.docker.com/get-docker/ *(optional)* |

---

## Option A — Local Development (Fastest)

### Step 1 — Get the code

Unzip `cosmic-art.zip` and enter the directory:

```bash
unzip cosmic-art.zip
cd cosmic-art
```

### Step 2 — Run the one-click setup script

```bash
chmod +x setup.sh
./setup.sh
```

This will:
- Check Node.js version
- Create your `.env` file from `.env.example`
- Install all dependencies via `npm install`

### Step 3 — Configure environment (optional)

Open `.env` in any text editor:

```bash
# .env
ORBITPORT_CLIENT_ID=your_client_id_here
ORBITPORT_CLIENT_SECRET=your_client_secret_here
ORBITPORT_AUTH_URL=https://auth.spacecomputer.io
ORBITPORT_API_URL=https://op.spacecomputer.io
```

> **Don't have credentials?** Leave them blank. The app automatically falls back to the public IPFS beacon and local crypto — no sign-up needed to use the app.
>
> **Want real satellite entropy?** Get credentials at https://spacecomputer.io

### Step 4 — Start the dev server

```bash
npm run dev
```

### Step 5 — Open the app

Go to **http://localhost:3000** in your browser.

Click **✦ GENERATE COSMIC ART** and watch the universe create art for you.

---

## Option B — Docker (One Command)

### Step 1 — Unzip and enter directory

```bash
unzip cosmic-art.zip
cd cosmic-art
```

### Step 2 — Create your .env

```bash
cp .env.example .env
# Optionally edit .env with your Orbitport credentials
```

### Step 3 — Run the Docker deploy script

```bash
chmod +x deploy-docker.sh
./deploy-docker.sh
```

This runs `docker compose up --build` — Docker builds the image and starts the container.

### Step 4 — Open the app

**http://localhost:3000**

To stop: press `Ctrl+C` or run `docker compose down`

---

## Option C — Docker Production Mode

Build a standalone production image:

```bash
chmod +x deploy-docker.sh
./deploy-docker.sh prod
```

This runs:
1. `docker build -t cosmic-art:latest .` — multi-stage production build
2. `docker run -d --restart unless-stopped ...` — starts as a background service

Useful commands after deploying:

```bash
# View logs
docker logs -f cosmic-art

# Stop
docker stop cosmic-art

# Remove
docker rm -f cosmic-art

# Health check
curl http://localhost:3000/api/health
```

---

## Option D — Vercel (Cloud, Free Tier)

### Step 1 — Install Vercel CLI (if not installed)

```bash
npm install -g vercel
vercel login
```

### Step 2 — Run the Vercel deploy script

```bash
chmod +x deploy-vercel.sh
./deploy-vercel.sh
```

This will:
1. Check/install the Vercel CLI
2. Set your Orbitport env vars in Vercel (if found in `.env`)
3. Deploy to production with `vercel --prod`

### Step 3 — Set environment variables manually (if needed)

In the Vercel dashboard → your project → Settings → Environment Variables:

```
ORBITPORT_CLIENT_ID      = your_client_id
ORBITPORT_CLIENT_SECRET  = your_client_secret
ORBITPORT_AUTH_URL       = https://auth.spacecomputer.io
ORBITPORT_API_URL        = https://op.spacecomputer.io
```

---

## Option E — Manual Setup (No Scripts)

If you prefer to do everything yourself:

```bash
# 1. Unzip
unzip cosmic-art.zip && cd cosmic-art

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env
# Edit .env with your credentials (optional)

# 4. Development
npm run dev
# → http://localhost:3000

# 5. Production build
npm run build
npm start
# → http://localhost:3000
```

---

## Getting Orbitport Credentials

You don't need credentials — the app works without them using IPFS beacon fallback.

If you want true satellite cTRNG entropy:

1. Visit **https://spacecomputer.io**
2. Sign up and request API access
3. You'll receive `ORBITPORT_CLIENT_ID` and `ORBITPORT_CLIENT_SECRET`
4. Add them to your `.env` file

### How randomness priority works

```
1st choice → Orbitport SDK (satellite cTRNG via aptosorbital)
               ↓ fails (no credentials or network error)
2nd choice → Orbitport REST API (direct token + TRNG call)
               ↓ fails
3rd choice → IPFS Beacon (public, no auth, updated every ~60s)
               XOR'd with local entropy for uniqueness
               ↓ fails
4th choice → Node.js crypto.randomBytes (always works, always unique)
```

Every path produces a unique 64-character hex seed on every request.

---

## Troubleshooting

### App starts but art doesn't generate

Check the browser console (F12) and the terminal running `npm run dev` for errors.

### Same seed appearing repeatedly

Make sure you're on the latest version of the code — earlier versions had a caching bug that is now fixed with `export const dynamic = 'force-dynamic'` and `cache: 'no-store'` on all fetch calls.

### "Module not found" errors

```bash
rm -rf node_modules .next
npm install
npm run dev
```

### Docker build fails

Make sure Docker Desktop is running, then:
```bash
docker compose down
docker system prune -f
./deploy-docker.sh
```

### Port 3000 already in use

```bash
# Find what's using port 3000
lsof -i :3000

# Or use a different port
PORT=3001 npm run dev
```

For Docker:
```bash
# Edit docker-compose.yml: change "3000:3000" to "3001:3000"
docker compose up --build
```

### IPFS is slow

The IPFS beacon (`ipfs.io`) can sometimes take 10–20 seconds to respond. This is normal. If you have Orbitport credentials, the satellite API is much faster (~1–2s).

---

## Project Structure Reference

```
cosmic-art/
├── app/
│   ├── api/
│   │   ├── random/route.ts    ← Entropy API: SDK → API → IPFS → fallback
│   │   └── health/route.ts    ← Docker health check endpoint
│   ├── page.tsx               ← Main page UI
│   ├── layout.tsx             ← Fonts, metadata
│   └── globals.css            ← Glassmorphism, animations, star effects
│
├── components/
│   ├── ArtCanvas.tsx          ← Canvas + loading states
│   ├── Controls.tsx           ← Generate/Download/Share buttons + seed input
│   ├── MetadataCard.tsx       ← Glassmorphism entropy metadata display
│   └── StarField.tsx          ← Animated star + particle background
│
├── lib/
│   ├── artEngine.ts           ← 55 generative art styles
│   └── prng.ts                ← Deterministic xoshiro256 PRNG from cosmic seed
│
├── hooks/
│   └── useCosmicArt.ts        ← State management + URL seed sync
│
├── setup.sh                   ← One-click local dev setup
├── deploy-docker.sh           ← One-click Docker deploy (dev + prod)
├── deploy-vercel.sh           ← One-click Vercel deploy
├── Dockerfile                 ← Multi-stage production build
├── docker-compose.yml         ← Local Docker compose
├── vercel.json                ← Vercel configuration
└── .env.example               ← Environment variable template
```

---

## What to do after setup

- **Generate art** — click the Generate button. Every click fetches fresh cosmic entropy and renders a new piece.
- **Share** — click Share to copy a URL with the seed embedded. Anyone with the link sees the exact same art.
- **Custom seed** — click "USE CUSTOM SEED" and paste any 64-char hex string to reproduce a specific artwork.
- **Download** — click PNG to save a 1024×1024 image.
- **Export metadata** — the metadata card has an "Export Metadata JSON" button that saves source, timestamp, seed, palette, and style.

---

*Questions? Check the README.md or open an issue.*
