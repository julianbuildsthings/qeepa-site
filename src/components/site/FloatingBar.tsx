import { Star } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

import { durations, easings } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Adapted from the app's `floating-bar.tsx`, including its two states. Over the
 * hero it is the app's browse bar: white, naming the page and its frame count.
 * Scroll into a feature and it takes on the app's selection state — the
 * peach-light surface with a star rating in the centre — naming that feature
 * and its own count.
 *
 * The stars are the page's table of contents. Five features, five stars: in
 * the second feature two are filled, and each star is a link to its feature.
 * Over the hero none are filled. A rating control used as a progress marker is
 * the joke, and it only works because the stars are exactly the app's.
 *
 * The features come in as a prop from `copy.ts` rather than being discovered,
 * so the stars and the section labels cannot disagree about order or names.
 * Which one is *current* is still read from the DOM on scroll, because that is
 * a question about layout.
 *
 * Get Qeepa is a real disabled button until there is something to get. It is
 * greyed out rather than hidden so the bar's shape is settled now.
 *
 * Surface values follow the app: 48px tall, fully rounded, `#FFFFFFF5` in
 * browse, `--color-peach-light` in selection, `0px 10px 30px rgba(43,38,33,0.14)`.
 * `sticky` rather than the app's `absolute`, because this has to survive a
 * scrolling page, and on the page's 120px rail so it shares the headline's
 * left edge.
 *
 * The label is not a live region. It is ambient context, and announcing every
 * change while scrolling would be noise.
 */
export type BarSection = {
  count: number;
  /** The section element's id, and the star's link target. */
  id: string;
  title: string;
};

type FloatingBarProps = {
  /**
   * The hero: shown before hydration and whenever no feature is current.
   * `count` is null on pages with no photo frames, rather than claiming zero.
   */
  brand: { count: number | null; title: string };
  /**
   * A section after the features where the bar returns to the brand state —
   * the closing, so the bar stops naming the last feature once you are past
   * it. Omit on pages without one.
   */
  endId?: string;
  /** The features, in page order. The nth is marked by n stars. */
  sections: BarSection[];
};

/**
 * How far down the viewport a section's top must reach before the bar adopts
 * it, as a fraction of the viewport height — the middle of the screen.
 *
 * An earlier fixed line at 140px from the top switched far too late: every row
 * has 112px of padding above its content, so the next feature was well on
 * screen, and the previous one largely gone, before the bar changed. At the
 * midpoint the bar names whichever section holds the middle of the screen.
 */
const ADOPT_LINE = 0.5;

/**
 * The id of the last section whose top has passed the adopt line, or null
 * while the hero is still current. Measured against the viewport's current
 * height on every pass, so it holds when the window is resized.
 *
 * Queried on each pass rather than cached at mount. This island hydrates with
 * `client:load` and sits above `<main>`, so on a cold load the effect can run
 * before the sections below it have been parsed — caching there captured an
 * empty list and the bar never updated again.
 */
function currentSectionId(ids: string[]): string | null {
  const line = window.innerHeight * ADOPT_LINE;
  let current: string | null = null;

  for (const id of ids) {
    const element = document.getElementById(id);
    if (element && element.getBoundingClientRect().top <= line) current = id;
  }

  return current;
}

/**
 * Root-relative, so the same bar works on every page: on the home page it is
 * an in-page jump, and on a legal page it goes home to that section.
 */
function sectionHref(id: string): string {
  return `/#${id}`;
}

