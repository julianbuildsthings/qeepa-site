# Qeepa Landing Page v1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first full version of the Qeepa marketing site — hero, five feature rows, closing availability section and footer — in the existing Astro project, matching the approved Paper comps (hero variant 1A, Tracks row variant T3).

**Architecture:** Astro pages render static HTML for everything that does not move. The four demonstrations that genuinely animate ship as React islands hydrated with `client:visible`, so no JavaScript runs for the static page. All animation values come from a ported motion token registry; all gradient values come from a warm-palette registry. Page copy lives in one module so it can be diffed against the approved brief.

**Tech Stack:** Astro 7, React 19 islands, Tailwind CSS 4, `motion/react`, TypeScript 7, Vitest 4, shadcn/ui primitives (already vendored), Cloudflare via Wrangler.

**Spec:** `.impeccable/surfaces/src-pages-index-astro.md` (direction contract) and `PRODUCT.md` (product truth). Read both before starting. The approved visuals are Paper file `01M0539MQZEZCYPHPZGFGWQTN6`, artboards `1A · Left rail (Satoshi)` and `T3 · Tracks — stack`.

## Global Constraints

- **Product name is `Qeepa`.** The `Keepa` spelling in the adjacent repo is legacy and must not appear in any file.
- **Never invent commercial or factual claims.** No prices, no release dates, no testimonials, no customer names, no download counts, no benchmarks. PRODUCT.md lists what exists.
- **"Shoot Insights" and "filter by export status" are unverified** against the app's feature audit. Build the rows, but describe only what the approved copy says; do not add capability claims.
- **Never inline an animation duration, easing, spring, or travel distance.** Every value comes from `src/lib/motion.ts`. If no preset fits, stop and ask before adding a sixth — this mirrors the app's `MOTION.md` rule.
- **Never inline a gradient.** Every gradient comes from `src/lib/gradients.ts`.
- **No eyebrows or kickers** above any heading, anywhere on the page.
- **Display face is Satoshi** (700). **Erode is the wordmark only.** Tracking: `-0.038em` at hero scale, `-0.032em` at feature-heading scale.
- **Colour:** every image surface uses the warm family only (`#FFFDFA`–`#C06E2C`). The only non-warm colours on the page are the three track dots (`--color-raw`, `--color-jpg`, `--color-af`) and text.
- **Shadows are always two-layer and warm-tinted** (`rgba(43,38,33,…)`), never neutral grey.
- **Accessibility (binding, from Vercel Web Interface Guidelines):** every flow keyboard-operable; visible `:focus-visible` rings; hit targets ≥24px (≥44px mobile); `prefers-reduced-motion` honoured with a real reduced variant; semantic HTML before ARIA; hierarchical headings plus a skip link; status never conveyed by colour alone; `touch-action: manipulation` on controls; curly quotes in all copy; `&nbsp;` between numbers and units.
- **Motion is compositor-only:** animate `transform`, `opacity`, `filter`. Never `transition: all`. Never animate `width`/`height`/`top`/`left`.
- **Commit after every task.** Branch is `worktree-landing-page-v1`.

---

### Task 1: Strip the template and establish the page shell

The repo is a shadcn/Astro starter. Its header (GitHub star counter, command menu, nav, theme toggle), footer and demo component are not Qeepa and must go before anything else is built on top of them.

**Files:**
- Modify: `src/lib/config.ts`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/pages/index.astro`
- Delete: `src/components/ComponentExample.tsx`, `src/components/CommandMenu.tsx`, `src/components/MainNav.tsx`, `src/components/MobileNav.tsx`, `src/components/Header.tsx`, `src/components/Footer.tsx`, `src/components/ThemeToggle.tsx`
- Modify: `src/lib/config.test.ts` (create)

**Interfaces:**
- Produces: `siteConfig` with fields `name`, `description`, `url`, `links.github`, `legal.privacy`, `legal.terms`, `contactEmail`. Consumed by Tasks 6 and 10.

- [ ] **Step 1: Write the failing test**

Create `src/lib/config.test.ts`:

```ts
import { describe, expect, it } from "vitest";

import { siteConfig } from "@/lib/config";

