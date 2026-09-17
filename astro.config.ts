// @ts-check
import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// Canonical site URL, used for <link rel="canonical"> and Open Graph tags.
// Resolved at BUILD time, so it must be set in the build environment — a runtime
// variable won't help. Set SITE in the Cloudflare build environment (Workers
// Builds → Settings → Environment variables), e.g. SITE=https://qeepa.com.
const site = process.env.SITE ?? "http://localhost:4321";

// Warn only during a real deploy build (Cloudflare sets WORKERS_CI / CF_PAGES),
// so local `astro dev` / `astro build` stay quiet.
if (!process.env.SITE && (process.env.WORKERS_CI || process.env.CF_PAGES)) {
  console.warn(
    "[astro.config] SITE is not set: canonical and Open Graph URLs will fall " +
      "back to http://localhost:4321. Set SITE in the Cloudflare build environment.",
  );
}

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
