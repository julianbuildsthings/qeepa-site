// @vitest-environment happy-dom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { InsightsPanel } from "@/components/demo/InsightsPanel";

describe("InsightsPanel", () => {
  /*
   * The fill and track are two depths of the same peach, which sits below
   * WCAG 1.4.11's 3:1 floor for a graphical object. That is only acceptable
   * while the bar is reinforcing a number the label already states. If a row
   * ever loses its printed percentage, the bar becomes the sole carrier of
   * that figure and the fill has to darken — so this is the test that has to
   * fail first.
   */
  it("prints every proportion as text beside its bar", () => {
    render(<InsightsPanel />);

    const rows = screen.getAllByRole("listitem");
    expect(rows.length).toBeGreaterThan(0);

    for (const row of rows) {
      expect(row.textContent, row.textContent ?? "").toMatch(/\d+%/);
    }
  });

  it("names the setting each proportion belongs to", () => {
    render(<InsightsPanel />);

    for (const label of ["Aperture", "Shutter", "ISO"]) {
      expect(screen.getByText(new RegExp(`^${label}\\b`))).toBeInTheDocument();
    }
  });
});
