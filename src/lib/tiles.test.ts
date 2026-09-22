import { describe, expect, it } from "vitest";

import { features } from "@/lib/copy";
import { demoFrames, pageTileCounts, shootSize } from "@/lib/tiles";
import { heroTileOrder, trackOrder } from "@/lib/tones";

describe("page tile census", () => {
  it("derives each count from the data that renders it", () => {
    expect(pageTileCounts.hero).toBe(heroTileOrder.length);
    expect(pageTileCounts.tracks).toBe(trackOrder.length);
    expect(pageTileCounts["local-first"]).toBe(demoFrames.localFirst);
    expect(pageTileCounts.insights).toBe(demoFrames.insights);
    expect(pageTileCounts.management).toBe(demoFrames.management);
  });

  it("covers every feature row, so no row shows a stale count", () => {
    for (const feature of features) {
      expect(pageTileCounts, feature.id).toHaveProperty(feature.id);
    }
  });

  it("counts a real, non-zero number the bar can claim honestly", () => {
    for (const [id, count] of Object.entries(pageTileCounts)) {
      expect(count, id).toBeGreaterThan(0);
      expect(Number.isInteger(count), id).toBe(true);
    }
  });

  /*
   * Fast performance is the one section whose bar names more than is on
   * screen, because the strip is a sample of a shoot that keeps scrolling past
   * the frame. It may never name *fewer* than it draws — that would be the bar
   * undercounting a grid the viewer can see and tally.
   */
  it("lets only the scrolling strip claim more frames than it draws", () => {
    expect(pageTileCounts.performance).toBe(shootSize);
    expect(shootSize).toBeGreaterThan(demoFrames.performance);

    const sampled = new Set(["performance"]);
    for (const [id, count] of Object.entries(pageTileCounts)) {
      if (sampled.has(id)) continue;
      const rendered = Object.values(demoFrames).concat([heroTileOrder.length, trackOrder.length]);
      expect(rendered, id).toContain(count);
    }
  });
});
