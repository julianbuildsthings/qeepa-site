import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import { siteConfig } from "@/lib/config";
import { footer } from "@/lib/copy";

import astroConfig from "../../astro.config";

const PAGES = resolve(__dirname, "../pages");

function pageFile(href: string): string | undefined {
  const name = href.replace(/^\//, "");
  return [`${name}.md`, `${name}.astro`]
    .map((file) => resolve(PAGES, file))
    .find((file) => existsSync(file));
}

const LEGAL_PAGES = Object.values(siteConfig.legal).map((href) => ({
  href,
  source: readFileSync(pageFile(href)!, "utf8"),
}));

describe("footer", () => {
  it("links to every legal page, and to nothing else", () => {
    expect(footer.links.map((link) => link.href).toSorted()).toEqual(
      Object.values(siteConfig.legal).toSorted(),
    );
  });

  it("has a page behind every link", () => {
    for (const link of footer.links) expect(pageFile(link.href), link.href).toBeDefined();
  });
});

describe("legal pages", () => {
  it("use the legal layout, with a title and a date line", () => {
    for (const { href, source } of LEGAL_PAGES) {
      expect(source, href).toMatch(/^layout: \.\.\/components\/site\/LegalPage\.astro$/m);
      expect(source, href).toMatch(/^title: \S/m);
      expect(source, href).toMatch(/^updated: Last (updated|reviewed) \d/m);
    }
  });

  /*
   * The documents came from a generator that left unfilled blanks as random
   * tokens ("mpkwali0-x9idrhsjr8a"), and one used the legacy spelling in its
   * email address. Neither may reach the page.
   */
  it("carry no generator placeholders", () => {
    for (const { href, source } of LEGAL_PAGES) {
      expect(source, href).not.toMatch(/\bmp[a-z0-9]{6}-[a-z0-9]{8,}\b/);
    }
  });

  it("give one contact address, in the Qeepa spelling", () => {
    for (const { href, source } of LEGAL_PAGES) {
      expect(source, href).not.toMatch(/\bKeepa\b|keepaphotos/i);
      for (const email of source.match(/[\w.+-]+@[\w-]+\.[\w.]+/g) ?? []) {
        expect(email, href).toBe(siteConfig.contactEmail);
      }
    }
  });

  it("name the site by its own domain, not a deployment URL", () => {
    for (const { href, source } of LEGAL_PAGES) {
      expect(source, href).not.toContain("workers.dev");
    }
  });
});

describe("site URL", () => {
  it("is qeepa.app, and is the canonical origin unless SITE overrides it", () => {
    expect(siteConfig.url).toBe("https://qeepa.app");
    expect(astroConfig.site).toBe(process.env.SITE ?? siteConfig.url);
  });
});
