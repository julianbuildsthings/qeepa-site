// @vitest-environment happy-dom
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FilterReveal } from "@/components/demo/FilterReveal";

describe("FilterReveal", () => {
  /*
   * `AnimatePresence mode="popLayout"` positions each exiting frame absolutely
   * against the nearest positioned ancestor. When the grid was static, that was
   * the page, and every filter pass flashed the leaving frames across the hero.
   */
  it("gives the popLayout grid a positioned parent", () => {
    const { container } = render(<FilterReveal />);
    const grid = container.querySelector(".grid-cols-4");

    expect(grid).not.toBeNull();
    expect(grid).toHaveClass("relative");
  });
});
