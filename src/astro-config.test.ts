import { describe, expect, it } from "vitest";

import astroConfig from "../astro.config";

// Guards a real footgun: Astro's `defineConfig` accepts an OBJECT only (it is
// Vite's `defineConfig` that also accepts a function — easy to conflate). If the
// config is ever changed to a function default export, Astro's config merger
// does `{ ...defaults }` on it, which spreads a function to `{}` and silently
// discards the whole config. The build then falls back to output:"static" with
// no adapter and fails with a misleading JSX parse error deep in the CSS
// pipeline. These assertions pin the object form and the Cloudflare server setup.
describe("astro.config", () => {
  it("default-exports a plain config object, not a function", () => {
    expect(typeof astroConfig).toBe("object");
    expect(astroConfig).not.toBeNull();
    expect(Array.isArray(astroConfig)).toBe(false);
  });

  it("keeps server output wired to the Cloudflare adapter", () => {
    expect(astroConfig.output).toBe("server");
    expect(astroConfig.adapter?.name).toBe("@astrojs/cloudflare");
  });
});
