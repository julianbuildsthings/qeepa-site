import { AnimatePresence, motion, MotionConfig, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

import { cycle, distance, durations, easings, presets, stagger } from "@/lib/motion";
import { frameBorder, pipEmpty, pipFilled, type ToneName, tones } from "@/lib/tones";

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
 * Four files, one shot: the RAW, two exports and the working file. The second
 * export is a web-sized `.webp`, which the app's format registry files under
 * the same deliverable role as the JPEG — so this is still a single shot, just
 * one with an extra rendition, and every name here is one the app groups.
 */
export const FILES: { name: string; size: string; tone: ToneName }[] = [
  { name: "IMG_4821.CR3", size: "28.4 MB", tone: "shell" },
  { name: "IMG_4821.JPG", size: "4.1 MB", tone: "chalk" },
  { name: "IMG_4821.webp", size: "860 KB", tone: "linen" },
  { name: "IMG_4821.afphoto", size: "61.7 MB", tone: "bisque" },
];

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
  const [paused, setPaused] = useState(false);
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
    if (paused || reduceMotion) return;

    const id = setTimeout(
      () => {
        setRated((current) => !current);
      },
      rated ? cycle.hold : cycle.reset,
    );

    return () => clearTimeout(id);
  }, [paused, rated, reduceMotion]);

  return (
    <MotionConfig reducedMotion="user">
      {/* biome-ignore lint/a11y/noNoninteractiveElementInteractions: pause affordance, not a control */}
      <div
        className="flex aspect-716/496 w-full items-center"
        onBlur={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
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
                {index === 0 && (
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

            <AnimatePresence initial={false}>
              {rated && (
                <motion.li
                  animate={{ height: "auto", opacity: 1 }}
                  className="flex items-center gap-3 overflow-hidden bg-peach-light/50 px-5"
                  exit={{ height: 0, opacity: 0 }}
                  initial={{ height: 0, opacity: 0 }}
                  transition={presets.gentle}
                >
                  <span className="flex h-8 w-12 shrink-0 items-center justify-center rounded-[3px] border border-dashed border-[rgba(111,59,15,0.35)] text-[9px] font-medium text-peach-dark">
                    XMP
                  </span>
                  <span className="flex-1 truncate py-2.5 text-[13px] font-medium text-peach-dark">
                    IMG_4821.xmp
                  </span>
                  <span className="w-16 shrink-0 text-right text-[12px] text-peach-dark tabular-nums">
                    2 KB
                  </span>
                </motion.li>
              )}
            </AnimatePresence>
          </ul>

          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className="border-t border-[rgba(43,38,33,0.08)] px-5 py-3 text-[12px] text-text-secondary"
            initial={{ opacity: 0, y: distance.hover }}
            key={String(rated)}
            transition={{ duration: durations.base, ease: easings.enter }}
          >
            {rated
              ? "Rating written to a sidecar. Your originals are untouched."
              : "Four files, one shot. Nothing has been copied or moved."}
          </motion.p>
        </div>
      </div>
    </MotionConfig>
  );
}