describe("siteConfig", () => {
  it("uses the Qeepa spelling", () => {
    expect(siteConfig.name).toBe("Qeepa");
  });

  it("never uses the legacy Keepa spelling", () => {
    const serialised = JSON.stringify(siteConfig);
    expect(serialised).not.toMatch(/keepa/i.source.replace("keepa", "Keepa"));
    expect(/\bKeepa\b/.test(serialised)).toBe(false);
  });

  it("makes no claim about price or release date", () => {
    const serialised = JSON.stringify(siteConfig).toLowerCase();
    for (const banned of ["$", "free", "trial", "2026", "release date", "launch"]) {
      expect(serialised).not.toContain(banned);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/lib/config.test.ts`
Expected: FAIL — current description mentions nothing banned, but `navItems` and `author` shape will not match once rewritten; confirm at least one assertion fails before proceeding. If all three pass by accident, add `expect(siteConfig.legal.privacy).toBe("/privacy")` which will fail.

- [ ] **Step 3: Rewrite the config**

Replace `src/lib/config.ts`:

```ts
export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  links: { github: string };
  legal: { privacy: string; terms: string };
  contactEmail: string;
};

export const siteConfig: SiteConfig = {
  name: "Qeepa",
  description:
    "A local-first photo manager for photographers who shoot in RAW. Cull, compare, and keep your edits.",
  url: "",
  links: { github: "https://github.com/julianbuildsthings/qeepa-site" },
  legal: { privacy: "/privacy", terms: "/terms" },
  contactEmail: "",
};
```

- [ ] **Step 4: Delete the template components**

```bash
git rm src/components/ComponentExample.tsx src/components/CommandMenu.tsx \
  src/components/MainNav.tsx src/components/MobileNav.tsx \
  src/components/Header.tsx src/components/Footer.tsx src/components/ThemeToggle.tsx
```

- [ ] **Step 5: Reduce BaseLayout to a real shell**

Replace the `<body>` of `src/layouts/BaseLayout.astro`. Keep `HeadSEO`; drop `Header`, `Footer`, `Toaster` and the theme-bootstrap inline script (the site ships light-only for v1 — the dark tokens stay in CSS for later).

```astro
---
import HeadSEO from "@/components/HeadSEO.astro";

const { title, description, ogImage } = Astro.props;
---

<!doctype html>
<html lang="en" class="scroll-smooth">
  <head>
    <HeadSEO title={title} description={description} ogImage={ogImage} />
    <meta name="theme-color" content="#FFFFFF" />
  </head>
  <body class="bg-background text-foreground antialiased">
    <a
      href="#main"
      class="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-50 focus-visible:rounded-md focus-visible:bg-background focus-visible:px-4 focus-visible:py-2 focus-visible:ring-2 focus-visible:ring-ring"
      >Skip to content</a
    >
    <slot />
  </body>
</html>
```

- [ ] **Step 6: Reduce index.astro to an empty shell**

```astro
---
import BaseLayout from "@/layouts/BaseLayout.astro";
import { siteConfig } from "@/lib/config";
---

<BaseLayout title={siteConfig.name} description={siteConfig.description}>
  <main id="main"></main>
</BaseLayout>
```

- [ ] **Step 7: Verify tests and build pass**

Run: `pnpm vitest run && pnpm lint && pnpm build`
Expected: tests PASS, lint reports no errors, build succeeds.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "chore: strip starter template chrome and establish Qeepa page shell"
```

---

### Task 2: Port the motion token registry

The app enforces "never inline a duration". The site inherits that registry verbatim so the two share one physics vocabulary, and so the discipline exists before the first component rather than being retrofitted.

**Files:**
- Create: `src/lib/motion.ts`
- Create: `src/lib/motion.test.ts`
- Read (reference only, do not modify): `/Users/jubs/Desktop/Building/Keepa/src/utils/motion.ts`, `/Users/jubs/Desktop/Building/Keepa/MOTION.md`

**Interfaces:**
- Produces: `presets` (`Record<PresetName, Transition>` with keys `ambient|gentle|lively|snap|ui`), `distance` (`{ enter: 16, hover: 4, panel: 32 }`), `stagger` (`{ base: 0.06, relaxed: 0.12, tight: 0.03 }`), `easings` (`Record<"enter"|"exit"|"standard", [number,number,number,number]>`), `durations`, and composed variants `fadeInUp`, `staggerContainer`, `staggerItem`. Consumed by Tasks 5, 8, 9, 12.

- [ ] **Step 1: Write the failing test**

Create `src/lib/motion.test.ts`:

```ts
import { describe, expect, it } from "vitest";

import { distance, easings, presets, stagger } from "@/lib/motion";

describe("motion tokens", () => {
  it("ships exactly the five app presets", () => {
    expect(Object.keys(presets).sort()).toEqual([
      "ambient",
      "gentle",
      "lively",
      "snap",
      "ui",
    ]);
  });

  it("matches the app's spring values so both share one feel", () => {
    expect(presets.ui).toEqual({ damping: 42, stiffness: 600, type: "spring" });
    expect(presets.snap).toEqual({ damping: 40, stiffness: 500, type: "spring" });
    expect(presets.gentle).toEqual({ damping: 26, stiffness: 170, type: "spring" });
    expect(presets.lively).toEqual({ damping: 40, stiffness: 800, type: "spring" });
  });

  it("keeps ambient as the one non-spring, because a loop never rests", () => {
    expect(presets.ambient).toMatchObject({ ease: "easeInOut", duration: 2 });
    expect(presets.ambient).not.toHaveProperty("type", "spring");
  });

  it("exposes travel distances and stagger delays", () => {
    expect(distance).toEqual({ enter: 16, hover: 4, panel: 32 });
    expect(stagger).toEqual({ base: 0.06, relaxed: 0.12, tight: 0.03 });
  });

  it("exposes four-point cubic beziers for tween work", () => {
    for (const curve of Object.values(easings)) {
      expect(curve).toHaveLength(4);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/lib/motion.test.ts`
Expected: FAIL — `Cannot find module '@/lib/motion'`.

- [ ] **Step 3: Port the registry**

Read `/Users/jubs/Desktop/Building/Keepa/src/utils/motion.ts` in full and copy `presets`, `distance`, `stagger`, `easings`, `durations` and the composed variants verbatim into `src/lib/motion.ts`. Keep the explanatory comments — they record why each number is what it is. Drop anything referencing app-only concepts (`layoutIds` for gallery/filmstrip shared layout) since the site has no equivalent surfaces. Add a file header noting the source:

```ts
/**
 * Motion tokens, ported verbatim from the Qeepa app (`src/utils/motion.ts`).
 * The site and the app share one physics vocabulary on purpose: a transition
 * on the marketing page should feel like the same product as the app it sells.
 *
 * The rule from the app's MOTION.md applies here unchanged: never inline a
 * duration, easing, spring or travel distance. If none of these fit, stop and
 * ask before adding a sixth preset.
 */
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run src/lib/motion.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/motion.ts src/lib/motion.test.ts
git commit -m "feat: port the app's motion token registry to the site"
```

---

### Task 3: Warm gradient registry

Every image surface on the page is a gradient. This task makes the palette a tested, enumerable thing rather than fifteen inlined strings, and encodes the two rules that took several design passes to settle: all warm, all near-vertical.

**Files:**
- Create: `src/lib/gradients.ts`
- Create: `src/lib/gradients.test.ts`

**Interfaces:**
- Produces: `warm: Record<WarmName, string>` with keys `sunbleached|apricot|blush|honey|peach|amber|clay|terracotta`; `trackRender: Record<TrackName, string>` with keys `raw|jpg|edit`; `bloom: string`; `heroTileOrder: WarmName[]` (10 entries, the approved 1A order); helpers `gradientHexes(css: string): string[]`, `gradientAngle(css: string): number`, `hexToHsl(hex: string): { h: number; s: number; l: number }`. Consumed by Tasks 5, 7, 8, 9.

- [ ] **Step 1: Write the failing test**

Create `src/lib/gradients.test.ts`:

```ts
import { describe, expect, it } from "vitest";

import {
  gradientAngle,
  gradientHexes,
  heroTileOrder,
  hexToHsl,
  trackRender,
  warm,
} from "@/lib/gradients";

const allGradients = [...Object.values(warm), ...Object.values(trackRender)];

describe("gradient parsing helpers", () => {
  it("pulls every hex stop out of a gradient", () => {
    expect(gradientHexes("linear-gradient(178deg,#FFF0DD 0%,#FCBA7F 54%)")).toEqual([
      "#FFF0DD",
      "#FCBA7F",
    ]);
  });

  it("reads the angle", () => {
    expect(gradientAngle("linear-gradient(178deg,#FFF0DD 0%,#FCBA7F 54%)")).toBe(178);
  });

  it("converts hex to hsl", () => {
    expect(hexToHsl("#FFFFFF").l).toBeCloseTo(100, 0);
    expect(hexToHsl("#000000").l).toBeCloseTo(0, 0);
    expect(hexToHsl("#FCBA7F").h).toBeGreaterThan(20);
    expect(hexToHsl("#FCBA7F").h).toBeLessThan(40);
  });
});

describe("warm palette", () => {
  it("ships the eight named recipes", () => {
    expect(Object.keys(warm).sort()).toEqual([
      "amber",
      "apricot",
      "blush",
      "clay",
      "honey",
      "peach",
      "sunbleached",
      "terracotta",
    ]);
  });

  it("keeps every stop in the warm hue range", () => {
    for (const css of allGradients) {
      for (const hex of gradientHexes(css)) {
        const { h, s } = hexToHsl(hex);
        if (s < 4) continue; // near-white stops have no meaningful hue
        expect(h, `${hex} in ${css}`).toBeGreaterThanOrEqual(15);
        expect(h, `${hex} in ${css}`).toBeLessThanOrEqual(45);
      }
    }
  });

  it("stays light — nothing reaches the near-blacks the palette used to use", () => {
    for (const css of allGradients) {
      for (const hex of gradientHexes(css)) {
        expect(hexToHsl(hex).l, `${hex} in ${css}`).toBeGreaterThan(38);
      }
    }
  });

  it("keeps light falling from above on every surface", () => {
    for (const css of allGradients) {
      const angle = gradientAngle(css);
      expect(angle, css).toBeGreaterThanOrEqual(170);
      expect(angle, css).toBeLessThanOrEqual(192);
    }
  });
});

describe("track renderings", () => {
  it("orders raw flattest, edit richest", () => {
    const spread = (css: string) => {
      const ls = gradientHexes(css).map((h) => hexToHsl(h).l);
      return Math.max(...ls) - Math.min(...ls);
    };
    expect(spread(trackRender.raw)).toBeLessThan(spread(trackRender.jpg));
    expect(spread(trackRender.jpg)).toBeLessThan(spread(trackRender.edit));
  });
});

describe("hero tile order", () => {
  it("fills the approved 5x2 grid", () => {
    expect(heroTileOrder).toHaveLength(10);
  });

  it("never repeats a recipe in adjacent cells", () => {
    for (let i = 1; i < heroTileOrder.length; i++) {
      expect(heroTileOrder[i]).not.toBe(heroTileOrder[i - 1]);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/lib/gradients.test.ts`
Expected: FAIL — `Cannot find module '@/lib/gradients'`.

- [ ] **Step 3: Write the registry**

Create `src/lib/gradients.ts`. Values are taken from the approved Paper artboards `1A` and `T3`.

```ts
/**
 * Every image surface on this site is a gradient standing in for a photograph.
 * Two rules, both of which took several design passes to settle and are
 * enforced by gradients.test.ts:
 *
 * 1. Everything is warm. The page reads as one sunlit thing; the only
 *    non-warm colour anywhere is the three functional track dots.
 * 2. Light falls from above (170-192deg). Mixed angles made some tiles read
 *    as graphic rather than photographic.
 */
export type WarmName =
  | "amber"
  | "apricot"
  | "blush"
  | "clay"
  | "honey"
  | "peach"
  | "sunbleached"
  | "terracotta";

export const warm: Record<WarmName, string> = {
  amber: "linear-gradient(172deg,#FFE4C4 0%,#F09A50 48%,#C06E2C 100%)",
  apricot: "linear-gradient(174deg,#FFF3E4 0%,#FCD6AE 48%,#F7BA85 100%)",
  blush: "linear-gradient(176deg,#FFF4EC 0%,#FBD3BE 48%,#F0A98C 100%)",
  clay: "linear-gradient(178deg,#FFF1E2 0%,#F3CDA8 48%,#DFA877 100%)",
  honey: "linear-gradient(174deg,#FFF8E8 0%,#FBDFA6 48%,#EFBC6A 100%)",
  peach: "linear-gradient(178deg,#FFF0DD 0%,#FCBA7F 54%,#EE9B54 100%)",
  sunbleached: "linear-gradient(176deg,#FFFDFA 0%,#FFF2E3 46%,#FDE3C8 100%)",
  terracotta: "linear-gradient(180deg,#FDE0BF 0%,#EE9B54 46%,#C8752A 100%)",
};

export type TrackName = "edit" | "jpg" | "raw";

/** The same scene rendered three ways: flat, punchy, graded. */
export const trackRender: Record<TrackName, string> = {
  edit: "linear-gradient(178deg,#FFF4E4 0%,#F8B478 42%,#DE8A43 74%,#B4652A 100%)",
  jpg: "linear-gradient(178deg,#FFF0DC 0%,#FBC190 46%,#EC9A55 100%)",
  raw: "linear-gradient(178deg,#FDEBD8 0%,#F6D6B8 48%,#E8BC97 100%)",
};

/** Warm-white highlight, upper-left. A pure-white bloom cooled every tile top. */
export const bloom =
  "radial-gradient(102% 78% at 34% 14%, rgba(255,252,246,0.42), rgba(255,252,246,0) 64%)";

/** The approved 1A hero grid, read left-to-right, top row then bottom. */
export const heroTileOrder: WarmName[] = [
  "peach",
  "sunbleached",
  "terracotta",
  "clay",
  "honey",
  "amber",
  "apricot",
  "blush",
  "sunbleached",
  "peach",
];

export function gradientHexes(css: string): string[] {
  return css.match(/#[0-9A-Fa-f]{6}/g) ?? [];
}

export function gradientAngle(css: string): number {
  const match = css.match(/(-?\d+(?:\.\d+)?)deg/);
  if (!match) throw new Error(`No angle in gradient: ${css}`);
  return Number(match[1]);
}

export function hexToHsl(hex: string): { h: number; l: number; s: number } {
  const r = Number.parseInt(hex.slice(1, 3), 16) / 255;
  const g = Number.parseInt(hex.slice(3, 5), 16) / 255;
  const b = Number.parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  if (d === 0) return { h: 0, l: l * 100, s: 0 };
  const s = d / (1 - Math.abs(2 * l - 1));
  let h: number;
  if (max === r) h = 60 * (((g - b) / d) % 6);
  else if (max === g) h = 60 * ((b - r) / d + 2);
  else h = 60 * ((r - g) / d + 4);
  return { h: (h + 360) % 360, l: l * 100, s: s * 100 };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run src/lib/gradients.test.ts`
Expected: PASS (9 tests). If the "stays light" assertion fails on `terracotta`'s `#C8752A` or `amber`'s `#C06E2C`, lower the floor to the measured value and note it in a comment — do not darken the palette.

- [ ] **Step 5: Commit**

```bash
git add src/lib/gradients.ts src/lib/gradients.test.ts
git commit -m "feat: add the warm gradient registry with palette guards"
```

---

### Task 4: Page copy module

Copy is approved verbatim from the brief. Putting it in one module makes it diffable, keeps the fabrication ban testable, and stops an em-dash or straight quote creeping in during a later edit.

**Files:**
- Create: `src/lib/copy.ts`
- Create: `src/lib/copy.test.ts`

**Interfaces:**
- Produces: `hero: { headline: string[]; lede: string }`, `features: FeatureCopy[]` (5 entries, each `{ id, heading, subheading, body }`), `closing: { heading: string; body: string }`, `footer: { links: { label, href }[]; copyright: string }`. Consumed by Tasks 7, 8, 9, 10.

- [ ] **Step 1: Write the failing test**

Create `src/lib/copy.test.ts`:

```ts
import { describe, expect, it } from "vitest";

import { closing, features, footer, hero } from "@/lib/copy";

const everyString = [
  ...hero.headline,
  hero.lede,
  ...features.flatMap((f) => [f.heading, f.subheading, f.body]),
  closing.heading,
  closing.body,
  ...footer.links.map((l) => l.label),
  footer.copyright,
];

describe("page copy", () => {
  it("keeps the hero headline as three approved lines", () => {
    expect(hero.headline).toEqual([
      "Picking your keepers",
      "shouldn’t feel",
      "like a chore.",
    ]);
  });

  it("ships all five feature rows in brief order", () => {
    expect(features.map((f) => f.id)).toEqual([
      "tracks",
      "local-first",
      "performance",
      "insights",
      "management",
    ]);
  });

  it("uses curly apostrophes, never straight ones", () => {
    for (const s of everyString) {
      expect(s, s).not.toContain("'");
    }
  });

  it("invents no price, date or social proof", () => {
    for (const s of everyString) {
      const lower = s.toLowerCase();
      for (const banned of ["$", "£", "€", "per month", "customers", "rated", "trusted by", "reviews"]) {
        expect(lower, s).not.toContain(banned);
      }
      expect(/\b(19|20)\d{2}\b/.test(s.replace(footer.copyright, "")), s).toBe(false);
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/lib/copy.test.ts`
Expected: FAIL — `Cannot find module '@/lib/copy'`.

- [ ] **Step 3: Write the copy module**

Create `src/lib/copy.ts`. Every string below is approved; do not reword. Note that `tracks.heading` is `"Photo tracks."` — renamed from the brief's "Track system." during design review — and that each feature's `heading` and `subheading` form a two-tier heading, never a kicker above a heading.

```ts
export type FeatureCopy = {
  body: string;
  heading: string;
  id: string;
  subheading: string;
};

export const hero = {
  headline: ["Picking your keepers", "shouldn’t feel", "like a chore."],
  lede:
    "Qeepa is a modern, local-first photo manager for photographers who shoot in RAW and want to seamlessly sort through their photos. Cull, compare, and keep your edits.",
};

export const features: FeatureCopy[] = [
  {
    body: "RAWs, exports and edits of the same shot are automatically bunched together as tracks. Switch between them instantly, compare the differences and move through your shoots without ever digging around in folders.",
    heading: "Photo tracks.",
    id: "tracks",
    subheading: "Every version of a photo, together.",
  },
  {
    body: "Qeepa works directly with the photos already on your Mac. Because we don’t touch your files, it works alongside tools such as Lightroom, FastRawViewer, Affinity and everywhere you can work with your beautiful photos. It’s basically Finder on steroids, built with photographers in mind.",
    heading: "Local-first.",
    id: "local-first",
    subheading: "No accounts, no cloud subscription, and no touching your photos.",
  },
  {
    body: "Large shoots stay quick to browse, scroll, and revisit without staring at a loading icon waiting for massive RAW files to open. JPEG previews and caching keep everything snappy and responsive.",
    heading: "Fast performance.",
    id: "performance",
    subheading: "Built to work with thousands of photos without skipping a beat.",
  },
  {
    body: "Qeepa shows you the most frequently used camera settings and gear for every shoot. Better yet, you can filter by the photos you kept or delivered to clients, so you can understand what settings made your photos stick.",
    heading: "Shoot insights.",
    id: "insights",
    subheading: "Understand how you shoot and what you kept.",
  },
  {
    body: "Filter a shoot by rating and export status to surface files that may no longer need to take up space. Reveal the results in Finder, review them in context and decide for yourself what stays or goes. Qeepa helps you find the files; it never deletes them for you.",
    heading: "Photo management.",
    id: "management",
    subheading: "Clear out clutter and find the photos you need.",
  },
];

export const closing = {
  body: "We’re putting the finishing touches on the first release. Qeepa will be a one-time purchase you own forever, with no subscription required.",
  heading: "Qeepa is coming soon to macOS.",
};

export const footer = {
  copyright: "© Qeepa",
  links: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms and Conditions" },
    { href: "/contact", label: "Contact" },
  ],
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run src/lib/copy.test.ts`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/copy.ts src/lib/copy.test.ts
git commit -m "feat: add the approved page copy as a single tested module"
```

---

### Task 5: Photo frame and track pill primitives

These two components appear in the hero and in three feature rows. Building them once, tested, prevents the pill drifting between sections. This task also adds a DOM test environment, because from here on components have structure worth asserting.

**Files:**
- Modify: `vitest.config.mts`
- Modify: `package.json` (add `happy-dom`, `@testing-library/react` as devDependencies)
- Create: `src/components/demo/PhotoFrame.tsx`
- Create: `src/components/demo/TrackPill.tsx`
- Create: `src/components/demo/TrackPill.test.tsx`

**Interfaces:**
- Produces: `PhotoFrame({ gradient, className, radius })` renders a `<div>` with the gradient plus bloom overlay. `TrackPill({ active, onSelect, interactive })` where `active: TrackName`; renders a `<ul>` of three items, each a `<button>` when `interactive`, otherwise a `<span>`. Consumed by Tasks 7, 8, 9.

- [ ] **Step 1: Add the DOM test environment**

```bash
pnpm add -D happy-dom @testing-library/react @testing-library/dom
```

Modify `vitest.config.mts` so component tests get a DOM while pure tests stay fast:

```ts
test: {
  environmentMatchGlobs: [["src/**/*.test.tsx", "happy-dom"]],
  environment: "node",
  include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
},
```

- [ ] **Step 2: Write the failing test**

Create `src/components/demo/TrackPill.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { TrackPill } from "@/components/demo/TrackPill";

describe("TrackPill", () => {
  it("labels all three tracks in product order", () => {
    render(<TrackPill active="raw" />);
    expect(screen.getAllByRole("listitem").map((n) => n.textContent)).toEqual([
      "RAW",
      "JPG",
      "EDIT",
    ]);
  });

  it("marks the active track with text, not colour alone", () => {
    render(<TrackPill active="jpg" />);
    expect(screen.getByText("JPG").closest("li")).toHaveAttribute("aria-current", "true");
  });

  it("renders static spans when not interactive, so no dead controls ship", () => {
    render(<TrackPill active="raw" />);
    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });

  it("renders real buttons and reports selection when interactive", async () => {
    const onSelect = vi.fn();
    render(<TrackPill active="raw" interactive onSelect={onSelect} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(3);
    buttons[2]?.click();
    expect(onSelect).toHaveBeenCalledWith("edit");
  });
});
```

Add `import "@testing-library/jest-dom/vitest";` via a setup file if `toHaveAttribute` is unavailable; otherwise assert with `getAttribute`.

- [ ] **Step 3: Run test to verify it fails**

Run: `pnpm vitest run src/components/demo/TrackPill.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 4: Implement PhotoFrame**

```tsx
import { bloom } from "@/lib/gradients";
import { cn } from "@/lib/utils";

type PhotoFrameProps = {
  className?: string;
  gradient: string;
};

/**
 * A gradient standing in for a photograph. The bloom is a separate layer so the
 * highlight stays put when the base gradient changes between tracks.
 */
export function PhotoFrame({ className, gradient }: PhotoFrameProps) {
  return (
    <div
      className={cn("relative overflow-hidden rounded-[5px]", className)}
      style={{ background: gradient }}
    >
      <div aria-hidden="true" className="absolute inset-0" style={{ background: bloom }} />
    </div>
  );
}
```

- [ ] **Step 5: Implement TrackPill**

Structure matches the app's `track-pill.tsx`: rounded-full container, hairline border, peach fill on the active segment, coloured dot plus label. The dot is decorative — the label carries the meaning, per the redundant-status-cues rule.

```tsx
import type { TrackName } from "@/lib/gradients";
import { cn } from "@/lib/utils";

const TRACKS: { dot: string; key: TrackName; label: string }[] = [
  { dot: "bg-raw", key: "raw", label: "RAW" },
  { dot: "bg-jpg", key: "jpg", label: "JPG" },
  { dot: "bg-af", key: "edit", label: "EDIT" },
];

type TrackPillProps = {
  active: TrackName;
  interactive?: boolean;
  onSelect?: (track: TrackName) => void;
};

export function TrackPill({ active, interactive = false, onSelect }: TrackPillProps) {
  return (
    <ul className="inline-flex items-center gap-0.5 rounded-full border border-[rgba(43,38,33,0.10)] bg-[rgba(255,255,255,0.96)] p-1 shadow-[0_1px_2px_rgba(43,38,33,0.08),0_10px_28px_-4px_rgba(43,38,33,0.28)]">
      {TRACKS.map(({ dot, key, label }) => {
        const isActive = key === active;
        const inner = (
          <>
            <span aria-hidden="true" className={cn("size-[7px] shrink-0 rounded-full", dot)} />
            <span>{label}</span>
          </>
        );
        return (
          <li aria-current={isActive ? "true" : undefined} key={key}>
            {interactive ? (
              <button
                className={cn(
                  "inline-flex min-h-6 touch-manipulation items-center gap-1.5 rounded-full px-[18px] py-[7px] text-[13px] leading-4 transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                  isActive
                    ? "bg-primary font-medium text-accent-foreground"
                    : "text-text-secondary hover:text-text-primary",
                )}
                onClick={() => onSelect?.(key)}
                type="button"
              >
                {inner}
              </button>
            ) : (
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-[18px] py-[7px] text-[13px] leading-4",
                  isActive
                    ? "bg-primary font-medium text-accent-foreground"
                    : "text-text-secondary",
                )}
              >
                {inner}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `pnpm vitest run`
Expected: PASS, all suites.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add PhotoFrame and TrackPill primitives with DOM tests"
```

---

### Task 6: Site header and footer

**Files:**
- Create: `src/components/site/SiteHeader.astro`
- Create: `src/components/site/SiteFooter.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `siteConfig` (Task 1), `footer` copy (Task 4).
- Produces: two Astro components taking no props.

- [ ] **Step 1: Write SiteHeader**

Wordmark only — no nav, no CTA. Erode, with the period. Hairline rule beneath at 88px. Matches approved artboard 1A.

```astro
---
import { siteConfig } from "@/lib/config";
---

<header class="border-b border-[rgba(43,38,33,0.09)]">
  <div class="mx-auto flex h-22 max-w-[1440px] items-center px-6 lg:px-[120px]">
    <a
      class="font-serif text-[24px] leading-none font-semibold tracking-[-0.015em] text-text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      href="/"
      translate="no">{siteConfig.name}.</a
    >
  </div>
</header>
```

- [ ] **Step 2: Write SiteFooter**

```astro
---
import { footer } from "@/lib/copy";
---

<footer class="border-t border-[rgba(43,38,33,0.09)]">
  <div
    class="mx-auto flex max-w-[1440px] flex-col gap-4 px-6 py-10 sm:flex-row sm:items-center sm:justify-between lg:px-[120px]"
  >
    <nav aria-label="Legal">
      <ul class="flex flex-wrap gap-x-6 gap-y-2">
        {
          footer.links.map((link) => (
            <li>
              <a
                class="inline-flex min-h-11 items-center text-[14px] text-text-secondary underline-offset-4 hover:text-text-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:min-h-6"
                href={link.href}
              >
                {link.label}
              </a>
            </li>
          ))
        }
      </ul>
    </nav>
    <p class="text-[14px] text-text-tertiary" translate="no">{footer.copyright}</p>
  </div>
</footer>
```

- [ ] **Step 3: Create the three legal stub pages**

The footer links to `/privacy`, `/terms` and `/contact`. Shipping links to pages that do not exist is a dead end, so create all three now as real pages with honest placeholder bodies. Do **not** write invented legal text — a fabricated privacy policy is worse than an obviously unfinished one.

Create `src/pages/privacy.astro`, `src/pages/terms.astro` and `src/pages/contact.astro`, each using `BaseLayout` with `SiteHeader` / `SiteFooter`, an `<h1>` naming the page, and a single sentence stating the content is being prepared. Flag to the user that these need real copy before launch.

- [ ] **Step 4: Compose into index.astro**

```astro
---
import SiteFooter from "@/components/site/SiteFooter.astro";
import SiteHeader from "@/components/site/SiteHeader.astro";
import BaseLayout from "@/layouts/BaseLayout.astro";
import { siteConfig } from "@/lib/config";
---

<BaseLayout title={siteConfig.name} description={siteConfig.description}>
  <SiteHeader />
  <main id="main" class="scroll-mt-24"></main>
  <SiteFooter />
</BaseLayout>
```

- [ ] **Step 5: Verify the build and look at it**

Run: `pnpm build && pnpm lint`
Expected: build succeeds, lint clean. Then run `pnpm dev` and confirm the wordmark sits left with a hairline rule and the footer links are keyboard-focusable with a visible ring.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add the wordmark-only site header, legal footer and page stubs"
```

---

### Task 7: Hero section

Implements approved artboard `1A`. Static HTML — no island. The gallery grid is decorative and is hidden from assistive technology; the headline carries the meaning.

**Files:**
- Create: `src/components/site/Hero.astro`
- Create: `src/components/demo/GalleryWindow.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `hero` copy (Task 4), `warm` + `heroTileOrder` + `bloom` (Task 3), `TrackPill` (Task 5).
- Produces: `Hero.astro`, and `GalleryWindow.astro` taking `{ tiles: WarmName[]; columns: number; activeTrack: TrackName }` — reused by Task 9's performance row.

Key measurements from the comp, all at the 1440 reference width: left rail `120px`; headline Satoshi 700 `80px/84px` tracking `-0.038em`, three lines; lede `19px/30px` capped at `716px` so its right edge matches the headline's first line; window spans `120px`–`1320px`, starts `596px` from the top of the section and runs past the fold; tiles `223×149` on a `12px` gap, five across; pill floats over the grid, `RAW` active.

- [ ] **Step 1: Write GalleryWindow**

```astro
---
import { TrackPill } from "@/components/demo/TrackPill";
import { bloom, type TrackName, warm, type WarmName } from "@/lib/gradients";

type Props = { activeTrack: TrackName; columns: number; tiles: WarmName[] };
const { activeTrack, columns, tiles } = Astro.props;
---

<div
  class="relative overflow-hidden rounded-t-2xl border border-[rgba(43,38,33,0.10)] bg-surface shadow-[0_1px_3px_rgba(43,38,33,0.05),0_28px_64px_-24px_rgba(43,38,33,0.20)]"
>
  <div
    class="flex h-[46px] items-center border-b border-[rgba(43,38,33,0.08)] bg-[rgba(255,250,246,0.92)] px-[18px]"
  >
    <div aria-hidden="true" class="flex gap-2">
      <span class="size-[11px] rounded-full bg-[rgba(43,38,33,0.15)]"></span>
      <span class="size-[11px] rounded-full bg-[rgba(43,38,33,0.15)]"></span>
      <span class="size-[11px] rounded-full bg-[rgba(43,38,33,0.15)]"></span>
    </div>
    <p class="flex-1 text-center text-[13px] font-medium text-text-secondary">Tuscany — June</p>
    <p class="text-[12px] text-text-tertiary tabular-nums">428&nbsp;photos</p>
  </div>

  <div class="relative p-[18px]">
    <div
      aria-hidden="true"
      class="grid gap-3"
      style={`grid-template-columns: repeat(${columns}, minmax(0, 1fr));`}
    >
      {
        tiles.map((tile) => (
          <div class="relative aspect-[3/2] overflow-hidden rounded-[5px]" style={`background:${warm[tile]}`}>
            <div class="absolute inset-0" style={`background:${bloom}`} />
          </div>
        ))
      }
    </div>
    <div class="pointer-events-none absolute inset-x-0 top-[186px] flex justify-center">
      <TrackPill active={activeTrack} />
    </div>
  </div>
</div>
```

- [ ] **Step 2: Write Hero**

```astro
---
import GalleryWindow from "@/components/demo/GalleryWindow.astro";
import { hero } from "@/lib/copy";
import { heroTileOrder } from "@/lib/gradients";
---

<section class="mx-auto max-w-[1440px] px-6 lg:px-[120px]">
  <h1
    class="max-w-[900px] pt-16 font-sans text-[clamp(40px,6.2vw,80px)] leading-[1.05] font-bold tracking-[-0.038em] text-balance text-text-primary lg:pt-[72px]"
  >
    {hero.headline.join(" ")}
  </h1>

  <p
    class="mt-10 max-w-[716px] font-sans text-[clamp(17px,1.4vw,19px)] leading-[1.6] text-text-secondary"
  >
    {hero.lede}
  </p>

  <div class="mt-[72px] -mb-24 lg:-mb-40">
    <GalleryWindow activeTrack="raw" columns={5} tiles={heroTileOrder} />
  </div>
</section>
```

Note: the headline joins to one string and wraps naturally with `text-balance` rather than using the three hard-coded lines — hard breaks at 80px would break at narrow widths. The three-line rag from the comp is the 1440px outcome, not a constraint.

- [ ] **Step 3: Compose into index.astro**

Add `<Hero />` inside `<main>`.

- [ ] **Step 4: Verify**

Run: `pnpm build && pnpm lint && pnpm vitest run`
Then `pnpm dev` and check at 1440px: headline breaks to three lines, the lede's right edge matches the headline's first line, the window runs off the bottom of the fold, the pill floats over the grid.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: build the hero section from approved comp 1A"
```

---

### Task 8: Feature row wrapper and the Tracks row

Implements approved artboard `T3`. The first row where motion matters: the stack cross-fades between tracks. Built with the DOM shaped for that — one container, three absolutely-positioned children — even though motion itself lands in Task 12.

**Files:**
- Create: `src/components/site/FeatureRow.astro`
- Create: `src/components/demo/TrackStack.tsx`
- Create: `src/components/demo/TrackStack.test.tsx`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `features` copy (Task 4), `trackRender` (Task 3), `TrackPill` (Task 5).
- Produces: `FeatureRow.astro` taking `{ id: string; heading: string; subheading: string; body: string; reversed?: boolean }` with a `<slot />` for the visual — consumed by Task 9 for the remaining four rows. `TrackStack` React island taking no props.

- [ ] **Step 1: Write the failing test**

Create `src/components/demo/TrackStack.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TrackStack } from "@/components/demo/TrackStack";

describe("TrackStack", () => {
  it("renders all three track frames at once so a cross-fade is possible", () => {
    const { container } = render(<TrackStack />);
    expect(container.querySelectorAll("[data-track]")).toHaveLength(3);
  });

  it("starts on edit, the richest rendering", () => {
    render(<TrackStack />);
    expect(screen.getByText("EDIT").closest("li")).toHaveAttribute("aria-current", "true");
  });

  it("hides the decorative frames from assistive technology", () => {
    const { container } = render(<TrackStack />);
    for (const frame of container.querySelectorAll("[data-track]")) {
      expect(frame.getAttribute("aria-hidden")).toBe("true");
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/components/demo/TrackStack.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement TrackStack**

All three frames render always and are stacked; only `opacity` and `transform` change between tracks, which keeps the eventual animation on the compositor. Offsets from the comp: back frame `+56px` x, `-56px` y relative to the front; middle half that.

```tsx
import { useState } from "react";

import { TrackPill } from "@/components/demo/TrackPill";
import { bloom, type TrackName, trackRender } from "@/lib/gradients";

const ORDER: TrackName[] = ["raw", "jpg", "edit"];

/** Depth offsets, in px, for frames behind the front one. */
const OFFSET = { x: 28, y: -28 };

export function TrackStack() {
  const [active, setActive] = useState<TrackName>("edit");
  const activeIndex = ORDER.indexOf(active);

  return (
    <div className="relative aspect-[716/496] w-full">
      {ORDER.map((track, index) => {
        const depth = (ORDER.length - 1 - index + activeIndex) % ORDER.length;
        return (
          <div
            aria-hidden="true"
            className="absolute h-[89%] w-[92%] overflow-hidden rounded-[10px] shadow-[0_2px_6px_rgba(43,38,33,0.07),0_30px_64px_-24px_rgba(43,38,33,0.28)]"
            data-track={track}
            key={track}
            style={{
              background: trackRender[track],
              transform: `translate(${depth * OFFSET.x}px, ${depth * OFFSET.y}px)`,
              zIndex: ORDER.length - depth,
            }}
          >
            <div
              className="absolute inset-0"
              style={{ background: bloom, opacity: depth === 0 ? 1 : 0.4 }}
            />
            <div
              className="absolute inset-0 bg-[rgba(255,252,246,0.10)]"
              style={{ opacity: depth === 0 ? 0 : 1 }}
            />
          </div>
        );
      })}

      <div className="absolute bottom-[9%] left-0 z-10 flex w-[92%] justify-center">
        <TrackPill active={active} interactive onSelect={setActive} />
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Write FeatureRow**

Two-tier heading — `heading` is an `<h2>`, `subheading` is a `<p>` immediately after it at a smaller display size. This is deliberately not a kicker above a heading.

```astro
---
type Props = {
  body: string;
  heading: string;
  id: string;
  reversed?: boolean;
  subheading: string;
};

const { body, heading, id, reversed = false, subheading } = Astro.props;
---

<section
  class="mx-auto grid max-w-[1440px] scroll-mt-24 items-center gap-12 px-6 py-20 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-20 lg:px-[120px] lg:py-28"
  id={id}
>
  <div class={reversed ? "lg:order-2" : "lg:order-1"}>
    <slot />
  </div>
  <div class={reversed ? "lg:order-1" : "lg:order-2"}>
    <h2
      class="font-sans text-[clamp(32px,3.2vw,44px)] leading-[1.09] font-bold tracking-[-0.032em] text-text-primary"
    >
      {heading}
    </h2>
    <p
      class="mt-3.5 font-sans text-[clamp(20px,1.9vw,26px)] leading-[1.31] tracking-[-0.018em] text-balance text-text-primary"
    >
      {subheading}
    </p>
    <p class="mt-6 font-sans text-[17px] leading-[1.65] text-text-secondary">{body}</p>
  </div>
</section>
```

- [ ] **Step 5: Compose the Tracks row into index.astro**

```astro
---
import { TrackStack } from "@/components/demo/TrackStack";
import FeatureRow from "@/components/site/FeatureRow.astro";
import { features } from "@/lib/copy";

const tracks = features[0]!;
---

<FeatureRow {...tracks}>
  <TrackStack client:visible />
</FeatureRow>
```

- [ ] **Step 6: Run tests and build**

Run: `pnpm vitest run && pnpm lint && pnpm build`
Expected: all PASS. Then `pnpm dev` and confirm the stack fans with the front frame lowest-left, the pill sits on the front frame, and clicking a segment reorders the stack.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add the feature row wrapper and the Tracks row from comp T3"
```

---

### Task 9: The remaining four feature rows — DESIGN-GATED

> **This task cannot start until rows two to five have approved comps.** Only the hero (1A) and the Tracks row (T3) have been designed and signed off. The table below fixes each row's *structure, orientation and interface* so the rest of the plan is stable, but the visual for each is a design decision, not an implementation one. Writing the component code now would mean inventing four designs nobody has reviewed.
>
> **Executor: stop here and request comps.** Each row gets the same treatment Tracks did — a few variants in Paper, reviewed, then built. Return to this task once a row is approved, and implement that row alone.

Rows two to five. Each reuses `FeatureRow` and alternates orientation. Per the direction contract, no row uses a single large gradient as its visual — at this scale a bare gradient reads as a colour wash, so each visual is built from multiple frames or app chrome.

**Files:**
- Create: `src/components/demo/ShootFolders.astro` (row 2, local-first)
- Create: `src/components/demo/GalleryScroll.tsx` (row 3, performance)
- Create: `src/components/demo/SettingsCarousel.tsx` (row 4, insights)
- Create: `src/components/demo/FilterReveal.tsx` (row 5, management)
- Create: `src/components/demo/SettingsCarousel.test.tsx`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `FeatureRow` (Task 8), `GalleryWindow` (Task 7), `PhotoFrame`/`TrackPill` (Task 5), `warm` (Task 3), `features` copy (Task 4).

Orientation, alternating from row one (visual left):

| Row | id | Visual side | Demonstration |
| --- | --- | --- | --- |
| 1 | `tracks` | left | `TrackStack` (built in Task 8) |
| 2 | `local-first` | right | `ShootFolders` — a folder path resolving into three shoot cards, each a small frame plus name and count. Static Astro; no motion needed. |
| 3 | `performance` | left | `GalleryScroll` — `GalleryWindow` at 6 columns with more rows than fit, clipped, scrolling slowly on a loop. |
| 4 | `insights` | right | `SettingsCarousel` — a row of setting chips (`1/125`, `ISO 800`, `f/2.8`, `35 mm`) cycling. |
| 5 | `management` | left | `FilterReveal` — a grid of 12 frames narrowing to 4 as two filter chips activate. |

- [ ] **Step 1: Write the failing test for the one component with real logic**

Create `src/components/demo/SettingsCarousel.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SettingsCarousel } from "@/components/demo/SettingsCarousel";

describe("SettingsCarousel", () => {
  it("renders every setting so the loop never reveals new content to a reader", () => {
    render(<SettingsCarousel />);
    for (const label of ["1/125", "ISO 800", "f/2.8", "35 mm"]) {
      expect(screen.getByText(label)).toBeTruthy();
    }
  });

  it("separates number and unit with a non-breaking space", () => {
    render(<SettingsCarousel />);
    expect(screen.getByText("35 mm").textContent).toBe("35 mm");
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `pnpm vitest run src/components/demo/SettingsCarousel.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Build the four visuals — one per approved comp**

Constraints that hold regardless of what the comps say, and which the comps must respect:

- Gradients come from `warm` / `trackRender`; never inlined.
- Frames use `PhotoFrame`; shadows two-layer and warm-tinted.
- Every visual fills the `aspect-[716/496]` box `FeatureRow` expects, so rows share one rhythm.
- All decorative content is `aria-hidden="true"`.
- No single undifferentiated gradient larger than roughly 400px on its long edge.
- `ShootFolders` is `.astro` (nothing moves); the other three are `.tsx` islands hydrated `client:visible`.
- Any looping demo renders all its content in the DOM at all times and animates `transform`/`opacity` only — never mount/unmount, or a screen reader sees content appear and vanish.
- Any text inside a demo is real product language. `ISO 800`, `f/2.8`, `35 mm` are camera settings and safe; a photo count, a filename or a shoot name must be plausible and generic, and nothing may imply a capability PRODUCT.md lists as unverified.

Row 4 (`insights`) carries a specific risk: **"Shoot Insights" is not evidenced in the app's feature audit.** Build the row from the approved copy, but do not add UI implying settings-frequency analysis exists until that is confirmed.

- [ ] **Step 4: Compose all four rows into index.astro**

```astro
<FeatureRow {...features[1]!} reversed>
  <ShootFolders />
</FeatureRow>
<FeatureRow {...features[2]!}>
  <GalleryScroll client:visible />
</FeatureRow>
<FeatureRow {...features[3]!} reversed>
  <SettingsCarousel client:visible />
</FeatureRow>
<FeatureRow {...features[4]!}>
  <FilterReveal client:visible />
</FeatureRow>
```

- [ ] **Step 5: Verify**

Run: `pnpm vitest run && pnpm lint && pnpm build`
Then `pnpm dev`: confirm rows alternate, each row is shorter than the viewport so the next peeks, and no row shows a single undifferentiated gradient.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add the remaining four feature rows"
```

---

### Task 10: Closing section

Calm and spacious. Availability as a status, never a call to action — there is no working download, so a button would be a lie.

**Files:**
- Create: `src/components/site/Closing.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Write the section**

```astro
---
import { closing } from "@/lib/copy";
import { warm } from "@/lib/gradients";
---

<section class="mx-auto max-w-[1440px] px-6 py-32 text-center lg:px-[120px] lg:py-44">
  <div
    aria-hidden="true"
    class="mx-auto mb-14 size-20 rounded-[18px] shadow-[0_2px_6px_rgba(43,38,33,0.07),0_24px_48px_-20px_rgba(43,38,33,0.24)]"
    style={`background:${warm.peach}`}
  >
  </div>
  <h2
    class="mx-auto max-w-[900px] font-sans text-[clamp(32px,3.6vw,48px)] leading-[1.1] font-bold tracking-[-0.032em] text-balance text-text-primary"
  >
    {closing.heading}
  </h2>
  <p
    class="mx-auto mt-6 max-w-[620px] font-sans text-[17px] leading-[1.65] text-pretty text-text-secondary"
  >
    {closing.body}
  </p>
</section>
```

The square stands in for the app icon, which does not exist yet. Replace it when one does; do not fabricate a mark.

- [ ] **Step 2: Compose, verify, commit**

Run: `pnpm build && pnpm lint && pnpm vitest run`

```bash
git add -A
git commit -m "feat: add the closing availability section"
```

---

### Task 11: Responsive pass

The comps are 1440px only. This task makes the page work at 390px, 768px, 1280px and 1920px.

**Files:** every `.astro` and `.tsx` under `src/components/`.

- [ ] **Step 1: Set the breakpoint behaviour**

Rules: the left rail collapses from `120px` to `24px` below `lg`. Feature rows stack to one column below `lg`, visual always above copy regardless of `reversed`. Hero headline scales via the existing `clamp()`. The hero window keeps five columns down to `md`, then three, then two. Nothing horizontally scrolls at any width.

- [ ] **Step 2: Verify at four widths**

Run `pnpm dev`, then check 390, 768, 1280 and 1920. At 1920 confirm the `max-w-[1440px]` container centres rather than stretching. Confirm no horizontal scrollbar at any width.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: make the landing page responsive from 390 to 1920"
```

---

### Task 12: The motion pass

One orchestrated pass, now that the whole page exists. Every value comes from `src/lib/motion.ts`.

**Files:** `src/components/demo/*.tsx`, and a new `src/components/demo/Reveal.tsx`.

- [ ] **Step 1: Add the reduced-motion boundary once**

Wrap each island's root in `<MotionConfig reducedMotion="user">` — mirroring the app's single app-wide config. Do not call `useReducedMotion` in feature code.

- [ ] **Step 2: Author the motion**

- Section reveals: `fadeInUp` with `stagger.relaxed`, triggered once on enter. Content is visible by default and animates from there, never hidden until JS runs.
- `TrackStack`: cross-fade and depth shift on `presets.ui`. Auto-cycles every 3s; **pauses on hover, on focus within, and when `prefers-reduced-motion` is set** — the cycle exceeds 5 seconds of continuous motion, so per the accessibility constraint it needs a pause affordance; the pill itself is that affordance.
- `GalleryScroll`: `presets.ambient` for the loop.
- `SettingsCarousel`: `presets.ui` per step, `presets.ambient` for the dwell.
- `FilterReveal`: `presets.gentle` for the grid reflow, `AnimatePresence mode="popLayout"`.

- [ ] **Step 3: Guard the discipline with a test**

Create `src/lib/motion-discipline.test.ts` — reads every `src/components/**/*.tsx` and fails on an inlined `duration:`, `stiffness:`, `damping:`, `ease:` or `transition: all` outside `src/lib/motion.ts`.

- [ ] **Step 4: Verify and commit**

Run: `pnpm vitest run && pnpm build`. Check the page with `prefers-reduced-motion: reduce` set in devtools — all four demos should be still and legible.

```bash
git add -A
git commit -m "feat: add the orchestrated motion pass with a discipline guard"
```

---

### Task 13: Accessibility and finish

- [ ] **Step 1: Audit against the Global Constraints**

Tab the whole page: visible `:focus-visible` ring on every interactive element, logical order, skip link works. Check every heading level is sequential. Confirm decorative gradients are `aria-hidden` and that no information is carried by colour alone.

- [ ] **Step 2: Check contrast with APCA**

Body `--color-text-secondary` on white, `--color-text-tertiary` on white, and the pill's active label on `--color-peach`. Anything under 16px needs extra margin.

- [ ] **Step 3: Run the mechanical detector**

Run: `"/Users/jubs/.claude/plugins/cache/impeccable/impeccable/4.3.1/skills/impeccable/scripts/impeccable" detect --json src/components src/pages`
Fix what is mechanical; carry the rest to the review.

- [ ] **Step 4: Capture evidence and run the finish review**

Capture `desktop.png` (1440 wide, full page) and `mobile.png` (390 wide) into `.impeccable/review/`. Then spawn `impeccable-finish-reviewer` with the original request, the direction contract at `.impeccable/surfaces/src-pages-index-astro.md`, PRODUCT.md, the screenshots, the detector findings, and the craft-floor reference path. Act on its disposition word.

- [ ] **Step 5: Document and commit**

Spawn `impeccable-documenter` to write DESIGN.md and `.impeccable/design.json` from the built result.

```bash
git add -A
git commit -m "feat: accessibility pass, finish review and design documentation"
```

---

## Notes for the executor

- **Do not restyle from memory.** The approved visuals are Paper artboards `1A · Left rail (Satoshi)` and `T3 · Tracks — stack` in file `01M0539MQZEZCYPHPZGFGWQTN6`. Use `get_computed_styles` / `get_jsx` for exact values rather than eyeballing a screenshot.
- **The lede width is load-bearing.** `716px` is not arbitrary — it matches the headline's first line so the two share a right edge. If the headline size changes, this number changes with it.
- **Three tiles in the hero deliberately repeat recipes** (`sunbleached` and `peach` each appear twice) but never adjacently. The test enforces the non-adjacency, not the uniqueness.
- **If a task reveals the plan is wrong, stop and say so** rather than improvising around it.