export function FloatingBar({ brand, endId, sections }: FloatingBarProps) {
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [previewed, setPreviewed] = useState<number | null>(null);

  useEffect(() => {
    // The end section is tracked like any other, but it is not a feature, so
    // when it is current no star is marked and the bar reads as the brand.
    const ids = [...sections.map((section) => section.id), ...(endId ? [endId] : [])];
    let frame = 0;

    const update = () => {
      frame = 0;
      setCurrentId(currentSectionId(ids));
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
  }, [endId, sections]);

  const index = sections.findIndex((section) => section.id === currentId);
  const current = index === -1 ? null : sections[index]!;
  const selecting = current !== null;

  /*
   * The count names frames the viewer can see. Over the hero that is the
   * hero's grid; at the closing there are none, so the bar shows the name
   * alone rather than repeating a count for a grid long since scrolled away.
   */
  const atEnd = endId !== undefined && currentId === endId;
  const count = current ? current.count : atEnd ? null : brand.count;

  /** How many stars read as filled: the current section, or the one hovered. */
  const filled = previewed ?? index + 1;

  const titleClass =
    "min-w-0 truncate rounded-sm font-serif text-[17px] leading-[22px] font-medium tracking-[-0.01em] text-text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";

  return (
    <div className="pointer-events-none sticky top-4 z-30 mt-8 px-6 lg:mt-14 lg:px-[120px]">
      <div className="mx-auto max-w-[1200px]">
        {/*
          The surface change is a CSS transition rather than a Motion animation:
          a colour is a tween with nothing physical about it, and Motion hands
          colours to the Web Animations API, whose cancellations surface as
          unhandled rejections in the test environment. 250ms is `durations.base`.
        */}
        <div
          className={cn(
            "pointer-events-auto relative flex h-12 items-center gap-2.5 rounded-full pr-1.5 pl-5 shadow-[0px_10px_30px_rgba(43,38,33,0.14)] transition-colors duration-[250ms] ease-in-out motion-reduce:transition-none",
            selecting ? "bg-peach-light" : "bg-[#FFFFFFF5]",
          )}
          data-state={selecting ? "selection" : "browse"}
        >
          {/* `initial={false}` on the presence, not the label: the first render
          is the server's HTML, and a label that starts at opacity 0 is an
          invisible brand name until the island hydrates. Only later changes of
          section fade in. */}
          <AnimatePresence initial={false}>
            <motion.div
              animate={{ opacity: 1 }}
              className="flex min-w-0 items-center gap-2.5"
              initial={{ opacity: 0 }}
              key={current?.id ?? (atEnd ? "end" : "brand")}
              transition={{ duration: durations.quick, ease: easings.standard }}
            >
              {current ? (
                <span className={titleClass}>{current.title}</span>
              ) : (
                <a className={titleClass} href="/" translate="no">
                  {brand.title}
                </a>
              )}
              {count !== null && (
                // From md, not sm: between the two the hero window shows six of its
                // ten frames, and the count has to describe what is on screen.
                <p className="hidden truncate text-[13px] leading-4 text-text-secondary tabular-nums md:block">
                  {count}&nbsp;photos
                </p>
              )}
            </motion.div>
          </AnimatePresence>

          {/*
            Centred on the bar, not placed in the flow, so it holds still while
            the label beside it changes length — the app's centre slot does the
            same. Hidden below md, where the label and the button need the
            width.
          */}
          <div className="pointer-events-none absolute inset-0 hidden items-center justify-center md:flex">
            <nav aria-label="Features" className="pointer-events-auto">
              <ol className="flex">
                {sections.map((section, position) => {
                  const lit = position < filled;
                  return (
                    <li key={section.id}>
                      <a
                        aria-current={section.id === currentId ? "location" : undefined}
                        aria-label={section.title}
                        className="flex size-6 items-center justify-center rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                        href={sectionHref(section.id)}
                        onBlur={() => setPreviewed(null)}
                        onFocus={() => setPreviewed(position + 1)}
                        onMouseEnter={() => setPreviewed(position + 1)}
                        onMouseLeave={() => setPreviewed(null)}
                        title={section.title}
                      >
                        <Star
                          aria-hidden="true"
                          className={cn(
                            "transition-colors",
                            lit ? "text-raw" : selecting ? "text-[#6F3B0F2E]" : "text-[#2B26211F]",
                          )}
                          fill="currentColor"
                          size={16}
                          strokeWidth={0}
                        />
                      </a>
                    </li>
                  );
                })}
              </ol>
            </nav>
          </div>

          <div className="flex-1" />

          <button
            className="inline-flex shrink-0 cursor-not-allowed items-center rounded-full bg-[rgba(43,38,33,0.06)] px-4 py-[9px] text-[13px] leading-4 font-medium text-text-tertiary sm:px-5"
            disabled
            type="button"
          >
            Get Qeepa
          </button>
        </div>
      </div>
    </div>
  );
}
