import { ChevronLeft, Star } from "lucide-react";
import { animate, AnimatePresence, motion, MotionConfig, useReducedMotion } from "motion/react";
import { type MouseEvent, useEffect, useRef, useState } from "react";

import { durations, easings, presets } from "@/lib/motion";
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
   * Where the Back button goes, on pages that are a step away from the home
   * page (the legal pages). Omit on the home page itself, which has nowhere
   * to go back to.
   */
  backHref?: string;
  /**
   * A section after the features — the closing — where the bar names the
   * product again, with every star lit, instead of going on naming the last
   * feature once you are past it. Omit on pages without one.
   */
  endId?: string;
  /**
   * The features, in page order. The nth is marked by n stars. Empty on the
   * legal pages, which show no stars: they are not a tour of the features.
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

/**
 * Root-relative, so a star always names the home page's section — an in-page
 * jump there, and still a working link if a star is ever shown elsewhere.
 */
function sectionHref(id: string): string {
  return `/#${id}`;
}

/** Input that means the reader has taken the scroll back. */
const TAKEOVER_EVENTS = ["wheel", "touchstart", "keydown", "pointerdown"] as const;

/**
 * Where the page must scroll for a section to land as a native anchor jump
 * would: its top, less its `scroll-margin-top`, clamped to what can scroll.
 */
function scrollTargetFor(element: HTMLElement): number {
  const margin = Number.parseFloat(getComputedStyle(element).scrollMarginTop) || 0;
  const top = element.getBoundingClientRect().top + window.scrollY - margin;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return Math.min(Math.max(top, 0), Math.max(max, 0));
}

