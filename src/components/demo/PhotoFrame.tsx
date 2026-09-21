import { frameBorder, pipEmpty, type TrackName } from "@/lib/tones";
import { cn } from "@/lib/utils";

/**
 * A flat tone standing in for a photograph, optionally carrying the metadata a
 * real preview carries: which track it belongs to, its frame number, and its
 * rating.
 *
 * The chrome is what makes a flat rectangle read as a photo rather than a
 * swatch — but only where there is room for it. Below roughly 150px wide the
 * 5px dot and 9px number stop being information and become dirt, so the
 * demonstrations that render frames smaller than that pass no metadata at all
 * and get a bare tone. That is a deliberate choice, not an oversight.
 *
 * Always decorative: the surrounding copy carries the meaning.
 */
const TRACK_DOT: Record<TrackName, string> = {
  edit: "bg-af",
  jpg: "bg-jpg",
  raw: "bg-raw",
};

const RATING_MAX = 5;

type PhotoFrameProps = {
  className?: string;
  /** Shown bottom-right. Omit on frames too small to read it. */
  frameNumber?: number;
  /** 1–5, or null for unrated. Most of a real shoot is unrated. */
  rating?: number | null;
  tone: string;
  /** Coloured dot, top-right. Omit on frames too small to read it. */
  track?: TrackName;
};

export function PhotoFrame({
  className,
  frameNumber,
  rating = null,
  tone,
  track,
}: PhotoFrameProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("relative rounded-[5px]", className)}
      style={{ background: tone, border: `1px solid ${frameBorder}` }}
    >
      {track && (
        <span
          className={cn("absolute top-2.5 right-2.5 size-[5px] rounded-full", TRACK_DOT[track])}
        />
      )}

      {rating !== null && (
        <span className="absolute bottom-[9px] left-2.5 flex gap-0.5">
          {Array.from({ length: RATING_MAX }, (_, index) => (
            <span
              className="size-[5px] shrink-0 rounded-[1px]"
              key={index}
              style={{ background: index < rating ? "var(--color-raw)" : pipEmpty }}
            />
          ))}
        </span>
      )}

      {frameNumber !== undefined && (
        <span className="absolute right-2.5 bottom-2 font-sans text-[9px] leading-3 tracking-[0.02em] text-text-tertiary">
          {frameNumber}
        </span>
      )}
    </div>
  );
}
