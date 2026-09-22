import { describe, expect, it } from "vitest";

import { siteConfig } from "@/lib/config";

describe("siteConfig", () => {
  it("uses the Qeepa spelling", () => {
    expect(siteConfig.name).toBe("Qeepa");
  });

  it("never uses the legacy Keepa spelling", () => {
    const serialised = JSON.stringify(siteConfig);
    expect(/\bKeepa\b/.test(serialised)).toBe(false);
  });

  it("makes no claim about price or release date", () => {
    const serialised = JSON.stringify(siteConfig).toLowerCase();
    for (const banned of ["$", "free", "trial", "release date", "launch"]) {
      expect(serialised).not.toContain(banned);
    }
  });

  it("points the footer at real legal routes", () => {
    expect(siteConfig.legal.privacy).toBe("/privacy");
    expect(siteConfig.legal.terms).toBe("/terms");
    expect(siteConfig.legal.acceptableUse).toBe("/acceptable-use");
  });
});
