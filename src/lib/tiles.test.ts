import { describe, expect, it } from "vitest";

import { features } from "@/lib/copy";
import { heroTileOrder, trackOrder } from "@/lib/gradients";
import { demoFrames, pageTileCounts, totalPageTiles } from "@/lib/tiles";

describe("page tile census", () => {
  it("derives each count from the data that renders it", () => {
    expect(pageTileCounts.hero).toBe(heroTileOrder.length);
    expect(pageTileCounts.tracks).toBe(trackOrder.length);
    expect(pageTileCounts.performance).toBe(demoFrames.performance);
  });

  it("covers every feature row, so no row shows a stale count", () => {
    for (const feature of features) {
      expect(pageTileCounts, feature.id).toHaveProperty(feature.id);
    }
  });

  it("totals every section", () => {
    const sum = Object.values(pageTileCounts).reduce((a, b) => a + b, 0);
    expect(totalPageTiles).toBe(sum);
  });

  it("counts a real, non-zero number the bar can claim honestly", () => {
    for (const [id, count] of Object.entries(pageTileCounts)) {
      expect(count, id).toBeGreaterThan(0);
      expect(Number.isInteger(count), id).toBe(true);
    }
  });
});
