import { NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export interface RandomResponse {
  seed: string;
  source: string;
  timestamp: number;
  provider?: string;
  sequence?: number;
  usedFallback: boolean;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

/** XOR two hex strings to produce a unique combined hex string */
function xorHex(a: string, b: string): string {
  const len = Math.min(a.length, b.length);
  let result = '';
  for (let i = 0; i < len; i += 2) {
    const byteA = parseInt(a.slice(i, i + 2), 16);
    const byteB = parseInt(b.slice(i, i + 2), 16);
    result += (byteA ^ byteB).toString(16).padStart(2, '0');
  }
  return result.padEnd(64, '0');
}

/**
 * Mix cosmic data with local crypto entropy.
 * This ensures that even if the upstream value is the same (e.g. cached IPFS),
 * every call to /api/random returns a unique seed.
 */
function addLocalEntropy(cosmicHex: string): string {
  const localEntropy = crypto.randomBytes(32).toString('hex');
  return xorHex(cosmicHex, localEntropy);
}

// ─── Source 1: Orbitport SDK ─────────────────────────────────────────────────

async function fetchFromOrbitportSDK(): Promise<{
  data: string;
  src: string;
  provider?: string;
} | null> {
  try {
    const clientId = process.env.ORBITPORT_CLIENT_ID;
    const clientSecret = process.env.ORBITPORT_CLIENT_SECRET;
    if (!clientId || !clientSecret) return null;

    // Always new instance — never reuse a module-level singleton
    const { OrbitportSDK } = await import('@spacecomputer-io/orbitport-sdk-ts');

    const sdk = new OrbitportSDK({
      config: {
        clientId,
        clientSecret,
        authUrl: process.env.ORBITPORT_AUTH_URL || 'https://auth.spacecomputer.io',
        apiUrl: process.env.ORBITPORT_API_URL || 'https://op.spacecomputer.io',
        timeout: 15000,
        retryAttempts: 1,
      },
    });

    // Force satellite/API source — cast to any to handle SDK version type differences
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await sdk.ctrng.random({ src: 'trng' } as any);
    if (!result?.data?.data) return null;

    return {
      data: result.data.data,
      src: result.data.src || 'aptosorbital',
      provider: 'orbitport-sdk',
    };
  } catch (err) {
    console.warn('[SDK] Failed:', err instanceof Error ? err.message : String(err));
    return null;
  }
}

// ─── Source 2: Orbitport REST API (direct, no SDK) ───────────────────────────

async function fetchFromOrbitportAPI(): Promise<{
  data: string;
  src: string;
  provider?: string;
} | null> {
  const clientId = process.env.ORBITPORT_CLIENT_ID;
  const clientSecret = process.env.ORBITPORT_CLIENT_SECRET;
  const authUrl = process.env.ORBITPORT_AUTH_URL || 'https://auth.spacecomputer.io';
  const apiUrl = process.env.ORBITPORT_API_URL || 'https://op.spacecomputer.io';

  if (!clientId || !clientSecret) return null;

  try {
    // Fetch a fresh token every time — no caching
    const tokenRes = await fetch(`${authUrl}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        audience: 'https://op.spacecomputer.io/api',
        grant_type: 'client_credentials',
      }),
      cache: 'no-store',
      signal: AbortSignal.timeout(12000),
    });

    if (!tokenRes.ok) {
      console.warn('[API] Token fetch failed:', tokenRes.status, await tokenRes.text());
      return null;
    }

    const tokenData = await tokenRes.json();
    const accessToken: string | undefined = tokenData.access_token;
    if (!accessToken) return null;

    // Call TRNG — disable all caching layers
    const trngRes = await fetch(`${apiUrl}/api/v1/services/trng`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Cache-Control': 'no-cache, no-store',
        Pragma: 'no-cache',
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(12000),
    });

    if (!trngRes.ok) {
      console.warn('[API] TRNG fetch failed:', trngRes.status);
      return null;
    }

    const trngData = await trngRes.json();
    if (!trngData.data) return null;

    return {
      data: trngData.data,
      src: trngData.src || 'aptosorbital',
      provider: 'orbitport-api',
    };
  } catch (err) {
    console.warn('[API] Failed:', err instanceof Error ? err.message : String(err));
    return null;
  }
}

// ─── Source 3: IPFS Beacon ───────────────────────────────────────────────────
// IPFS only updates every ~60s, so we XOR with local entropy to guarantee
// a unique seed on every call regardless of upstream freshness.

async function fetchFromIPFS(): Promise<{
  data: string;
  sequence: number;
} | null> {
  try {
    const cacheBust = `${Date.now()}-${Math.random()}`;
    const res = await fetch(
      `https://ipfs.io/ipns/k2k4r8lvomw737sajfnpav0dpeernugnryng50uheyk1k39lursmn09f?t=${cacheBust}`,
      {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
        },
        signal: AbortSignal.timeout(18000),
      }
    );
    if (!res.ok) return null;

    const json = await res.json();
    const ctrng: string[] = json?.data?.ctrng;
    if (!Array.isArray(ctrng) || ctrng.length === 0) return null;

    const sequence: number = json?.data?.sequence || 0;

    // Use all available ctrng values: combine them all together
    let combined = ctrng[0];
    for (let i = 1; i < ctrng.length; i++) {
      combined = xorHex(combined, ctrng[i]);
    }

    // XOR with local entropy — unique even if IPFS hasn't updated yet
    const uniqueData = addLocalEntropy(combined);

    return { data: uniqueData, sequence };
  } catch (err) {
    console.warn('[IPFS] Failed:', err instanceof Error ? err.message : String(err));
    return null;
  }
}

// ─── GET handler ─────────────────────────────────────────────────────────────

export async function GET() {
  const timestamp = Date.now();
  const noCache = { 'Cache-Control': 'no-store, no-cache, must-revalidate' };

  // 1. Orbitport SDK — satellite cTRNG, forces aptosorbital src
  const sdkResult = await fetchFromOrbitportSDK();
  if (sdkResult) {
    console.log(`[/api/random] ✓ SDK (${sdkResult.src})`);
    return NextResponse.json(
      { seed: sdkResult.data, source: sdkResult.src, timestamp, provider: sdkResult.provider, usedFallback: false } satisfies RandomResponse,
      { headers: noCache }
    );
  }

  // 2. Orbitport REST API — direct, no SDK layer
  const apiResult = await fetchFromOrbitportAPI();
  if (apiResult) {
    console.log(`[/api/random] ✓ REST API (${apiResult.src})`);
    return NextResponse.json(
      { seed: apiResult.data, source: apiResult.src, timestamp, provider: apiResult.provider, usedFallback: false } satisfies RandomResponse,
      { headers: noCache }
    );
  }

  // 3. IPFS beacon + local entropy mix
  const ipfsResult = await fetchFromIPFS();
  if (ipfsResult) {
    console.log(`[/api/random] ✓ IPFS beacon (seq ${ipfsResult.sequence})`);
    return NextResponse.json(
      { seed: ipfsResult.data, source: 'ipfs', timestamp, sequence: ipfsResult.sequence, usedFallback: false } satisfies RandomResponse,
      { headers: noCache }
    );
  }

  // 4. Pure local crypto — always unique, always works
  const fallbackSeed = crypto.randomBytes(32).toString('hex');
  console.log('[/api/random] ✓ local crypto fallback');
  return NextResponse.json(
    { seed: fallbackSeed, source: 'fallback', timestamp, usedFallback: true } satisfies RandomResponse,
    { headers: noCache }
  );
}
