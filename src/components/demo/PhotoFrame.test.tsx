// @vitest-environment happy-dom
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PhotoFrame } from "@/components/demo/PhotoFrame";
import { tones } from "@/lib/tones";

const pips = (container: HTMLElement) =>
  [...container.querySelectorAll("span")].filter((node) =>
    node.className.includes("rounded-[1px]"),
  );

describe("PhotoFrame", () => {
  it("renders a bare tone when given no metadata", () => {
    const { container } = render(<PhotoFrame tone={tones.shell} />);
    expect(container.querySelectorAll("span")).toHaveLength(0);
  });

  it("stays hidden from assistive technology", () => {
    const { container } = render(<PhotoFrame tone={tones.shell} />);
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
  });

  it("shows five pips, filled to the rating", () => {
    const { container } = render(<PhotoFrame rating={3} tone={tones.shell} />);
    const all = pips(container);
    expect(all).toHaveLength(5);
    const filled = all.filter((node) => node.style.background.includes("--color-raw"));
    expect(filled).toHaveLength(3);
  });

  it("shows no pips at all when unrated, rather than five empty ones", () => {
    const { container } = render(<PhotoFrame rating={null} tone={tones.shell} />);
    expect(pips(container)).toHaveLength(0);
  });

  it("colours the track dot by track", () => {
    const { container } = render(<PhotoFrame tone={tones.shell} track="jpg" />);
    expect(container.querySelector(".bg-jpg")).not.toBeNull();
  });

  it("renders the frame number when given one", () => {
    const { container } = render(<PhotoFrame frameNumber={4821} tone={tones.shell} />);
    expect(container.textContent).toContain("4821");
  });
});
