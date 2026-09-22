import { describe, expect, it } from "vitest";

import { distance, durations, easings, presets, stagger } from "@/lib/motion";

describe("motion tokens", () => {
  it("ships exactly the five app presets", () => {
    expect(Object.keys(presets).sort()).toEqual(["ambient", "gentle", "lively", "snap", "ui"]);
  });

  it("matches the app's spring values so both share one feel", () => {
    expect(presets.ui).toEqual({ damping: 42, stiffness: 600, type: "spring" });
    expect(presets.snap).toEqual({ damping: 40, stiffness: 500, type: "spring" });
    expect(presets.gentle).toEqual({ damping: 26, stiffness: 170, type: "spring" });
    expect(presets.lively).toEqual({ damping: 40, stiffness: 800, type: "spring" });
  });

  it("keeps ambient as the one non-spring, because a loop never rests", () => {
    expect(presets.ambient).toMatchObject({ duration: 2, ease: "easeInOut" });
    expect(presets.ambient).not.toHaveProperty("type", "spring");
  });

  it("exposes travel distances and stagger delays", () => {
    expect(distance).toEqual({ enter: 16, hover: 4, panel: 32 });
    expect(stagger).toEqual({ base: 0.06, line: 0.07, relaxed: 0.12, tight: 0.03 });
  });

  it("exposes four-point cubic beziers for tween work", () => {
    for (const curve of Object.values(easings)) {
      expect(curve).toHaveLength(4);
    }
  });

  it("exposes tween durations in seconds, not milliseconds", () => {
    for (const value of Object.values(durations)) {
      expect(value).toBeGreaterThan(0);
      expect(value).toBeLessThan(1);
    }
  });
});
