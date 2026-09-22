// @ts-check
import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// Canonical site URL, used for <link rel="canonical"> and Open Graph tags.
// Resolved at BUILD time. Defaults to the production domain; set SITE in the
// build environment only to override it, e.g. for a preview deployment.
const site = process.env.SITE ?? "https://qeepa.app";

// IMPORTANT: keep this an object literal. Astro's `defineConfig` accepts an
// object only — unlike Vite's, which also accepts a function. A function default
// export is silently dropped by Astro's config merger (it spreads the export to
// `{}`), leaving output:"static" with no adapter and failing later with a
// misleading JSX parse error. `src/astro-config.test.ts` guards against this.
// https://astro.build/config
export default defineConfig({
  site,
  base: process.env.BASE || "/",
  output: "server",
  adapter: cloudflare(),
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
