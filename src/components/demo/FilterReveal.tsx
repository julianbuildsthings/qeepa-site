import { AnimatePresence, motion, MotionConfig, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

import { PhotoFrame } from "@/components/demo/PhotoFrame";
import { cycle, durations, easings, presets } from "@/lib/motion";
import { type ToneName, tones, type TrackName } from "@/lib/tones";

/**
 * Row five, photo management.
 *
 * Twelve frames narrow to four as two filters apply. The surviving frames
 * reflow rather than the others being struck out, because filtering narrows a
 * view: the copy beside this is about showing the photos you care about, and
 * PRODUCT.md is plain that Qeepa never deletes a file. A frame that looks
 * destroyed would contradict both.
 *
 * The filters are Unrated and a tag, which are the filters the app actually
 * has. An earlier draft of the copy claimed filtering by export status; no
 * such filter exists in the codebase, and the copy was corrected rather than
 * the demonstration faking it.
 *
 * The survivors are exactly the frames carrying no rating. That is not
 * decoration — the filter says "Unrated", so anything left holding stars would
 * make the demonstration a lie about its own control.
 *
 * Clicking a chip pins the filtered state and stops the loop, matching how the
 * track pill behaves — that is also the pause control this loop needs.
 */
const FRAMES: { rating: number | null; tone: ToneName; track: TrackName }[] = [
  { rating: 4, tone: "shell", track: "raw" },
  { rating: null, tone: "chalk", track: "jpg" },
  { rating: 2, tone: "bisque", track: "raw" },
  { rating: 5, tone: "wheat", track: "edit" },
  { rating: null, tone: "linen", track: "raw" },
  { rating: 3, tone: "oat", track: "jpg" },
  { rating: 1, tone: "almond", track: "raw" },
  { rating: null, tone: "ivory", track: "edit" },
  { rating: 4, tone: "shell", track: "raw" },
  { rating: null, tone: "linen", track: "jpg" },
  { rating: 2, tone: "wheat", track: "raw" },
  { rating: 5, tone: "chalk", track: "edit" },
];

const ALL = FRAMES.map((_, index) => index);

/** Everything the Unrated filter leaves behind. */
const KEPT = FRAMES.flatMap((frame, index) => (frame.rating === null ? [index] : []));

const CHIPS = ["Unrated", "Portfolio"];

export function FilterReveal() {
  const [filtered, setFiltered] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();

  const looping = !pinned && !paused && !reduceMotion;

  useEffect(() => {
    if (!looping) return;

    const id = setInterval(() => {
      setFiltered((current) => !current);
    }, cycle.track * 2);

    return () => clearInterval(id);
  }, [looping]);

  const visible = filtered ? KEPT : ALL;

  return (
    <MotionConfig reducedMotion="user">
      {/*
        The panel is anchored to the top, not centred. Under `justify-center`
        the whole block re-centred every time the grid lost two rows, so the
        chip row slid 110px down the panel and back on every pass and the space
        above it swung between 48px and 158px. A filter toolbar does not move
        when its results change; the grid empties downward beneath it.
      */}
      {/* Keyboard focus on a chip pauses the loop; Never on hover: a visitor's pointer often rests
      on a graphic early, and pausing there meant they never saw it move. */}
      <div
        className="flex aspect-716/496 w-full flex-col gap-4 rounded-xl border border-[rgba(43,38,33,0.10)] bg-white p-5 shadow-[0_1px_3px_rgba(43,38,33,0.05),0_24px_56px_-24px_rgba(43,38,33,0.20)]"
        onBlur={() => setPaused(false)}
        onFocus={() => setPaused(true)}
      >
        <div className="flex items-center gap-2">
          {CHIPS.map((chip) => (
            <button
              className={`extend-touch-target-y inline-flex min-h-6 touch-manipulation items-center rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${
                filtered
                  ? "bg-peach-light text-peach-dark"
                  : "bg-surface-2 text-text-secondary hover:text-text-primary"
              }`}
              key={chip}
              onClick={() => {
                setPinned(true);
                setFiltered(true);
              }}
              type="button"
            >
              {chip}
            </button>
          ))}
          {/* The count fades on change, not on first render, so the server
          HTML shows it rather than an invisible label. */}
          <AnimatePresence initial={false}>
            <motion.span
              animate={{ opacity: 1 }}
              className="ml-auto text-[12px] text-text-secondary tabular-nums"
              initial={{ opacity: 0 }}
              key={visible.length}
              transition={{ duration: durations.quick, ease: easings.standard }}
            >
              {visible.length}&nbsp;shown
            </motion.span>
          </AnimatePresence>
        </div>

        {/* `flex-1` plus `content-start` keeps the surviving frames exactly
        where they were when twelve were showing, rather than letting the grid
        re-centre itself in the space the other eight left.

        `relative` is load-bearing. `popLayout` takes each exiting frame out of
        the flow with absolute positioning while it fades, measured against the
        nearest positioned ancestor. Without one here that was the page itself,
        and every filter pass flashed the leaving frames across the top of the
        hero. */}
        <div aria-hidden="true" className="relative grid flex-1 grid-cols-4 content-start gap-3">
          {/* `initial={false}`: the twelve frames are the starting state, so
          they are rendered visible in the server HTML rather than each fading
          in from nothing once the island hydrates. */}
          <AnimatePresence initial={false} mode="popLayout">
            {visible.map((index) => (
              <motion.div
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                initial={{ opacity: 0, scale: 0.92 }}
                key={index}
                layout
                transition={presets.gentle}
              >
                <PhotoFrame
                  className="aspect-3/2"
                  rating={FRAMES[index]!.rating}
                  tone={tones[FRAMES[index]!.tone]}
                  track={FRAMES[index]!.track}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </MotionConfig>
  );
}
