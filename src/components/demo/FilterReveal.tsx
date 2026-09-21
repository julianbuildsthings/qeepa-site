import { AnimatePresence, motion, MotionConfig, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

import { PhotoFrame } from "@/components/demo/PhotoFrame";
import { cycle, durations, easings, presets } from "@/lib/motion";
import { type ToneName, tones, type TrackName } from "@/lib/tones";

/**
 * Row five, photo management.
 *
 * Twelve frames narrow to four as two filters apply. The surviving frames
 * reflow rather than the others being struck out, because the sentence
 * directly above this reads "Qeepa helps you find the files; it never deletes
 * them for you" — so the demonstration has to read as narrowing a view. A
 * frame that looks destroyed contradicts the copy beside it.
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
      {/* biome-ignore lint/a11y/noNoninteractiveElementInteractions: pause affordance, not a control */}
      <div
        className="flex aspect-716/496 w-full flex-col justify-center gap-4"
        onBlur={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="flex items-center gap-2">
          {CHIPS.map((chip) => (
            <button
              className={`inline-flex min-h-6 touch-manipulation items-center rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${
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
          <motion.span
            animate={{ opacity: 1 }}
            className="ml-auto text-[12px] text-text-secondary tabular-nums"
            initial={{ opacity: 0 }}
            key={visible.length}
            transition={{ duration: durations.quick, ease: easings.standard }}
          >
            {visible.length}&nbsp;shown
          </motion.span>
        </div>

        <div aria-hidden="true" className="grid grid-cols-4 gap-3">
          <AnimatePresence mode="popLayout">
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
