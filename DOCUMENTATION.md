# 🌌 COSMIC ART — Complete Technical Documentation

> **In-depth guide to every file, every system, and how cosmic radiation from satellites becomes a 1024×1024 piece of art.**

---

## Table of Contents

1. [The Big Picture — How It All Works](#1-the-big-picture)
2. [Project Structure](#2-project-structure)
3. [The Journey of a Single Click](#3-the-journey-of-a-single-click)
4. [File-by-File Deep Dive](#4-file-by-file-deep-dive)
   - [app/api/random/route.ts — The Entropy Engine](#41-appapirandomroute-ts)
   - [lib/prng.ts — The Dice Machine](#42-libprngts)
   - [lib/artEngine.ts — The Painter](#43-libartengine-ts)
   - [hooks/useCosmicArt.ts — The Brain](#44-hooksusecosmicartts)
   - [app/page.tsx — The Screen](#45-appapagetsx)
   - [components/ArtCanvas.tsx — The Canvas](#46-componentsartcanvastsx)
   - [components/Controls.tsx — The Buttons](#47-componentscontrolstsx)
   - [components/MetadataCard.tsx — The Info Panel](#48-componentsmetadatacardtsx)
   - [components/StarField.tsx — The Background](#49-componentsstarfieldtsx)
   - [app/layout.tsx — The Shell](#410-applayouttsx)
   - [app/globals.css — The Styles](#411-appglobalscss)
   - [tailwind.config.ts — The Design System](#412-tailwindconfigts)
5. [The 4-Tier Entropy Fallback System](#5-the-4-tier-entropy-fallback-system)
6. [The PRNG — How Math Turns Chaos Into Order](#6-the-prng)
7. [The Art Engine — All 55 Styles Explained](#7-the-art-engine)
8. [Palette Generation](#8-palette-generation)
9. [Why Art Is Deterministic (Reproducible)](#9-why-art-is-deterministic)
10. [Configuration Files](#10-configuration-files)
11. [Deployment Files](#11-deployment-files)
12. [Data Flow Diagram](#12-data-flow-diagram)
13. [Glossary](#13-glossary)

---

## 1. The Big Picture

Here is the entire system in one sentence:

> **A satellite in orbit detects cosmic radiation → that becomes a 64-character number → the number is fed into a mathematical dice machine → the dice machine rolls hundreds of times → each roll decides one visual detail → the computer draws all those details onto a canvas → you see art.**

The app has four major systems that work together:

| System | File | Job |
|--------|------|-----|
| **Entropy Engine** | `app/api/random/route.ts` | Fetches the cosmic random number |
| **PRNG** | `lib/prng.ts` | Turns that number into an infinite stream of dice rolls |
| **Art Engine** | `lib/artEngine.ts` | Uses the dice rolls to draw 55 different art styles |
| **UI** | Everything in `app/`, `components/`, `hooks/` | Shows the art to the user |

---

## 2. Project Structure

```
cosmic-art/
│
├── app/                          ← Next.js App Router (pages & API)
│   ├── api/
│   │   ├── random/
│   │   │   └── route.ts          ← API endpoint: fetches cosmic seed
│   │   └── health/
│   │       └── route.ts          ← API endpoint: health check for Docker
│   ├── layout.tsx                ← HTML shell, fonts, metadata
│   ├── page.tsx                  ← Main page UI
│   └── globals.css               ← Global styles, animations, glassmorphism
│
├── components/                   ← Reusable UI pieces
│   ├── ArtCanvas.tsx             ← The 1024×1024 canvas + loading states
│   ├── Controls.tsx              ← Generate/Download/Share buttons
│   ├── MetadataCard.tsx          ← Info panel showing seed, source, palette
│   └── StarField.tsx             ← Animated star background
│
├── hooks/
│   └── useCosmicArt.ts           ← Central state manager for the whole app
│
├── lib/
│   ├── prng.ts                   ← Deterministic random number generator
│   └── artEngine.ts              ← All 55 art style drawing algorithms
│
├── public/
│   └── fonts/
│       └── SpaceFuture-Bold.ttf  ← Custom display font
│
├── Dockerfile                    ← Multi-stage Docker build
├── docker-compose.yml            ← Local Docker setup
├── vercel.json                   ← Vercel deployment config
├── setup.sh                      ← One-click local dev setup
├── deploy-docker.sh              ← One-click Docker deploy
├── deploy-vercel.sh              ← One-click Vercel deploy
├── next.config.js                ← Next.js configuration
├── tailwind.config.ts            ← Design system & custom colors
├── tsconfig.json                 ← TypeScript compiler settings
├── package.json                  ← Dependencies & scripts
├── .env.example                  ← Environment variable template
└── .gitignore                    ← Files excluded from git
```

---

## 3. The Journey of a Single Click

When you click **✦ GENERATE COSMIC ART**, here is exactly what happens step by step:

### Step 1 — Button Click (`components/Controls.tsx`)
The button calls `onGenerate()` which is wired to the `generate()` function in `useCosmicArt.ts`.

### Step 2 — State Update (`hooks/useCosmicArt.ts`)
The hook sets `isLoading: true`, which immediately triggers the loading animation in `ArtCanvas.tsx` (the spinning orbital rings appear).

### Step 3 — API Call (`hooks/useCosmicArt.ts`)
The hook calls `fetch('/api/random')` — a GET request to the Next.js API route running on the same server.

### Step 4 — Entropy Fetch (`app/api/random/route.ts`)
The API route tries four sources in order:
1. **Orbitport SDK** (satellite cTRNG — real cosmic radiation)
2. **Orbitport REST API** (direct HTTP call to satellite API)
3. **IPFS Beacon** (public satellite data, XOR'd with local entropy)
4. **Local crypto** (`crypto.randomBytes(32)` — computer random)

One of these returns a **64-character hex string** like:
```
0a4c2ea21557418bbc1d57120142ad83e8fa6e030ad35125fe225b97929d2526
```

### Step 5 — API Response
The route returns JSON:
```json
{
  "seed": "0a4c2ea21557418bbc1d57120142ad83...",
  "source": "aptosorbital",
  "timestamp": 1709481234567,
  "provider": "orbitport-sdk",
  "usedFallback": false
}
```

### Step 6 — Art Generation (`hooks/useCosmicArt.ts` → `lib/artEngine.ts`)
The hook calls `generateArt(canvas, seed)`. This is the most important step — the seed goes into the art engine.

### Step 7 — PRNG Seeding (`lib/prng.ts`)
Inside `generateArt`, the seed string is split into 4 chunks and loaded into the `CosmicPRNG` class as 64-bit numbers. The dice machine is now ready.

### Step 8 — Style & Palette Selection (`lib/artEngine.ts`)
`rng.pick(ART_STYLES)` picks one of 55 styles. Then `generatePalette(rng)` picks 6 colours. Both decisions are determined by the seed.

### Step 9 — Drawing (`lib/artEngine.ts`)
The selected drawing function runs. It calls `rng.range()`, `rng.int()`, `rng.chance()` hundreds or thousands of times. Every call returns the next number in the deterministic sequence. These numbers become pixel coordinates, colours, sizes, angles, and counts.

The drawing functions call the browser's **Canvas 2D API** — functions like `ctx.arc()`, `ctx.bezierCurveTo()`, `ctx.fillRect()` — to paint directly onto the `<canvas>` element.

### Step 10 — State Update & Display (`hooks/useCosmicArt.ts`)
The hook receives the completed `ArtConfig` (style name + palette), updates state with all the metadata, sets `isLoading: false` and `generated: true`.

### Step 11 — Canvas Fades In (`components/ArtCanvas.tsx`)
The canvas opacity transitions from 0 to 1 over 0.6 seconds. The loading animation disappears. The art is visible.

### Step 12 — URL Update (`hooks/useCosmicArt.ts`)
`window.history.replaceState()` adds `?seed=0a4c2ea2...` to the URL. Anyone who opens this URL will see the exact same art because the same seed produces the same sequence of dice rolls.

---

## 4. File-by-File Deep Dive

### 4.1 `app/api/random/route.ts`

**What it is:** A Next.js API route that runs on the server (not in the browser). It is the only file that communicates with the outside world — satellites, IPFS, and the Orbitport API.

**Why it's server-side:** API credentials (client ID and secret) must never be exposed to the browser. By running on the server, the credentials stay hidden.

**Key exports:**
```typescript
export const dynamic = 'force-dynamic'; // Never cache this response
export const revalidate = 0;            // Always run fresh
export async function GET() { ... }     // The handler
```

**The `dynamic = 'force-dynamic'` line is critical.** Without it, Next.js would cache the first response and return the same seed to every user forever. This was a major bug that was fixed by adding this line.

---

#### Helper: `xorHex(a, b)`

XOR means "exclusive or" — a bitwise operation. If two bits are the same, the result is 0. If they're different, the result is 1.

```
Byte from satellite:  0a  (= 00001010 in binary)
Byte from computer:   f3  (= 11110011 in binary)
XOR result:           f9  (= 11111001 in binary)
```

**Why XOR?** To mix two sources of randomness together. If the satellite sends the same number twice (IPFS only updates every 60 seconds), XORing it with fresh computer randomness guarantees a different result every time.

---

#### Helper: `addLocalEntropy(cosmicHex)`

Takes the cosmic hex string and XORs it with 32 fresh random bytes from `crypto.randomBytes()`. This is the "insurance policy" — even if the upstream source is stale, the result is always unique.

---

#### Source 1: `fetchFromOrbitportSDK()`

Uses the official `@spacecomputer-io/orbitport-sdk-ts` npm package. The SDK handles OAuth authentication automatically.

**Important:** A new SDK instance is created on every request. Module-level singletons were caching the same IPFS result — creating a fresh instance forces a real network call every time.

```typescript
const sdk = new OrbitportSDK({ config: { clientId, clientSecret, ... } });
const result = await sdk.ctrng.random({ src: 'trng' } as any);
```

The `as any` cast is needed because the SDK's TypeScript types don't include all valid source values. This is safe — the SDK still works correctly.

---

#### Source 2: `fetchFromOrbitportAPI()`

Does the same thing as the SDK but manually:
1. POST to `https://auth.spacecomputer.io/oauth/token` with client credentials → get a JWT access token
2. GET `https://op.spacecomputer.io/api/v1/services/trng` with `Authorization: Bearer <token>` → get the random number

All fetch calls include `cache: 'no-store'` to prevent Next.js or the browser from caching the HTTP response.

---

#### Source 3: `fetchFromIPFS()`

IPFS (InterPlanetary File System) is a decentralised network. SpaceComputer publishes satellite cTRNG data to a public IPFS address that anyone can read without credentials.

**Problem:** IPFS only updates every ~60 seconds. If you click Generate twice within one minute, you'd get the same hex string.

**Solution:** XOR the IPFS data with local entropy via `addLocalEntropy()`. The cosmic component is the same, but the local component is fresh — so the combined result is always unique.

---

#### Source 4: Local crypto fallback

```typescript
const fallbackSeed = crypto.randomBytes(32).toString('hex');
```

Node.js's built-in `crypto` module generates cryptographically secure random bytes using the operating system's random number generator. Not from space, but mathematically indistinguishable from random.

---

### 4.2 `lib/prng.ts`

**What it is:** A deterministic pseudo-random number generator (PRNG). It takes a seed and produces an infinite stream of numbers. Same seed → always same stream.

**Algorithm:** Based on **xoshiro256\*\*** — a well-studied algorithm designed by researchers Sebastiano Vigna and David Blackman. It has excellent statistical properties (passes all standard randomness tests) and is fast.

---

#### Constructor

```typescript
constructor(seed: string) {
  const padded = seed.padEnd(64, '0').slice(0, 64);
  this.s0 = BigInt('0x' + padded.slice(0, 16));  // chars 0-15
  this.s1 = BigInt('0x' + padded.slice(16, 32)); // chars 16-31
  this.s2 = BigInt('0x' + padded.slice(32, 48)); // chars 32-47
  this.s3 = BigInt('0x' + padded.slice(48, 64)); // chars 48-63
  for (let i = 0; i < 20; i++) this.next(); // warm up
}
```

The 64-character hex seed is split into four 16-character chunks. Each becomes a 64-bit integer (a `BigInt`). Together these four numbers are the "state" of the dice machine.

The 20 warm-up calls discard the first 20 outputs — this is standard practice to ensure the state is well-mixed before any outputs are used.

---

#### `rotl(x, k)` — Rotate Left

```typescript
private rotl(x: bigint, k: bigint): bigint {
  const mask = BigInt('0xFFFFFFFFFFFFFFFF'); // 64-bit mask
  return ((x << k) | (x >> (64n - k))) & mask;
}
```

Takes a 64-bit number and rotates its bits to the left by `k` positions. Bits that fall off the left end wrap around to the right. This is a core primitive in modern hash and PRNG functions because it mixes bits very effectively.

---

#### `next()` — The Core Step

```typescript
next(): bigint {
  const mask = BigInt('0xFFFFFFFFFFFFFFFF');
  const result = (this.rotl(this.s1 * 5n, 7n) * 9n) & mask;

  const t = (this.s1 << 17n) & mask;
  this.s2 ^= this.s0;
  this.s3 ^= this.s1;
  this.s1 ^= this.s2;
  this.s0 ^= this.s3;
  this.s2 ^= t;
  this.s3 = this.rotl(this.s3, 45n);

  return result;
}
```

Each call:
1. Computes one output value from the current state
2. Updates all four state values using XOR and rotation
3. Returns the output

The state update ensures the next call produces a completely different output. A sequence of calls is statistically indistinguishable from true randomness.

---

#### Public Methods

| Method | Returns | What it does |
|--------|---------|--------------|
| `float()` | `0.0 – 0.999...` | Divides a 53-bit output by 2⁵³ to get a float |
| `int(min, max)` | Integer in `[min, max)` | Scales float to an integer range |
| `range(min, max)` | Float in `[min, max)` | Scales float to a decimal range |
| `pick(array)` | One element | Picks a random item from an array |
| `chance(p)` | `true` or `false` | True with probability `p` (e.g., `chance(0.3)` = 30% chance) |
| `shuffle(array)` | Shuffled copy | Fisher-Yates shuffle — fair, unbiased |
| `hsl(...)` | HSL color string | Generates a random CSS colour in given range |
| `rgb()` | `[r, g, b]` | Three random 0–255 values |

The `float()` method uses a clever bit trick: it takes the top 53 bits of a 64-bit output and divides by 2⁵³. This is the standard technique for generating doubles from integers — 53 bits is the precision of a JavaScript `number`.

---

### 4.3 `lib/artEngine.ts`

**What it is:** 1,100+ lines of drawing code. Every style is a self-contained function that takes `(ctx, rng, palette, width, height)` and paints onto the canvas.

**Key exports:**
- `ART_STYLES` — array of 55 style name strings
- `generateArt(canvas, seed, size?)` — the main entry point

---

#### `generateArt(canvas, seed, size)`

```typescript
export function generateArt(canvas, seed, size = 1024): ArtConfig {
  const rng = new CosmicPRNG(seed);       // Seed the dice machine
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, size, size);

  const palette = generatePalette(rng);   // Pick 6 colours
  const style = rng.pick(ART_STYLES);     // Pick one of 55 styles
  const drawFn = DRAW_FNS[style];         // Look up the drawing function

  try {
    drawFn(ctx, rng, palette, size, size); // Draw the art
  } catch(e) {
    drawNebula(ctx, rng, palette, size, size); // Fallback if error
  }

  return { style, palette, seed };
}
```

This is 10 lines of code that orchestrates everything. It's deliberately simple — all complexity is pushed into the individual drawing functions.

---

#### Helper: `hsla(color, alpha)`

A utility that converts an `hsl(...)` string to `hsla(...)` with an alpha (transparency) value. Used extensively by every drawing function to create transparent overlapping layers.

```typescript
function hsla(col: string, alpha: number): string {
  return col.replace('hsl(', 'hsla(').replace(')', `,${alpha})`);
}
```

---

#### Helper: `drawStars(ctx, rng, w, h, n)`

Draws `n` tiny white circles at random positions with random sizes and opacities. Used as a background layer in space-themed styles. Separating this into a helper prevents duplicating 8 lines of code across 12 styles.

---

### 4.4 `hooks/useCosmicArt.ts`

**What it is:** A React hook — a function that manages all the state and actions for the app. This is the "brain" that connects the API, the art engine, and the UI.

**Why a hook?** It keeps all the logic in one place. `page.tsx` just calls `useCosmicArt()` and gets back everything it needs. No logic lives in the UI components.

---

#### State Object

```typescript
interface ArtState {
  seed: string | null;        // The 64-char hex seed
  source: string | null;      // "aptosorbital" | "ipfs" | "fallback" | "custom"
  provider?: string;          // "orbitport-sdk" | "orbitport-api"
  sequence?: number;          // IPFS sequence number (if from IPFS)
  timestamp: number | null;   // Unix ms when entropy was fetched
  usedFallback: boolean;      // Whether local crypto was used
  style: string | null;       // e.g. "mandala"
  palette: string[];          // 6 HSL color strings
  isLoading: boolean;         // True while fetching + drawing
  error: string | null;       // Error message if something went wrong
  generated: boolean;         // True after first successful generation
}
```

---

#### `generate(customSeed?)`

The main action. Can be called with or without a custom seed:

- **No seed:** calls `fetch('/api/random')` to get cosmic entropy
- **Custom seed:** skips the API call, uses the provided string directly

After getting the seed, it calls `generateArt(canvas, seed)` from `artEngine.ts`. This is called via dynamic import (`await import('@/lib/artEngine')`) so the art engine code is only downloaded when needed, not on initial page load.

After drawing, it updates `window.history` to put the seed in the URL.

---

#### `downloadPNG()`

Calls `canvas.toDataURL('image/png')` — the Canvas API can export its current pixels directly as a PNG data URL. The function creates a temporary `<a>` element, sets its `href` to the data URL, and programmatically clicks it to trigger a download.

---

#### `exportMetadata()`

Creates a JSON object with all the art's provenance data and downloads it as a `.json` file using the same `Blob → URL → click` technique.

---

#### `canvasRef`

A React ref that holds a reference to the actual `<canvas>` DOM element. The hook needs direct access to the canvas element to call `generateArt()`. This ref is passed down to `ArtCanvas.tsx` which attaches it to the `<canvas>` element.

---

### 4.5 `app/page.tsx`

**What it is:** The main page of the application. It assembles all components and connects them to the hook.

**Layout:**
- Full-screen `<main>` with `StarField` as the background
- A centred header with the `COSMIC ART` title
- A two-column grid (canvas left, sidebar right on desktop; stacked on mobile)
- Canvas column: `ArtCanvas` + error display
- Sidebar column: `Controls` card + `MetadataCard` + style info card
- Footer with link to SpaceComputer

**`STYLE_DESCRIPTIONS`:**
A lookup table of 55 entries mapping style names to one-line human-readable descriptions. These appear in the "Generation Style" card in the sidebar. This data lives in `page.tsx` rather than `artEngine.ts` because it's UI text, not drawing logic.

**Framer Motion animations:**
- Header slides down from above on load (`initial={{ y: -20 }}`)
- Canvas fades in from small (`initial={{ scale: 0.95 }}`)
- Sidebar slides in from the right (`initial={{ x: 20 }}`)

---

### 4.6 `components/ArtCanvas.tsx`

**What it is:** The visual wrapper around the `<canvas>` element. Manages three visual states: placeholder, loading, and showing art.

---

#### Three States

**Placeholder** (before any generation):
- Shows a decorative orbital ring animation
- Text: "Your cosmos awaits"
- Canvas is invisible (`opacity: 0`)

**Loading** (while fetching + drawing):
- Shows three spinning concentric rings in purple/cyan/pink
- Three pulsing dots beneath it
- Text: "Harvesting Cosmic Entropy"

**Generated** (art is ready):
- Canvas fades in (`opacity: 1`, 0.6s transition)
- A rotating conic gradient glow ring appears around the canvas
- A subtle inner vignette (dark edges) adds depth

---

#### The Glow Ring

```typescript
background: 'conic-gradient(from 0deg, #7c3aed, #00f5ff, #ff2d78, #ffd700, #7c3aed)',
animation: 'spin 8s linear infinite',
filter: 'blur(8px)',
```

A conic gradient (rainbow rotating around a point) is placed behind the canvas, blurred, and slowly rotated. It creates the glowing halo effect. The canvas itself sits 2px in from the edge, covering most of the gradient except for a thin glowing border.

---

### 4.7 `components/Controls.tsx`

**What it is:** All the interactive controls — the generate button, custom seed input, download button, and share button.

---

#### Generate Button

- Before generation: shows `✦ GENERATE COSMIC ART`
- While loading: shows a spinning ring and `Fetching Cosmic Entropy...`
- After generation: shows `⟳ REGENERATE`

The button is disabled while loading (can't double-click to generate twice simultaneously).

---

#### Custom Seed

A hidden input that slides open when you click "USE CUSTOM SEED". When the input has text and you click generate, that text is passed as the seed instead of fetching from the API.

This is useful for:
- Reproducing a specific piece of art
- Sharing art without using the URL (copy the seed string)
- Testing specific seeds

---

#### URL Seed Sync

On mount, the component checks `window.location.search` for a `?seed=` parameter. If found, it puts it in the seed input and automatically calls `onGenerate(urlSeed)`. This is what makes share links work — visiting `https://yoursite.com?seed=0a4c2e...` automatically generates that exact artwork.

---

#### Share Button

Copies the current URL (with `?seed=` parameter) to the clipboard. Shows a green checkmark for 2 seconds to confirm the copy worked.

---

### 4.8 `components/MetadataCard.tsx`

**What it is:** A glassmorphism card that appears after generation, showing all the provenance data for the artwork.

---

#### `SourceBadge`

Displays a coloured pulsing dot and label based on where the entropy came from:

| Source value | Dot colour | Label |
|-------------|------------|-------|
| `trng` / `aptosorbital` | Green `#00ff9f` | SATELLITE cTRNG |
| `ipfs` / `ipfs-beacon` | Cyan `#00f5ff` | IPFS BEACON |
| `fallback` | Gold `#ffd700` | LOCAL CRYPTO |
| `custom` | Purple `#a855f7` | CUSTOM SEED |

The pulsing animation (`animate-pulse`) gives a sense of liveness — like a heartbeat showing the source is active.

---

#### Palette Preview

Six small coloured squares showing the palette used for the art. Hovering reveals the HSL value in a tooltip (`title={color}`).

---

#### Export Metadata JSON

Downloads a JSON file containing everything needed to reproduce and attribute the artwork:
```json
{
  "seed": "0a4c2ea21557...",
  "style": "mandala",
  "source": "aptosorbital",
  "provider": "orbitport-sdk",
  "sequence": null,
  "timestamp": 1709481234567,
  "usedFallback": false,
  "palette": ["hsl(240,80%,8%)", "hsl(270,70%,30%)", ...],
  "generated": "2024-03-03T14:53:54.567Z"
}
```

---

### 4.9 `components/StarField.tsx`

**What it is:** The animated star background. It renders 120 stars and 20 floating particles as fixed-position elements behind everything else.

---

#### Stars (120)

Stars are positioned using a **golden angle** technique:
```typescript
x: (i * 137.508 + 23) % 100,  // % of screen width
y: (i * 97.631 + 11) % 100,   // % of screen height
```

Multiplying by irrational-ish numbers (137.508 is related to the golden ratio) ensures stars are evenly distributed without visible clustering. This is the same technique used in sunflower seed arrangements.

Each star has a CSS `twinkle` animation with a unique duration (2–7s) and delay (0–5s), creating an organic shimmering effect.

---

#### Particles (20)

Coloured glowing dots that float upward and drift sideways, created with CSS `@keyframes`. Each has:
- A random starting X position
- A unique speed (6–16s cycle)
- A unique sideways drift (±30px)
- One of 5 colours (purple, cyan, pink, gold, green)
- A glow effect via `box-shadow`

---

#### Nebula Glow

Three overlapping radial gradients create the subtle background nebula visible beneath the stars:
```css
radial-gradient(ellipse 60% 50% at 20% 30%, rgba(124, 58, 237, 0.3), transparent)
radial-gradient(ellipse 40% 60% at 80% 70%, rgba(0, 245, 255, 0.2), transparent)
radial-gradient(ellipse 50% 40% at 50% 50%, rgba(255, 45, 120, 0.1), transparent)
```

Purple top-left, cyan bottom-right, pink centre — gives the deep space feeling.

---

#### Performance

All star positions are computed inside `useMemo()` — they're calculated once when the component mounts and never recalculated. Without `useMemo`, React would recalculate 120 star positions on every re-render.

---

### 4.10 `app/layout.tsx`

**What it is:** The outermost HTML wrapper rendered for every page. In Next.js App Router, this file provides the `<html>` and `<body>` tags.

**Responsibilities:**
- Load the `Space Mono` font from Google Fonts (monospace font used for labels and metadata)
- Set page metadata: title, description, Open Graph tags
- Apply the `spaceMono.variable` CSS variable to the `<html>` element

**Note about Space Future font:** Space Future Bold (the custom `.ttf` file) is loaded via `@font-face` in `globals.css` rather than through Next.js's font system, because it's a local file, not a Google Font.

---

### 4.11 `app/globals.css`

**What it is:** Global CSS applied to every page. Contains custom utilities that can't be expressed in Tailwind.

---

#### `@font-face` — Space Future Bold

```css
@font-face {
  font-family: 'Space Future';
  src: url('/fonts/SpaceFuture-Bold.ttf') format('truetype');
  font-weight: 700;
  font-display: swap;
}
```

Loads `SpaceFuture-Bold.ttf` from the `public/fonts/` directory. `font-display: swap` means text renders immediately in the fallback font, then swaps to Space Future once it loads — prevents invisible text during loading.

---

#### `.glass` and `.glass-strong`

Glassmorphism effect — cards that look like frosted glass:

```css
.glass {
  background: rgba(255, 255, 255, 0.03);  /* 3% white — barely visible */
  backdrop-filter: blur(20px);             /* blurs what's behind */
  border: 1px solid rgba(255, 255, 255, 0.07); /* faint border */
}
```

`backdrop-filter: blur()` is what creates the frosted glass look. It blurs the content behind the element (in this case, the animated stars and nebula glow).

---

#### `.noise` — Film Grain

```css
.noise::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,...feTurbulence...");
  opacity: 0.4;
}
```

An SVG `feTurbulence` filter generates fractal noise, embedded directly in the CSS as a data URL. It's applied as a fixed overlay across the entire screen at 40% opacity. This adds subtle film grain — making the dark background feel more tactile and less like a flat screen.

---

#### `.scanlines` — CRT Effect

```css
.scanlines::after {
  background: repeating-linear-gradient(
    0deg,
    transparent 0px, transparent 2px,
    rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px
  );
}
```

Alternating transparent and very slightly dark horizontal lines across the screen, simulating the horizontal scan lines of a CRT monitor. At 3% opacity per line they're barely noticeable — but they add to the retro-digital atmosphere.

---

#### Animations

| Name | What it does | Used by |
|------|-------------|---------|
| `shimmer` | Scrolls background gradient left to right | Title text |
| `spin` | 360° rotation | Loading rings, canvas glow |
| `float` | Gentle up/down oscillation | Various elements |
| `star-twinkle` | Opacity pulses between dim and bright | Star dots |
| `particle-float` | Moves upward off screen with drift | Coloured particles |
| `btn-shine` | Light sweep across button | Generate button |

---

### 4.12 `tailwind.config.ts`

**What it is:** Tailwind CSS configuration — extends the default design system with project-specific values.

---

#### Custom Colors

```typescript
colors: {
  void: '#030308',          // Near-black background
  nebula: {
    500: '#7c3aed',         // Primary purple
    ...
  },
  cosmic: {
    cyan:  '#00f5ff',       // Bright electric cyan
    gold:  '#ffd700',       // Warm gold
    rose:  '#ff2d78',       // Hot pink/rose
    green: '#00ff9f',       // Bioluminescent green
  }
}
```

These become Tailwind classes like `bg-void`, `text-cosmic-cyan`, `border-nebula-500`.

---

#### Custom Font Families

```typescript
fontFamily: {
  display: ['Space Future', 'Space Mono', 'monospace'],
  mono: ['var(--font-mono)', 'monospace'],
}
```

`font-display` → Space Future Bold (the `.ttf` font, for titles and style names)
`font-mono` → Space Mono from Google Fonts (for labels, seeds, metadata)

---

## 5. The 4-Tier Entropy Fallback System

The app never fails to generate art. If one source is unavailable, it automatically tries the next:

```
┌─────────────────────────────────────────────────────────────┐
│  TIER 1: Orbitport SDK                                       │
│  Needs: ORBITPORT_CLIENT_ID + ORBITPORT_CLIENT_SECRET        │
│  Source: Physical satellite (AptosOrbital) in LEO            │
│  Speed: ~2-4 seconds                                         │
│  Quality: True hardware randomness from cosmic radiation     │
└──────────────────────┬──────────────────────────────────────┘
                       │ fails (no credentials / network error)
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  TIER 2: Orbitport REST API (direct HTTP)                    │
│  Needs: Same credentials as Tier 1                           │
│  Source: Same satellite, bypasses SDK layer                  │
│  Speed: ~2-4 seconds                                         │
│  Quality: Same as Tier 1                                     │
└──────────────────────┬──────────────────────────────────────┘
                       │ fails
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  TIER 3: IPFS Beacon                                         │
│  Needs: Nothing (public, no auth)                            │
│  Source: Satellite data published to IPFS, updates ~60s      │
│  Speed: ~5-18 seconds (IPFS can be slow)                     │
│  Quality: Cosmic origin + XOR'd with local entropy           │
│  Note: XOR ensures uniqueness even if beacon hasn't updated  │
└──────────────────────┬──────────────────────────────────────┘
                       │ fails (IPFS unreachable)
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  TIER 4: Local crypto.randomBytes                            │
│  Needs: Nothing (always available)                           │
│  Source: OS entropy pool (hardware events, timings, etc.)    │
│  Speed: Instant                                              │
│  Quality: Cryptographically secure, but terrestrial         │
└─────────────────────────────────────────────────────────────┘
```

The source used is always reported in the `MetadataCard` — a green pulsing dot for satellite, cyan for IPFS, gold for local fallback.

---

## 6. The PRNG

### Why not just use `Math.random()`?

`Math.random()` in JavaScript:
- Is different every time — cannot be seeded
- Is not reproducible — can't recreate the same sequence
- Is not shareable — two people can't get the same output

The `CosmicPRNG` solves all three problems. Same seed = same sequence, always, on every computer.

### How xoshiro256** works

The state is four 64-bit numbers: `s0, s1, s2, s3`.

On each call to `next()`:
1. A result is computed from the current state
2. The state is updated using XOR (^) and bit rotations
3. The result is returned

The "256" refers to the total state size: 4 × 64 bits = 256 bits. The "**" (star-star) refers to the specific output scrambler used (multiply by 5, rotate left 7, multiply by 9).

A 256-bit state means the sequence won't repeat for 2²⁵⁶ outputs — approximately 10⁷⁷ numbers. The universe has only been around for about 4 × 10¹⁷ seconds. Even generating a million numbers per second, it would take 10⁵⁴ times the age of the universe to cycle.

### Why BigInt?

JavaScript's standard `number` type only has 53 bits of integer precision (it's a 64-bit float). For xoshiro256 we need full 64-bit integer operations — shifts, XOR, rotation — without any precision loss.

`BigInt` in JavaScript provides arbitrary-precision integers. The `64n` syntax (a number followed by `n`) creates a BigInt literal. This requires ES2020, which is why `tsconfig.json` sets `"target": "ES2020"`.

---

## 7. The Art Engine

### How a Drawing Function Works

Every drawing function has the same signature:

```typescript
function drawMandala(
  ctx: CanvasRenderingContext2D,  // The Canvas 2D drawing context
  rng: CosmicPRNG,               // The seeded dice machine
  p: string[],                   // Array of 6 palette colours
  w: number,                     // Canvas width (1024)
  h: number                      // Canvas height (1024)
): void
```

The function uses `ctx` to draw and `rng` to make every decision.

### The 55 Art Styles

| # | Style | Algorithm | What Makes It Random |
|---|-------|-----------|---------------------|
| 1 | `nebula` | Radial gradients + star field | Cloud positions, star count, colour distribution |
| 2 | `crystalline` | Voronoi diagram | Site positions, colour assignments |
| 3 | `flowfield` | Perlin-like noise particles | Scale, octaves, particle count, path length |
| 4 | `mandala` | Radial symmetry | Symmetry count, layers, petal dimensions |
| 5 | `constellation` | Connected graph | Node count, node positions, connection distance |
| 6 | `aurora` | Sine wave curtains | Curtain count, amplitude, colour, position |
| 7 | `fractal` | Julia set escape-time | Centre point, zoom level, iteration depth |
| 8 | `supernova` | Radial ray geometry | Ray count, ray length, ring count |
| 9 | `blackhole` | Accretion disk + lens | Disk layers, glow radius |
| 10 | `wormhole` | Perspective rings | Ring count, tilt, perspective depth |
| 11 | `plasma` | Multi-frequency sine | 4 frequency parameters |
| 12 | `galaxy` | Spiral arm distribution | Arm count, star count, spread |
| 13 | `magnetar` | Curved field lines | Line count, curvature |
| 14 | `quasar` | Jet + disk | Jet width, disk radius |
| 15 | `pulsar` | Pulse rings + beams | Ring count, beam angles |
| 16 | `interference` | Wave superposition | Source count, wavelength |
| 17 | `voronoi_lines` | Voronoi cells | Site count, colours |
| 18 | `lissajous` | Harmonic figures | Frequency ratio, phase |
| 19 | `spirograph` | Hypotrochoid | Radii, pen distance |
| 20 | `trefoil` | 3-lobed parametric | Curve parameters |
| 21 | `reaction_diffusion` | Turing patterns | Feed rate, kill rate, seed points |
| 22 | `strange_attractor` | Lorenz system | σ, ρ, β parameters |
| 23 | `penrose` | P2 tiling | Subdivision generations |
| 24 | `celtic_knot` | Interlaced curves | Knot count, bezier points |
| 25 | `amoeba` | Organic blobs | Blob count, irregularity |
| 26 | `bioluminescence` | Glowing organisms | Organism count, size, tentacle count |
| 27 | `coral` | Recursive branching | Root count, depth, branching probability |
| 28 | `mycelium` | Random walks | Hypha count, step size, turning rate |
| 29 | `lightning` | Recursive midpoint | Bolt count, recursion depth |
| 30 | `ice_crystal` | Recursive branching | Branch depth, branch angles |
| 31 | `oil_slick` | Blob shapes + iridescence | Blob count, sheen positions |
| 32 | `chromatic_aberration` | RGB channel shift | Shape count, shift amount |
| 33 | `glitch` | Scan line displacement | Slice count, shift amount |
| 34 | `circuit` | Grid graph routing | Node density, connection probability |
| 35 | `datamosh` | Block displacement | Block count, position |
| 36 | `watercolor` | Blurred blobs | Stroke count, blob size |
| 37 | `impressionist` | Oriented ellipses | Stroke count, size, angle |
| 38 | `pointillist` | Coloured dots | Dot count, size |
| 39 | `chalkboard` | Chalk strokes | Drawing type, size |
| 40 | `neon_sign` | Glowing shapes | Shape count, type |
| 41 | `stained_glass` | Lead-camed cells | Cell count, colour |
| 42 | `topography` | Contour lines | Frequency, levels |
| 43 | `geode` | Layered irregular rings | Layer count, irregularity |
| 44 | `moiré` | Overlapping grids | Layer count, spacing, angle |
| 45 | `diffraction` | Ring + interference | Ring count, slit count |
| 46 | `hypercube` | 4D projection | Rotation angles |
| 47 | `klein_bottle` | Parametric surface | Rotation angle |
| 48 | `torus_knot` | Torus parametric | p and q knot parameters |
| 49 | `rose_curve` | Rhodonea polar | k (petal count) |
| 50 | `epitrochoid` | Outer roulette | Arm ratio, pen distance |
| 51 | `interference_rings` | Concentric rings | Source count, density |
| 52 | `bismuth` | Stepped squares | Recursion depth |
| 53 | `soap_bubble` | Iridescent rings | Bubble count, size |
| 54 | `aurora_borealis` | Mountain landscape + aurora | Band count, terrain shape |
| 55 | `dark_matter` | Cosmic web filaments | Node count, filament density |

---

## 8. Palette Generation

The palette is always 6 colours. Seven colour scheme generators exist, each with its own aesthetic logic:

```typescript
const schemes = [
  () => cosmicBluesPurples(rng),  // Deep blues, purples, cyan
  () => firePlasma(rng),          // Oranges, reds, yellows
  () => bioluminescent(rng),      // Greens, teals, aqua
  () => twilightMetals(rng),      // Muted purples, golds
  () => rainbow(rng),             // Full hue wheel sweep
  () => monochrome(rng),          // Single hue, varying brightness
  () => randomVivid(rng),         // Fully random vivid hues
];
```

`rng.pick(schemes)()` — first picks which scheme function to use, then calls it.

Each scheme function calls `rng.range()` to get the base hue and builds 6 colours around it using HSL. HSL (Hue, Saturation, Lightness) is used instead of RGB because it's easy to create harmonious palettes: same hue + varying lightness = a natural progression.

---

## 9. Why Art Is Deterministic

**Deterministic** means: given the same input, always produces the same output.

The `CosmicPRNG` is deterministic because:
1. The initial state is set entirely from the seed string — no randomness involved
2. Every `next()` call is a pure mathematical operation on the state
3. The state update rules are fixed — they don't depend on time, memory, or external factors

The art engine is deterministic because:
1. Every visual decision comes from `rng.float()`, `rng.int()`, etc.
2. These calls happen in a fixed order — style first, palette second, drawing third
3. The same seed → same PRNG state → same sequence of calls → same decisions

**What makes it feel random:** The cosmic seed changes every time you click Generate. A single bit difference in the seed causes the state to diverge completely within a few calls — this is called the "avalanche effect" and is a property of good hash/PRNG algorithms.

---

## 10. Configuration Files

### `package.json`

| Package | Why it's needed |
|---------|----------------|
| `next@14.2.29` | The web framework (routing, server, build system) |
| `react@18.3` | UI rendering library |
| `react-dom@18.3` | React's DOM renderer |
| `framer-motion@11` | Animations (fade-in, slide-in, spring effects) |
| `@spacecomputer-io/orbitport-sdk-ts@0.0.4` | Official Orbitport client SDK |
| `typescript@5.4` | Type checking |
| `tailwindcss@3.4` | Utility CSS framework |
| `autoprefixer@10.4` | Adds vendor prefixes to CSS automatically |

---

### `tsconfig.json`

Key settings:

| Setting | Value | Why |
|---------|-------|-----|
| `target` | `ES2020` | Required for BigInt literals (`64n`) |
| `lib` | `["dom", "dom.iterable", "es2020"]` | Available browser and ES APIs |
| `strict` | `true` | Catches type errors at build time |
| `moduleResolution` | `bundler` | Modern Next.js module resolution |
| `paths` | `{ "@/*": ["./*"] }` | Enables `@/lib/prng` imports |

---

### `next.config.js`

```javascript
const nextConfig = {
  output: 'standalone',  // Bundle everything for Docker
  reactStrictMode: true, // Catch potential React bugs in dev
};
```

`output: 'standalone'` is what makes Docker work. It creates a self-contained `server.js` file with all dependencies bundled — no `node_modules` needed in the Docker runner stage.

---

## 11. Deployment Files

### `Dockerfile`

Three-stage build:

**Stage 1 — `deps`:** Install npm packages only. Caching this separately means re-builds only reinstall packages when `package.json` changes.

**Stage 2 — `builder`:** Copy source code and run `next build`. Produces the `.next/standalone` directory.

**Stage 3 — `runner`:** The final image. Contains only:
- The standalone server (`server.js`)
- Static assets
- The public folder

This is the image that actually runs. It's much smaller than the builder stage because it doesn't contain source code, TypeScript compiler, or dev dependencies.

The image runs as a non-root user (`nextjs`) for security — a best practice for production containers.

---

### `docker-compose.yml`

```yaml
services:
  cosmic-art:
    build: .
    ports:
      - "3000:3000"
    env_file: .env
    restart: unless-stopped
    healthcheck:
      test: wget -qO- http://localhost:3000/api/health
      interval: 30s
```

`restart: unless-stopped` means Docker automatically restarts the container if it crashes. The health check pings `/api/health` every 30 seconds — if it fails 3 times, Docker marks the container as unhealthy.

---

### `vercel.json`

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "env": {
    "ORBITPORT_AUTH_URL": "https://auth.spacecomputer.io",
    "ORBITPORT_API_URL": "https://op.spacecomputer.io"
  }
}
```

Tells Vercel which framework this is and sets default environment variables. Individual credentials (`ORBITPORT_CLIENT_ID`, `ORBITPORT_CLIENT_SECRET`) must be added manually in the Vercel dashboard as secret environment variables.

---

### `app/api/health/route.ts`

A simple endpoint that returns `{ status: 'ok', timestamp: ... }` with HTTP 200. Used by Docker's health check and can also be called manually to verify the server is running.

---

## 12. Data Flow Diagram

```
USER CLICKS GENERATE
        │
        ▼
Controls.tsx
  handleGenerate()
        │
        ▼
useCosmicArt.ts
  generate()
  setState({ isLoading: true })
        │
        ├─── fetch('/api/random') ──────────────────────────┐
        │                                                   │
        │    app/api/random/route.ts                        │
        │    ┌─────────────────────────────────────────┐   │
        │    │ try fetchFromOrbitportSDK()              │   │
        │    │   OrbitportSDK.ctrng.random()            │   │
        │    │   → { data: "0a4c2e..." }                │   │
        │    │                                          │   │
        │    │ OR fetchFromOrbitportAPI()               │   │
        │    │   POST /oauth/token → JWT                │   │
        │    │   GET /api/v1/services/trng → hex        │   │
        │    │                                          │   │
        │    │ OR fetchFromIPFS()                       │   │
        │    │   GET ipfs.io/ipns/k2k4... → hex         │   │
        │    │   xorHex(hex, crypto.randomBytes())      │   │
        │    │                                          │   │
        │    │ OR crypto.randomBytes(32).toString('hex')│   │
        │    └─────────────────────────────────────────┘   │
        │                                                   │
        │◄──────────── JSON { seed, source, ... } ─────────┘
        │
        ├─── import('@/lib/artEngine').generateArt(canvas, seed)
        │
        │    lib/artEngine.ts
        │    ┌───────────────────────────────────────────┐
        │    │ new CosmicPRNG(seed)                      │
        │    │   split "0a4c2e..." into 4 × BigInt       │
        │    │   warm up 20 calls                        │
        │    │                                           │
        │    │ generatePalette(rng)                      │
        │    │   rng.pick(schemes)()                     │
        │    │   → ["hsl(240,80%,8%)", ...]              │
        │    │                                           │
        │    │ rng.pick(ART_STYLES)                      │
        │    │   → "mandala"                             │
        │    │                                           │
        │    │ drawMandala(ctx, rng, palette, 1024, 1024)│
        │    │   rng.pick([6,8,10,12,16]) → 10 arms      │
        │    │   rng.int(5,10) → 7 layers                │
        │    │   ... hundreds more rng calls ...         │
        │    │   ctx.bezierCurveTo(...)                  │
        │    │   ctx.arc(...)                            │
        │    │   ctx.fill()                              │
        │    │   → pixels on canvas                     │
        │    └───────────────────────────────────────────┘
        │
        ├─── setState({ seed, style, palette, generated: true })
        │
        ├─── window.history.replaceState('?seed=0a4c2e...')
        │
        ▼
ArtCanvas.tsx
  canvas opacity: 0 → 1 (0.6s transition)
  glow ring appears
  art is visible

MetadataCard.tsx
  fades in with entropy source badge,
  seed preview, palette swatches
```

---

## 13. Glossary

| Term | Plain English meaning |
|------|-----------------------|
| **cTRNG** | Cosmic True Random Number Generator — a device that uses physical quantum processes (cosmic radiation) to generate numbers |
| **PRNG** | Pseudo-Random Number Generator — mathematical algorithm that produces numbers that look random but are computed from a starting value |
| **Seed** | The starting value fed into a PRNG — same seed always produces the same sequence |
| **Entropy** | Unpredictability or randomness — "high entropy" = very unpredictable |
| **XOR** | Bitwise exclusive-or — a way to combine two numbers so the result depends on both |
| **BigInt** | JavaScript integer type with no size limit, needed for 64-bit maths |
| **HSL** | Hue, Saturation, Lightness — a way to describe colours that's easier to manipulate than RGB |
| **Voronoi** | A way to divide space by assigning each point to its nearest site — produces crystal-like cells |
| **Canvas API** | Browser's built-in drawing system — lets JavaScript paint pixels directly |
| **Glassmorphism** | UI style with frosted-glass panels (blur + transparency) |
| **Deterministic** | Always produces the same output given the same input |
| **IPFS** | InterPlanetary File System — decentralised network for storing/sharing data |
| **OAuth / JWT** | Standard system for authenticating API calls using tokens |
| **LEO** | Low Earth Orbit — where the AptosOrbital satellite flies (a few hundred km up) |
| **xoshiro256** | Name of the specific PRNG algorithm — "xor/shift/rotate, 256-bit state" |
| **Standalone** | Next.js build mode that packages everything into a single portable `server.js` |
| **Avalanche effect** | Property where a tiny input change (one bit) causes completely different output — ensures visual variety |
