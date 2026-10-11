/**
 * The colours the page's photo frames are drawn with, and the tracks they
 * belong to.
 *
 * The frames themselves hold the owner's photographs (`src/lib/photos.ts`).
 * These are the colours around and on top of them: the hairline, the fill
 * shown before a photo has decoded, the rating pips and the insights bars.
 * Values for the chrome taken from the approved Paper artboard
 * `G-B · Preview chrome` (file 01M0539MQZEZCYPHPZGFGWQTN6), read with
 * get_computed_styles rather than matched by eye.
 *
 * Everything stays warm, enforced by tones.test.ts. The only non-warm colours
 * on the page are the functional track dots — and the photographs.
 */

/**
 * What a frame shows until its photo has decoded, and where it never will
 * (images blocked). Warm and near-white, from the family of flat tones that
 * stood in for the photos before there were any.
 */
export const frameFill = "#FBF2E8";

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
 * An empty pip on a photograph, where it sits on the frame's dark frosted
 * backing rather than on white: the same quiet square, inverted.
 */
export const pipEmptyOnPhoto = "#FFFFFF59";

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
 * The file extension each track's frames carry, written lower-case as the
 * frames print it. One set for the whole page, so the hero and the tracks row
 * name the same kinds of file. `.af` for the edit: the owner edits in
 * Affinity, and the tracks shot's working file is one.
 */
export const trackExtension: Record<TrackName, string> = {
  edit: "af",
  jpg: "jpg",
  raw: "raw",
};

/**
 * A firmer hairline for the stacked frames. The gallery's border is almost
 * invisible, which is right on a grid where the gaps already separate the
 * frames — but the stack overlaps its own frames on a white page, and at that
 * tint the peeking edges disappeared into the background.
 */
export const stackBorder = "#2B26211F";

/**
 * The hero's ratings, as a loop of four states. The first is what the page
 * renders before anything moves; the hero steps to the next after each full
 * pass through the tracks, and the last steps back to the first.
 *
 * Each step changes exactly two frames — enough to be seen, few enough to read
 * as someone culling rather than as the grid reshuffling — and every state
 * leaves most frames unrated, because most of a real shoot is. `null` is
 * unrated. Frames 1 and 2 change, so the moment still happens on a phone,
 * where only the first four frames show.
 */
export const heroRatings: (number | null)[][] = [
  [4, null, 2, null, null, 5, null, null, 2, null],
  [4, 3, 2, null, null, 5, null, null, null, null],
  [4, 3, 5, null, null, 3, null, null, null, null],
  [4, null, 5, null, null, 3, null, null, 2, null],
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
