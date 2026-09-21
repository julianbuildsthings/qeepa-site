import { motion, MotionConfig, useReducedMotion } from "motion/react";
import { useState } from "react";

import { durations, easings, stagger } from "@/lib/motion";
import { demoFrames } from "@/lib/tiles";
import { frameBorder, type ToneName, tones } from "@/lib/tones";

/**
 * Row three, fast performance.
 *
 * Speed is the one claim a page cannot argue its way into — "fast" beside a
 * static screenshot argues against itself. So the grid arrives on a very tight
 * stagger and then scrolls continuously, and the frames are small and many,
 * because density is what reads as a large shoot.
 *
 * Small frames also sidestep the scale problem the larger demonstrations have:
 * a gradient reads as a photograph at thumbnail size and as a colour wash when
 * it fills half a row.
 */
const COLUMNS = 8;
const RECIPES: ToneName[] = [
  "shell",
  "chalk",
  "bisque",
  "wheat",
  "linen",
  "oat",
  "almond",
  "ivory",
];

const TILES = Array.from(
  { length: demoFrames.performance },
  (_, index) => RECIPES[index % RECIPES.length] as ToneName,
);

/** One full scroll of the strip, in seconds. Slow enough to read as browsing. */
const SCROLL_SECONDS = 18;

export function GalleryScroll() {
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      {/* biome-ignore lint/a11y/noNoninteractiveElementInteractions: pause affordance, not a control */}
      <div
        className="aspect-716/496 w-full overflow-hidden rounded-xl border border-[rgba(43,38,33,0.10)] bg-surface shadow-[0_1px_3px_rgba(43,38,33,0.05),0_24px_56px_-24px_rgba(43,38,33,0.20)]"
        onBlur={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <motion.div
          animate={paused || reduceMotion ? { y: "0%" } : { y: ["0%", "-46%"] }}
          className="grid gap-1.5 p-3"
          style={{ gridTemplateColumns: `repeat(${COLUMNS}, minmax(0, 1fr))` }}
          transition={{
            duration: SCROLL_SECONDS,
            ease: "linear",
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        >
          {TILES.map((recipe, index) => (
            <motion.div
              animate={{ opacity: 1, scale: 1 }}
              aria-hidden="true"
              className="aspect-3/2 rounded-[3px]"
              initial={{ opacity: 0, scale: 0.94 }}
              // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length decorative grid
              key={index}
              style={{ background: tones[recipe], border: `1px solid ${frameBorder}` }}
              transition={{
                delay: index * stagger.tight,
                duration: durations.quick,
                ease: easings.enter,
              }}
            />
          ))}
        </motion.div>
      </div>
    </MotionConfig>
  );
}
