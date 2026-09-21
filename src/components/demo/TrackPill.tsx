import type { TrackName } from "@/lib/tones";

import { cn } from "@/lib/utils";

/**
 * The recurring component of the page: the app's own track switcher, appearing
 * in the hero and in the feature rows. Structure follows the app's
 * `track-pill.tsx` so the site and the product agree on what this control is.
 *
 * The coloured dot is decorative. The label carries the meaning, so track state
 * is never conveyed by colour alone.
 */
const TRACKS: { dot: string; key: TrackName; label: string }[] = [
  { dot: "bg-raw", key: "raw", label: "RAW" },
  { dot: "bg-jpg", key: "jpg", label: "JPG" },
  { dot: "bg-af", key: "edit", label: "EDIT" },
];

type TrackPillProps = {
  active: TrackName;
  /**
   * Static by default. A pill rendered into static HTML must not look
   * clickable, so non-interactive pills render spans rather than disabled
   * buttons.
   */
  interactive?: boolean;
  onSelect?: (track: TrackName) => void;
};

const SEGMENT_BASE =
  "inline-flex items-center gap-1.5 rounded-full px-[18px] py-[7px] text-[13px] leading-4";

export function TrackPill({ active, interactive = false, onSelect }: TrackPillProps) {
  return (
    <ul className="inline-flex items-center gap-0.5 rounded-full border border-[rgba(43,38,33,0.10)] bg-[rgba(255,255,255,0.96)] p-1 shadow-[0_1px_2px_rgba(43,38,33,0.08),0_10px_28px_-4px_rgba(43,38,33,0.28)]">
      {TRACKS.map(({ dot, key, label }) => {
        const isActive = key === active;
        const inner = (
          <>
            <span
              aria-hidden="true"
              className={cn("size-[7px] shrink-0 rounded-full", dot)}
              data-track-dot
            />
            <span>{label}</span>
          </>
        );

        return (
          <li aria-current={isActive ? "true" : undefined} key={key}>
            {interactive ? (
              <button
                className={cn(
                  SEGMENT_BASE,
                  "min-h-6 touch-manipulation transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                  isActive
                    ? "bg-primary font-medium text-accent-foreground"
                    : "text-text-secondary hover:text-text-primary",
                )}
                onClick={() => onSelect?.(key)}
                type="button"
              >
                {inner}
              </button>
            ) : (
              <span
                className={cn(
                  SEGMENT_BASE,
                  isActive
                    ? "bg-primary font-medium text-accent-foreground"
                    : "text-text-secondary",
                )}
              >
                {inner}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
