import { describe, expect, it } from "vitest";

import {
  barFill,
  barTrack,
  contrastRatio,
  heroTileMeta,
  heroTileOrder,
  hexToHsl,
  scatterTones,
  tones,
  trackOrder,
  trackTone,
} from "@/lib/tones";

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

describe("contrastRatio", () => {
  it("brackets the scale", () => {
    expect(contrastRatio("#FFFFFF", "#000000")).toBeCloseTo(21, 1);
    expect(contrastRatio("#FFFFFF", "#FFFFFF")).toBeCloseTo(1, 5);
  });

  it("is order-independent", () => {
    expect(contrastRatio("#B67B47", "#FFFFFF")).toBeCloseTo(contrastRatio("#FFFFFF", "#B67B47"), 5);
  });
});

describe("proportion bars", () => {
  it("uses the brand primary for the fill", () => {
    expect(barFill).toBe("#FCBA7F");
  });

  it("runs that fill in a warm track, never a grey one", () => {
    // Grey and peach-accent sit at almost the same luminance, so a grey track
    // cannot separate from this fill at any opacity. The pair has to part on
    // hue and saturation instead.
    for (const colour of [barFill, barTrack]) {
      const { h, s } = hexToHsl(colour);
      expect(h, colour).toBeGreaterThan(15);
      expect(h, colour).toBeLessThan(45);
      expect(s, colour).toBeGreaterThan(20);
    }
  });

  it("keeps the track the paler of the two", () => {
    expect(contrastRatio(barTrack, "#FFFFFF")).toBeLessThan(contrastRatio(barFill, "#FFFFFF"));
  });
});

describe("scatterTones", () => {
  const COLUMNS = 8;
  const grid = scatterTones(96, COLUMNS);

  it("returns one tone per cell", () => {
    expect(grid).toHaveLength(96);
    for (const tone of grid) {
      expect(Object.keys(tones)).toContain(tone);
    }
  });

  it("is deterministic, so the server and the client agree", () => {
    expect(scatterTones(96, COLUMNS)).toEqual(grid);
  });

  it("never repeats a tone beside itself", () => {
    const pairs = grid.flatMap((tone, index) =>
      index % COLUMNS === 0 ? [] : [[index, tone, grid[index - 1]] as const],
    );

    for (const [index, tone, left] of pairs) {
      expect(tone, `cell ${index} matches its left neighbour`).not.toBe(left);
    }
  });

  it("never repeats a tone above itself", () => {
    const pairs = grid.flatMap((tone, index) =>
      index < COLUMNS ? [] : [[index, tone, grid[index - COLUMNS]] as const],
    );

    for (const [index, tone, above] of pairs) {
      expect(tone, `cell ${index} matches the cell above`).not.toBe(above);
    }
  });

  /*
   * The bug this function exists to fix. With eight tones and eight columns,
   * `index % length` gave every column a single tone all the way down, and the
   * grid read as stripes.
   */
  it("never lays a single tone down a whole column", () => {
    for (let column = 0; column < COLUMNS; column++) {
      const down = grid.filter((_, index) => index % COLUMNS === column);
      expect(new Set(down).size, `column ${column}`).toBeGreaterThan(1);
    }
  });

  it("uses the whole palette rather than favouring a few tones", () => {
    expect(new Set(grid).size).toBe(Object.keys(tones).length);
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
