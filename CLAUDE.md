# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Marketing site for Qeepa, a local-first photo workflow app for macOS. Astro + React islands, Tailwind CSS v4, deployed to Cloudflare Workers. Scaffolded from `area44/astro-shadcn-ui-template`; the template's chrome is gone and the page is built from the components in `src/components/site` and `src/components/demo`.

The app itself lives in a separate repository and is **read-only reference** for this one — never edit it.

## Commands

```bash
pnpm dev            # Astro dev server at http://localhost:4321
pnpm build          # build to dist/
pnpm preview        # astro build && wrangler dev (build, then serve locally through Wrangler)
pnpm deploy         # astro build && wrangler deploy (requires `wrangler login` or CLOUDFLARE_API_TOKEN)
pnpm lint           # oxlint
pnpm fmt            # oxfmt
pnpm check          # oxlint && oxfmt
pnpm test           # vitest run
pnpm test:watch     # vitest watch mode
```

Run a single test file: `pnpm vitest run src/lib/tones.test.ts`. Tests live next to the code they cover (`*.test.ts` / `*.test.tsx` under `src/`); `src/tests/setup.ts` is the shared setup.

A Husky pre-commit hook runs `lint-staged` (oxfmt + oxlint on staged files) and then the full `pnpm test` suite, so a commit is blocked if either fails.

The dev server may serve a stale dependency cache after a dependency changes, which shows up as a 500 naming a missing file under `node_modules/.vite`. Restart it; if that is not enough, `rm -rf node_modules/.vite`.

## Content rules

- The product is **Qeepa**. "Keepa" is the legacy spelling and `src/lib/config.test.ts` fails on it.
- **Nothing may be invented**: no prices, dates, testimonials, benchmarks, or capabilities the app does not have. `PRODUCT.md` is the record of what is true; the same test blocks price and launch-date words in `siteConfig`.
- Page copy lives in `src/lib/copy.ts`, not inline in components.

## Architecture

- `src/pages/index.astro` — the landing page: hero, five feature rows, closing, footer.
- `src/pages/{privacy,terms,acceptable-use}.md` — the legal pages. Markdown with `LegalPage.astro` as their layout; the text is the owner's, published as supplied.
- `src/layouts/BaseLayout.astro` — the HTML shell, and the inline scripts for the scroll reveals and the copy's line-by-line rise (it splits each `[data-lines]` element into its rendered lines after the fonts load).
- `src/components/site/` — the page's own sections: `Hero`, `FeatureRow`, `Closing`, `SiteFooter`, `LegalPage` and the `FloatingBar` island.
- `src/components/demo/` — the product demonstrations, one per feature row, plus `HeroGallery` and the shared `PhotoFrame` / `TrackPill` / `WindowBar`.
- `src/lib/` — `copy.ts` (all page copy), `tones.ts` (the flat photo tones, tracks and hero data), `tiles.ts` (the tile census the bar's counts come from), `bar.ts`, `motion.ts` and `config.ts`.
- `src/components/ui/` — vendored shadcn/ui primitives the page does not use. Regenerate rather than hand-edit.
- React components are Astro islands: without an explicit `client:*` directive they render as static HTML only.
- Path alias `@/*` → `src/*` (`tsconfig.json`, mirrored in `vitest.config.mts`).

### Motion

`src/lib/motion.ts` is the single registry of durations, easings, springs, travel distances and loop intervals, ported from the app. **Never write a duration, easing, spring or distance into a component** — `src/lib/motion-discipline.test.ts` scans the source and fails on it. CSS-driven motion reads the same numbers through `motionCssVariables()`, set on `<html>`.

Every animation is guarded by `prefers-reduced-motion`, and nothing is left hidden when motion is off or JavaScript is unavailable. The looping demonstrations deliberately do **not** pause on hover (the owner's decision: an early hover meant visitors never saw them move); keyboard focus on their controls still pauses them.

`DESIGN.md` records the resulting design system, and `.impeccable/surfaces/` the direction the landing page was built to. Update both when the page's design changes.

### Astro config footgun (`astro.config.ts`)

`defineConfig` must be called with a plain object literal, not a function. Vite's `defineConfig` accepts a function, Astro's does not — a function default export is silently spread to `{}`, which drops the whole config, falls back to `output: "static"` with no adapter, and fails later with a misleading JSX parse error. `src/astro-config.test.ts` pins the object form and the Cloudflare setup; don't weaken it.

### `SITE` env var

Canonical and Open Graph URLs come from `process.env.SITE`, resolved at **build** time, defaulting to `https://qeepa.app`. Set `SITE` only to override that origin, e.g. for a preview deployment. CI's build job sets a dummy value.

`src/components/HeadSEO.astro` still carries `<meta name="robots" content="noindex, nofollow" />`; it must be removed before the site should be indexed.

## CI / deployment split

`.github/workflows/ci.yml` runs `lint`, `test` and a `build` job gated on both — it does **not** deploy. Deployment is Cloudflare Workers Builds, connected directly to this repo: every push to `main` (and PR branches, for previews) builds and deploys on Cloudflare's side. Keep it that way.

## Linting/formatting

oxlint (`.oxlintrc.json`) and oxfmt (`.oxfmtrc.json`) instead of ESLint/Prettier, on `*.{js,jsx,ts,tsx,mjs,cjs,json,css}` via `lint-staged`.
