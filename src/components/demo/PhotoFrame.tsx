import { frameBorder, pipEmpty, pipFilled, type TrackName } from "@/lib/tones";
import { cn } from "@/lib/utils";

/**
 * A flat tone standing in for a photograph, optionally carrying the metadata a
 * real preview carries: which track it belongs to, its frame number, and its
 * rating.
 *
 * The chrome is what makes a flat rectangle read as a photo rather than a
 * swatch — but only where there is room for it. Below roughly 150px wide the
 * dot and number stop being information and become dirt, so the demonstrations
 * that render frames smaller than that pass no metadata at all and get a bare
 * tone. That is a deliberate choice, not an oversight.
 *
 * `size="large"` scales the chrome for frames several hundred pixels across,
 * where the default 5px dot would disappear.
 *
 * Always decorative: the surrounding copy carries the meaning.
 */
const TRACK_DOT: Record<TrackName, string> = {
  edit: "bg-af",
  jpg: "bg-jpg",
  raw: "bg-raw",
};

const RATING_MAX = 5;

const SIZES = {
  default: {
    dot: "size-[5px] top-2.5 right-2.5",
    number: "right-2.5 bottom-2 text-[9px] leading-3",
    pip: "size-[5px] rounded-[1px]",
    pips: "bottom-[9px] left-2.5 gap-0.5",
  },
  /*
   * Pips sit top-left here, not bottom-left as they do on a gallery frame.
   * The large size exists for the stacked tracks, and the stack fans up and to
   * the right — so each frame behind shows its top and right edges and hides
   * its bottom-left under the frame in front. Ratings on the bottom-left would
   * be visible on exactly one of the three.
   */
  large: {
    dot: "size-2 top-4 right-4",
    number: "right-4 bottom-3.5 text-[12px] leading-4",
    pip: "size-2 rounded-[2px]",
    pips: "top-4 left-4 gap-1",
  },
} as const;

type PhotoFrameProps = {
  className?: string;
  /** Shown bottom-right. Omit on frames too small to read it. */
  frameNumber?: number;
  /** 1–5, or null for unrated. Most of a real shoot is unrated. */
  rating?: number | null;
  size?: keyof typeof SIZES;
  tone: string;
  /** Coloured dot, top-right. Omit on frames too small to read it. */
  track?: TrackName;
};

export function PhotoFrame({
  className,
  frameNumber,
  rating = null,
  size = "default",
  tone,
  track,
}: PhotoFrameProps) {
  const scale = SIZES[size];

  return (
    <div
      aria-hidden="true"
      className={cn("relative rounded-[5px]", className)}
      style={{ background: tone, border: `1px solid ${frameBorder}` }}
    >
      {track && <span className={cn("absolute rounded-full", scale.dot, TRACK_DOT[track])} />}

      {rating !== null && (
        <span className={cn("absolute flex", scale.pips)}>
          {Array.from({ length: RATING_MAX }, (_, index) => (
            <span
              className={cn("shrink-0", scale.pip)}
              key={index}
              style={{ background: index < rating ? pipFilled : pipEmpty }}
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