export function FloatingBar({ backHref, brand, endId, sections }: FloatingBarProps) {
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [previewed, setPreviewed] = useState<number | null>(null);
  /*
   * The section a star was clicked for, while the page travels to it. The bar
   * names it from the click on, rather than naming every section it passes.
   */
  const [travellingTo, setTravellingTo] = useState<string | null>(null);
  const travel = useRef<{ stop: () => void } | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    // The end section is tracked like any other, but it is not a feature, so
    // when it is current no star is marked as the current location.
    const ids = [...sections.map((section) => section.id), ...(endId ? [endId] : [])];
    let frame = 0;

    const update = () => {
      frame = 0;
      if (travel.current) return;
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

  // Stop any travel still running when the bar goes away.
  useEffect(() => () => travel.current?.stop(), []);

  /**
   * A star's click on the home page. The page travels by a spring the bar
   * drives itself, rather than by the browser's smooth anchor scroll, for two
   * reasons found in use:
   *
   * 1. The native scroll fires scroll events through every section on the
   *    way, so the bar flickered through each one — Shoot insights for a
   *    moment on the way from Photo management to Photo tracks.
   * 2. Passing the pointer over a graphic mid-scroll could stop the page
   *    short. The demos then paused their loops on hover (they no longer do);
   *    the browser's own smooth scroll is fragile to what happens beneath it,
   *    and it gave up.
   *
   * A spring set frame by frame answers to nothing but this code. It stops only
   * when the reader takes the scroll back — a wheel, a touch, a key, a press —
   * and the bar then names wherever they have stopped. Under reduced motion
   * the page jumps.
   */
  const travelTo = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    // Off the home page the link navigates there, as a link.
    const target = document.getElementById(id);
    if (!target || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();

    travel.current?.stop();
    history.pushState(null, "", `#${id}`);
    const top = scrollTargetFor(target);

    const finish = () => {
      for (const name of TAKEOVER_EVENTS) window.removeEventListener(name, takeover);
      travel.current = null;
      setTravellingTo(null);
      // Name wherever the page came to rest.
      window.dispatchEvent(new Event("scroll"));
    };
    const takeover = () => {
      animation?.stop();
      finish();
    };

    if (reduceMotion) {
      window.scrollTo({ behavior: "instant", top });
      return;
    }

    setTravellingTo(id);
    setCurrentId(id);
    // `instant` on each step, or the page's CSS `scroll-behavior: smooth`
    // would turn every frame of the spring into a smooth scroll of its own.
    const animation = animate(window.scrollY, top, {
      ...presets.gentle,
      onComplete: finish,
      onUpdate: (y) => window.scrollTo({ behavior: "instant", top: y }),
    });
    travel.current = { stop: takeover };
    for (const name of TAKEOVER_EVENTS) {
      window.addEventListener(name, takeover, { once: true, passive: true });
    }
  };

  const index = sections.findIndex((section) => section.id === (travellingTo ?? currentId));
  const current = index === -1 ? null : sections[index]!;
  const atEnd = endId !== undefined && currentId === endId;

  /*
   * At the closing the bar stays in the selection state with every star lit —
   * all five features seen, the rating complete — but names the product
   * rather than a feature, since the closing belongs to none of them.
   */
  const selecting = current !== null || atEnd;

  /*
   * The count names frames the viewer can see. Over the hero that is the
   * hero's grid; at the closing there are none, so the bar shows the name
   * alone rather than repeating a count for a grid long since scrolled away.
   */
  const count = current ? current.count : atEnd ? null : brand.count;

  /**
   * How many stars read as filled: the one hovered, else every star at the
   * closing, else the current section's position.
   */
  const filled = previewed ?? (atEnd ? sections.length : index + 1);

  const titleClass =
    // `py-px` takes the 22px line to the 24px minimum hit target; the touch
    // extension then takes the brand link to 44px on touch screens.
    "extend-touch-target-y min-w-0 truncate rounded-sm py-px font-serif text-[17px] leading-[22px] font-medium tracking-[-0.01em] text-text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";

  return (
    <MotionConfig reducedMotion="user">
      {/* `data-enter` slides the bar down into place on page load — see the
      entrances in global.css. On the outer wrapper, so it never fights the
      surface's own colour transition. */}
      <div
        className="pointer-events-none sticky top-4 z-30 mt-8 px-6 lg:mt-14 lg:px-[120px]"
        data-enter="bar"
      >
        <div className="mx-auto max-w-[1200px]">
          {/*
          The surface change is a CSS transition rather than a Motion animation:
          a colour is a tween with nothing physical about it, and Motion hands
          colours to the Web Animations API, whose cancellations surface as
          unhandled rejections in the test environment. Its timing is still the
          registry's — `durations.base` and `easings.standard`, as the CSS
          variables `motionCssVariables()` sets on the page.
        */}
          <div
            className={cn(
              "pointer-events-auto relative flex h-12 items-center gap-2.5 rounded-full pr-1.5 shadow-[0px_10px_30px_rgba(43,38,33,0.14)] transition-colors duration-(--motion-base) ease-(--ease-standard) motion-reduce:transition-none",
              // The app tightens the left edge when a round button sits there.
              backHref ? "pl-1.5" : "pl-5",
              selecting ? "bg-peach-light" : "bg-[#FFFFFFF5]",
            )}
            data-state={selecting ? "selection" : "browse"}
          >
            {/* `initial={false}` on the presence, not the label: the first render
          is the server's HTML, and a label that starts at opacity 0 is an
          invisible brand name until the island hydrates. Only later changes of
          section fade in. */}
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

            {/*
            Centred on the bar, not placed in the flow, so it holds still while
            the label beside it changes length — the app's centre slot does the
            same. Hidden below md, where the label and the button need the
            width, and absent where there are no sections (the legal pages).
          */}
            {sections.length > 0 && (
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
                            onClick={(event) => travelTo(event, section.id)}
                            onFocus={() => setPreviewed(position + 1)}
                            onMouseEnter={() => setPreviewed(position + 1)}
                            onMouseLeave={() => setPreviewed(null)}
                            title={section.title}
                          >
                            <Star
                              aria-hidden="true"
                              className={cn(
                                "transition-colors",
                                lit
                                  ? "text-raw"
                                  : selecting
                                    ? "text-[#6F3B0F2E]"
                                    : "text-[#2B26211F]",
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
            )}

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
    </MotionConfig>
  );
}
