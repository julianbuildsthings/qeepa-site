import type { AnimationPlaybackControls } from "motion/react";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { animate, motion, MotionConfig, useMotionValue, useReducedMotion } from "motion/react";
import { type KeyboardEvent, useEffect, useEffectEvent, useRef, useState } from "react";

import { screenshots } from "@/lib/copy";
import { cycle, presets } from "@/lib/motion";
import { screenshotSize, screenshotSlides } from "@/lib/screenshots";
import { cn } from "@/lib/utils";

/**
 * Real screenshots of the app, under the closing — the one place the page
 * shows the product itself rather than its flat-tone demonstrations.
 *
 * It plays itself, one screenshot per `cycle.screenshot`, on the rules every
 * loop on the page follows: never paused by hover (a pointer resting on it
 * early meant a visitor never saw it move), paused while one of its controls
 * has keyboard focus, stopped for good once a control is used, and never
 * started under reduced motion.
 *
 * It only ever travels forward on its own. A copy of the first screenshot sits
 * after the last, so the wrap slides one step onto the copy and then jumps,
 * unseen, back to the real first — rather than rewinding across all four.
 * Previous from the first does the same in reverse.
 */
const SIZES =
  "(min-width: 1440px) 1200px, (min-width: 1024px) calc(100vw - 240px), calc(100vw - 48px)";

/** The floating bar's own surface and shadow, as a 48px round button. */
const ARROW_CLASS =
  "extend-touch-target flex size-12 shrink-0 items-center justify-center rounded-full bg-[#FFFFFFF5] text-text-secondary shadow-[0px_10px_30px_rgba(43,38,33,0.14)] transition-colors duration-(--motion-quick) ease-(--ease-standard) hover:text-text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none motion-reduce:transition-none";

/** The strip's offset with `position` in view; `count` is the wrap copy. */
const at = (position: number) => `${-position * 100}%`;

export function ScreenshotCarousel() {
  const count = screenshotSlides.length;
  const [index, setIndex] = useState(0);
  const [pinned, setPinned] = useState(false);
  const [paused, setPaused] = useState(false);
  /*
   * Lazy in the server HTML, eager once hydrated. The island hydrates as it
   * comes into view, and a lazy image clipped off to the side of the strip
   * may not start loading until it is already sliding in.
   */
  const [hydrated, setHydrated] = useState(false);
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(at(0));
  const travel = useRef<AnimationPlaybackControls | null>(null);

  const playing = !pinned && !paused && !reduceMotion;

  useEffect(() => setHydrated(true), []);
  useEffect(() => () => travel.current?.stop(), []);

  const show = (to: number, step: -1 | 0 | 1) => {
    const target = (to + count) % count;
    travel.current?.stop();
    setIndex(target);

    if (reduceMotion) {
      x.set(at(target));
      return;
    }

    // Caught mid-wrap, on the copy's side of the last screenshot: the copy is
    // the first, so carry on from the real one.
    if (Number.parseFloat(x.get()) < -(count - 1) * 100) x.set(at(0));

    const wrapsForward = step === 1 && index === count - 1 && target === 0;
    const wrapsBack = step === -1 && index === 0 && target === count - 1;
    if (wrapsBack) x.set(at(count));

    travel.current = animate(x, at(wrapsForward ? count : target), {
      ...presets.gentle,
      onComplete: () => {
        if (wrapsForward) x.set(at(0));
      },
    });
  };

  // An effect event, so the dwell restarts only on a new slide or a change
  // of playing state — not on every render that rebuilds `show`.
  const advance = useEffectEvent(() => show(index + 1, 1));

  useEffect(() => {
    if (!playing) return;
    const id = setTimeout(advance, cycle.screenshot);
    return () => clearTimeout(id);
  }, [index, playing]);

  const use = (to: number, step: -1 | 0 | 1) => {
    setPinned(true);
    show(to, step);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      use(index + 1, 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      use(index - 1, -1);
    }
  };

  const image = (slide: (typeof screenshotSlides)[number], alt: string) => (
    <img
      alt={alt}
      className="block h-auto w-full"
      decoding="async"
      draggable={false}
      height={screenshotSize.height}
      loading={hydrated ? "eager" : "lazy"}
      sizes={SIZES}
      src={slide.src}
      srcSet={slide.srcSet}
      width={screenshotSize.width}
    />
  );

  return (
    <MotionConfig reducedMotion="user">
      {/*
        One grid, two arrangements. From lg the arrows flank the screenshot in
        the rail's gutter — the grid reaches out by an arrow and its gap on each
        side, so the screenshot keeps the rail's full width. Below lg there is
        no gutter to use, and they flank the dots instead.

        Keyboard focus pauses it: focus lands on the controls and bubbles up to
        the wrapper, which is not focusable itself.
      */}
      <div onBlur={() => setPaused(false)} onFocus={() => setPaused(true)}>
        <section
          aria-label={screenshots.label}
          aria-roledescription="carousel"
          className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-y-3 lg:-mx-[72px] lg:gap-x-6"
        >
          <div className="col-span-3 row-start-1 overflow-hidden rounded-2xl border border-[rgba(43,38,33,0.10)] bg-white shadow-[0_1px_3px_rgba(43,38,33,0.05),0_28px_64px_-24px_rgba(43,38,33,0.20)] lg:col-span-1 lg:col-start-2">
            {/* Announced only when the visitor is driving: a region that speaks
          every few seconds on its own is noise. */}
            <motion.div aria-live={playing ? "off" : "polite"} className="flex" style={{ x }}>
              {screenshotSlides.map((slide, position) => (
                <div
                  aria-hidden={position === index ? undefined : true}
                  aria-label={`${position + 1} of ${count}`}
                  aria-roledescription="slide"
                  className="w-full shrink-0"
                  key={slide.id}
                  role="group"
                >
                  {image(slide, slide.alt)}
                </div>
              ))}
              <div aria-hidden="true" className="w-full shrink-0" data-wrap-copy>
                {image(screenshotSlides[0]!, "")}
              </div>
            </motion.div>
          </div>

          <button
            aria-label="Previous screenshot"
            className={cn(ARROW_CLASS, "col-start-1 row-start-2 lg:row-start-1")}
            onClick={() => use(index - 1, -1)}
            onKeyDown={onKeyDown}
            type="button"
          >
            <ChevronLeft aria-hidden="true" size={18} />
          </button>

          <div className="col-start-2 row-start-2 flex items-center justify-center">
            {screenshotSlides.map((slide, position) => (
              <button
                aria-current={position === index ? "true" : undefined}
                aria-label={slide.alt}
                className="extend-touch-target-y flex size-6 items-center justify-center rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                key={slide.id}
                onClick={() => use(position, 0)}
                onKeyDown={onKeyDown}
                type="button"
              >
                {/* Shape as well as colour marks the current one: the peach
              alone is too faint against white to carry it. */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "block h-2 rounded-full transition-colors duration-(--motion-quick) ease-(--ease-standard) motion-reduce:transition-none",
                    position === index ? "w-5 bg-primary" : "w-2 bg-[rgba(43,38,33,0.18)]",
                  )}
                />
              </button>
            ))}
          </div>

          <button
            aria-label="Next screenshot"
            className={cn(ARROW_CLASS, "col-start-3 row-start-2 lg:row-start-1")}
            onClick={() => use(index + 1, 1)}
            onKeyDown={onKeyDown}
            type="button"
          >
            <ChevronRight aria-hidden="true" size={18} />
          </button>
        </section>
      </div>
    </MotionConfig>
  );
}
