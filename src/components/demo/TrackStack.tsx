import { motion, MotionConfig, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

import { TrackPill } from "@/components/demo/TrackPill";
import { cycle, presets } from "@/lib/motion";
import { stackBorder, type TrackName, trackOrder, trackTone } from "@/lib/tones";

/**
 * Approved comp `T3 · Tracks — stack`.
 *
 * Three renderings of the same shot, fanned as a stack of prints. The stack
 * cycles RAW → JPG → EDIT on its own, because the point being made is that
 * every version is one shot — and watching it happen says that faster than
 * reading it.
 *
 * All three frames stay mounted and only `transform` and `opacity` animate, so
 * the cross-fade runs on the compositor and nothing appears or vanishes for a
 * screen reader.
 *
 * The loop runs longer than five seconds, so it needs a pause control. The pill
 * is that control: clicking a segment pins that track and ends the loop for
 * good. It also pauses while hovered or focused, and never starts at all under
 * `prefers-reduced-motion`.
 */

/**
 * Per-step depth offset, in px. Wider than the comp's 28px: with flat tones on
 * a white page the frames behind need more of themselves showing to read as a
 * stack rather than a shadow.
 */
const OFFSET = { x: 38, y: -38 };

export function TrackStack() {
  const [active, setActive] = useState<TrackName>("raw");
  const [pinned, setPinned] = useState(false);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();

  const looping = !pinned && !paused && !reduceMotion;

  useEffect(() => {
    if (!looping) return;

    const id = setInterval(() => {
      setActive((current) => {
        const next = (trackOrder.indexOf(current) + 1) % trackOrder.length;
        return trackOrder[next] as TrackName;
      });
    }, cycle.track);

    return () => clearInterval(id);
  }, [looping]);

  const activeIndex = trackOrder.indexOf(active);

  const pin = (track: TrackName) => {
    setPinned(true);
    setActive(track);
  };

  return (
    <MotionConfig reducedMotion="user">
      {/* Hover and focus pause the loop. The wrapper is not focusable itself —
      focus lands on the pill's buttons, which bubble through focus-within. */}
      {/* biome-ignore lint/a11y/noNoninteractiveElementInteractions: pause affordance, not a control */}
      <div
        className="relative aspect-716/496 w-full"
        onBlur={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {trackOrder.map((track, index) => {
          // 0 is the front frame; higher values sit further back in the fan.
          const depth = (activeIndex - index + trackOrder.length) % trackOrder.length;
          return (
            <motion.div
              animate={{
                x: depth * OFFSET.x,
                y: depth * OFFSET.y,
                zIndex: trackOrder.length - depth,
              }}
              aria-hidden="true"
              className="absolute bottom-0 left-0 h-[89%] w-[92%] overflow-hidden rounded-[10px] shadow-[0_2px_6px_rgba(43,38,33,0.07),0_30px_64px_-24px_rgba(43,38,33,0.28)]"
              data-depth={depth}
              data-track={track}
              key={track}
              style={{ background: trackTone[track], border: `1px solid ${stackBorder}` }}
              transition={presets.ui}
            />
          );
        })}

        <div className="absolute bottom-[8%] left-0 z-10 flex w-[92%] justify-center">
          <TrackPill active={active} interactive onSelect={pin} />
        </div>
      </div>
    </MotionConfig>
  );
}
