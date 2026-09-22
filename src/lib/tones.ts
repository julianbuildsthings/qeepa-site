/**
 * Flat tones standing in for photographs.
 *
 * This replaces the earlier gradient registry. Gradients were the wrong form,
 * not the wrong colour: a gradient rectangle reads as a colour swatch at any
 * size, and no palette fixes that. A flat tone carrying a photo's *metadata* —
 * its track, its frame number, its rating — reads as a photo preview, because
 * the information is doing the work the picture was failing to do.
 *
 * Values taken from the approved Paper artboard `G-B · Preview chrome`
 * (file 01M0539MQZEZCYPHPZGFGWQTN6), read with get_computed_styles rather than
 * matched by eye.
 *
 * Two rules, enforced by tones.test.ts:
 *
 * 1. Everything stays warm. The only non-warm colour on the page is the three
 *    functional track dots.
 * 2. Everything stays light. These are near-white surfaces; a tone dark enough
 *    to compete with the type has stopped being a photo stand-in and become a
 *    block of colour.
 */
export type ToneName =
  | "almond"
  | "bisque"
  | "chalk"
  | "ivory"
  | "linen"
  | "oat"
  | "shell"
  | "wheat";

export const tones: Record<ToneName, string> = {
  almond: "#F8EBDC",
  bisque: "#F9EEE1",
  chalk: "#FEFAF6",
  ivory: "#FDF8F2",
  linen: "#FBF2E8",
  oat: "#FAF0E5",
  shell: "#FCF5ED",
  wheat: "#FDF7F0",
};

/** Hairline on every frame. Warm-tinted, never neutral grey. */
export const frameBorder = "#2B262114";

/**
 * Rating pips.
 *
 * Bracketed between two extremes this has already been through. At `--color-raw`
 * (#C8752A) a grid of them pulled the eye straight past the headline; at
 * `--peach-accent` (#FCBA7F) they vanished into the near-white frames entirely.
 * The midpoint was still too heavy, so this sits about 45% of the way from the
 * dark end toward the peach: present at a glance across a twelve-frame grid,
 * but never the first thing the eye lands on.
 */
export const pipFilled = "#EEA767";
export const pipEmpty = "#2B26211F";

/**
 * The filled portion of a proportion bar, and the track it runs in.
 *
 * The fill is `--primary` / `--peach-accent` and the track is `--peach-light`:
 * the same peach at two depths, so a bar reads as one channel partly filled
 * rather than as a coloured mark laid on a grey rule.
 *
 * The earlier grey track was the reason these bars were hard to see. Grey and
 * peach-accent sit at almost the same luminance, so deepening the grey does
 * not separate them — it passes *through* the fill (1.04:1 at 24% black) and
 * only parts again once the track has gone dark enough to dominate the card.
 * A warm track separates on hue and saturation instead, which is what the app
 * does everywhere else.
 *
 * At 1.46:1 this pair is below WCAG 1.4.11's 3:1 floor for a graphical object,
 * and that is acceptable here for one specific reason: every bar's number is
 * already written beside it, as "Aperture · 62%". The bar reinforces a figure
 * the label states outright, so it is never the sole carrier of information.
 * InsightsPanel.test.tsx guards that, and the day a bar loses its printed
 * percentage the guard fails and the fill has to darken.
 */
export const barFill = "#FCBA7F";
export const barTrack = "#FDECD9";

export type TrackName = "edit" | "jpg" | "raw";

/**
 * The order a shot's versions are presented in — the order the tracks demo
 * cycles through, and the order the pill lists them. Capture to deliverable.
 */
export const trackOrder: TrackName[] = ["raw", "jpg", "edit"];

/**
 * Tones for the three renderings of one shot — drawn from the same scheme as
 * every other frame on the page, so the tracks row does not read as a
 * different material.
 *
 * An earlier version separated these much more widely, because three
 * near-white frames overlapping on white read as one shape and the row's whole
 * claim disappeared. Giving the stacked frames their chrome solved that better:
 * each carries its own coloured track dot, so the *information* tells them
 * apart and the tones no longer have to. Still ordered palest to deepest, which
 * is true to how a RAW, an export and a graded edit differ.
 */
export const trackTone: Record<TrackName, string> = {
  edit: tones.almond,
  jpg: tones.wheat,
  raw: tones.chalk,
};

/**
 * A firmer hairline for the stacked frames. The gallery's border is almost
 * invisible, which is right on a grid where the gaps already separate the
 * frames — but the stack overlaps its own frames on a white page, and at that
 * tint the peeking edges disappeared into the background.
 */
export const stackBorder = "#2B26211F";

/** The approved hero grid, read left-to-right, top row then bottom. */
export const heroTileOrder: ToneName[] = [
  "shell",
  "chalk",
  "bisque",
  "wheat",
  "linen",
  "chalk",
  "almond",
  "ivory",
  "shell",
  "oat",
];

/**
 * Which track each hero frame belongs to, and what it is rated. `null` means
 * unrated — most of a real shoot is, and a grid where every frame carries a
 * rating reads as a product screenshot rather than work in progress.
 */
export const heroTileMeta: { rating: number | null; track: TrackName }[] = [
  { rating: 4, track: "raw" },
  { rating: null, track: "jpg" },
  { rating: 2, track: "raw" },
  { rating: null, track: "edit" },
  { rating: null, track: "raw" },
  { rating: 5, track: "jpg" },
  { rating: null, track: "raw" },
  { rating: null, track: "edit" },
  { rating: 2, track: "raw" },
  { rating: null, track: "jpg" },
];

/** Relative luminance, per WCAG 2.1. Opaque `#rrggbb` only. */
export function luminance(hex: string): number {
  const channels = [1, 3, 5].map((offset) => {
    const value = Number.parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * channels[0]! + 0.7152 * channels[1]! + 0.0722 * channels[2]!;
}

/** WCAG contrast ratio between two opaque colours, 1–21. */
export function contrastRatio(a: string, b: string): number {
  const [lighter, darker] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (lighter! + 0.05) / (darker! + 0.05);
}

/**
 * xorshift32. Deliberately not a multiplicative hash: the usual constants are
 * odd, so `index * k % 8` collapses back to `index % 8` — which is exactly the
 * stripe `scatterTones` exists to remove.
 */
function mix(index: number): number {
  let x = index + 1;
  x = (x ^ (x << 13)) >>> 0;
  x = (x ^ (x >>> 17)) >>> 0;
  x = (x ^ (x << 5)) >>> 0;
  return x >>> 0;
}

/**
 * A scatter of tones across a grid, with no tone repeating immediately to the
 * left of or above itself.
 *
 * Deterministic, which matters twice over: Astro renders these on the server
 * and React has to produce the same markup on hydration, and a guard can only
 * assert against a fixed sequence. So this is a scatter, not randomness.
 *
 * It replaces `index % palette.length`, which on an eight-wide grid with eight
 * tones laid an identical tone down every column. That read as stripes rather
 * than as a shoot — the one thing a wall of photo frames must not look like.
 */
export function scatterTones(count: number, columns: number): ToneName[] {
  const names = Object.keys(tones) as ToneName[];
  const scattered: ToneName[] = [];

  for (let index = 0; index < count; index++) {
    const left = index % columns === 0 ? null : scattered[index - 1];
    const above = index < columns ? null : scattered[index - columns];
    const choices = names.filter((name) => name !== left && name !== above);
    scattered.push(choices[mix(index) % choices.length]!);
  }

  return scattered;
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
