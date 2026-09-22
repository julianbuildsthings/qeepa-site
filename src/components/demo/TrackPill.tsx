import { animate, motion, useMotionValue, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

import type { TrackName } from "@/lib/tones";

import { presets } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * The recurring component of the page: the app's own track switcher, appearing
 * in the hero and in the feature rows. Structure and motion follow the app's
 * `src/components/gallery/track-pill.tsx` so the site and the product agree on
 * what this control is and how it behaves.
 *
 * The coloured dot is decorative. The label carries the meaning, so track state
 * is never conveyed by colour alone.
 */
const TRACKS: { dot: string; key: TrackName; label: string }[] = [
  { dot: "bg-raw", key: "raw", label: "RAW" },
  { dot: "bg-jpg", key: "jpg", label: "JPG" },
  { dot: "bg-af", key: "edit", label: "EDIT" },
];

type TrackPillProps = {
  active: TrackName;
  /**
   * Static by default. A pill rendered into static HTML must not look
   * clickable, so non-interactive pills render spans rather than disabled
   * buttons — and paint the active fill as a plain background, since there is
   * no JavaScript on that instance to measure a travelling one.
   */
  interactive?: boolean;
  onSelect?: (track: TrackName) => void;
};

/*
 * Every segment keeps the same font weight in every state, exactly as the app
 * does. An earlier version set the active segment in `font-medium`, which
 * changed its width on each switch and shoved the other two segments sideways
 * underneath the fill — the pill appeared to lurch rather than slide.
 */
const SEGMENT_BASE =
  "relative inline-flex items-center gap-1.5 rounded-full px-3 py-[7px] text-[13px] leading-4 transition-colors sm:px-[18px]";

/*
 * The active label, one step darker than the app's `--peach-dark`. The app's
 * value on the peach fill measured APCA Lc 58.6 at 13px, just under the 60 a
 * label that size needs; this measures Lc 63.5 and reads as the same brown.
 */
const ACTIVE_LABEL = "text-[#5C300C]";

export function TrackPill({ active, interactive = false, onSelect }: TrackPillProps) {
  const activeIndex = TRACKS.findIndex((track) => track.key === active);

  /*
   * The fill is positioned from the active segment's measured box rather than
   * sharing a `layoutId` — the same decision, and the same reasoning, as the
   * app. It is pinned at the target width and travels as two transforms (`x`
   * and `scaleX`), so the animation runs on the compositor; animating `width`
   * instead re-lays-out the fill on every frame.
   */
  const segmentRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const width = useMotionValue(0);
  const height = useMotionValue(0);
  const scaleX = useMotionValue(1);
  const hasMeasured = useRef(false);
  const reduceMotion = useReducedMotion();

  const setSegmentRef = useCallback((element: HTMLButtonElement | null) => {
    const rawIndex = element?.dataset.index;
    if (rawIndex === undefined) return;

    const index = Number(rawIndex);
    segmentRefs.current[index] = element;
    return () => {
      segmentRefs.current[index] = null;
    };
  }, []);

  useLayoutEffect(() => {
    if (!interactive) return;

    const segment = segmentRefs.current[activeIndex];
    if (!segment) return;

    // Height and y never animate — the fill just matches the segment's box.
    height.set(segment.offsetHeight);
    y.set(segment.offsetTop);

    const nextWidth = segment.offsetWidth;
    if (!hasMeasured.current) {
      hasMeasured.current = true;
      x.set(segment.offsetLeft);
      width.set(nextWidth);
      scaleX.set(1);
      return;
    }

    if (width.get() > 0 && width.get() !== nextWidth) {
      scaleX.set(width.get() / nextWidth);
    }
    width.set(nextWidth);
    // Imperative `animate()` answers to no MotionConfig, so the reduced-motion
    // preference is honoured here directly: the fill moves to its segment
    // without travelling there.
    if (reduceMotion) {
      x.set(segment.offsetLeft);
      scaleX.set(1);
      return;
    }
    animate(x, segment.offsetLeft, presets.lively);
    animate(scaleX, 1, presets.lively);
  }, [activeIndex, height, interactive, reduceMotion, scaleX, width, x, y]);

  /*
   * Segment widths change at the sm breakpoint, where the padding tightens for
   * phones. Snap the fill to the active segment's new box on resize — snap,
   * not animate, because nothing moved from the viewer's point of view.
   */
  useEffect(() => {
    if (!interactive) return;

    const snap = () => {
      const segment = segmentRefs.current[activeIndex];
      if (!segment) return;
      x.set(segment.offsetLeft);
      y.set(segment.offsetTop);
      width.set(segment.offsetWidth);
      height.set(segment.offsetHeight);
      scaleX.set(1);
    };

    window.addEventListener("resize", snap, { passive: true });
    return () => window.removeEventListener("resize", snap);
  }, [activeIndex, height, interactive, scaleX, width, x, y]);

  return (
    <div className="relative inline-flex items-center rounded-full border border-[rgba(43,38,33,0.10)] bg-[rgba(255,255,255,0.96)] p-1 shadow-[0_1px_2px_rgba(43,38,33,0.08),0_10px_28px_-4px_rgba(43,38,33,0.28)]">
      {interactive && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 rounded-full bg-primary"
          style={{ height, scaleX, transformOrigin: "0% 50%", width, x, y }}
        />
      )}

      <ul className="inline-flex items-center gap-0.5">
        {TRACKS.map(({ dot, key, label }, index) => {
          const isActive = key === active;
          const inner = (
            <>
              <span
                aria-hidden="true"
                className={cn("relative size-[7px] shrink-0 rounded-full", dot)}
                data-track-dot
              />
              <span className="relative whitespace-nowrap">{label}</span>
            </>
          );

          return (
            <li aria-current={isActive ? "true" : undefined} key={key}>
              {interactive ? (
                <button
                  className={cn(
                    SEGMENT_BASE,
                    "extend-touch-target-y min-h-6 touch-manipulation focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                    isActive ? ACTIVE_LABEL : "text-text-secondary hover:text-text-primary",
                  )}
                  data-index={index}
                  onClick={() => onSelect?.(key)}
                  ref={setSegmentRef}
                  type="button"
                >
                  {inner}
                </button>
              ) : (
                <span
                  className={cn(
                    SEGMENT_BASE,
                    isActive ? cn("bg-primary", ACTIVE_LABEL) : "text-text-secondary",
                  )}
                >
                  {inner}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
