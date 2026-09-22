/**
 * The app window's title strip: three muted traffic lights on white, and
 * nothing else.
 *
 * Shared by the hero window and the fast-performance strip so the two read as
 * the same window. It is its own component for the same reason `PhotoFrame`
 * is: an earlier version inlined frame chrome in two places and they drifted
 * the first time one was restyled.
 *
 * Static, so Astro renders it to HTML with no hydration wherever it is used.
 */
const LIGHTS = 3;

export function WindowBar() {
  return (
    <div className="flex h-[46px] shrink-0 items-center border-b border-[rgba(43,38,33,0.08)] bg-white px-[18px]">
      <div aria-hidden="true" className="flex shrink-0 gap-2">
        {Array.from({ length: LIGHTS }, (_, index) => (
          <span className="size-[11px] rounded-full bg-[rgba(43,38,33,0.15)]" key={index} />
        ))}
      </div>
    </div>
  );
}
