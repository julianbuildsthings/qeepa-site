// @vitest-environment happy-dom
import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { HeroGallery } from "@/components/demo/HeroGallery";
import { cycle } from "@/lib/motion";
import { heroRatings, heroTileOrder, pipFilled, tones } from "@/lib/tones";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

function frames(container: HTMLElement) {
  return [...container.querySelectorAll("[data-track] > div")] as HTMLElement[];
}

function labels(container: HTMLElement) {
  return frames(container).map((frame) => frame.lastElementChild?.textContent);
}

/** Filled rating squares per frame. */
function ratings(container: HTMLElement) {
  return frames(container).map((frame) => {
    const pips = frame.querySelector(".flex");
    if (!pips || pips.classList.contains("opacity-0")) return null;
    return [...pips.children].filter(
      (pip) => (pip as HTMLElement).style.backgroundColor === pipFilled,
    ).length;
  });
}

function advance(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}

describe("HeroGallery", () => {
  it("renders the approved still first: RAW, the approved tones and ratings", () => {
    const { container } = render(<HeroGallery />);

    expect(labels(container)).toEqual(heroTileOrder.map((_, index) => `${4821 + index}.raw`));
    expect(frames(container).map((frame) => frame.style.backgroundColor)).toEqual(
      heroTileOrder.map((tone) => tones[tone]),
    );
    expect(ratings(container)).toEqual(heroRatings[0]);
  });

  it("switches every frame to the next track on the tracks row's cadence", () => {
    const { container } = render(<HeroGallery />);
    advance(cycle.track);

    expect(labels(container)).toEqual(heroTileOrder.map((_, index) => `${4821 + index}.jpg`));
    expect(container.querySelector("[data-track]")).toHaveAttribute("data-track", "jpg");

    advance(cycle.track);
    expect(labels(container)[0]).toBe("4821.psd");
  });

  it("rearranges the tones at each switch", () => {
    const { container } = render(<HeroGallery />);
    const before = frames(container).map((frame) => frame.style.backgroundColor);
    advance(cycle.track);
    const after = frames(container).map((frame) => frame.style.backgroundColor);

    expect(after).not.toEqual(before);
    expect(after.toSorted()).toEqual(before.toSorted());
  });

  it("re-rates after a full pass, half a dwell after the switch back to RAW", () => {
    const { container } = render(<HeroGallery />);

    advance(cycle.track * 3);
    expect(labels(container)[0]).toBe("4821.raw");
    // Not on the switch's beat.
    expect(ratings(container)).toEqual(heroRatings[0]);

    advance(cycle.track / 2);
    expect(ratings(container)).toEqual(heroRatings[1]);
  });

  it("stops for good when a track is picked, and pauses while hovered", () => {
    const { container } = render(<HeroGallery />);

    fireEvent.mouseEnter(container.firstElementChild!);
    advance(cycle.track * 2);
    expect(labels(container)[0]).toBe("4821.raw");
    fireEvent.mouseLeave(container.firstElementChild!);

    fireEvent.click(screen.getByRole("button", { name: /EDIT/ }));
    expect(labels(container)[0]).toBe("4821.psd");
    advance(cycle.track * 6);
    expect(labels(container)[0]).toBe("4821.psd");
  });
});
