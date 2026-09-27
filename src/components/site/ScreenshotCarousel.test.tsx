// @vitest-environment happy-dom
import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ScreenshotCarousel } from "@/components/site/ScreenshotCarousel";
import { screenshots } from "@/lib/copy";
import { cycle } from "@/lib/motion";

const reduced = vi.hoisted(() => ({ motion: false }));

vi.mock("motion/react", async (original) => ({
  ...(await original<typeof import("motion/react")>()),
  useReducedMotion: () => reduced.motion,
}));

const alts = screenshots.slides.map((slide) => slide.alt);

const tick = (ms: number) =>
  act(() => {
    vi.advanceTimersByTime(ms);
  });

// `hidden`, or the slides not on show are skipped for being aria-hidden.
const slides = () => screen.getAllByRole("group", { hidden: true });

/** The alt text of the screenshot on show, read from the dot marked current. */
function current() {
  const dots = screen
    .getAllByRole("button")
    .filter((button) => button.getAttribute("aria-current") === "true");
  expect(dots).toHaveLength(1);
  return dots[0]!.getAttribute("aria-label");
}

const next = () => screen.getByRole("button", { name: "Next screenshot" });
const previous = () => screen.getByRole("button", { name: "Previous screenshot" });

describe("ScreenshotCarousel", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    reduced.motion = false;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("is a labelled carousel region", () => {
    render(<ScreenshotCarousel />);
    const region = screen.getByRole("region", { name: screenshots.label });
    expect(region).toHaveAttribute("aria-roledescription", "carousel");
  });

  it("renders one numbered slide per screenshot", () => {
    render(<ScreenshotCarousel />);
    expect(slides()).toHaveLength(alts.length);
    slides().forEach((slide, index) => {
      expect(slide).toHaveAttribute("aria-roledescription", "slide");
      expect(slide).toHaveAttribute("aria-label", `${index + 1} of ${alts.length}`);
    });
  });

  it("starts on the first screenshot, with the others hidden", () => {
    render(<ScreenshotCarousel />);
    expect(current()).toBe(alts[0]);
    expect(slides().map((slide) => slide.getAttribute("aria-hidden"))).toEqual(
      alts.map((_, index) => (index === 0 ? null : "true")),
    );
  });

  it("shows no caption, but gives every image its alt text and both widths", () => {
    render(<ScreenshotCarousel />);
    for (const alt of alts) {
      expect(screen.queryByText(alt)).toBeNull();
    }
    const images = slides().map((slide) => slide.querySelector("img")!);
    expect(images.map((image) => image.getAttribute("alt"))).toEqual(alts);
    for (const image of images) {
      expect(image.getAttribute("srcset")).toMatch(/ 1200w, .+ 2400w$/);
      expect(image).toHaveAttribute("width");
      expect(image).toHaveAttribute("height");
    }
  });

  it("hides the copy of the first screenshot that the loop wraps onto", () => {
    const { container } = render(<ScreenshotCarousel />);
    const clone = container.querySelector("[data-wrap-copy]");
    expect(clone).toHaveAttribute("aria-hidden", "true");
    expect(clone?.querySelector("img")).toHaveAttribute("alt", "");
  });

  it("advances on its own, one screenshot per dwell, and wraps to the first", () => {
    render(<ScreenshotCarousel />);
    for (let step = 1; step < alts.length; step++) {
      tick(cycle.screenshot);
      expect(current()).toBe(alts[step]);
    }
    tick(cycle.screenshot);
    expect(current()).toBe(alts[0]);
  });

  it("does not announce slides while it is playing itself", () => {
    const { container } = render(<ScreenshotCarousel />);
    expect(container.querySelector("[aria-live]")).toHaveAttribute("aria-live", "off");
    fireEvent.click(next());
    expect(container.querySelector("[aria-live]")).toHaveAttribute("aria-live", "polite");
  });

  it("stops playing for good once a control is clicked", () => {
    render(<ScreenshotCarousel />);
    fireEvent.click(next());
    expect(current()).toBe(alts[1]);
    tick(cycle.screenshot * 3);
    expect(current()).toBe(alts[1]);
  });

  it("pauses while a control has keyboard focus, and resumes on blur", () => {
    render(<ScreenshotCarousel />);
    fireEvent.focus(next());
    tick(cycle.screenshot * 2);
    expect(current()).toBe(alts[0]);
    fireEvent.blur(next());
    tick(cycle.screenshot);
    expect(current()).toBe(alts[1]);
  });

  it("does not pause on hover", () => {
    render(<ScreenshotCarousel />);
    fireEvent.mouseEnter(screen.getByRole("region", { name: screenshots.label }));
    tick(cycle.screenshot);
    expect(current()).toBe(alts[1]);
  });

  it("never plays itself under reduced motion", () => {
    reduced.motion = true;
    render(<ScreenshotCarousel />);
    tick(cycle.screenshot * 3);
    expect(current()).toBe(alts[0]);
  });

  it("moves forward with Next and wraps from the last to the first", () => {
    render(<ScreenshotCarousel />);
    for (let step = 1; step < alts.length; step++) {
      fireEvent.click(next());
      expect(current()).toBe(alts[step]);
    }
    fireEvent.click(next());
    expect(current()).toBe(alts[0]);
  });

  it("wraps from the first to the last with Previous", () => {
    render(<ScreenshotCarousel />);
    fireEvent.click(previous());
    expect(current()).toBe(alts.at(-1));
  });

  it("jumps straight to a screenshot from its dot", () => {
    render(<ScreenshotCarousel />);
    fireEvent.click(screen.getByRole("button", { name: alts[2] }));
    expect(current()).toBe(alts[2]);
    expect(slides()[2]).not.toHaveAttribute("aria-hidden");
    expect(slides()[0]).toHaveAttribute("aria-hidden", "true");
  });

  it("pages with the arrow keys from any of its controls", () => {
    render(<ScreenshotCarousel />);
    fireEvent.keyDown(next(), { key: "ArrowRight" });
    expect(current()).toBe(alts[1]);
    fireEvent.keyDown(screen.getByRole("button", { name: alts[1] }), { key: "ArrowLeft" });
    fireEvent.keyDown(previous(), { key: "ArrowLeft" });
    expect(current()).toBe(alts.at(-1));
  });
});
