import { heroTileOrder, trackOrder } from "@/lib/gradients";

/**
 * How many photo frames the landing page actually renders.
 *
 * The floating bar shows this number, and it is a real count rather than app
 * chrome — so it has to stay true. Each entry derives from the data that drives
 * the demonstration wherever possible; a demonstration added later must add its
 * frames here, which `tiles.test.ts` is the reminder for.
 */
export const pageTileCounts = {
  hero: heroTileOrder.length,
  tracks: trackOrder.length,
} satisfies Record<string, number>;

export const totalPageTiles: number = Object.values(pageTileCounts).reduce(
  (sum, count) => sum + count,
  0,
);
