// @vitest-environment happy-dom
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TrackStack } from "@/components/demo/TrackStack";

describe("TrackStack", () => {
  it("renders all three track frames at once so a cross-fade is possible", () => {
    const { container } = render(<TrackStack />);
    expect(container.querySelectorAll("[data-track]")).toHaveLength(3);
  });

  it("starts on edit, the richest rendering", () => {
    render(<TrackStack />);
    const current = screen
      .getAllByRole("listitem")
      .filter((node) => node.getAttribute("aria-current") === "true");
    expect(current).toHaveLength(1);
    expect(current[0]?.textContent).toBe("EDIT");
  });

  it("hides the decorative frames from assistive technology", () => {
    const { container } = render(<TrackStack />);
    for (const frame of container.querySelectorAll("[data-track]")) {
      expect(frame).toHaveAttribute("aria-hidden", "true");
    }
  });

  it("moves the chosen track to the front without unmounting anything", () => {
    const { container } = render(<TrackStack />);
    const frontBefore = container.querySelector('[data-track][data-depth="0"]');
    expect(frontBefore).toHaveAttribute("data-track", "edit");

    const rawButton = screen.getAllByRole("button").find((node) => node.textContent === "RAW");
    if (!rawButton) throw new Error("RAW segment not rendered");
    fireEvent.click(rawButton);

    expect(container.querySelectorAll("[data-track]")).toHaveLength(3);
    expect(container.querySelector('[data-track][data-depth="0"]')).toHaveAttribute(
      "data-track",
      "raw",
    );
  });
});
