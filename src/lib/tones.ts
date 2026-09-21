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

/** An unfilled rating pip. */
export const pipEmpty = "#2B26211F";

export type TrackName = "edit" | "jpg" | "raw";

/**
 * The order a shot's versions are presented in — the order the tracks demo
 * cycles through, and the order the pill lists them. Capture to deliverable.
 */
export const trackOrder: TrackName[] = ["raw", "jpg", "edit"];

/**
 * Tones for the three renderings of one shot.
 *
 * Deliberately separated more widely than the gallery tones. The tracks
 * demonstration's whole claim is that you can *see* the difference between a
 * RAW, its export and its edit — and near-identical near-whites would make
 * that claim false. Still light, but far enough apart to read at a glance:
 * RAW flattest and palest, EDIT deepest.
 */
export const trackTone: Record<TrackName, string> = {
  edit: "#E5C39E",
  jpg: "#F3E0C8",
  raw: "#FDF9F4",
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
