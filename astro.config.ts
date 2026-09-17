// @ts-check
import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// Canonical site URL, used for <link rel="canonical"> and Open Graph tags.
// Set SITE in the Cloudflare build environment (Workers Builds → Settings →
// Environment variables), e.g. SITE=https://qeepa.com. Falls back to localhost
// so local `astro dev` / `astro build` keep working.
const site = process.env.SITE ?? "http://localhost:4321";
const base = process.env.BASE || "/";

// https://astro.build/config
export default defineConfig({
  site,
  base,
  output: "server",
  adapter: cloudflare(),
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
