import { stagger } from "@/lib/motion";
import { frameBorder, pipEmpty, pipFilled, type TrackName } from "@/lib/tones";
import { cn } from "@/lib/utils";

/**
 * A flat tone standing in for a photograph, optionally carrying the metadata a
 * real preview carries: which track it belongs to, its frame number, and its
 * rating.
 *
 * The chrome is what makes a flat rectangle read as a photo rather than a
 * swatch — but only where it earns its weight. On the small file-list
 * thumbnails in local-first there is no room for it, and on the scrolling
 * fast-performance strip, repeated across sixty frames in motion, it was too
 * heavy. Both pass no metadata and get a bare tone. That is a deliberate
 * choice, not an oversight.
 *
 * `size="large"` scales the chrome for frames several hundred pixels across,
 * where the default 5px dot would disappear.
 *
 * Changes animate, for the frames that change in place (the hero, as it steps
 * through tracks and ratings): the tone and the track dot cross-fade over the
 * editorial duration, and a rating fills square by square, one `stagger.base`
 * apart. Colour only, so nothing reflows; and not at all under reduced motion.
 *
 * Always decorative: the surrounding copy carries the meaning.
 */
const TRACK_DOT: Record<TrackName, string> = {
  edit: "bg-af",
  jpg: "bg-jpg",
  raw: "bg-raw",
};

const RATING_MAX = 5;

/** A colour change in place: the tone, or the track dot. */
const CHANGE =
  "transition-colors duration-(--motion-editorial) ease-(--ease-standard) motion-reduce:transition-none";

const SIZES = {
  default: {
    dot: "size-[5px] top-2.5 right-2.5",
    number: "right-2.5 bottom-2 text-[9px] leading-3",
    pip: "size-[5px] rounded-[1px]",
    pips: "bottom-[9px] left-2.5 gap-0.5",
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
    dot: "size-[5px] top-2.5 right-2.5 sm:size-2 sm:top-4 sm:right-4",
    number:
      "right-2.5 bottom-2 text-[9px] leading-3 sm:right-4 sm:bottom-3.5 sm:text-[12px] sm:leading-4",
    pip: "size-[5px] rounded-[1px] sm:size-2 sm:rounded-[2px]",
    pips: "bottom-[9px] left-2.5 gap-0.5 sm:bottom-4 sm:left-4 sm:gap-1",
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
  /** 1–5, or null for unrated. Most of a real shoot is unrated. */
  rating?: number | null;
  /**
   * Keep the rating's squares in place while unrated, invisible, so a rating
   * can arrive by fading in and filling rather than popping into existence.
   * For frames whose rating changes as you watch.
   */
  ratingSlot?: boolean;
  size?: keyof typeof SIZES;
  tone: string;
  /** Coloured dot, top-right. Omit on frames too small to read it. */
  track?: TrackName;
};

export function PhotoFrame({
  className,
  frameNumber,
  rating = null,
  ratingSlot = false,
  size = "default",
  tone,
  track,
}: PhotoFrameProps) {
  const scale = SIZES[size];

  return (
    <div
      aria-hidden="true"
      className={cn("relative rounded-[5px]", CHANGE, className)}
      style={{ backgroundColor: tone, border: `1px solid ${frameBorder}` }}
    >
      {track && (
        <span className={cn("absolute rounded-full", CHANGE, scale.dot, TRACK_DOT[track])} />
      )}

      {(rating !== null || ratingSlot) && (
        <span
          className={cn(
            "absolute flex transition-opacity duration-(--motion-editorial) ease-(--ease-standard) motion-reduce:transition-none",
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
                backgroundColor: rating !== null && index < rating ? pipFilled : pipEmpty,
                transitionDelay: `${index * stagger.base}s`,
              }}
            />
          ))}
        </span>
      )}

      {frameNumber !== undefined && (
        <span
          className={cn("absolute font-sans tracking-[0.02em] text-text-tertiary", scale.number)}
        >
          {frameNumber}
        </span>
      )}
    </div>
  );
}
