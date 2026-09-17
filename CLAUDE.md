# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Marketing site for Qeepa, a photo workflow app. Built with Astro + React islands, Tailwind CSS v4, and shadcn/ui, deployed to Cloudflare Workers. Originally scaffolded from `area44/astro-shadcn-ui-template`; the demo shadcn components have since been replaced with Qeepa branding.

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

pnpm dlx shadcn@latest add <component>   # add a new shadcn/ui primitive
```

Run a single test file: `pnpm vitest run src/lib/utils.test.ts`. Test files live next to the code they cover (`*.test.ts`/`*.test.tsx` under `src/`), not in a separate `tests/` directory.

A Husky pre-commit hook runs `lint-staged` (oxfmt + oxlint on staged files) followed by the full `pnpm test` suite — expect commits to be blocked if either fails.

## Architecture

- `src/pages/index.astro` — the landing page; composes `BaseLayout` and page sections.
- `src/layouts/BaseLayout.astro` — HTML shell: loads `HeadSEO`, the inline dark-mode bootstrap script (reads `localStorage.theme`, falls back to `prefers-color-scheme`, toggles the `dark` class on `<html>` before hydration to avoid a flash), and wraps `<Header client:load>` / `<slot />` / `<Footer>` with a `sonner` `<Toaster client:load>`.
- `src/components/HeadSEO.astro` — canonical URL, favicon, Open Graph and Twitter meta tags, all derived from `Astro.site` (i.e. from the `SITE` build-time env var, see below). **Currently hardcodes `<meta name="robots" content="noindex, nofollow" />`** — this must be removed before the site should be indexed.
- `src/lib/config.ts` — single `siteConfig` object (name, description, url, author, nav items) consumed across components; update this rather than hardcoding site metadata inline.
- `src/styles/global.css` — Tailwind v4 theme: Qeepa brand color tokens, `Satoshi`/`Erode` custom fonts (served from `public/fonts/`), and dark mode variables. This is the design-system source of truth, referenced by `components.json` as the shadcn `css` target.
- `src/components/ui/` — shadcn/ui primitives (base-vega style, neutral base color, no class prefix); treat these as generated/vendored and prefer regenerating via `pnpm dlx shadcn@latest add <component>` over hand-editing.
- React components are Astro islands — they need an explicit `client:*` directive (e.g. `client:load` on `Header` and `Toaster`) to hydrate; anything without one renders as static HTML only.
- Path alias `@/*` → `src/*` (`tsconfig.json`, mirrored in `vitest.config.mts`'s Vitest `resolve.alias`, and used as shadcn's `aliases.*` in `components.json`).

### Astro config footgun (`astro.config.ts`)

`defineConfig` must be called with a plain object literal, not a function. Vite's `defineConfig` accepts a function, but Astro's does not — a function default export is silently spread to `{}` by Astro's config merger, which drops the whole config, falls back to `output: "static"` with no adapter, and fails later with a misleading JSX parse error. `src/astro-config.test.ts` pins the object form and the Cloudflare (`output: "server"`, `@astrojs/cloudflare` adapter) setup — don't remove or weaken that test when touching `astro.config.ts`.

### `SITE` env var

The canonical/OG URL origin comes from `process.env.SITE`, resolved at **build** time (not runtime) and defaulting to `http://localhost:4321` if unset. In the real deployment this is set as a Cloudflare Workers Builds environment variable; CI's `build` job sets a dummy `SITE=https://qeepa.example` just so the build doesn't silently fall back and pass unnoticed. `astro.config.ts` prints a warning if `SITE` is unset when `WORKERS_CI`/`CF_PAGES` is present.

## CI / deployment split

`.github/workflows/ci.yml` runs `lint`, `test`, and a `build` job gated on both (`needs: [lint, test]`) — it does **not** deploy. Deployment is handled entirely by Cloudflare Workers Builds, connected directly to this GitHub repo: every push to `main` (and PR branches, for previews) triggers `pnpm build` + `wrangler deploy` on Cloudflare's side, independent of GitHub Actions. Keep it this way — don't wire deploy into GitHub Actions, since Cloudflare is the single source of truth for production.

## Linting/formatting

oxlint (`.oxlintrc.json`) and oxfmt (`.oxfmtrc.json`) are used instead of ESLint/Prettier. Via `lint-staged` (`.lintstagedrc.json`), oxfmt runs on `*.{js,jsx,ts,tsx,mjs,cjs,json,css}` and oxlint on the JS/TS subset only — oxlint doesn't support linting bare JSON/CSS, so including them would fail staged-only commits to those files.
