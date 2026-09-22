import { MotionConfig, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { PhotoFrame } from "@/components/demo/PhotoFrame";
import { TrackPill } from "@/components/demo/TrackPill";
import { WindowBar } from "@/components/demo/WindowBar";
import { cycle } from "@/lib/motion";
import {
  heroRatings,
  heroTileOrder,
  shuffledTones,
  tones,
  trackExtension,
  type TrackName,
  trackOrder,
} from "@/lib/tones";

/**
 * The hero's app window: chrome strip, a grid of photo frames, and the track
 * pill floating over the grid.
 *
 * It runs on the tracks row's cadence, one track every `cycle.track`, RAW →
 * JPG → EDIT. Every frame follows the pill, as choosing a track does in the
 * app: its dot takes the track's colour and its name the track's extension
 * (`4821.raw`, `4821.jpg`, `4821.psd`). The tones rearrange at each switch, so
 * each track reads as its own set of files rather than one grid relabelled.
 *
 * A second, slower moment: after each full pass through the tracks, two
 * frames are re-rated, half a track's dwell after the switch back to RAW so it
 * never lands on the same beat as the colours. The squares fill one by one.
 *
 * As in the tracks row, the pill is the pause control: clicking a segment pins
 * that track and ends the loop for good. It also pauses while hovered or
 * focused, and never starts under `prefers-reduced-motion`. The first render
 * is the approved still — RAW, the approved tones and ratings — so the
 * server's HTML is the settled state and hydration changes nothing.
 *
 * The grid is decorative — the surrounding copy carries the meaning — so it is
 * hidden from assistive technology rather than announcing a wall of blanks.
 *
 * Responsive by column count, never by row count: five columns from md, three
 * from sm, two below, hiding the frames that no longer fit rather than wrapping
 * them into more rows. The row count is what the pill's position is computed
 * from, so holding it fixed keeps the pill on its row at every width.
 */
const COLUMNS = 5;

/** The row the pill sits on, 1-indexed. */
const PILL_ROW = 2;

/** Frame numbers count up from here. */
const START_NUMBER = 4821;

/** Row gap in px. Must match the `gap-3` on the grid below. */
const GAP = 12;

const ROWS = Math.ceil(heroTileOrder.length / COLUMNS);

/** Frames beyond these indices are hidden below sm, and below md. */
const VISIBLE_BELOW_SM = ROWS * 2;
const VISIBLE_BELOW_MD = ROWS * 3;

/*
 * The exact centre line of the pill's row. A plain percentage is wrong here:
 * the gaps are fixed pixels, so they are not part of the proportional split.
 * Subtracting them first gives the true row height, then the gaps above the
 * target row are added back.
 */
const TRACK_HEIGHT = `(100% - ${(ROWS - 1) * GAP}px)`;
const PILL_TOP = `calc(${(PILL_ROW - 0.5) / ROWS} * ${TRACK_HEIGHT} + ${(PILL_ROW - 1) * GAP}px)`;

export function HeroGallery() {
  /** Track switches so far. The active track and the tones both follow it. */
  const [step, setStep] = useState(0);
  // The same count, readable from the interval without a state updater —
  // updaters must stay pure, and scheduling the re-rating is a side effect.
  const steps = useRef(0);
  /** Which state of the rating loop is showing. */
  const [ratingStep, setRatingStep] = useState(0);
  const [pinned, setPinned] = useState<TrackName | null>(null);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();

  const looping = pinned === null && !paused && !reduceMotion;
  const active = pinned ?? trackOrder[step % trackOrder.length]!;
  const frameTones = shuffledTones(heroTileOrder, step);
  const ratings = heroRatings[ratingStep % heroRatings.length]!;

  useEffect(() => {
    if (!looping) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    const id = setInterval(() => {
      steps.current += 1;
      setStep(steps.current);
      // Back at RAW: a full pass is done, so re-rate, off the switch's beat.
      if (steps.current % trackOrder.length === 0) {
        timers.push(setTimeout(() => setRatingStep((rating) => rating + 1), cycle.track / 2));
      }
    }, cycle.track);

    return () => {
      clearInterval(id);
      for (const timer of timers) clearTimeout(timer);
    };
  }, [looping]);

  return (
    <MotionConfig reducedMotion="user">
      {/* Hover and focus pause the loop. The wrapper is not focusable itself —
      focus lands on the pill's buttons, which bubble through focus-within. */}
      {/* biome-ignore lint/a11y/noNoninteractiveElementInteractions: pause affordance, not a control */}
      <div
        className="relative overflow-hidden rounded-t-2xl border border-b-0 border-[rgba(43,38,33,0.10)] bg-white shadow-[0_1px_3px_rgba(43,38,33,0.05),0_28px_64px_-24px_rgba(43,38,33,0.20)]"
        onBlur={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <WindowBar />

        <div className="p-[18px]">
          <div className="relative">
            <div
              aria-hidden="true"
              className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5"
              data-track={active}
            >
              {frameTones.map((tone, index) => {
                const number = START_NUMBER + index;
                return (
                  <PhotoFrame
                    className={
                      index >= VISIBLE_BELOW_MD
                        ? "hidden aspect-3/2 md:block"
                        : index >= VISIBLE_BELOW_SM
                          ? "hidden aspect-3/2 sm:block"
                          : "aspect-3/2"
                    }
                    frameNumber={`${number}.${trackExtension[active]}`}
                    key={number}
                    rating={ratings[index] ?? null}
                    ratingSlot
                    tone={tones[tone]}
                    track={active}
                  />
                );
              })}
            </div>

            <div
              className="pointer-events-none absolute inset-x-0 flex -translate-y-1/2 justify-center"
              style={{ top: PILL_TOP }}
            >
              <div className="pointer-events-auto">
                <TrackPill active={active} interactive onSelect={setPinned} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}
