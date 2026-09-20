import { Star } from "lucide-react";
import { AnimatePresence, motion, MotionConfig, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

import { bloom, warm, type WarmName } from "@/lib/gradients";
import { cycle, distance, durations, easings, presets } from "@/lib/motion";

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
const FILES: { gradient: WarmName; name: string; size: string }[] = [
  { gradient: "peach", name: "IMG_4821.CR3", size: "28.4 MB" },
  { gradient: "apricot", name: "IMG_4821.JPG", size: "4.1 MB" },
  { gradient: "honey", name: "IMG_4821.afphoto", size: "61.7 MB" },
];

const STARS = 5;
const RATING = 4;

function Frame({ gradient }: { gradient: WarmName }) {
  return (
    <div
      aria-hidden="true"
      className="relative h-8 w-12 shrink-0 overflow-hidden rounded-[3px]"
      style={{ background: warm[gradient] }}
    >
      <div className="absolute inset-0" style={{ background: bloom }} />
    </div>
  );
}

export function SidecarDemo() {
  const [rated, setRated] = useState(false);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (paused || reduceMotion) return;

    const id = setInterval(() => {
      setRated((current) => !current);
    }, cycle.track * 2);

    return () => clearInterval(id);
  }, [paused, reduceMotion]);

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
        <div className="w-full overflow-hidden rounded-xl border border-[rgba(43,38,33,0.10)] bg-surface shadow-[0_1px_3px_rgba(43,38,33,0.05),0_24px_56px_-24px_rgba(43,38,33,0.20)]">
          <p className="border-b border-[rgba(43,38,33,0.08)] bg-[rgba(255,250,246,0.92)] px-5 py-3 text-[12px] text-text-tertiary">
            Pictures › Shoots › June
          </p>

          <ul className="divide-y divide-[rgba(43,38,33,0.06)]">
            {FILES.map((file, index) => (
              <li className="flex items-center gap-3 px-5 py-2.5" key={file.name}>
                <Frame gradient={file.gradient} />
                <span className="flex-1 truncate text-[13px] text-text-primary">{file.name}</span>

                {index === 0 && (
                  <span aria-hidden="true" className="flex shrink-0 items-center gap-0.5">
                    {Array.from({ length: STARS }, (_, starIndex) => (
                      <motion.span
                        animate={{ opacity: rated && starIndex < RATING ? 1 : 0.22 }}
                        key={starIndex}
                        transition={{
                          delay: rated ? starIndex * 0.05 : 0,
                          duration: durations.quick,
                          ease: easings.standard,
                        }}
                      >
                        <Star className="text-raw" fill="currentColor" size={11} strokeWidth={0} />
                      </motion.span>
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
              : "Three files, one shot. Nothing has been copied or moved."}
          </motion.p>
        </div>
      </div>
    </MotionConfig>
  );
}
