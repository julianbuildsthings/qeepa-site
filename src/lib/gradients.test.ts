import { describe, expect, it } from "vitest";

import {
  gradientAngle,
  gradientHexes,
  heroTileOrder,
  hexToHsl,
  trackRender,
  warm,
} from "@/lib/gradients";

const allGradients = [...Object.values(warm), ...Object.values(trackRender)];

describe("gradient parsing helpers", () => {
  it("pulls every hex stop out of a gradient", () => {
    expect(gradientHexes("linear-gradient(178deg,#FFF0DD 0%,#FCBA7F 54%)")).toEqual([
      "#FFF0DD",
      "#FCBA7F",
    ]);
  });

  it("reads the angle", () => {
    expect(gradientAngle("linear-gradient(178deg,#FFF0DD 0%,#FCBA7F 54%)")).toBe(178);
  });

  it("converts hex to hsl", () => {
    expect(hexToHsl("#FFFFFF").l).toBeCloseTo(100, 0);
    expect(hexToHsl("#000000").l).toBeCloseTo(0, 0);
    expect(hexToHsl("#FCBA7F").h).toBeGreaterThan(20);
    expect(hexToHsl("#FCBA7F").h).toBeLessThan(40);
  });
});

describe("warm palette", () => {
  it("ships the eight named recipes", () => {
    expect(Object.keys(warm).sort()).toEqual([
      "amber",
      "apricot",
      "blush",
      "clay",
      "honey",
      "peach",
      "sunbleached",
      "terracotta",
    ]);
  });

  it("keeps every stop in the warm hue range", () => {
    for (const css of allGradients) {
      for (const hex of gradientHexes(css)) {
        const { h, s } = hexToHsl(hex);
        // Near-white stops have no meaningful hue to constrain.
        if (s < 4) continue;
        expect(h, `${hex} in ${css}`).toBeGreaterThanOrEqual(15);
        expect(h, `${hex} in ${css}`).toBeLessThanOrEqual(45);
      }
    }
  });

  it("stays light — nothing reaches the near-blacks the palette used to use", () => {
    for (const css of allGradients) {
      for (const hex of gradientHexes(css)) {
        expect(hexToHsl(hex).l, `${hex} in ${css}`).toBeGreaterThan(38);
      }
    }
  });

  it("keeps light falling from above on every surface", () => {
    for (const css of allGradients) {
      const angle = gradientAngle(css);
      expect(angle, css).toBeGreaterThanOrEqual(170);
      expect(angle, css).toBeLessThanOrEqual(192);
    }
  });
});

describe("track renderings", () => {
  it("orders raw flattest, edit richest", () => {
    const spread = (css: string) => {
      const ls = gradientHexes(css).map((hex) => hexToHsl(hex).l);
      return Math.max(...ls) - Math.min(...ls);
    };
    expect(spread(trackRender.raw)).toBeLessThan(spread(trackRender.jpg));
    expect(spread(trackRender.jpg)).toBeLessThan(spread(trackRender.edit));
  });
});

describe("hero tile order", () => {
  it("fills the approved 5x2 grid", () => {
    expect(heroTileOrder).toHaveLength(10);
  });

  it("never repeats a recipe in adjacent cells", () => {
    for (let i = 1; i < heroTileOrder.length; i++) {
      expect(heroTileOrder[i]).not.toBe(heroTileOrder[i - 1]);
    }
  });
});
