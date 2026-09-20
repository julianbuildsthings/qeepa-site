// @vitest-environment happy-dom
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { TrackPill } from "@/components/demo/TrackPill";

describe("TrackPill", () => {
  it("labels all three tracks in product order", () => {
    render(<TrackPill active="raw" />);
    expect(screen.getAllByRole("listitem").map((node) => node.textContent)).toEqual([
      "RAW",
      "JPG",
      "EDIT",
    ]);
  });

  it("marks exactly one track current, and labels it in text", () => {
    render(<TrackPill active="jpg" />);
    const current = screen
      .getAllByRole("listitem")
      .filter((node) => node.getAttribute("aria-current") === "true");
    expect(current).toHaveLength(1);
    expect(current[0]?.textContent).toBe("JPG");
  });

  it("renders static spans when not interactive, so no dead controls ship", () => {
    render(<TrackPill active="raw" />);
    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });

  it("renders real buttons and reports selection when interactive", () => {
    const onSelect = vi.fn();
    render(<TrackPill active="raw" interactive onSelect={onSelect} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(3);
    buttons[2]?.click();
    expect(onSelect).toHaveBeenCalledWith("edit");
  });

  it("hides the colour dots from assistive technology", () => {
    const { container } = render(<TrackPill active="raw" />);
    const dots = container.querySelectorAll("[data-track-dot]");
    expect(dots).toHaveLength(3);
    for (const dot of dots) {
      expect(dot).toHaveAttribute("aria-hidden", "true");
    }
  });
});
