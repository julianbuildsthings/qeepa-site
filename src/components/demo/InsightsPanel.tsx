import { motion, MotionConfig } from "motion/react";

import { PhotoFrame } from "@/components/demo/PhotoFrame";
import { durations, easings, presets, stagger } from "@/lib/motion";
import { barFill, barTrack, type ToneName, tones, type TrackName } from "@/lib/tones";

/**
 * Row four, shoot insights.
 *
 * Mirrors the app's real `folder-info-panel.tsx`, which renders the output of
 * `summarise()` in `src/utils/photo-metadata.ts`: the most-used aperture,
 * shutter and ISO each with the percentage of the shoot they account for, a
 * focal-length range, and a gear list with counts. Verified shipped and
 * reachable — the gallery mounts that panel as its `gridInfoSlot`.
 *
 * The percentages are what make this worth showing. "f/2.8" alone is a fact
 * about one photo; "f/2.8, 62% of the shoot" is a fact about how someone
 * shoots, which is the claim the heading makes.
 *
 * The bars fill once on entry rather than looping. The proportion is the
 * information, so animating it clarifies the number; repeating it would just
 * be movement.
 */
const STATS: { label: string; percentage: number; value: string }[] = [
  { label: "Aperture", percentage: 62, value: "f/2.8" },
  { label: "Shutter", percentage: 48, value: "1/125" },
  { label: "ISO", percentage: 41, value: "800" },
];

const GEAR: { count: number; label: string }[] = [
  { count: 318, label: "Canon EOS R6" },
  { count: 110, label: "RF 35mm F1.8" },
];

const FRAMES: { rating: number | null; tone: ToneName; track: TrackName }[] = [
  { rating: 5, tone: "shell", track: "raw" },
  { rating: null, tone: "wheat", track: "jpg" },
  { rating: 4, tone: "linen", track: "raw" },
];

export function InsightsPanel() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="flex aspect-716/496 w-full flex-col justify-center gap-3">
        <div aria-hidden="true" className="grid grid-cols-3 gap-3">
          {FRAMES.map((frame, index) => (
            <PhotoFrame
              className="aspect-3/2"
              frameNumber={4821 + index}
              key={frame.tone}
              rating={frame.rating}
              tone={tones[frame.tone]}
              track={frame.track}
            />
          ))}
        </div>

        <div className="rounded-xl border border-[rgba(43,38,33,0.10)] bg-white p-5 shadow-[0_1px_3px_rgba(43,38,33,0.05),0_24px_56px_-24px_rgba(43,38,33,0.20)]">
          <ul className="flex flex-col gap-3.5">
            {STATS.map((stat, index) => (
              <li key={stat.label}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-[12px] text-text-secondary">
                    {stat.label} · {stat.percentage}%
                  </span>
                  <span className="text-[14px] font-medium text-text-primary tabular-nums">
                    {stat.value}
                  </span>
                </div>
                {/*
                  The track carries `whileInView`, not the fill, and hands the
                  state down as a variant.

                  The fill starts at `scaleX: 0`, which makes its border box
                  zero pixels wide — and an IntersectionObserver whose target
                  has zero area never reports as intersecting. With the
                  observer on the fill itself that deadlocked: the bar could
                  not grow until it was seen, and could not be seen until it
                  had grown, so it sat at zero forever. The track is always
                  full width, so it is always observable.

                  6px, not 4px: at 4px a bar under a label/value row reads as a
                  divider rather than as a quantity.
                */}
                <motion.div
                  className="mt-1.5 h-1.5 overflow-hidden rounded-full"
                  initial="hidden"
                  style={{ background: barTrack }}
                  viewport={{ margin: "-80px", once: true }}
                  whileInView="shown"
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: barFill, transformOrigin: "0% 50%" }}
                    transition={{ ...presets.gentle, delay: index * stagger.relaxed }}
                    variants={{
                      hidden: { scaleX: 0 },
                      shown: { scaleX: stat.percentage / 100 },
                    }}
                  />
                </motion.div>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[rgba(43,38,33,0.07)] pt-4">
            {GEAR.map((item, index) => (
              <motion.span
                className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1.5 text-[12px] text-text-secondary"
                initial={{ opacity: 0, y: 4 }}
                key={item.label}
                transition={{
                  delay: index * stagger.base,
                  duration: durations.base,
                  ease: easings.enter,
                }}
                viewport={{ margin: "-80px", once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                {item.label}
                <span className="text-text-tertiary tabular-nums">{item.count}</span>
              </motion.span>
            ))}
            <span className="ml-auto text-[12px] text-text-tertiary tabular-nums">
              35–85&nbsp;mm
            </span>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}
