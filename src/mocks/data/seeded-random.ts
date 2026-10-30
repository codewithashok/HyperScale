export type RandomFn = () => number;

/**
 * Mulberry32: a tiny seeded PRNG. Same seed → same sequence,
 * so mock data is identical on every reload and in every test.
 */
export function seededRandom(seed: number): RandomFn {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pick<T>(random: RandomFn, items: readonly T[]): T {
  return items[Math.floor(random() * items.length)];
}

export function between(random: RandomFn, min: number, max: number): number {
  return min + random() * (max - min);
}
