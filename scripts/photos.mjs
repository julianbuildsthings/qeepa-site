// Turns the owner's photographs into the page's photo assets.
//
//   node scripts/photos.mjs ~/Desktop/qeepa-photos
//
// The originals are 3472 × 4640 JPGs and stay out of the repo. Every frame on
// the page is 3:2, so each photo is cropped to 3:2 here, once, rather than by
// CSS in every frame: the crop is then a decision recorded below, not
// something each component can get subtly different.
//
// Output is WebP, written to src/assets/photos. sharp drops EXIF, XMP and ICC
// metadata unless told to keep it, which matters on a public page: camera
// JPGs carry GPS position, capture time and the body's serial number. The
// orientation flag is applied to the pixels first, so nothing arrives rotated.
//
// The RAW rendering of the tracks shot is Apple's default RAW development of
// the .ORF, the same picture Finder and Preview show for it, read through
// `sips`. That makes this step macOS-only.

import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import sharp from "sharp";

const source = process.argv[2];
if (!source) {
  console.error("usage: node scripts/photos.mjs <folder of originals>");
  process.exit(1);
}

const OUT = new URL("../src/assets/photos/", import.meta.url).pathname;

/** Every frame on the page is 3:2. */
const ASPECT = 3 / 2;

/**
 * Wide enough for the largest grid frame at 2x: the insights row's frames are
 * about 230px across on a desktop column.
 */
const TILE_WIDTH = 480;

/** The stacked tracks frames are about 660px wide on desktop; 1x and 2x. */
const STACK_WIDTHS = [720, 1440];

/**
 * id → original filename, and where to hold the 3:2 crop.
 *
 * `focus` is how far down a portrait original (or across a landscape one) the
 * crop sits: 0 keeps the top edge, 1 the bottom, 0.5 the middle. A portrait
 * shows only the middle 44% of its height in a 3:2 frame, so this is chosen
 * per photo, by eye, to keep the subject in.
 */
const PHOTOS = {
  jubs0001: { file: "JUBS0001.jpg", focus: 0.5 },
  jubs0020: { file: "JUBS0020.jpg", focus: 0.45 },
  jubs0026: { file: "JUBS0026.jpg", focus: 0.45 },
  jubs0028: { file: "JUBS0028.jpg", focus: 0.55 },
  jubs0037: { file: "JUBS0037.jpg", focus: 0.5 },
  jubs0079: { file: "JUBS0079.jpg", focus: 0.45 },
  jubs0086: { file: "JUBS0086.jpg", focus: 0.5 },
  jubs0103: { file: "JUBS0103.jpg", focus: 0.68 },
  jubs0114: { file: "JUBS0114.jpg", focus: 0.55 },
  jubs0230: { file: "JUBS0230.jpg", focus: 0.45 },
  jubs0271: { file: "JUBS0271.jpg", focus: 0.4 },
  jubs0449: { file: "JUBS0449_GRADED.jpg", focus: 0.3 },
  jubs0478: { file: "JUBS0478_GRADED.jpg", focus: 0.72 },
  jubs0925: { file: "JUBS0925.jpg", focus: 0.5 },
  jubs0961: { file: "JUBS0961.jpg", focus: 0.5 },
  jubs0973: { file: "JUBS0973.jpg", focus: 0.5 },
  jubs1156: { file: "JUBS1156.jpg", focus: 0.5 },
  jubs1715: { file: "JUBS1715.jpg", focus: 0.45 },
  jubs1881: { file: "JUBS1881.jpg", focus: 0.5 },
  jubs1909: { file: "JUBS1909.jpg", focus: 0.5 },
  jubs1936: { file: "JUBS1936.jpg", focus: 0.5 },
  jubs2001: { file: "JUBS2001.jpg", focus: 0.4 },
  jubs2330: { file: "JUBS2330_GRADED.jpg", focus: 0.45 },
  jubs2838: { file: "JUBS2838_GRADED.jpg", focus: 0.5 },
  p4065252: { file: "P4065252.jpg", focus: 0.5 },
  p4075354: { file: "P4075354_G.jpg", focus: 0.5 },
  p4075549: { file: "P4075549.jpg", focus: 0.5 },
  p4186744: { file: "P4186744_G.jpg", focus: 0.5 },
  p4186803: { file: "P4186803_G.jpg", focus: 0.5 },
  "red-window": { file: "16. Red Window_Graded.jpg", focus: 0.5 },
};

/** The tracks shot: the RAW and the JPG of one frame, at the stack's sizes. */
const STACK = {
  "jubs0103-jpg": { file: "JUBS0103.jpg", focus: PHOTOS.jubs0103.focus },
  "jubs0103-raw": { file: "JUBS0103.ORF", focus: PHOTOS.jubs0103.focus },
};

/** The 3:2 box inside an upright image, held at `focus` along the long side. */
function crop(width, height, focus) {
  if (width / height > ASPECT) {
    const cropWidth = Math.round(height * ASPECT);
    return { height, left: Math.round((width - cropWidth) * focus), top: 0, width: cropWidth };
  }
  const cropHeight = Math.round(width / ASPECT);
  return { height: cropHeight, left: 0, top: Math.round((height - cropHeight) * focus), width };
}

async function write(input, focus, width, name) {
  // Apply the orientation flag to the pixels before measuring anything.
  const upright = await sharp(input).rotate().toBuffer({ resolveWithObject: true });
  const box = crop(upright.info.width, upright.info.height, focus);
  await sharp(upright.data)
    .extract(box)
    .resize(width, Math.round(width / ASPECT))
    .webp({ quality: 78, effort: 6 })
    .toFile(join(OUT, name));
}

/** A RAW file, developed to a lossless TIFF sharp can read. */
function develop(raw, scratch) {
  const tiff = join(scratch, "developed.tiff");
  execFileSync("sips", ["-s", "format", "tiff", raw, "--out", tiff], { stdio: "ignore" });
  return tiff;
}

mkdirSync(OUT, { recursive: true });
const scratch = mkdtempSync(join(tmpdir(), "qeepa-photos-"));

try {
  for (const [id, { file, focus }] of Object.entries(PHOTOS)) {
    await write(join(source, file), focus, TILE_WIDTH, `${id}.webp`);
  }

  for (const [id, { file, focus }] of Object.entries(STACK)) {
    const input = file.endsWith(".ORF") ? develop(join(source, file), scratch) : join(source, file);
    for (const width of STACK_WIDTHS) await write(input, focus, width, `${id}-${width}.webp`);
  }
} finally {
  rmSync(scratch, { force: true, recursive: true });
}

console.log(
  `${Object.keys(PHOTOS).length} photos and ${Object.keys(STACK).length} stack renderings → ${OUT}`,
);
