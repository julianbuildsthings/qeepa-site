import type { AnimationPlaybackControls } from "motion/react";

import { animate, motion, MotionConfig, useMotionValue, useReducedMotion } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { speeds } from "@/lib/motion";
import { demoFrames } from "@/lib/tiles";
import { frameBorder, scatterTones, tones } from "@/lib/tones";

/**
 * Row three, fast performance.
 *
 * Speed is the one claim a page cannot argue its way into — "fast" beside a
 * static screenshot argues against itself. So the panel is filled edge to edge
 * with small frames and scrolls continuously, because density is what reads as
 * a large shoot.
 *
 * Small frames also sidestep the scale problem the larger demonstrations have:
 * a tone reads as a photograph at thumbnail size and as a colour wash when it
 * fills half a row.
 *
 * The panel is shorter than the 716/496 the other demonstrations use. Eight
 * rows of eight put sixty-odd frames on screen at once, which stopped reading
 * as a large shoot and started reading as a wall; at roughly five rows it is
 * still plainly dense but the eye has somewhere to rest. Rows are deliberately
 * cut off at the top and bottom edge rather than fitting a whole number —
 * a strip that ends flush looks like it stopped.
 *
 * Three things here are less obvious than they look:
 *
 * 1. The strip is rendered twice and travels exactly one strip, so the copy
 *    lands where the original started and the loop has no seam. The previous
 *    version travelled a fixed -46% and reversed, which meant it visibly ran
 *    backwards, and left the lower half of the panel empty throughout because
 *    forty frames never filled it in the first place.
 * 2. Travel is measured, not assumed. The strip's height depends on the column
 *    width, which depends on the panel width, so a hard-coded percentage is
 *    only ever right at one viewport.
 * 3. Hovering pauses the playback where it stands. Swapping the `animate`
 *    target to `y: 0` — the old approach — snapped the strip back to the top
 *    the instant the pointer touched it.
 */
const COLUMNS = 8;

/** One strip. Scattered, so no tone lines up down a column. */
const STRIP = scatterTones(demoFrames.performance, COLUMNS);

export function GalleryScroll() {
  const reduceMotion = useReducedMotion();
  const gridRef = useRef<HTMLDivElement>(null);
  const playback = useRef<AnimationPlaybackControls | null>(null);
  const y = useMotionValue(0);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry?.contentRect.width ?? 0);
    });
    observer.observe(grid);

    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid || reduceMotion || width === 0) return;

    /*
     * The first frame of the duplicate strip sits exactly one strip below the
     * first frame of the original, gap included. Travelling that distance puts
     * the duplicate precisely where the original began.
     */
    const first = grid.children[0] as HTMLElement | undefined;
    const duplicate = grid.children[STRIP.length] as HTMLElement | undefined;
    if (!first || !duplicate) return;

    const travel = duplicate.offsetTop - first.offsetTop;
    if (travel <= 0) return;

    y.set(0);
    playback.current = animate(y, -travel, {
      duration: travel / speeds.gallery,
      ease: "linear",
      repeat: Number.POSITIVE_INFINITY,
      repeatType: "loop",
    });

    return () => {
      playback.current?.stop();
      playback.current = null;
    };
  }, [reduceMotion, width, y]);

  const hold = (paused: boolean) => {
    if (paused) playback.current?.pause();
    else playback.current?.play();
  };

  return (
    <MotionConfig reducedMotion="user">
      {/* biome-ignore lint/a11y/noNoninteractiveElementInteractions: pause affordance, not a control */}
      <div
        className="aspect-716/296 w-full overflow-hidden rounded-xl border border-[rgba(43,38,33,0.10)] bg-white p-3 shadow-[0_1px_3px_rgba(43,38,33,0.05),0_24px_56px_-24px_rgba(43,38,33,0.20)]"
        onBlur={() => hold(false)}
        onFocus={() => hold(true)}
        onMouseEnter={() => hold(true)}
        onMouseLeave={() => hold(false)}
      >
        <motion.div
          aria-hidden="true"
          className="grid gap-1.5"
          ref={gridRef}
          style={{ gridTemplateColumns: `repeat(${COLUMNS}, minmax(0, 1fr))`, y }}
        >
          {[...STRIP, ...STRIP].map((tone, index) => (
            <div
              className="aspect-3/2 rounded-[3px]"
              // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length decorative grid
              key={index}
              style={{ background: tones[tone], border: `1px solid ${frameBorder}` }}
            />
          ))}
        </motion.div>
      </div>
    </MotionConfig>
  );
}
