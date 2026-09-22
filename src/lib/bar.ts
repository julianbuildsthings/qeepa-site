import type { BarSection } from "@/components/site/FloatingBar";

import { features } from "@/lib/copy";
import { pageTileCounts } from "@/lib/tiles";

/**
 * The floating bar's sections: every feature row, in page order, with the name
 * it is headed by and the photo count the tile census gives it.
 *
 * Derived rather than written out, so the stars, the Features menu and the
 * rows themselves are always the same five things in the same order. The nth
 * entry is the section marked by n stars.
 */
export const barSections: BarSection[] = features.map((feature) => ({
  count: pageTileCounts[feature.id],
  id: feature.id,
  title: feature.heading,
}));
