// @vitest-environment happy-dom
import { fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

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
  // A page tall enough to scroll, since happy-dom does no layout.
  Object.defineProperty(document.documentElement, "scrollHeight", {
    configurable: true,
    value: 10_000,
  });
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

  it("at the closing, names Qeepa with every star lit, still selected", () => {
    placeSections({
      availability: 120,
      "local-first": -2000,
      performance: -1000,
      tracks: -3000,
    });
    const { container } = render(
      <FloatingBar brand={BRAND} endId="availability" sections={SECTIONS} />,
    );

    expect(screen.getByRole("link", { name: "Qeepa" })).toBeInTheDocument();
    expect(container.querySelector("[data-state]")).toHaveAttribute("data-state", "selection");
    for (const star of stars()) {
      expect(star.querySelector("svg")).toHaveClass("text-raw");
      // The closing is not a feature, so no star claims to be where you are.
      expect(star).not.toHaveAttribute("aria-current");
    }
    // No frames are on screen at the closing, so no count is claimed there.
    expect(screen.queryByText(/photos/)).not.toBeInTheDocument();
  });

  /*
   * The regressions these guard: clicking a far star left the page to the
   * browser's smooth scroll, whose scroll events named every section on the
   * way, and which could stop short when the pointer crossed a graphic.
   */
  it("names the clicked section at once, and holds it through the travel", async () => {
    placeSections({ "local-first": 1600, performance: 2600, tracks: 900 });
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    render(<FloatingBar brand={BRAND} sections={SECTIONS} />);

    fireEvent.click(stars()[2]!);
    expect(screen.getByText("Fast performance")).toBeInTheDocument();
    expect(window.location.hash).toBe("#performance");

    // Mid-travel the page passes Local-first; the bar does not name it.
    for (const section of document.querySelectorAll("section")) section.remove();
    placeSections({ "local-first": 100, performance: 1100, tracks: -900 });
    fireEvent.scroll(window);
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(screen.queryByText("Local-first")).not.toBeInTheDocument();
    expect(scrollTo).toHaveBeenCalled();
    scrollTo.mockRestore();
  });

  it("hands the scroll back the moment the reader scrolls", async () => {
    placeSections({ "local-first": 1600, performance: 2600, tracks: 900 });
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    render(<FloatingBar brand={BRAND} sections={SECTIONS} />);

    fireEvent.click(stars()[2]!);
    for (const section of document.querySelectorAll("section")) section.remove();
    placeSections({ "local-first": 100, performance: 1100, tracks: -900 });
    fireEvent.wheel(window);
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(screen.getByText("Local-first")).toBeInTheDocument();
    scrollTo.mockRestore();
  });

  it("offers a Back button home on a page a step away from it", () => {
    render(<FloatingBar backHref="/" brand={BRAND} sections={SECTIONS} />);
    expect(screen.getByRole("link", { name: "Back to home" })).toHaveAttribute("href", "/");
  });

  it("names the page it is on as plain text when it has a Back button", () => {
    render(
      <FloatingBar
        backHref="/"
        brand={{ count: null, title: "Acceptable Use Policy" }}
        sections={SECTIONS}
      />,
    );
    expect(screen.getByText("Acceptable Use Policy").tagName).toBe("SPAN");
    // Back is the one way home, not the title as well.
    expect(screen.getAllByRole("link", { name: /home|Acceptable/ })).toHaveLength(1);
  });

  it("shows no stars when given no sections, as on the legal pages", () => {
    render(<FloatingBar backHref="/" brand={BRAND} sections={[]} />);
    expect(screen.queryByRole("navigation", { name: "Features" })).not.toBeInTheDocument();
  });

  it("drops Get Qeepa when asked to, as on the legal pages", () => {
    render(<FloatingBar backHref="/" brand={BRAND} offer={false} sections={[]} />);
    expect(screen.queryByRole("button", { name: "Get Qeepa" })).not.toBeInTheDocument();
  });

  it("has no Back button on the home page", () => {
    render(<FloatingBar brand={BRAND} sections={SECTIONS} />);
    expect(screen.queryByRole("link", { name: "Back to home" })).not.toBeInTheDocument();
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
