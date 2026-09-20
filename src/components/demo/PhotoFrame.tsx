import { bloom } from "@/lib/gradients";
import { cn } from "@/lib/utils";

type PhotoFrameProps = {
  className?: string;
  gradient: string;
};

/**
 * A gradient standing in for a photograph.
 *
 * The bloom is a separate layer rather than part of the gradient so the
 * highlight stays put when the base changes between tracks — cross-fading the
 * base alone is what makes a track switch read as the same shot re-rendered,
 * rather than a different photo.
 *
 * Always decorative: the surrounding copy carries the meaning.
 */
export function PhotoFrame({ className, gradient }: PhotoFrameProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("relative overflow-hidden rounded-[5px]", className)}
      style={{ background: gradient }}
    >
      <div className="absolute inset-0" style={{ background: bloom }} />
    </div>
  );
}
