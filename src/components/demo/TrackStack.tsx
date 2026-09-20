import { useState } from "react";

import { TrackPill } from "@/components/demo/TrackPill";
import { bloom, type TrackName, trackRender } from "@/lib/gradients";

/**
 * Approved comp `T3 · Tracks — stack`.
 *
 * Three renderings of the same shot, fanned as a stack of prints, with the
 * track pill on the front frame. The fan is what says "every version of a
 * photo, together" before a word is read.
 *
 * All three frames are always mounted and only `transform` and `opacity`
 * change, so the eventual cross-fade runs on the compositor and no content
 * appears or vanishes for a screen reader. Motion itself is added in the motion
 * pass; the structure here is what makes it cheap.
 */
const ORDER: TrackName[] = ["raw", "jpg", "edit"];

/** Per-step depth offset, in px. Matches the comp's 28px fan. */
const OFFSET = { x: 28, y: -28 };

export function TrackStack() {
  const [active, setActive] = useState<TrackName>("edit");
  const activeIndex = ORDER.indexOf(active);

  return (
    <div className="relative aspect-716/496 w-full">
      {ORDER.map((track, index) => {
        // 0 is the front frame; higher values sit further back in the fan.
        const depth = (activeIndex - index + ORDER.length) % ORDER.length;
        const isFront = depth === 0;

        return (
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-0 h-[89%] w-[92%] overflow-hidden rounded-[10px] shadow-[0_2px_6px_rgba(43,38,33,0.07),0_30px_64px_-24px_rgba(43,38,33,0.28)]"
            data-depth={depth}
            data-track={track}
            key={track}
            style={{
              background: trackRender[track],
              transform: `translate(${depth * OFFSET.x}px, ${depth * OFFSET.y}px)`,
              zIndex: ORDER.length - depth,
            }}
          >
            <div
              className="absolute inset-0"
              style={{ background: bloom, opacity: isFront ? 1 : 0.4 }}
            />
            {/* Frames behind recede with a warm veil rather than a grey one. */}
            <div
              className="absolute inset-0 bg-[rgba(255,252,246,0.10)]"
              style={{ opacity: isFront ? 0 : 1 }}
            />
          </div>
        );
      })}

      <div className="absolute bottom-[8%] left-0 z-10 flex w-[92%] justify-center">
        <TrackPill active={active} interactive onSelect={setActive} />
      </div>
    </div>
  );
}
