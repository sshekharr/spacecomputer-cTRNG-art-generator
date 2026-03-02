# 🌌 COSMIC ART

**True random generative art powered by cosmic radiation harvested from satellites in orbit.**

Built with [SpaceComputer Orbitport](https://spacecomputer.io) cTRNG — the universe's own random number generator.

---

## ✦ Overview

Cosmic Art generates unique, deterministic visual art from cosmic true random numbers (cTRNG). Every piece is seeded with entropy harvested from hardware on satellites in Earth's orbit, ensuring each artwork is genuinely unique — not just pseudo-random.

---

## Architecture

```
Browser (Next.js)
  ↓
/api/random (Next.js API Route)
  ↓ tries in order:
  1. Orbitport SDK (satellite cTRNG)
  2. Orbitport API (direct REST)
  3. IPFS Beacon (public, no auth needed)
  4. Node.js crypto.randomBytes (offline fallback)
  ↓
returns: { seed, source, timestamp, provider?, sequence?, usedFallback }
  ↓
Art Engine (client-side Canvas)
  ↓ CosmicPRNG (xoshiro128-inspired from seed)
  ↓ picks one of 7 art styles
  ↓ renders 1024×1024 canvas
  ↓
Display + Download
```

---

## How Randomness Works

1. The server calls Orbitport's cTRNG endpoint
2. Returns 32 bytes (64 hex chars) of true random data from satellite instrumentation
3. This hex string becomes the **seed** for a deterministic PRNG
4. The PRNG drives all art decisions: style, colors, shapes, positions, parameters
5. Same seed → same art (shareable & reproducible)
6. Different seed → completely different art

---

## Orbitport Integration

### SDK (Preferred)
```typescript
import { OrbitportSDK } from '@spacecomputer-io/orbitport-sdk-ts';

const sdk = new OrbitportSDK({ config: { clientId, clientSecret } });
const result = await sdk.ctrng.random();
// result.data.data = 64-char hex entropy
```

### Direct API
```
POST https://auth.spacecomputer.io/oauth/token
  → access_token

GET https://op.spacecomputer.io/api/v1/services/trng
  Authorization: Bearer {token}
  → { data: "hex...", src: "aptosorbital" }
```

### IPFS Beacon (No Auth)
```
GET https://ipfs.io/ipns/k2k4r8lvomw737sajfnpav0dpeernugnryng50uheyk1k39lursmn09f
  → { data: { sequence, timestamp, ctrng: ["hex...", ...] } }
```

---

## Fallback Chain

| Priority | Source | Auth Required | Notes |
|----------|--------|---------------|-------|
| 1st | Orbitport SDK | Yes (optional) | Satellite cTRNG, auto-fallback |
| 2nd | Orbitport API | Yes | Direct REST call |
| 3rd | IPFS Beacon | No | Updated every 60s |
| 4th | Node crypto | No | Local CSPRNG, offline |

---

## Art Engine

Seven distinct generative styles, each fully deterministic from seed:

| Style | Description | Technique |
|-------|-------------|-----------|
| **Nebula** | Deep space gas clouds | Radial gradients, star fields |
| **Crystalline** | Crystal lattice structures | Voronoi diagrams |
| **Flow Field** | Particle streams | Perlin-like noise |
| **Mandala** | Sacred geometry | Radial symmetry, petal math |
| **Constellation** | Star maps | Graph edges, proximity |
| **Aurora** | Northern lights | Sine wave curtains |
| **Fractal** | Julia sets | Escape time algorithm |

---

## Deterministic PRNG

The `CosmicPRNG` class uses an xoshiro128-inspired 256-bit algorithm:

```typescript
// Initialize from 32-byte hex seed
const rng = new CosmicPRNG(seed);

// Use deterministically
const color = rng.hsl();           // random HSL color
const x = rng.range(0, width);    // float in range
const n = rng.int(0, 10);         // integer in range
const item = rng.pick(array);     // random array element
```

The same seed **always** produces the same sequence of values, making artworks reproducible and shareable via URL.

---

## Local Development

```bash
# 1. Clone / copy the project
cd cosmic-art

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env - credentials optional (IPFS fallback works without them)

# 4. Run dev server
npm run dev
# → http://localhost:3000
```

---

## Docker Deployment

### One-Command Local Deploy
```bash
cp .env.example .env
docker compose up --build
# → http://localhost:3000
```

### Production Build
```bash
docker build -t cosmic-art .
docker run -p 3000:3000 --env-file .env cosmic-art
```

### With Custom Port
```bash
docker run -p 8080:3000 --env-file .env cosmic-art
# → http://localhost:8080
```

---

## Production Deployment

### Environment Variables
```bash
ORBITPORT_CLIENT_ID=your_client_id       # Optional
ORBITPORT_CLIENT_SECRET=your_client_secret # Optional
ORBITPORT_AUTH_URL=https://auth.spacecomputer.io
ORBITPORT_API_URL=https://op.spacecomputer.io
```

### Health Check
```
GET /api/health
→ { status: "ok", service: "cosmic-art", timestamp: 1234567890, version: "1.0.0" }
```

### Reverse Proxy (Nginx)
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## Customization Guide

### Add a New Art Style

1. Add style name to `ArtStyle` type in `lib/artEngine.ts`
2. Implement `drawYourStyle(ctx, rng, palette, w, h)` function
3. Add case in `generateArt` switch statement
4. Add description in `app/page.tsx` `STYLE_DESCRIPTIONS`

### Modify Color Palettes

Edit the `generatePalette()` function in `lib/artEngine.ts`. Add new schemes:
```typescript
// Your custom palette scheme
() => [
  `hsl(210, 80%, 10%)`,
  `hsl(220, 70%, 30%)`,
  // ...6 colors
],
```

### Change Canvas Resolution

Default is 1024×1024. Change in `hooks/useCosmicArt.ts`:
```typescript
const config = generateArt(canvasRef.current, randomData.seed, 2048); // 2K
```

---

## Performance Considerations

- **Fractal style** is CPU-intensive (pixel-by-pixel computation). On slower devices it may take 1–2 seconds for 1024×1024
- All art generation runs client-side, keeping server load minimal
- The PRNG is extremely fast (~100M ops/sec) and adds negligible overhead
- IPFS fetches may be slow (up to 15s timeout); consider caching in production
- For production with high traffic, consider adding Redis caching for API tokens

---

## Features

- ✦ 7 distinct generative art styles
- ✦ True cosmic entropy from satellite hardware
- ✦ Graceful 4-tier fallback chain
- ✦ Shareable URLs with embedded seed
- ✦ Custom seed input for reproducibility
- ✦ PNG download
- ✦ Metadata JSON export
- ✦ Animated dark space UI with glassmorphism
- ✦ Responsive (mobile-first)
- ✦ Docker one-command deployment
- ✦ Health check endpoint

---

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS, Framer Motion
- **Art Engine**: Canvas API, custom xoshiro PRNG
- **Entropy**: `@spacecomputer-io/orbitport-sdk-ts`, Orbitport REST API, IPFS beacon, Node.js crypto
- **Deploy**: Docker (multi-stage), docker-compose

---

*Every piece of art generated by this application contains a fragment of the cosmos — harvested from cosmic radiation detected by satellites orbiting Earth.*
