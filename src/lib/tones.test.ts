import { describe, expect, it } from "vitest";

import { heroPhotoOrder } from "@/lib/photos";
import {
  barFill,
  barTrack,
  contrastRatio,
  frameFill,
  heroRatings,
  hexToHsl,
  trackOrder,
} from "@/lib/tones";

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

describe("frame fill", () => {
  it("stays warm and near-white, so a frame still loading reads as the page's material", () => {
    const { h, l } = hexToHsl(frameFill);
    expect(h).toBeGreaterThanOrEqual(15);
    expect(h).toBeLessThanOrEqual(45);
    expect(l).toBeGreaterThan(75);
  });
});

describe("tracks", () => {
  it("lists every track in capture-to-deliverable order", () => {
    expect(trackOrder).toEqual(["raw", "jpg", "edit"]);
  });
});

describe("hero ratings", () => {
  it("rates every frame of the hero grid", () => {
    for (const ratings of heroRatings) expect(ratings).toHaveLength(heroPhotoOrder.length);
  });

  it("leaves most frames unrated in every state, the way a shoot in progress looks", () => {
    for (const ratings of heroRatings) {
      const rated = ratings.filter((rating) => rating !== null);
      expect(rated.length).toBeGreaterThan(0);
      expect(rated.length).toBeLessThan(ratings.length / 2);
    }
  });

  it("only ever rates a frame between 1 and 5", () => {
    for (const rating of heroRatings.flat()) {
      if (rating === null) continue;
      expect(rating).toBeGreaterThanOrEqual(1);
      expect(rating).toBeLessThanOrEqual(5);
    }
  });

  it("changes exactly two frames per step, around a closed loop", () => {
    for (let step = 0; step < heroRatings.length; step++) {
      const from = heroRatings[step]!;
      const to = heroRatings[(step + 1) % heroRatings.length]!;
      expect(from.filter((rating, index) => rating !== to[index])).toHaveLength(2);
    }
  });

  it("changes a frame a phone can see at every step", () => {
    const phoneFrames = 4;
    for (let step = 0; step < heroRatings.length; step++) {
      const from = heroRatings[step]!;
      const to = heroRatings[(step + 1) % heroRatings.length]!;
      const changed = from.flatMap((rating, index) => (rating !== to[index] ? [index] : []));
      expect(changed.some((index) => index < phoneFrames)).toBe(true);
    }
  });
});
