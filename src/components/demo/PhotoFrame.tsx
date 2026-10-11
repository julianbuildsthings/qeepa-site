import { AnimatePresence, motion } from "motion/react";

import { durations, easings, stagger } from "@/lib/motion";
import { frameBorder, frameFill, pipEmptyOnPhoto, pipFilled, type TrackName } from "@/lib/tones";
import { cn } from "@/lib/utils";

/**
 * One of the owner's photographs, optionally carrying the metadata a real
 * preview carries: which track it belongs to, its frame number, and its
 * rating.
 *
 * The chrome only appears where it earns its weight. On the scrolling
 * fast-performance strip, repeated across sixty frames in motion, it was too
 * heavy, so those frames pass no metadata and show the bare photo. That is a
 * deliberate choice, not an oversight.
 *
 * Each piece of chrome sits on its own small backing of frosted, translucent
 * warm ink, the way a photo app labels a thumbnail. The chrome was drawn for
 * near-white stand-ins; on a photograph — a concert shot is nearly black — a
 * bare frame number or an empty pip disappears. An opaque white backing fixed
 * that but cut a hole in every picture; this one lets the photo through,
 * blurred, so the mark sits on the picture rather than in it. A backing per
 * mark, rather than a scrim across the frame, leaves the rest untouched.
 *
 * `size="large"` scales the chrome for frames several hundred pixels across,
 * where the default 5px dot would disappear.
 *
 * Changes animate, for the frames that change in place (the hero, as it steps
 * through tracks and ratings): a new photo cross-fades over the old one and
 * the track dot's colour follows, both over the editorial duration, and a
 * rating fills square by square, one `stagger.base` apart. Opacity and colour
 * only, so nothing reflows; and not at all under reduced motion.
 *
 * Always decorative: the surrounding copy carries the meaning.
 */
const TRACK_DOT: Record<TrackName, string> = {
  edit: "bg-af",
  jpg: "bg-jpg",
  raw: "bg-raw",
};

const RATING_MAX = 5;

/** A colour change in place: the track dot. */
const CHANGE =
  "transition-colors duration-(--motion-editorial) ease-(--ease-standard) motion-reduce:transition-none";

/**
 * What each piece of chrome sits on: text-primary at a third, frosted. Dark
 * enough for light marks to hold on a near-white photo (the skylight, the
 * cap), light enough to stay a tint on a dark one.
 */
const BACKING = "bg-text-primary/35 backdrop-blur-[6px]";

const SIZES = {
  default: {
    dot: "size-[5px] top-2 right-2 ring-[1.5px]",
    number: "right-1.5 bottom-1.5 rounded-[3px] px-1 text-[9px] leading-3",
    pip: "size-[5px] rounded-[1px]",
    pips: "bottom-1.5 left-1.5 gap-0.5 rounded-[3px] px-1 py-[3.5px]",
  },
  /*
   * Same corners as the default size, just scaled. Note that on the stacked
   * tracks only the front frame's rating is visible: the stack fans up and to
   * the right, so the frames behind hide their bottom-left under the frame in
   * front. That is what a stack of prints does, and it reads as the rating of
   * the photo you are actually looking at.
   *
   * Large only from sm up. On a phone a "large" frame is about 300px wide, and
   * at full scale its rating ran underneath the track pill; below sm it takes
   * the default chrome, which clears the pill.
   */
  large: {
    dot: "size-[5px] top-2 right-2 ring-[1.5px] sm:size-2 sm:top-3.5 sm:right-3.5 sm:ring-2",
    number:
      "right-1.5 bottom-1.5 rounded-[3px] px-1 text-[9px] leading-3 sm:right-3 sm:bottom-3 sm:rounded-[4px] sm:px-1.5 sm:py-0.5 sm:text-[12px] sm:leading-4",
    pip: "size-[5px] rounded-[1px] sm:size-2 sm:rounded-[2px]",
    pips: "bottom-1.5 left-1.5 gap-0.5 rounded-[3px] px-1 py-[3.5px] sm:bottom-3 sm:left-3 sm:gap-1 sm:rounded-[4px] sm:px-1.5 sm:py-[6px]",
  },
} as const;

type PhotoFrameProps = {
  className?: string;
  /**
   * Shown bottom-right: a frame number, or a number with its extension where
   * the format is the point (the three renderings of one shot on the tracks
   * row). Omit on frames too small to read it.
   */
  frameNumber?: number | string;
  /**
   * Fetch the photo straight away rather than when it nears the viewport. For
   * the hero, which is the first thing on the page, and for frames whose
   * owner knows they are about to be seen.
   */
  eager?: boolean;
  /** 1–5, or null for unrated. Most of a real shoot is unrated. */
  rating?: number | null;
  /**
   * Keep the rating's squares in place while unrated, invisible, so a rating
   * can arrive by fading in and filling rather than popping into existence.
   * For frames whose rating changes as you watch.
   */
  ratingSlot?: boolean;
  size?: keyof typeof SIZES;
  /** Rendered widths for `srcSet`, where the frame has more than one file. */
  sizes?: string;
  /** The photo. Already cropped to 3:2 by scripts/photos.mjs. */
  src: string;
  srcSet?: string;
  /** Coloured dot, top-right. Omit on frames too small to read it. */
  track?: TrackName;
};

export function PhotoFrame({
  className,
  eager = false,
  frameNumber,
  rating = null,
  ratingSlot = false,
  size = "default",
  sizes,
  src,
  srcSet,
  track,
}: PhotoFrameProps) {
  const scale = SIZES[size];

  return (
    <div
      aria-hidden="true"
      className={cn("relative overflow-hidden rounded-[5px]", className)}
      data-photo={src}
      style={{ backgroundColor: frameFill, border: `1px solid ${frameBorder}` }}
    >
      <AnimatePresence initial={false}>
        <motion.img
          alt=""
          animate={{ opacity: 1 }}
          className="absolute inset-0 size-full object-cover"
          decoding="async"
          draggable={false}
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          key={src}
          loading={eager ? "eager" : "lazy"}
          sizes={sizes}
          src={src}
          srcSet={srcSet}
          transition={{ duration: durations.editorial, ease: easings.standard }}
        />
      </AnimatePresence>

      {track && (
        <span
          className={cn("absolute rounded-full ring-white/70", CHANGE, scale.dot, TRACK_DOT[track])}
        />
      )}

      {(rating !== null || ratingSlot) && (
        <span
          className={cn(
            "absolute flex transition-opacity duration-(--motion-editorial) ease-(--ease-standard) motion-reduce:transition-none",
            BACKING,
            scale.pips,
            rating === null && "opacity-0",
          )}
        >
          {Array.from({ length: RATING_MAX }, (_, index) => (
            <span
              className={cn(
                "shrink-0 transition-colors duration-(--motion-base) ease-(--ease-standard) motion-reduce:transition-none",
                scale.pip,
              )}
              key={index}
              style={{
                backgroundColor: rating !== null && index < rating ? pipFilled : pipEmptyOnPhoto,
                transitionDelay: `${index * stagger.base}s`,
              }}
            />
          ))}
        </span>
      )}

      {frameNumber !== undefined && (
        <span
          className={cn("absolute font-sans tracking-[0.02em] text-white", BACKING, scale.number)}
        >
          {frameNumber}
        </span>
      )}
    </div>
  );
}
