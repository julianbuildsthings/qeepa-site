import { heroTileOrder, trackOrder } from "@/lib/tones";

/**
 * How many photo frames each demonstration actually draws.
 *
 * The demonstrations read their frame counts from here rather than hard-coding
 * a length, so a component and the census cannot drift apart.
 */
export const demoFrames = {
  /** One row per file in a shot's set: RAW, JPEG, web export, working file. */
  localFirst: 4,
  /** The shots the settings panel is summarising. */
  insights: 3,
  /**
   * One strip of the scrolling gallery. Rendered twice, so the second copy is
   * already in place when the first scrolls away and the loop has no seam.
   *
   * Twelve rows of five — longer than the viewport needs, to keep the loop
   * from coming round too often: at the strip's speed this is about seven
   * seconds of travel. Only the rows inside the window are ever painted.
   */
  performance: 60,
  /** Twelve before filtering, four after. Matches FRAMES in FilterReveal. */
  management: 12,
} satisfies Record<string, number>;

/**
 * What the floating bar says for each section.
 *
 * Every section states the frames it actually draws, with one deliberate
 * exception. Fast performance is a window onto a shoot that keeps scrolling
 * past the frame: the strip is a sample of the set, not the set. Naming the
 * ninety-six frames that happen to fit would contradict the sentence beside
 * it, so the bar names the shoot. `shootSize` is the only number on this page
 * that is larger than what is on screen, and it is guarded as such.
 */
export const shootSize = 1127;

export const pageTileCounts = {
  hero: heroTileOrder.length,
  tracks: trackOrder.length,
  "local-first": demoFrames.localFirst,
  performance: shootSize,
  insights: demoFrames.insights,
  management: demoFrames.management,
} satisfies Record<string, number>;
