/**
 * Every image surface on this site is a gradient standing in for a photograph.
 * Two rules, both of which took several design passes to settle and are
 * enforced by gradients.test.ts:
 *
 * 1. Everything is warm. The page reads as one sunlit thing; the only non-warm
 *    colour anywhere is the three functional track dots.
 * 2. Light falls from above (170-192deg). Mixed angles made some tiles read as
 *    graphic rather than photographic.
 *
 * Values are taken from the approved Paper artboards `1A · Left rail (Satoshi)`
 * and `T3 · Tracks — stack` in file 01M0539MQZEZCYPHPZGFGWQTN6.
 */
export type WarmName =
  | "amber"
  | "apricot"
  | "blush"
  | "clay"
  | "honey"
  | "peach"
  | "sunbleached"
  | "terracotta";

export const warm: Record<WarmName, string> = {
  amber: "linear-gradient(172deg,#FFECD6 0%,#F5AE72 48%,#D48B4A 100%)",
  apricot: "linear-gradient(174deg,#FFF3E4 0%,#FCD6AE 48%,#F7BA85 100%)",
  blush: "linear-gradient(176deg,#FFF4EC 0%,#FBD3BE 48%,#F0A98C 100%)",
  clay: "linear-gradient(178deg,#FFF1E2 0%,#F3CDA8 48%,#DFA877 100%)",
  honey: "linear-gradient(174deg,#FFF8E8 0%,#FBDFA6 48%,#EFBC6A 100%)",
  peach: "linear-gradient(178deg,#FFF0DD 0%,#FCBA7F 54%,#EE9B54 100%)",
  sunbleached: "linear-gradient(176deg,#FFFDFA 0%,#FFF2E3 46%,#FDE3C8 100%)",
  terracotta: "linear-gradient(180deg,#FEE9D2 0%,#F3B07A 46%,#D8873F 100%)",
};

export type TrackName = "edit" | "jpg" | "raw";

/**
 * The order a shot's versions are presented in — the order the tracks demo
 * cycles through, and the order the pill lists them. Capture to deliverable.
 */
export const trackOrder: TrackName[] = ["raw", "jpg", "edit"];

/**
 * The same scene rendered three ways: flat, punchy, graded. The tonal spread
 * widens across the three, which is what makes the track switch legible.
 */
export const trackRender: Record<TrackName, string> = {
  edit: "linear-gradient(178deg,#FFF6E9 0%,#F9BF8C 42%,#E39E60 74%,#C5813F 100%)",
  jpg: "linear-gradient(178deg,#FFF3E2 0%,#FBCCA4 46%,#F0AE72 100%)",
  raw: "linear-gradient(178deg,#FEF1E4 0%,#F8DFC8 48%,#EFCFB0 100%)",
};

/**
 * Warm-white highlight, upper-left. A pure-white bloom cooled the top of every
 * tile, which fought the sunlit feel the palette is built for.
 */
export const bloom =
  "radial-gradient(102% 78% at 34% 14%, rgba(255,252,246,0.42), rgba(255,252,246,0) 64%)";

/**
 * The approved 1A hero grid, read left-to-right, top row then bottom.
 * `sunbleached` and `peach` each appear twice; the test enforces only that no
 * recipe sits next to itself.
 */
export const heroTileOrder: WarmName[] = [
  "peach",
  "sunbleached",
  "terracotta",
  "clay",
  "honey",
  "amber",
  "apricot",
  "blush",
  "sunbleached",
  "peach",
];

export function gradientHexes(css: string): string[] {
  return css.match(/#[0-9A-Fa-f]{6}/g) ?? [];
}

export function gradientAngle(css: string): number {
  const match = css.match(/(-?\d+(?:\.\d+)?)deg/);
  if (!match) {
    throw new Error(`No angle in gradient: ${css}`);
  }
  return Number(match[1]);
}

export function hexToHsl(hex: string): { h: number; l: number; s: number } {
  const r = Number.parseInt(hex.slice(1, 3), 16) / 255;
  const g = Number.parseInt(hex.slice(3, 5), 16) / 255;
  const b = Number.parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;

  if (d === 0) {
    return { h: 0, l: l * 100, s: 0 };
  }

  const s = d / (1 - Math.abs(2 * l - 1));
  let h: number;
  if (max === r) {
    h = 60 * (((g - b) / d) % 6);
  } else if (max === g) {
    h = 60 * ((b - r) / d + 2);
  } else {
    h = 60 * ((r - g) / d + 4);
  }

  return { h: (h + 360) % 360, l: l * 100, s: s * 100 };
}
