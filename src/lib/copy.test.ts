import { describe, expect, it } from "vitest";

import { closing, features, footer, hero } from "@/lib/copy";

const everyString = [
  ...hero.headline,
  hero.lede,
  ...features.flatMap((feature) => [feature.heading, feature.subheading, feature.body]),
  closing.heading,
  closing.body,
  ...footer.links.map((link) => link.label),
];

describe("page copy", () => {
  it("keeps the hero headline as three approved lines", () => {
    expect(hero.headline).toEqual(["Choosing your keepers", "shouldn’t feel", "like a chore."]);
  });

  it("ships all five feature rows in brief order", () => {
    expect(features.map((feature) => feature.id)).toEqual([
      "tracks",
      "local-first",
      "performance",
      "insights",
      "management",
    ]);
  });

  it("gives every feature a two-tier heading, never a bare label", () => {
    for (const feature of features) {
      expect(feature.heading.length, feature.id).toBeGreaterThan(0);
      expect(feature.subheading.length, feature.id).toBeGreaterThan(0);
      expect(feature.heading, feature.id).not.toBe(feature.subheading);
    }
  });

  it("uses curly apostrophes, never straight ones", () => {
    for (const line of everyString) {
      expect(line, line).not.toContain("'");
    }
  });

  it("invents no price", () => {
    for (const line of everyString) {
      for (const symbol of ["$", "£", "€"]) {
        expect(line, line).not.toContain(symbol);
      }
    }
  });

  it("invents no social proof", () => {
    // Word-boundary matched, not substring: "JPEG previews" legitimately
    // contains "reviews", and "rated" hides inside plenty of ordinary words.
    // Plural "reviews" only — "review them in context" is product language.
    const claims = /\b(customers|testimonials?|reviews|rated|trusted by|loved by|downloads)\b/i;
    for (const line of everyString) {
      expect(claims.test(line), line).toBe(false);
    }
  });

  it("invents no release date", () => {
    for (const line of everyString) {
      expect(/\b(19|20)\d{2}\b/.test(line), line).toBe(false);
    }
  });

  it("keeps availability out of the hero entirely", () => {
    const heroText = [...hero.headline, hero.lede].join(" ").toLowerCase();
    for (const banned of ["download", "buy", "coming soon", "macos", "sign up", "waitlist"]) {
      expect(heroText).not.toContain(banned);
    }
  });

  it("states availability honestly in the closing section", () => {
    expect(closing.heading.toLowerCase()).toContain("macos");
    expect(closing.body.toLowerCase()).toContain("one-time purchase");
  });
});
