import type { TrackName } from "@/lib/tones";

/**
 * The owner's photographs, in the page's photo frames.
 *
 * Thirty frames from the owner's own shoots, cropped to the page's 3:2 frame
 * and written to `src/assets/photos` by `scripts/photos.mjs`, which records
 * each crop and strips the camera's metadata (GPS position included). One file
 * per photo at 480px, wide enough for the largest grid frame at 2x, so a photo
 * that appears in two places is fetched once. The tracks shot is the exception:
 * it fills a frame several hundred pixels across, so it has its own sizes.
 *
 * Resized ahead of time rather than through Astro's image service, for the
 * same reason as the screenshots: the Cloudflare adapter's default service is
 * the Images binding, which this project does not have.
 */
const files = import.meta.glob<string>("../assets/photos/*.webp", {
  eager: true,
  import: "default",
  query: "?url",
});

function file(name: string): string {
  const url = files[`../assets/photos/${name}.webp`];
  if (!url) throw new Error(`No photo asset named ${name}.webp`);
  return url;
}

export const photoIds = [
  "jubs0001",
  "jubs0020",
  "jubs0026",
  "jubs0028",
  "jubs0037",
  "jubs0079",
  "jubs0086",
  "jubs0103",
  "jubs0114",
  "jubs0230",
  "jubs0016",
  "jubs0449",
  "jubs0478",
  "jubs0925",
  "jubs0961",
  "jubs0973",
  "jubs1156",
  "jubs1715",
  "jubs1881",
  "jubs1909",
  "jubs1936",
  "jubs0838",
  "jubs2330",
  "jubs2838",
  "p4065252",
  "p4075354",
  "p4075549",
  "p4186744",
  "p4186803",
  "red-window",
] as const;

export type PhotoId = (typeof photoIds)[number];

export const photos = Object.fromEntries(photoIds.map((id) => [id, file(id)])) as Record<
  PhotoId,
  string
>;

/**
 * The tracks row's shot, as each track shows it. RAW is Apple's default
 * development of the camera's .ORF; JPG is the finished export.
 *
 * EDIT is the JPG brightened slightly, at the owner's request, so it reads as
 * its own version beside the export. The working file is an Affinity
 * document, which has no browser rendering of its own.
 */
function stack(name: string) {
  return {
    src: file(`${name}-1440`),
    srcSet: `${file(`${name}-720`)} 720w, ${file(`${name}-1440`)} 1440w`,
  };
}

export const trackPhoto: Record<TrackName, { src: string; srcSet: string }> = {
  edit: stack("jubs0103-edit"),
  jpg: stack("jubs0103-jpg"),
  raw: stack("jubs0103-raw"),
};

/**
 * The hero grid, read left-to-right, top row then bottom. The first four are
 * all a phone shows, so they are four of the most different pictures in the
 * set: a flower, an illustration, a landscape and a shelf of colour.
 */
export const heroPhotoOrder: PhotoId[] = [
  "jubs0079",
  "jubs0449",
  "jubs1936",
  "jubs0086",
  "p4186803",
  "jubs0114",
  "jubs2330",
  "jubs0961",
  "jubs0020",
  "p4075549",
];

/**
 * How many track switches before the hero's photos come back to the approved
 * order. Long enough that no one watching sees the repeat; short enough that
 * working out any step's arrangement stays trivial however long the page has
 * been open.
 */
const SHUFFLE_PERIOD = 12;

/**
 * The hero's photos after `step` track switches: the approved order at step 0,
 * then a fresh arrangement of the same photos at every switch, so the frames
 * read as a different set of files in each track rather than one grid
 * relabelled.
 *
 * A seeded shuffle, not randomness, so the server's HTML and the hydrated
 * island agree. Each arrangement moves at least half the frames to a new
 * photo — a shuffle that happened to leave most in place read as nothing
 * happening — and never puts a photo beside itself.
 */
export function shuffledPhotos<T>(order: T[], step: number): T[] {
  const target = step % SHUFFLE_PERIOD;
  let current = order;
  for (let seed = 1; seed <= target; seed++) current = rearranged(order, current, seed);
  return current;
}

function rearranged<T>(order: T[], previous: T[], seed: number): T[] {
  for (let attempt = 0; ; attempt++) {
    const shuffled = [...order];
    for (let index = shuffled.length - 1; index > 0; index--) {
      const pick = mix(seed * 97 + attempt * 13 + index) % (index + 1);
      [shuffled[index], shuffled[pick]] = [shuffled[pick]!, shuffled[index]!];
    }
    const apart = shuffled.every((photo, index) => index === 0 || photo !== shuffled[index - 1]);
    const moved = shuffled.filter((photo, index) => photo !== previous[index]).length;
    if (apart && moved >= order.length / 2) return shuffled;
  }
}

/**
 * xorshift32. Deliberately not a multiplicative hash: the usual constants are
 * odd, so `index * k % n` collapses back into a stripe for small `n`.
 */
function mix(index: number): number {
  let x = index + 1;
  x = (x ^ (x << 13)) >>> 0;
  x = (x ^ (x >>> 17)) >>> 0;
  x = (x ^ (x << 5)) >>> 0;
  return x >>> 0;
}

/**
 * The fast-performance strip: every photo on the page, `passes` times over, in
 * one seeded order.
 *
 * The same order each pass, not a fresh one, because that is what keeps
 * repeats furthest apart: each photo recurs exactly one pass later, and the
 * strip loops, so the gap is the same going round. At five columns thirty
 * photos is six rows, twice the height of the window — no photo is ever on
 * screen twice.
 */
export function galleryStrip(passes: number): PhotoId[] {
  const pass = shuffledPhotos([...photoIds], 1);
  return Array.from({ length: passes }, () => pass).flat();
}
