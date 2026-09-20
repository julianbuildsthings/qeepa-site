import { describe, expect, it } from "vitest";

import { heroTileOrder, trackOrder } from "@/lib/gradients";
import { pageTileCounts, totalPageTiles } from "@/lib/tiles";

describe("page tile census", () => {
  it("derives each count from the data that renders it", () => {
    expect(pageTileCounts.hero).toBe(heroTileOrder.length);
    expect(pageTileCounts.tracks).toBe(trackOrder.length);
  });

  it("totals every section", () => {
    const sum = Object.values(pageTileCounts).reduce((a, b) => a + b, 0);
    expect(totalPageTiles).toBe(sum);
  });

  it("counts a real, non-zero number the bar can claim honestly", () => {
    expect(totalPageTiles).toBeGreaterThan(0);
    expect(Number.isInteger(totalPageTiles)).toBe(true);
  });
});
