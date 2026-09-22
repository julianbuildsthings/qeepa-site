import { Menu } from "@base-ui/react/menu";
import { ChevronDown, Star } from "lucide-react";
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
 * so the stars, the Features menu and the section labels cannot disagree about
 * order or names. Which one is *current* is still read from the DOM on scroll,
 * because that is a question about layout.
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
  /** The features, in page order. The nth is marked by n stars. */
  sections: BarSection[];
};

/** How far down the viewport a section must reach before the bar adopts it. */
const ADOPT_LINE_PX = 140;

/**
 * The id of the last section whose top has passed the adopt line, or null
 * while the hero is still current.
 *
 * Queried on each pass rather than cached at mount. This island hydrates with
 * `client:load` and sits above `<main>`, so on a cold load the effect can run
 * before the sections below it have been parsed — caching there captured an
 * empty list and the bar never updated again.
 */
function currentSectionId(ids: string[]): string | null {
  let current: string | null = null;

  for (const id of ids) {
    const element = document.getElementById(id);
    if (element && element.getBoundingClientRect().top <= ADOPT_LINE_PX) current = id;
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

export function FloatingBar({ brand, sections }: FloatingBarProps) {
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [previewed, setPreviewed] = useState<number | null>(null);

  useEffect(() => {
    const ids = sections.map((section) => section.id);
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
  }, [sections]);

  const index = sections.findIndex((section) => section.id === currentId);
  const current = index === -1 ? null : sections[index]!;
  const selecting = current !== null;

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
              key={current?.id ?? "brand"}
              transition={{ duration: durations.quick, ease: easings.standard }}
            >
              {current ? (
                <span className={titleClass}>{current.title}</span>
              ) : (
                <a className={titleClass} href="/" translate="no">
                  {brand.title}
                </a>
              )}
              {(current?.count ?? brand.count) !== null && (
                <p className="hidden truncate text-[13px] leading-4 text-text-secondary tabular-nums sm:block">
                  {current?.count ?? brand.count}&nbsp;photos
                </p>
              )}
            </motion.div>
          </AnimatePresence>

          {/*
            Centred on the bar, not placed in the flow, so it holds still while
            the label beside it changes length — the app's centre slot does the
            same. Hidden below md, where the label and the two controls need the
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

          <Menu.Root>
            {/* Below sm the label goes and the trigger becomes a 36px round
            button, the size of the app's own icon buttons: on a phone the two
            controls otherwise leave about 75px for the section name. The
            accessible name stays "Features" at every width. */}
            <Menu.Trigger
              aria-label="Features"
              className="relative inline-flex size-9 shrink-0 touch-manipulation items-center justify-center gap-[7px] rounded-full border border-border-strong text-[13px] leading-4 font-medium text-text-primary transition-colors hover:bg-[rgba(43,38,33,0.04)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none data-popup-open:bg-[rgba(43,38,33,0.04)] sm:h-auto sm:w-auto sm:px-4 sm:py-2"
            >
              <span className="hidden sm:inline">Features</span>
              <ChevronDown aria-hidden="true" size={12} strokeWidth={2} />
            </Menu.Trigger>
            <Menu.Portal>
              <Menu.Positioner align="end" className="z-40 outline-none" sideOffset={10}>
                <Menu.Popup className="min-w-56 origin-(--transform-origin) rounded-2xl bg-white p-1.5 shadow-[0px_10px_30px_rgba(43,38,33,0.14)] ring-1 ring-[rgba(43,38,33,0.06)] transition-[opacity,transform] duration-150 outline-none data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-starting-style:scale-[0.98] data-starting-style:opacity-0 motion-reduce:transition-none">
                  {sections.map((section) => (
                    <Menu.LinkItem
                      aria-current={section.id === currentId ? "location" : undefined}
                      className={cn(
                        "flex items-center justify-between gap-6 rounded-xl px-3 py-2 text-[13px] leading-4 outline-none select-none data-highlighted:bg-surface-2",
                        section.id === currentId
                          ? "bg-peach-light font-medium text-peach-dark data-highlighted:bg-peach-light"
                          : "text-text-primary",
                      )}
                      // Base UI leaves link items' menus open by default, on the
                      // assumption the link leaves the page. These jump within it,
                      // so the menu has to get out of the way of where you landed.
                      closeOnClick
                      href={sectionHref(section.id)}
                      key={section.id}
                    >
                      {section.title}
                      <span
                        className={cn(
                          "tabular-nums",
                          section.id === currentId ? "text-peach-dark" : "text-text-tertiary",
                        )}
                      >
                        {section.count}
                      </span>
                    </Menu.LinkItem>
                  ))}
                </Menu.Popup>
              </Menu.Positioner>
            </Menu.Portal>
          </Menu.Root>

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
