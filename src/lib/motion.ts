import type { Transition, Variants } from "motion/react";

/**
 * Motion tokens, ported verbatim from the Qeepa app (`src/utils/motion.ts`).
 * The site and the app share one physics vocabulary on purpose: a transition on
 * the marketing page should feel like the same product as the app it sells.
 *
 * The rule from the app's MOTION.md applies here unchanged — never inline a
 * duration, easing, spring or travel distance. If none of these fit, stop and
 * ask before adding a sixth preset rather than quietly introducing new physics.
 *
 * The app's `layoutIds` registry is deliberately not ported: the site has no
 * shared-layout surfaces, and an unused id registry invites duplicates.
 */
export type PresetName = "ambient" | "gentle" | "lively" | "snap" | "ui";

export const presets: Record<PresetName, Transition> = {
  /** Continuous background motion — e.g. a slow gallery scroll. */
  ambient: { duration: 2, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY },
  /** Large surfaces: panels, sheets, full-width reveals. Critically damped. */
  gentle: { damping: 26, stiffness: 170, type: "spring" },
  /**
   * Celebratory beats. As quick as `snap` but keeps a ~4% kick. Speed comes
   * from stiffness, not from cutting the bounce — lowering damping instead rang
   * for ~440ms, which read as sluggish.
   */
  lively: { damping: 40, stiffness: 800, type: "spring" },
  /** Instant feedback: toggles, press states. */
  snap: { damping: 40, stiffness: 500, type: "spring" },
  /**
   * Reveals, cross-fades and every piece of chrome — the default for everything
   * else. Sharing this one token is precisely what lets all of it be re-timed
   * together: this number *is* the chrome's speed.
   */
  ui: { damping: 42, stiffness: 600, type: "spring" },
};

/**
 * How far things travel, in px. Consistency here reads as much as timing does:
 * the same action should always move the same distance.
 */
export const distance = {
  /** Default enter/exit travel for content appearing in place. */
  enter: 16,
  /** Hover nudge and press recoil. */
  hover: 4,
  /** Panels and full-surface slides. */
  panel: 32,
};

/** Per-child delay for staggered reveals, in seconds. */
export const stagger = {
  /** Default list and grid reveal. */
  base: 0.06,
  /** Short lists and hero content. */
  relaxed: 0.12,
  /** Long grids, where the offset should be barely perceptible. */
  tight: 0.03,
};

export type EasingName = "enter" | "exit" | "standard";

/**
 * Cubic-bézier easing for tween work — opacity, colour, and anything else that
 * isn't physical. Anything positional should use a spring preset instead.
 */
export const easings: Record<EasingName, [number, number, number, number]> = {
  /** Element arriving. */
  enter: [0, 0, 0.58, 1],
  /** Element leaving. */
  exit: [0.42, 0, 1, 1],
  /** Symmetric in/out — the default for fades. */
  standard: [0.42, 0, 0.58, 1],
};

/** Durations for tween work, in seconds. */
export const durations = {
  /** Fades and small state changes. */
  base: 0.25,
  /** Deliberate reveals — feature-row content entering. */
  editorial: 0.35,
  /** Hover, focus, colour and fades. */
  quick: 0.15,
  /** Larger surfaces. */
  slow: 0.4,
};

/**
 * Dwell time per step in a looping demonstration, in ms.
 *
 * Site-only: the app has no self-playing marketing loop, so there is nothing to
 * port. This is a scheduling interval rather than a transition, which is why it
 * is a token of its own and not a sixth preset — the presets describe how a
 * change feels, this describes how long to wait before starting the next one.
 */
export const cycle = {
  /**
   * Dwell on the settled state of a two-state demonstration — long enough to
   * read the caption that state writes.
   */
  hold: 2200,
  /**
   * Dwell on that demonstration's starting state. Half a `hold`, because it is
   * the state the viewer has already read; holding it as long only produces
   * dead air between plays.
   */
  reset: 1100,
  /** RAW → JPG → EDIT on the tracks demonstration. */
  track: 1400,
};

/**
 * Continuous linear travel, in px per second.
 *
 * A speed rather than a duration, because the distance these travel depends on
 * how much content there is and how wide the viewport is. A fixed duration
 * would mean the same strip crawled on a narrow screen and raced on a wide
 * one; the thing that should stay constant is how fast it looks.
 */
export const speeds = {
  /** The gallery strip browsing itself — roughly one row of thumbnails a second. */
  gallery: 72,
};

/** Content appearing in place. Pair with AnimatePresence for the exit half. */
export const fadeInUp = {
  animate: { opacity: 1, transition: presets.ui, y: 0 },
  exit: { opacity: 0, transition: presets.snap, y: distance.enter / 2 },
  initial: { opacity: 0, y: distance.enter },
};

/** Spread onto any pressable control. Competing transforms stay composable. */
export const pressable = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
};

/** Parent of a staggered reveal — put `staggerItem` on each child. */
export const staggerContainer: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: stagger.base } },
};

/** Child of `staggerContainer`. */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: distance.enter },
  shown: {
    opacity: 1,
    transition: { duration: durations.editorial, ease: easings.enter },
    y: 0,
  },
};
