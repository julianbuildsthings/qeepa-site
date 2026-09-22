import { frameBorder, pipEmpty, pipFilled, type TrackName } from "@/lib/tones";
import { cn } from "@/lib/utils";

/**
 * A flat tone standing in for a photograph, optionally carrying the metadata a
 * real preview carries: which track it belongs to, its frame number, and its
 * rating.
 *
 * The chrome is what makes a flat rectangle read as a photo rather than a
 * swatch — but only where there is room for it. The default size holds up down
 * to about 110px wide, the width of the fast-performance strip's five columns;
 * the rating pips and the number still clear each other there with room to
 * spare. Below that the dot and number stop being information and become dirt,
 * so the one demonstration that renders frames smaller — the 48px file-list
 * thumbnails in local-first — passes no metadata and gets a bare tone. That is
 * a deliberate choice, not an oversight.
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
   * Same corners as the default size, just scaled. Note that on the stacked
   * tracks only the front frame's rating is visible: the stack fans up and to
   * the right, so the frames behind hide their bottom-left under the frame in
   * front. That is what a stack of prints does, and it reads as the rating of
   * the photo you are actually looking at.
   */
  large: {
    dot: "size-2 top-4 right-4",
    number: "right-4 bottom-3.5 text-[12px] leading-4",
    pip: "size-2 rounded-[2px]",
    pips: "bottom-4 left-4 gap-1",
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
