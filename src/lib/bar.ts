import type { BarSection } from "@/components/site/FloatingBar";

import { features } from "@/lib/copy";
import { pageTileCounts } from "@/lib/tiles";

/**
 * The floating bar's sections: every feature row, in page order, with the name
 * it is headed by and the photo count the tile census gives it.
 *
 * Derived rather than written out, so the bar's label and the rows themselves
 * are always the same five things in the same order.
 */
export const barSections: BarSection[] = features.map((feature) => ({
  count: pageTileCounts[feature.id],
  id: feature.id,
  title: feature.heading,
}));
