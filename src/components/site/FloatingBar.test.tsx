// @vitest-environment happy-dom
import { render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { type BarSection, FloatingBar } from "@/components/site/FloatingBar";
import { barSections } from "@/lib/bar";
import { features } from "@/lib/copy";
import { pageTileCounts } from "@/lib/tiles";

const SECTIONS: BarSection[] = [
  { count: 3, id: "tracks", title: "Photo tracks" },
  { count: 4, id: "local-first", title: "Local-first" },
  { count: 1127, id: "performance", title: "Fast performance" },
];

const BRAND = { count: 10, title: "Qeepa" };

/** Fixed, so the adopt line — the middle of the viewport — sits at 400px. */
const VIEWPORT_HEIGHT = 800;

beforeEach(() => {
  window.innerHeight = VIEWPORT_HEIGHT;
});

/**
 * Lay the sections into the document with fixed tops, since happy-dom does no
 * layout. A top at or above the middle of the viewport counts as reached.
 */
function placeSections(tops: Record<string, number>) {
  for (const [id, top] of Object.entries(tops)) {
    const section = document.createElement("section");
    section.id = id;
    section.getBoundingClientRect = () => ({ top }) as DOMRect;
    document.body.append(section);
  }
}

afterEach(() => {
  for (const section of document.querySelectorAll("section")) section.remove();
});

function stars() {
  return within(screen.getByRole("navigation", { name: "Features" })).getAllByRole("link");
}

describe("FloatingBar", () => {
  it("reads as the page over the hero, with no star marked", () => {
    placeSections({ "local-first": 1600, performance: 2600, tracks: 900 });
    render(<FloatingBar brand={BRAND} sections={SECTIONS} />);

    expect(screen.getByRole("link", { name: "Qeepa" })).toHaveAttribute("href", "/");
    expect(screen.getByText("10 photos")).toBeInTheDocument();
    for (const star of stars()) expect(star).not.toHaveAttribute("aria-current");
  });

  it("names the section it is in, and marks the star at that section's position", () => {
    placeSections({ "local-first": 80, performance: 1100, tracks: -700 });
    render(<FloatingBar brand={BRAND} sections={SECTIONS} />);

    expect(screen.getByText("Local-first")).toBeInTheDocument();
    expect(screen.getByText("4 photos")).toBeInTheDocument();

    const current = stars().filter((star) => star.getAttribute("aria-current") === "location");
    expect(current).toHaveLength(1);
    expect(current[0]).toHaveAccessibleName("Local-first");
    expect(stars().indexOf(current[0]!)).toBe(1);
  });

  it("switches to the selection surface only inside a section", () => {
    placeSections({ "local-first": 1600, performance: 2600, tracks: 900 });
    const { container, unmount } = render(<FloatingBar brand={BRAND} sections={SECTIONS} />);
    expect(container.querySelector("[data-state]")).toHaveAttribute("data-state", "browse");
    unmount();

    for (const section of document.querySelectorAll("section")) section.remove();
    placeSections({ "local-first": 1600, performance: 2600, tracks: 20 });
    const again = render(<FloatingBar brand={BRAND} sections={SECTIONS} />);
    expect(again.container.querySelector("[data-state]")).toHaveAttribute(
      "data-state",
      "selection",
    );
  });

  it("makes every star a link to its section, in page order", () => {
    render(<FloatingBar brand={BRAND} sections={SECTIONS} />);

    expect(stars().map((star) => star.getAttribute("href"))).toEqual([
      "/#tracks",
      "/#local-first",
      "/#performance",
    ]);
    expect(stars().map((star) => star.getAttribute("aria-label"))).toEqual(
      SECTIONS.map((section) => section.title),
    );
  });

  it("offers Get Qeepa as a genuinely disabled button, not a styled one", () => {
    render(<FloatingBar brand={BRAND} sections={SECTIONS} />);
    expect(screen.getByRole("button", { name: "Get Qeepa" })).toBeDisabled();
  });

  /*
   * The regression this guards: the bar used to adopt a section only once its
   * top reached 140px from the top of the screen, which — with 112px of
   * padding above every row's content — meant the next feature was well on
   * screen before the bar changed. It now adopts at the middle of the screen.
   */
  it("adopts a section as soon as its top reaches the middle of the screen", () => {
    placeSections({ "local-first": 300, performance: 1400, tracks: -500 });
    render(<FloatingBar brand={BRAND} sections={SECTIONS} />);
    expect(screen.getByText("Local-first")).toBeInTheDocument();
  });

  it("holds the previous section until the next one reaches the middle", () => {
    placeSections({ "local-first": 460, performance: 1400, tracks: -500 });
    render(<FloatingBar brand={BRAND} sections={SECTIONS} />);
    expect(screen.getByText("Photo tracks")).toBeInTheDocument();
  });

  it("offers nothing but the stars and the button on the right", () => {
    render(<FloatingBar brand={BRAND} sections={SECTIONS} />);
    expect(screen.getAllByRole("button").map((button) => button.textContent)).toEqual([
      "Get Qeepa",
    ]);
  });

  it("omits the count on pages with no photo frames rather than claiming zero", () => {
    render(<FloatingBar brand={{ count: null, title: "Qeepa" }} sections={SECTIONS} />);
    expect(screen.queryByText(/photos/)).not.toBeInTheDocument();
  });
});

describe("barSections", () => {
  it("is every feature row, in page order, named by its heading", () => {
    expect(barSections.map((section) => section.id)).toEqual(features.map((f) => f.id));
    expect(barSections.map((section) => section.title)).toEqual(features.map((f) => f.heading));
  });

  it("carries each row's count from the tile census", () => {
    for (const section of barSections) {
      expect(section.count, section.id).toBe(
        pageTileCounts[section.id as keyof typeof pageTileCounts],
      );
    }
  });

  it("has five sections, so five stars", () => {
    expect(barSections).toHaveLength(5);
  });
});
