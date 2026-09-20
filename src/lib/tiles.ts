import { heroTileOrder, trackOrder } from "@/lib/gradients";

/**
 * How many photo frames each section of the landing page renders.
 *
 * The floating bar shows this number for whichever section you are in, and it
 * is a real count rather than app chrome — so it has to stay true. This module
 * is the single source: the demonstrations read their frame counts from here
 * rather than hard-coding a length, so the two cannot drift apart.
 */
export const demoFrames = {
  /** One row per file in a shot's set: RAW, JPEG, working file. */
  localFirst: 3,
  /** The shots the settings panel is summarising. */
  insights: 3,
  /** Enough to read as a large shoot rather than a sample. */
  performance: 40,
  /** Twelve before filtering, four after. */
  management: 12,
} satisfies Record<string, number>;

export const pageTileCounts = {
  hero: heroTileOrder.length,
  tracks: trackOrder.length,
  "local-first": demoFrames.localFirst,
  performance: demoFrames.performance,
  insights: demoFrames.insights,
  management: demoFrames.management,
} satisfies Record<string, number>;

export const totalPageTiles: number = Object.values(pageTileCounts).reduce(
  (sum, count) => sum + count,
  0,
);
