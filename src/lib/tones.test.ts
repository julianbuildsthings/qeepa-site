import { describe, expect, it } from "vitest";

import { heroTileMeta, heroTileOrder, hexToHsl, tones, trackOrder, trackTone } from "@/lib/tones";

const allTones = [...Object.values(tones), ...Object.values(trackTone)];

describe("hexToHsl", () => {
  it("reads lightness", () => {
    expect(hexToHsl("#FFFFFF").l).toBeCloseTo(100, 0);
    expect(hexToHsl("#000000").l).toBeCloseTo(0, 0);
  });

  it("reads hue", () => {
    expect(hexToHsl("#EACDAB").h).toBeGreaterThan(20);
    expect(hexToHsl("#EACDAB").h).toBeLessThan(45);
  });
});

describe("tone palette", () => {
  it("keeps every tone warm", () => {
    for (const hex of allTones) {
      const { h, s } = hexToHsl(hex);
      if (s < 4) continue; // near-white has no meaningful hue
      expect(h, hex).toBeGreaterThanOrEqual(15);
      expect(h, hex).toBeLessThanOrEqual(45);
    }
  });

  it("keeps every tone light enough to stay a surface, not a block of colour", () => {
    for (const hex of allTones) {
      expect(hexToHsl(hex).l, hex).toBeGreaterThan(75);
    }
  });

  it("holds the gallery tones inside a tight range, so the grid reads as one field", () => {
    const lightness = Object.values(tones).map((hex) => hexToHsl(hex).l);
    expect(Math.max(...lightness) - Math.min(...lightness)).toBeLessThan(8);
  });
});

describe("track tones", () => {
  it("draws from the same scheme as every other frame on the page", () => {
    for (const hex of Object.values(trackTone)) {
      expect(Object.values(tones)).toContain(hex);
    }
  });

  it("orders raw palest through to edit deepest", () => {
    const raw = hexToHsl(trackTone.raw).l;
    const jpg = hexToHsl(trackTone.jpg).l;
    const edit = hexToHsl(trackTone.edit).l;

    expect(raw).toBeGreaterThan(jpg);
    expect(jpg).toBeGreaterThan(edit);
  });

  it("gives each track its own tone, so no two frames look identical", () => {
    expect(new Set(Object.values(trackTone)).size).toBe(3);
  });

  it("lists every track in capture-to-deliverable order", () => {
    expect(trackOrder).toEqual(["raw", "jpg", "edit"]);
  });
});

describe("hero grid", () => {
  it("fills the approved 5x2 grid", () => {
    expect(heroTileOrder).toHaveLength(10);
    expect(heroTileMeta).toHaveLength(heroTileOrder.length);
  });

  it("never repeats a tone in adjacent cells", () => {
    for (let i = 1; i < heroTileOrder.length; i++) {
      expect(heroTileOrder[i]).not.toBe(heroTileOrder[i - 1]);
    }
  });

  it("leaves most frames unrated, the way a shoot in progress looks", () => {
    const rated = heroTileMeta.filter((meta) => meta.rating !== null);
    expect(rated.length).toBeGreaterThan(0);
    expect(rated.length).toBeLessThan(heroTileMeta.length / 2);
  });

  it("only ever rates a frame between 1 and 5", () => {
    for (const { rating } of heroTileMeta) {
      if (rating === null) continue;
      expect(rating).toBeGreaterThanOrEqual(1);
      expect(rating).toBeLessThanOrEqual(5);
    }
  });
});
