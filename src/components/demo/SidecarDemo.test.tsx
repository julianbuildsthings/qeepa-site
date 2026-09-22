// @vitest-environment happy-dom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FILES, SIDECAR, SidecarDemo } from "@/components/demo/SidecarDemo";
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

  it("lists four different photos in one RAW format", () => {
    const names = FILES.map((file) => file.name);
    expect(new Set(names).size).toBe(FILES.length);
    expect(new Set(names.map((name) => name.split(".")[1]))).toEqual(new Set(["raw"]));
  });

  it("names the sidecar after the photo that carries the rating, the last", () => {
    expect(SIDECAR).toBe("IMG_4824.xmp");
    render(<SidecarDemo />);
    const rows = screen.getAllByRole("listitem");
    // The rating squares sit on the last photo's row, above where the sidecar
    // appears, and on no other.
    expect(rows.at(-1)!.querySelector("[aria-hidden=true].gap-1")).not.toBeNull();
    for (const row of rows.slice(0, -1)) {
      expect(row.querySelector("[aria-hidden=true].gap-1")).toBeNull();
    }
  });

  it("captions the listing as four photos, untouched", () => {
    render(<SidecarDemo />);
    expect(screen.getByText("Four photos. Nothing has been copied or moved.")).toBeInTheDocument();
  });
});
