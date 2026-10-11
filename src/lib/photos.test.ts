import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { FILES } from "@/components/demo/SidecarDemo";
import {
  galleryStrip,
  heroPhotoOrder,
  type PhotoId,
  photoIds,
  photos,
  shuffledPhotos,
  trackPhoto,
} from "@/lib/photos";
import { demoFrames } from "@/lib/tiles";
import { trackOrder } from "@/lib/tones";

const ASSETS = "src/assets/photos";

describe("photo assets", () => {
  it("has a file for every photo, and no photo without one", () => {
    const tiles = readdirSync(ASSETS)
      .filter((name) => /^[a-z0-9-]+\.webp$/.test(name) && !/-\d+\.webp$/.test(name))
      .map((name) => name.replace(/\.webp$/, ""));
    expect(tiles.toSorted()).toEqual([...photoIds].toSorted());
  });

  it("resolves every photo to a URL", () => {
    for (const id of photoIds) expect(photos[id], id).toMatch(/\.webp/);
  });

  /*
   * sharp strips metadata unless asked to keep it, and scripts/photos.mjs
   * never asks. This is the guard on that: a camera JPG carries the GPS
   * position it was taken at, and a WebP's EXIF lives in a chunk tagged
   * `EXIF` — so the tag must never appear.
   */
  it("publishes no camera metadata", () => {
    for (const name of readdirSync(ASSETS).filter((file) => file.endsWith(".webp"))) {
      const bytes = readFileSync(`${ASSETS}/${name}`);
      expect(bytes.includes("EXIF"), name).toBe(false);
      expect(bytes.includes("XMP "), name).toBe(false);
    }
  });
});

describe("tracks photo", () => {
  it("shows one shot on every track", () => {
    for (const track of trackOrder) expect(trackPhoto[track].src, track).toMatch(/jubs0103/);
  });

  it("shows the RAW as its own rendering", () => {
    expect(trackPhoto.raw.src).not.toBe(trackPhoto.jpg.src);
  });

  // The owner's decision, until the page presents them as two different files.
  it("shows the edit and the export as the same picture, for now", () => {
    expect(trackPhoto.edit).toEqual(trackPhoto.jpg);
  });
});

describe("hero photos", () => {
  it("fills the approved 5x2 grid with ten different photos", () => {
    expect(heroPhotoOrder).toHaveLength(10);
    expect(new Set(heroPhotoOrder).size).toBe(heroPhotoOrder.length);
  });
});

describe("shuffledPhotos", () => {
  it("keeps the approved order before anything moves", () => {
    expect(shuffledPhotos(heroPhotoOrder, 0)).toBe(heroPhotoOrder);
  });

  it("rearranges the same photos at every switch", () => {
    for (let step = 1; step < 30; step++) {
      expect(shuffledPhotos(heroPhotoOrder, step).toSorted()).toEqual(heroPhotoOrder.toSorted());
    }
  });

  it("moves most frames to a new photo at each switch", () => {
    for (let step = 1; step < 30; step++) {
      const before = shuffledPhotos(heroPhotoOrder, step - 1);
      const after = shuffledPhotos(heroPhotoOrder, step);
      const changed = after.filter((photo, index) => photo !== before[index]).length;
      expect(changed).toBeGreaterThanOrEqual(heroPhotoOrder.length / 2);
    }
  });

  it("is deterministic, so the server and the island agree", () => {
    expect(shuffledPhotos(heroPhotoOrder, 7)).toEqual(shuffledPhotos(heroPhotoOrder, 7));
  });
});

describe("gallery strip", () => {
  const COLUMNS = 5;
  const passes = demoFrames.performance / photoIds.length;
  const strip = galleryStrip(passes);

  it("draws exactly the frames the census counts, in whole passes", () => {
    expect(Number.isInteger(passes)).toBe(true);
    expect(strip).toHaveLength(demoFrames.performance);
  });

  it("uses every photo on the page, equally often", () => {
    for (const id of photoIds) {
      expect(
        strip.filter((photo) => photo === id),
        id,
      ).toHaveLength(passes);
    }
  });

  /*
   * The window shows a little under three rows. A photo's next appearance —
   * counting round the loop, since the strip repeats — must be further away
   * than that, or the same picture would be on screen twice.
   */
  it("never shows a photo twice in one window", () => {
    const windowRows = 3;
    for (let index = 0; index < strip.length; index++) {
      for (let ahead = 1; ahead <= (windowRows + 1) * COLUMNS; ahead++) {
        expect(strip[(index + ahead) % strip.length], `frame ${index}`).not.toBe(strip[index]);
      }
    }
  });
});

describe("photos across the page", () => {
  /*
   * Read from the components, so this sees what they actually render. Each
   * section shows its own photos; only the fast-performance strip, which is
   * every photo on the page, repeats them.
   */
  const source = (name: string) => readFileSync(`src/components/demo/${name}.tsx`, "utf8");
  const ids = (text: string) =>
    [...text.matchAll(/photo: "([a-z0-9-]+)"/g)].map((match) => match[1] as PhotoId);

  it("gives every section its own photos", () => {
    const sections = {
      hero: heroPhotoOrder,
      insights: ids(source("InsightsPanel")),
      "local-first": FILES.map((file) => file.photo),
      management: ids(source("FilterReveal")),
      tracks: ["jubs0103" as PhotoId],
    };

    expect(sections.insights).toHaveLength(demoFrames.insights);
    expect(sections["local-first"]).toHaveLength(demoFrames.localFirst);
    expect(sections.management).toHaveLength(demoFrames.management);

    const all = Object.values(sections).flat();
    expect(new Set(all).size, "a photo appears in two sections").toBe(all.length);
    expect(all.toSorted()).toEqual([...photoIds].toSorted());
  });
});
