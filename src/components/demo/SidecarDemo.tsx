import { motion, MotionConfig, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

import { cycle, distance, durations, easings, stagger } from "@/lib/motion";
import { frameBorder, pipEmpty, pipFilled, type ToneName, tones } from "@/lib/tones";
import { cn } from "@/lib/utils";

/**
 * Row two, local-first.
 *
 * A file listing rather than a gallery, because "we never touch your files" is
 * not a claim a gallery can make — a gallery looks like every photo app. A
 * listing where the only thing that ever changes is one small `.xmp` appearing
 * shows the actual mechanism: the rating is written beside the photo, in the
 * format Lightroom already reads, and the originals are left alone.
 *
 * Filenames and sizes are plausible placeholders. The sidecar naming follows
 * the app's real Lightroom-style convention.
 */
/*
 * Four photos from one card: consecutive frames, all RAW (`.raw`), numbered as
 * the hero's frames are. The last is the one rated, so the sidecar appears
 * directly beneath it, named after it. Sizes are plausible for a RAW frame and
 * differ as real frames do.
 */
export const FILES: { name: string; size: string; tone: ToneName }[] = [
  { name: "IMG_4821.raw", size: "18.9 MB", tone: "shell" },
  { name: "IMG_4822.raw", size: "19.4 MB", tone: "chalk" },
  { name: "IMG_4823.raw", size: "18.6 MB", tone: "linen" },
  { name: "IMG_4824.raw", size: "20.1 MB", tone: "bisque" },
];

/** The photo the demo rates: the last, so its sidecar lands right below it. */
const RATED_INDEX = FILES.length - 1;

/** The sidecar the rating writes: the rated photo's name, as `.xmp`. */
export const SIDECAR = FILES[RATED_INDEX]!.name.replace(/\.[^.]+$/, ".xmp");

const PIPS = 5;
const RATING = 4;

/** At 48x32 there is no room for chrome, so this is a bare tone. */
function Frame({ tone }: { tone: ToneName }) {
  return (
    <div
      aria-hidden="true"
      className="h-8 w-12 shrink-0 rounded-[3px]"
      style={{ background: tones[tone], border: `1px solid ${frameBorder}` }}
    />
  );
}

export function SidecarDemo() {
  const [rated, setRated] = useState(false);
  const reduceMotion = useReducedMotion();

  /*
   * Asymmetric dwell, on a timeout chain rather than an interval. A fixed
   * interval gave both states the same 2.8s, and since the whole state change
   * plays in under 400ms the loop was mostly dead air — worst of all in the
   * unrated state, which is only the setup for the thing being demonstrated.
   * The rated state now holds long enough to read its caption; the starting
   * state passes through in half that.
   */
  useEffect(() => {
    if (reduceMotion) return;

    const id = setTimeout(
      () => {
        setRated((current) => !current);
      },
      rated ? cycle.hold : cycle.reset,
    );

    return () => clearTimeout(id);
  }, [rated, reduceMotion]);

  return (
    <MotionConfig reducedMotion="user">
      {/* No hover pause: a visitor's pointer often rests on a graphic early,
      and pausing there meant they never saw the sidecar appear. Reduced motion
      is what stops it. */}
      <div className="flex w-full items-center lg:aspect-716/496">
        <div className="w-full overflow-hidden rounded-xl border border-[rgba(43,38,33,0.10)] bg-white shadow-[0_1px_3px_rgba(43,38,33,0.05),0_24px_56px_-24px_rgba(43,38,33,0.20)]">
          <p className="border-b border-[rgba(43,38,33,0.08)] bg-white px-5 py-3 text-[12px] text-text-tertiary">
            Pictures › Shoots › June
          </p>

          <ul className="divide-y divide-[rgba(43,38,33,0.06)]">
            {FILES.map((file, index) => (
              <li className="flex items-center gap-3 px-5 py-2.5" key={file.name}>
                <Frame tone={file.tone} />
                <span className="flex-1 truncate text-[13px] text-text-primary">{file.name}</span>

                {/*
                  The rating as the page's rating squares, not stars — the same
                  pips, colours and 8px size the photo frames carry, so a rating
                  looks like one thing everywhere on the page. Each square is an
                  empty pip with a filled one fading in over it: opacity only,
                  so it stays on the compositor.
                */}
                {index === RATED_INDEX && (
                  <span aria-hidden="true" className="flex shrink-0 items-center gap-1">
                    {Array.from({ length: PIPS }, (_, pipIndex) => (
                      <span
                        className="relative size-2 rounded-[2px]"
                        key={pipIndex}
                        style={{ background: pipEmpty }}
                      >
                        <motion.span
                          animate={{ opacity: rated && pipIndex < RATING ? 1 : 0 }}
                          className="absolute inset-0 rounded-[2px]"
                          initial={false}
                          style={{ background: pipFilled }}
                          transition={{
                            delay: rated ? pipIndex * stagger.base : 0,
                            duration: durations.quick,
                            ease: easings.standard,
                          }}
                        />
                      </span>
                    ))}
                  </span>
                )}

                <span className="w-16 shrink-0 text-right text-[12px] text-text-tertiary tabular-nums">
                  {file.size}
                </span>
              </li>
            ))}

            {/*
              Always in the list rather than mounted only once rated.
              Animating `height` from 0 grew the whole card, and below `lg`
              nothing gives the card a fixed size to absorb that in — the
              row's entrance pushed every section beneath it down the page.
              A fade in place costs nothing: the row's height is reserved
              from the first render, so it appearing changes no one's height.

              A CSS transition, not Motion's `animate`: this row's opacity
              toggles on the same interval-driven `rated` flip that also
              swaps the caption below by remounting it, and racing a Motion
              tween against that remount left it a full cycle behind — the
              same reason the floating bar's surface colour is a CSS
              transition rather than a Motion one.
            */}
            <li
              aria-hidden={!rated}
              className={cn(
                "flex items-center gap-3 bg-peach-light/50 px-5 py-2.5 transition-opacity duration-(--motion-base) ease-(--ease-standard)",
                rated ? "opacity-100" : "opacity-0",
              )}
            >
              <span className="flex h-8 w-12 shrink-0 items-center justify-center rounded-[3px] border border-dashed border-[rgba(111,59,15,0.35)] text-[9px] font-medium text-peach-dark">
                XMP
              </span>
              <span className="flex-1 truncate text-[13px] font-medium text-peach-dark">
                {SIDECAR}
              </span>
              <span className="w-16 shrink-0 text-right text-[12px] text-peach-dark tabular-nums">
                2 KB
              </span>
            </li>
          </ul>

          {/*
            `min-h-[61px]` and `flex items-center`: the rated caption's extra
            clause wraps to a second line below `sm`, and the shorter caption
            alone was one line — the swap changed the card's height on every
            cycle, which below `lg` nothing absorbs, so it pushed the section
            after this one down the page. Reserved to the two-line height, the
            one-line caption centres in it instead of shrinking the box.
          */}
          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className="flex min-h-[61px] items-center border-t border-[rgba(43,38,33,0.08)] px-5 py-3 text-[12px] text-text-secondary"
            initial={{ opacity: 0, y: distance.hover }}
            key={String(rated)}
            transition={{ duration: durations.base, ease: easings.enter }}
          >
            {rated
              ? "Rating written to a sidecar. Your originals are untouched."
              : "Four photos. Nothing has been copied or moved."}
          </motion.p>
        </div>
      </div>
    </MotionConfig>
  );
}
