// @vitest-environment happy-dom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FILES, SidecarDemo } from "@/components/demo/SidecarDemo";
import { pageTileCounts } from "@/lib/tiles";

describe("SidecarDemo", () => {
  /*
   * The floating bar reads this section's count from the tile census, but the
   * file list is written out in the component. This is what keeps the two from
   * drifting: change one and not the other, and this fails.
   */
  it("lists exactly as many photos as the floating bar claims", () => {
    expect(FILES).toHaveLength(pageTileCounts["local-first"]);
  });

  it("renders one row per file before the sidecar appears", () => {
    render(<SidecarDemo />);
    expect(screen.getAllByRole("listitem")).toHaveLength(FILES.length);
  });

  it("keeps every file in one shot, so the caption stays true", () => {
    const stems = new Set(FILES.map((file) => file.name.split(".")[0]));
    expect(stems.size).toBe(1);
  });
});
