import type { AnimationPlaybackControls } from "motion/react";

import { animate, motion, MotionConfig, useMotionValue, useReducedMotion } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { PhotoFrame } from "@/components/demo/PhotoFrame";
import { WindowBar } from "@/components/demo/WindowBar";
import { easings, speeds } from "@/lib/motion";
import { demoFrames } from "@/lib/tiles";
import { scatterTones, tones } from "@/lib/tones";

/**
 * Row three, fast performance.
 *
 * Speed is the one claim a page cannot argue its way into — "fast" beside a
 * static screenshot argues against itself. So this is the hero's window,
 * scrolling: the same title strip, the same padding, five columns of frames,
 * moving continuously through a shoot.
 *
 * The window is what makes it read as the app. An earlier version was a bare
 * rounded box of eight-wide swatches and read as a texture instead.
 *
 * The frames themselves are bare tones, without the track dot, rating and
 * number the hero's carry. With sixty-odd frames passing at speed, that chrome
 * repeated on every one was too heavy — the strip's job is to convey volume
 * and pace, and the hero has already shown what a single frame carries.
 *
 * Unlike the hero, the window is closed at the bottom. The hero bleeds into
 * the section beneath it; this sits inside a feature row and has to read as a
 * whole object.
 *
 * Three things here are less obvious than they look:
 *
 * 1. The strip is rendered twice and travels exactly one strip, so the copy
 *    lands where the original started and the loop has no seam.
 * 2. Travel is measured, not assumed. The strip's height depends on the column
 *    width, which depends on the panel width, so a hard-coded percentage is
 *    only ever right at one viewport.
 * 3. It does not pause on hover. It once did, and a visitor whose pointer
 *    rested on the window early never saw the one thing this row is for —
 *    speed. Reduced motion is what stops it.
 *
 * Rows are cut at the top and bottom of the viewport rather than fitting a
 * whole number — a strip that ends flush looks like it stopped.
 */
const COLUMNS = 5;

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
      ease: easings.linear,
      repeat: Number.POSITIVE_INFINITY,
      repeatType: "loop",
    });

    return () => {
      playback.current?.stop();
      playback.current = null;
    };
  }, [reduceMotion, width, y]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="w-full overflow-hidden rounded-2xl border border-[rgba(43,38,33,0.10)] bg-white shadow-[0_1px_3px_rgba(43,38,33,0.05),0_28px_64px_-24px_rgba(43,38,33,0.20)]">
        <WindowBar />

        {/* The viewport the strip scrolls through. Horizontal padding matches
        the hero's 18px; there is no vertical padding, because frames scroll up
        under the title strip and out of the bottom edge. */}
        <div className="aspect-716/280 overflow-hidden px-[18px]">
          <motion.div
            aria-hidden="true"
            className="grid gap-3"
            ref={gridRef}
            style={{ gridTemplateColumns: `repeat(${COLUMNS}, minmax(0, 1fr))`, y }}
          >
            {[...STRIP, ...STRIP].map((tone, index) => (
              <PhotoFrame
                className="aspect-3/2"
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length decorative grid
                key={index}
                tone={tones[tone]}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </MotionConfig>
  );
}
