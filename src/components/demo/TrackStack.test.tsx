// @vitest-environment happy-dom
import { fireEvent, render, screen } from "@testing-library/react";
import { act } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { TRACK_META, TrackStack } from "@/components/demo/TrackStack";
import { cycle } from "@/lib/motion";
import { trackOrder } from "@/lib/tones";

const frontTrack = (container: HTMLElement) =>
  container.querySelector('[data-track][data-depth="0"]')?.getAttribute("data-track");

const tick = (ms: number) =>
  act(() => {
    vi.advanceTimersByTime(ms);
  });

describe("TrackStack", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders all three track frames at once so a cross-fade is possible", () => {
    const { container } = render(<TrackStack />);
    expect(container.querySelectorAll("[data-track]")).toHaveLength(3);
  });

  it("hides the decorative frames from assistive technology", () => {
    const { container } = render(<TrackStack />);
    for (const frame of container.querySelectorAll("[data-track]")) {
      expect(frame).toHaveAttribute("aria-hidden", "true");
    }
  });

  it("starts on raw and loops raw -> jpg -> edit -> raw", () => {
    const { container } = render(<TrackStack />);
    expect(frontTrack(container)).toBe("raw");

    tick(cycle.track);
    expect(frontTrack(container)).toBe("jpg");

    tick(cycle.track);
    expect(frontTrack(container)).toBe("edit");

    tick(cycle.track);
    expect(frontTrack(container)).toBe("raw");
  });

  it("pins a track and stops looping when a segment is clicked", () => {
    const { container } = render(<TrackStack />);

    const editButton = screen.getAllByRole("button").find((n) => n.textContent === "EDIT");
    if (!editButton) throw new Error("EDIT segment not rendered");
    fireEvent.click(editButton);
    expect(frontTrack(container)).toBe("edit");

    // The loop must not resume, or the pause affordance is not a pause.
    tick(cycle.track * 3);
    expect(frontTrack(container)).toBe("edit");
  });

  it("pauses while hovered and resumes on leave", () => {
    const { container } = render(<TrackStack />);
    const region = container.firstElementChild as HTMLElement;

    fireEvent.mouseEnter(region);
    tick(cycle.track * 2);
    expect(frontTrack(container)).toBe("raw");

    fireEvent.mouseLeave(region);
    tick(cycle.track);
    expect(frontTrack(container)).toBe("jpg");
  });

  it("keeps all three frames mounted across a full cycle", () => {
    const { container } = render(<TrackStack />);
    tick(cycle.track * 3);
    expect(container.querySelectorAll("[data-track]")).toHaveLength(3);
  });

  /*
   * The row's claim is "every version of a photo, together". A track is the
   * files that share a filename stem, so the stack must show one stem in
   * several formats — 522/523/524 read as three different shots.
   */
  it("labels every version with the same shot and a different format", () => {
    const labels = trackOrder.map((track) => TRACK_META[track].label);
    const stems = new Set(labels.map((label) => label.split(".")[0]));
    const extensions = new Set(labels.map((label) => label.split(".")[1]));

    expect(stems.size).toBe(1);
    expect(extensions.size).toBe(trackOrder.length);
  });
});
