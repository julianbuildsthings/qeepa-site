import { ChevronLeft } from "lucide-react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { useEffect, useState } from "react";

import { durations, easings } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Adapted from the app's `floating-bar.tsx`: a sticky pill naming the page,
 * white on a soft shadow, that survives the page's own scroll.
 *
 * Over the hero it names the brand; scroll into a feature and it takes on
 * that feature's name instead, read from the DOM on scroll since that is a
 * question about layout, not state the page already tracks.
 *
 * The features come in as a prop from `copy.ts` rather than being
 * discovered, so the label can never name a section the page does not have.
 *
 * Get Qeepa is a real disabled button until there is something to get. It is
 * greyed out rather than hidden so the bar's shape is settled now.
 *
 * Surface values follow the app: 48px tall, fully rounded, `#FFFFFFF5`,
 * `0px 10px 30px rgba(43,38,33,0.14)`. `sticky` rather than the app's
 * `absolute`, because this has to survive a scrolling page, and on the
 * page's 120px rail so it shares the headline's left edge.
 *
 * The label is not a live region. It is ambient context, and announcing
 * every change while scrolling would be noise.
 */
export type BarSection = {
  count: number;
  /** The section element's id, read on scroll to tell where the reader is. */
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
   * Where the Back button goes, on pages that are a step away from the home
   * page (the legal pages). Omit on the home page itself, which has nowhere
   * to go back to.
   */
  backHref?: string;
  /**
   * A section after the features — the closing — where the bar names the
   * product again instead of going on naming the last feature once you are
   * past it. Omit on pages without one.
   */
  endId?: string;
  /**
   * Whether the bar carries Get Qeepa. On by default; the legal pages turn it
   * off, since a policy page is not where anyone decides to get the app.
   */
  offer?: boolean;
  /**
   * The features, in page order. Their ids and titles drive the bar's label
   * as the reader scrolls past each one. Empty on the legal pages, which have
   * no features to name.
   */
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

export function FloatingBar({ backHref, brand, endId, offer = true, sections }: FloatingBarProps) {
  const [currentId, setCurrentId] = useState<string | null>(null);

  useEffect(() => {
    // The end section is tracked like any other, but it is not a feature, so
    // when it is current the bar falls back to naming the brand.
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

  const current = sections.find((section) => section.id === currentId) ?? null;
  const atEnd = endId !== undefined && currentId === endId;

  /*
   * The count names frames the viewer can see. Over the hero that is the
   * hero's grid; at the closing there are none, so the bar shows the name
   * alone rather than repeating a count for a grid long since scrolled away.
   */
  const count = current ? current.count : atEnd ? null : brand.count;

  const titleClass =
    // `py-px` takes the 22px line to the 24px minimum hit target; the touch
    // extension then takes the brand link to 44px on touch screens.
    "extend-touch-target-y min-w-0 truncate rounded-sm py-px font-serif text-[17px] leading-[22px] font-medium tracking-[-0.01em] text-text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";

  return (
    <MotionConfig reducedMotion="user">
      {/* `data-enter` slides the bar down into place on page load — see the
      entrances in global.css. */}
      <div
        className="pointer-events-none sticky top-4 z-30 mt-8 px-6 lg:mt-14 lg:px-[120px]"
        data-enter="bar"
      >
        <div className="mx-auto max-w-[1200px]">
          <div
            className={cn(
              "pointer-events-auto relative flex h-12 items-center gap-2.5 rounded-full bg-[#FFFFFFF5] pr-1.5 shadow-[0px_10px_30px_rgba(43,38,33,0.14)]",
              // The app tightens the left edge when a round button sits there.
              backHref ? "pl-1.5" : "pl-5",
            )}
          >
            {/*
              The app's Back button, as its floating bar draws it: a 36px round
              button on the surface-2 fill with a 15px chevron, at the bar's
              left edge. A link rather than `history.back()`, so it always
              lands on the home page, however the visitor arrived.
            */}
            {backHref && (
              <a
                aria-label="Back to home"
                className="extend-touch-target flex size-9 shrink-0 items-center justify-center rounded-full bg-surface-2 text-text-secondary transition-colors duration-(--motion-quick) ease-(--ease-standard) hover:text-text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none motion-reduce:transition-none"
                href={backHref}
              >
                <ChevronLeft aria-hidden="true" size={15} />
              </a>
            )}

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
                ) : backHref ? (
                  // A page a step from home names itself, as the app's bar
                  // names the shoot you are in; the Back button is the way home.
                  <span className={titleClass}>{brand.title}</span>
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

            <div className="flex-1" />

            {offer && (
              <button
                className="inline-flex shrink-0 cursor-not-allowed items-center rounded-full bg-[rgba(43,38,33,0.06)] px-4 py-[9px] text-[13px] leading-4 font-medium text-text-tertiary sm:px-5"
                disabled
                type="button"
              >
                Get Qeepa
              </button>
            )}
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}
