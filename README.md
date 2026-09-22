# Qeepa

Marketing site for **Qeepa** — the photo workflow app for managing shoots from
RAW capture to final deliverable.

Built with [Astro](https://astro.build/) + [React](https://react.dev/) islands,
[Tailwind CSS v4](https://tailwindcss.com/), and [shadcn/ui](https://ui.shadcn.com/),
and deployed to **Cloudflare**.

> Originally scaffolded from
> [area44/astro-shadcn-ui-template](https://github.com/area44/astro-shadcn-ui-template)
> — the shadcn demo components have since been replaced with Qeepa branding.

---

## Requirements

- **Node.js** (LTS) and **pnpm**.

## Getting started

```bash
pnpm install
pnpm dev        # http://localhost:4321
```

## Scripts

| Script         | What it does                                                                |
| -------------- | --------------------------------------------------------------------------- |
| `pnpm dev`     | Start the Astro dev server.                                                 |
| `pnpm build`   | Build the site to `dist/`.                                                  |
| `pnpm preview` | Build, then serve locally through Wrangler (`astro build && wrangler dev`). |
| `pnpm deploy`  | Build, then deploy to Cloudflare (`astro build && wrangler deploy`).        |
| `pnpm lint`    | Lint with oxlint.                                                           |
| `pnpm test`    | Run unit tests with Vitest.                                                 |
| `pnpm fmt`     | Format with oxfmt.                                                          |

A pre-commit hook (Husky) runs lint-staged + the unit tests.

## Project structure

```
src/
  pages/index.astro        # the landing page (composes the shell + sections)
  layouts/BaseLayout.astro # HTML shell: <head>/SEO, dark-mode, header/footer
  components/              # site components (Header, Footer, CommandMenu, …)
  components/ui/           # shadcn/ui primitives
  styles/global.css        # Tailwind v4 theme + Qeepa brand tokens
  lib/config.ts            # site metadata + nav items
```

The design system (brand colors, `Satoshi`/`Erode` fonts, dark mode) lives in
`src/styles/global.css`. Add new shadcn/ui primitives with:

```bash
pnpm dlx shadcn@latest add <component>
```

---

## Deployment — Cloudflare

This project deploys to **Cloudflare Workers** with the `@astrojs/cloudflare`
adapter (`output: "server"`) and a `wrangler.jsonc` config. Cloudflare is
connected **directly to this GitHub repo**, so deployment is not wired through
GitHub Actions (`.github/workflows/ci.yml` runs lint + tests only).

**One-time setup (in the Cloudflare dashboard):**

1. **Workers & Pages → Create → Connect to Git**, and select this repository.
2. Set the **build command** to `pnpm build` and the **deploy command** to
   `npx wrangler deploy` (or leave the default that reads `wrangler.jsonc`).
3. Canonical and Open Graph URLs default to `https://qeepa.app`. Set a build
   **environment variable** `SITE` only to override that origin.

After that, every push to `main` (or a PR branch, for preview deployments)
builds and deploys automatically. To deploy manually from your machine:

```bash
pnpm deploy   # requires `wrangler login` (or CLOUDFLARE_API_TOKEN)
```

### Before going live

- Point the `qeepa.app` domain at the Worker (Workers & Pages → the project →
  Settings → Domains & Routes).
- Remove the `noindex, nofollow` meta tag in `src/components/HeadSEO.astro`
  once the site should be indexed.

## License

[MIT](./LICENSE).
