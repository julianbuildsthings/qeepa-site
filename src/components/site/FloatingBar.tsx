import { motion } from "motion/react";
import { useEffect, useState } from "react";

import { durations, easings } from "@/lib/motion";

/**
 * Adapted from the app's `floating-bar.tsx`, including its behaviour: the app's
 * bar names the context you are in, so this one does too. At the top it reads
 * the wordmark and the hero's frame count; scroll into a feature row and it
 * becomes that row's name and its own count.
 *
 * Sections declare themselves in the DOM with `data-bar-title` and
 * `data-bar-count` rather than being listed here, so a row added later is
 * picked up without touching this file.
 *
 * Surface values are the app's exactly: 48px tall, fully rounded, `#FFFFFFF5`,
 * `gap-2.5`, `0px 10px 30px rgba(43,38,33,0.14)`. Two departures — `sticky`
 * rather than `absolute`, because this has to survive a scrolling page, and the
 * page's 120px content rail rather than the app's 32px window inset, so the bar
 * and the headline share a left edge.
 *
 * The label is not a live region. It is ambient context, and announcing every
 * change while scrolling would be noise.
 */
export type BarSection = {
  /** Rendered as a link home only when this is the brand. */
  brand?: boolean;
  count: number | null;
  title: string;
};

type FloatingBarProps = {
  /** Rendered before hydration, so the bar is never briefly empty. */
  initial: BarSection;
};

/** How far down the viewport a section must reach before the bar adopts it. */
const ADOPT_LINE_PX = 140;

function readSections(): { element: Element; section: BarSection }[] {
  return [...document.querySelectorAll("[data-bar-title]")].map((element) => ({
    element,
    section: {
      brand: element.hasAttribute("data-bar-brand"),
      count: element.getAttribute("data-bar-count")
        ? Number(element.getAttribute("data-bar-count"))
        : null,
      title: element.getAttribute("data-bar-title") ?? "",
    },
  }));
}

export function FloatingBar({ initial }: FloatingBarProps) {
  const [current, setCurrent] = useState<BarSection>(initial);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;

      /*
       * Queried on each pass rather than cached at mount. This island hydrates
       * with `client:load` and sits above `<main>`, so on a cold load the
       * effect can run before the sections below it have been parsed — caching
       * there captures an empty list and the bar never updates again. Re-reading
       * also means a section added later is picked up for free.
       */
      const sections = readSections();
      if (sections.length === 0) return;

      // The active section is the last one whose top has passed the adopt
      // line. Scanning from the end means the first match is the answer.
      const match = [...sections]
        .reverse()
        .find(({ element }) => element.getBoundingClientRect().top <= ADOPT_LINE_PX);

      const next = match?.section ?? sections[0]?.section;
      if (!next) return;

      setCurrent((previous) =>
        previous.title === next.title && previous.count === next.count ? previous : next,
      );
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const titleClass =
    "shrink-0 rounded-sm font-serif text-[17px] leading-[22px] font-medium tracking-[-0.01em] text-text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";

  return (
    <div className="pointer-events-none sticky top-4 z-30 mt-8 px-6 lg:mt-14 lg:px-[120px]">
      <div className="mx-auto max-w-[1200px]">
        <div className="pointer-events-auto flex h-12 items-center gap-2.5 rounded-full bg-[#FFFFFFF5] px-5 shadow-[0px_10px_30px_rgba(43,38,33,0.14)]">
          <motion.div
            animate={{ opacity: 1 }}
            className="flex min-w-0 items-center gap-2.5"
            initial={{ opacity: 0 }}
            key={current.title}
            transition={{ duration: durations.quick, ease: easings.standard }}
          >
            {current.brand ? (
              <a className={titleClass} href="/" translate="no">
                {current.title}
              </a>
            ) : (
              <span className={titleClass}>{current.title}</span>
            )}

            {current.count !== null && (
              <p className="truncate text-[13px] leading-4 text-text-secondary tabular-nums">
                {current.count}&nbsp;photos
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
