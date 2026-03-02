/**
 * Deterministic PRNG built from cosmic entropy seed.
 * Uses a 128-bit splitmix64-inspired algorithm for high quality pseudo-randomness.
 */

export class CosmicPRNG {
  private s0: bigint;
  private s1: bigint;
  private s2: bigint;
  private s3: bigint;

  constructor(seed: string) {
    // Convert 32-byte hex seed into 4 x 64-bit state values
    const padded = seed.padEnd(64, '0').slice(0, 64);
    this.s0 = BigInt('0x' + padded.slice(0, 16));
    this.s1 = BigInt('0x' + padded.slice(16, 32));
    this.s2 = BigInt('0x' + padded.slice(32, 48));
    this.s3 = BigInt('0x' + padded.slice(48, 64));

    // Warm up the generator
    for (let i = 0; i < 20; i++) this.next();
  }

  private rotl(x: bigint, k: bigint): bigint {
    const mask = BigInt('0xFFFFFFFFFFFFFFFF');
    return ((x << k) | (x >> (64n - k))) & mask;
  }

  /** Returns a pseudo-random BigInt in [0, 2^64) */
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

  /** Returns a float in [0, 1) */
  float(): number {
    return Number(this.next() >> 11n) / 2 ** 53;
  }

  /** Returns an integer in [min, max) */
  int(min: number, max: number): number {
    return Math.floor(this.float() * (max - min)) + min;
  }

  /** Returns a float in [min, max) */
  range(min: number, max: number): number {
    return this.float() * (max - min) + min;
  }

  /** Picks a random item from an array */
  pick<T>(arr: T[]): T {
    return arr[this.int(0, arr.length)];
  }

  /** Returns a random boolean with given probability */
  chance(p: number = 0.5): boolean {
    return this.float() < p;
  }

  /** Shuffle an array in-place using Fisher-Yates */
  shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = this.int(0, i + 1);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /** Generate an HSL color string */
  hsl(hMin = 0, hMax = 360, sMin = 60, sMax = 100, lMin = 40, lMax = 70): string {
    const h = this.range(hMin, hMax);
    const s = this.range(sMin, sMax);
    const l = this.range(lMin, lMax);
    return `hsl(${h.toFixed(1)}, ${s.toFixed(1)}%, ${l.toFixed(1)}%)`;
  }

  /** Generate an RGB color array [r, g, b] */
  rgb(): [number, number, number] {
    return [this.int(0, 256), this.int(0, 256), this.int(0, 256)];
  }
}
