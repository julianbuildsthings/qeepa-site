---
name: Qeepa
description: Local-first photo manager for photographers who shoot RAW; the marketing site shows the app's own sunlit gallery instead of describing it.
colors:
  cream-base: "#ffffff"
  peach-accent: "#fcba7f"
  peach-light: "#fdecd9"
  peach-dark: "#6f3b0f"
  surface-2: "#f6f1ea"
  text-primary: "#2b2621"
  text-secondary: "#6b645a"
  text-tertiary: "#9d958a"
  track-raw: "#c8752a"
  track-jpg: "#2f6ea8"
  track-af: "#6b4fa8"
  pip-filled: "#EEA767"
  pip-empty: "#2B26211F"
  frame-border: "#2B262114"
  stack-border: "#2B26211F"
  tone-almond: "#F8EBDC"
  tone-bisque: "#F9EEE1"
  tone-chalk: "#FEFAF6"
  tone-ivory: "#FDF8F2"
  tone-linen: "#FBF2E8"
  tone-oat: "#FAF0E5"
  tone-shell: "#FCF5ED"
  tone-wheat: "#FDF7F0"
  bar-browse: "#FFFFFFF5"
typography:
  display:
    fontFamily: "Satoshi, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(34px, 4.7vw, 62px)"
    fontWeight: 700
    lineHeight: 1.07
    letterSpacing: "-0.036em"
  headline:
    fontFamily: "Satoshi, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(32px, 3.6vw, 48px)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.032em"
  title:
    fontFamily: "Satoshi, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(26px, 2.4vw, 34px)"
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: "-0.03em"
  subheading:
    fontFamily: "Satoshi, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(17px, 1.4vw, 20px)"
    fontWeight: 400
    lineHeight: 1.38
    letterSpacing: "-0.014em"
  lede:
    fontFamily: "Satoshi, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(15px, 1.15vw, 16px)"
    fontWeight: 400
    lineHeight: 1.7
  body:
    fontFamily: "Satoshi, ui-sans-serif, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.7
  body-closing:
    fontFamily: "Satoshi, ui-sans-serif, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.65
  wordmark:
    fontFamily: "Erode, ui-serif, Georgia, serif"
    fontSize: "17px"
    fontWeight: 500
    lineHeight: "22px"
    letterSpacing: "-0.01em"
  small:
    fontFamily: "Satoshi, ui-sans-serif, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
  label:
    fontFamily: "Satoshi, ui-sans-serif, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: "16px"
  caption:
    fontFamily: "Satoshi, ui-sans-serif, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 400
  frame-number:
    fontFamily: "Satoshi, ui-sans-serif, system-ui, sans-serif"
    fontSize: "9px"
    fontWeight: 400
    lineHeight: "12px"
    letterSpacing: "0.02em"
rounded:
  pip: "1px"
  thumb: "3px"
  frame: "5px"
  sm: "6px"
  print: "10px"
  panel: "14px"
  window: "18px"
  full: "9999px"
spacing:
  rail-mobile: "24px"
  rail: "120px"
  row-y-mobile: "80px"
  row-y: "112px"
  row-gap-mobile: "48px"
  row-gap: "80px"
  window-inset: "18px"
  grid-gap: "12px"
  panel-inset: "20px"
  closing-y-mobile: "128px"
  closing-y: "176px"
  page-max: "1440px"
  bar-max: "1200px"
components:
  floating-bar-browse:
    backgroundColor: "{colors.bar-browse}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.full}"
    height: "48px"
    padding: "0 6px 0 20px"
  floating-bar-selection:
    backgroundColor: "{colors.peach-light}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.full}"
    height: "48px"
    padding: "0 6px 0 20px"
  button-get-disabled:
    backgroundColor: "rgba(43,38,33,0.06)"
    textColor: "{colors.text-tertiary}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "9px 20px"
  track-pill:
    backgroundColor: "rgba(255,255,255,0.96)"
    rounded: "{rounded.full}"
    padding: "4px"
  track-pill-segment:
    textColor: "{colors.text-secondary}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "7px 18px"
  track-pill-segment-active:
    backgroundColor: "{colors.peach-accent}"
    textColor: "{colors.peach-dark}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "7px 18px"
  filter-chip:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.text-secondary}"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: "6px 12px"
  filter-chip-active:
    backgroundColor: "{colors.peach-light}"
    textColor: "{colors.peach-dark}"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: "6px 12px"
  photo-frame:
    backgroundColor: "{colors.tone-shell}"
    rounded: "{rounded.frame}"
  app-window:
    backgroundColor: "{colors.cream-base}"
    rounded: "{rounded.window}"
    padding: "{spacing.window-inset}"
  panel:
    backgroundColor: "{colors.cream-base}"
    rounded: "{rounded.panel}"
    padding: "{spacing.panel-inset}"
---

# Design System: Qeepa

## Overview

**Creative North Star: "The Sunlit Gallery"**

The site shows the product demonstrating itself on a white page. Every visual is a piece of the app's own interface: a window with muted traffic lights, a grid of near-white photo frames, the track pill, a file listing, an insights panel, a filter toolbar. None of it is a framed screenshot on a plinth. Copy ranges left on a single 120px rail. Each feature gets a full row, never a card, and the rows alternate sides down the page. The page ends with a status line, not a call to action, because there is nothing to download yet.

The material is warm and light. Photographs are stood in for by flat, near-white warm tones. What makes a tone read as a photo rather than a swatch is its metadata chrome: a track dot, rating pips, a frame number. The only non-warm colours on the page are the functional JPG and EDIT track dots. Depth comes from soft, warm-tinted shadows under objects the app would float. Surfaces themselves stay flat.

Motion shares one physics vocabulary with the app. Loops demonstrate a claim, pause on hover or focus, and stop under reduced motion. Server HTML always shows a settled, legible state, and nothing is hidden unless JavaScript is present and motion is welcome.

**Key Characteristics:**
- White ground, one warm family, three functional track colours.
- Satoshi Bold display with tight negative tracking. Erode appears only in the wordmark and the floating bar's section names.
- Flat light tones with metadata chrome stand in for photographs. No gradients, no imagery.
- App chrome (window, pill, bar, chips) is the recurring material, taken from the product rather than invented.
- One motion registry, enforced by a test.

## Colors

A white page with warm neutral text, a single peach accent at three depths, a light warm tone family for photo stand-ins, and three functional track colours.

### Primary
- **Peach Accent** (peach-accent): the one accent. It fills the active track-pill segment and the proportion bars, and it is the focus ring colour (`--ring`). Never used for text.
- **Peach Light** (peach-light): the selection surface. It is the floating bar in selection state, the active filter chips, the proportion-bar track (the same peach at a paler depth, so a bar reads as one channel partly filled), and at 50% it tints the newly written `.xmp` row.
- **Peach Dark** (peach-dark): text on peach-light surfaces — active chips and the sidecar row. The active track pill label, which sits on the stronger peach fill, is one step darker at `#5C300C`: peach-dark there measured APCA Lc 58.6 at 13px, and `#5C300C` measures 63.5.

### Secondary
- **Track RAW / Burnt Apricot** (track-raw): the RAW track dot. It is also the colour of the lit stars in the floating bar, the only place the star glyph appears. Ratings in page content — photo frames and the local-first listing alike — are the rating pips.
- **Track JPG / Export Blue** (track-jpg) and **Track EDIT / Working-File Violet** (track-af): the JPG and EDIT track dots. These are the only non-warm colours on the page, and they appear only as dots beside a text label or on a frame.

### Tertiary: photo tones
- **The eight tones** (tone-almond, tone-bisque, tone-chalk, tone-ivory, tone-linen, tone-oat, tone-shell, tone-wheat): flat stand-ins for photographs, at HSL hue 15 to 45 and lightness above 75, with the whole family inside an 8-point lightness band so a grid reads as one field. The tracks row maps RAW to chalk, JPG to wheat and EDIT to almond, palest to deepest.
- **Rating Pip** (pip-filled / pip-empty): tuned between track-raw, which was too loud across a grid, and peach-accent, which vanished. Empty pips are text-primary at 12% alpha.

### Neutral
- **White** (cream-base): page ground, window and panel surfaces. The browse state of the floating bar is white at 96% (bar-browse).
- **Warm Stone** (surface-2): inactive chip and gear-chip fill.
- **Ink** (text-primary): headings, subheadings and data values.
- **Umber Grey** (text-secondary): lede, body copy, captions and inactive pill labels.
- **Pebble** (text-tertiary): frame numbers, file sizes, breadcrumb, copyright and the disabled button label. Keep it off tinted surfaces at small sizes (see the APCA note under Components).
- **Hairlines**: all borders are text-primary (`rgba(43,38,33,…)`) at low alpha, never neutral grey. Container edge 0.10, window-bar divider 0.08, list dividers 0.06, panel section rule 0.07, footer rule 0.09. Photo frames use frame-border (8%); overlapping stacked frames use stack-border (12%).

### Named Rules
**The Warm-Only Rule.** Everything is warm (hue 15 to 45) except the JPG and EDIT track dots, which earn their colour by carrying meaning. `tones.test.ts` enforces this for the tone family and the bar colours.

**The Light-Tone Rule.** A photo stand-in stays above 75% lightness. A tone dark enough to compete with the type has stopped being a photo and become a block of colour.

**The Printed-Number Rule.** The proportion bar's peach-on-peach pair is 1.46:1, below the 3:1 floor for graphics. That is acceptable only because every bar has its percentage printed beside it ("Aperture · 62%"). `InsightsPanel.test.tsx` fails if a bar ever loses its number, and at that point the fill has to darken.

## Typography

**Display Font:** Satoshi (variable 300 to 900, self-hosted), with ui-sans-serif, system-ui, sans-serif
**Body Font:** Satoshi
**Wordmark Font:** Erode (300 to 700, self-hosted), with ui-serif, Georgia, serif

**Character:** Satoshi Bold with tight negative tracking carries every heading, confident and plain. Erode is a quiet serif signature, kept to the name "Qeepa" and the feature names in the floating bar, matching the app's own bar.

### Hierarchy
- **Display** (hero h1): three lines broken as "Choosing your keepers / shouldn't feel / like a chore." with hard breaks only from lg. Below lg it rewraps, balanced, capped at 660px. Weight synthesis is off (`font-synthesis-weight: none`).
- **Headline** (closing h2): centred, max 900px, balanced.
- **Title** (feature h2): the feature name.
- **Subheading**: the sentence set directly beneath the title, 12px below it, in text-primary. Title and subheading form a two-tier heading, and the subheading always sits below.
- **Lede** (hero only): text-secondary, capped at 560px. That cap follows the headline size, so if one changes the other changes with it.
- **Body**: feature body in text-secondary, 20px below the subheading. **Body-closing** is the larger closing paragraph, max 620px.
- **Wordmark**: the brand link and section names in the floating bar.
- **Label** (13px/16px): pill segments, the bar's photo count and the Get Qeepa button. **Caption** (12px): panel text, chips, file sizes. **Frame number** (9px, 12px from sm on large frames). **Small** (14px): footer links and copyright, and the values in the insights panel (medium weight).
- Numbers that change or align use `tabular-nums`.

### Named Rules
**The No-Kicker Rule.** No small label sits above a heading anywhere. The subheading is always below the title. Stated in `copy.ts` and `FeatureRow.astro`.

**The Curly-Apostrophe Rule.** All copy lives in `src/lib/copy.ts`, uses curly apostrophes, and never states a price, a date or social proof. `copy.test.ts` enforces all three.

## Layout

- **Rail.** Content is capped at 1440px, with 24px side padding that becomes a 120px rail from lg. The hero, feature rows, closing, footer, legal pages and floating bar all share that left edge. The bar's inner width caps at 1200px.
- **Rows.** Each feature row is one section. Padding is 80px vertical, 112px from lg, so row-to-row rhythm is 224px on desktop. The hero carries the same bottom padding, so the hero-to-first-row seam matches. Gap is 48px, 80px from lg.
- **Split at lg, shrink before stacking.** From lg (1024px) a row is two columns, 1.45 : 1 with the wide column always following the visual, and the copy column never narrower than 340px: as the window narrows the visual gives up the width, and the gap eases from 80px at 1440 to 57px at 1024 (`clamp(48px, 5.56vw, 80px)`). Rows alternate starting with the visual on the left. Below lg every row stacks to one column with the copy first, as in the hero, capped at 560px, regardless of orientation, with 64px between copy and visual. The shared 716 : 496 visual box applies only side by side, where it evens out the rows; stacked, a visual is as tall as its content, so panels that sit centred in that box (the sidecar listing, the insights panel) never float in empty space.
- **Hero window by columns, never rows.** The hero grid is 2 columns, 3 from sm and 5 from md. Frames that no longer fit are hidden, not wrapped, so the row count and the track pill's position hold at every width. The pill sits on the exact centre line of row two, computed with the fixed 12px gaps taken out.
- **Demo canvas.** Row visuals share a 716 : 496 aspect box. The fast-performance viewport is 716 : 280. Frames are 3 : 2.
- **Breakpoints** (Tailwind defaults): sm 640, md 768, lg 1024, xl 1280. Things that change at each: the bar's stars and photo count appear from md. Large-frame chrome scales up from sm. Pill segment padding goes from 12px to 18px at sm. Footer links drop from 44px to 24px tall at sm.
- **Closing.** Centred, type only, 128px vertical padding (176px from lg).

## Elevation & Depth

Surfaces are flat. Depth belongs only to objects the app itself would float: the window, the panels, the stacked prints, the track pill and the floating bar. Every shadow is tinted with text-primary (`rgba(43,38,33,…)`), never neutral black. Objects on the page use two layers: a tight contact shadow plus a long ambient one with a negative spread. The floating bar is the single-layer exception, because its value is copied from the app's bar.

### Shadow Vocabulary
- **Window** (`0 1px 3px rgba(43,38,33,0.05), 0 28px 64px -24px rgba(43,38,33,0.20)`): the hero window and the fast-performance window.
- **Panel** (`0 1px 3px rgba(43,38,33,0.05), 0 24px 56px -24px rgba(43,38,33,0.20)`): the sidecar listing, the insights panel and the filter panel.
- **Print** (`0 2px 6px rgba(43,38,33,0.07), 0 30px 64px -24px rgba(43,38,33,0.28)`): the stacked track frames, so the frames behind read as a stack and not as a shadow.
- **Pill** (`0 1px 2px rgba(43,38,33,0.08), 0 10px 28px -4px rgba(43,38,33,0.28)`): the track pill floating over a grid.
- **Bar** (`0px 10px 30px rgba(43,38,33,0.14)`): the floating bar, taken from the app.

### Named Rules
**The Warm-Shadow Rule.** A shadow is tinted with the ink colour, and every shadow on a page object has two layers. A neutral-grey shadow never appears.

## Shapes

- Photo frames have gently rounded corners (5px), stacked prints 10px, file-list thumbnails 3px, pips 1px (2px on large frames).
- Panels are 14px. Windows are 18px. The hero window is rounded at the top only and has no bottom border, so it ends open-edged. The fast-performance window is closed on all sides because it sits inside a row as a whole object.
- The bar, the pill, pill segments, chips, the disabled button and proportion bars are fully round.
- The window strip is 46px tall and white, with three muted 11px traffic lights (ink at 15%), 8px apart, 18px in from the edge, and a hairline beneath. The strip carries nothing else.
- Every edge is a 1px ink hairline at the alphas listed under Colors.

## Components

### Floating Bar (navigation)
Adapted from the app's floating bar. It is sticky 16px from the top on the 120px rail, 48px tall and fully round.
- **Browse state** (over the hero): near-white surface, the brand "Qeepa" in Erode linking home, and "10 photos" from md.
- **Selection state** (a feature holds the middle of the viewport): peach-light surface, with the feature's name in Erode and its count. At the closing the bar stays in this state with all five stars lit, names "Qeepa" (linking home) and shows no count; no star is marked current. The surface change is a CSS colour transition at `--motion-base` / `--ease-standard`. The label fades at `durations.quick`.
- **Stars as sections:** five 16px stars centred on the bar, one per feature. The nth feature fills n stars. Each star is a 24px link to its section, labelled with the feature name and marked `aria-current="location"` when current. Hovering or focusing a star previews its fill. On the home page a click travels there on `presets.gentle`, driven by the bar rather than the browser's smooth scroll: the bar names the destination from the click and holds it through the travel, and the reader's own wheel, touch, key or press hands the scroll straight back. Off the home page a star is a plain link home. Lit stars are track-raw. Unlit stars are peach-dark at 18% in selection and ink at 12% in browse. Stars are hidden below md.
- **Get Qeepa:** a real disabled button (ink at 6% fill, pebble label, not-allowed cursor). It stays disabled until there is something to get.
- The label is not a live region. The bar adopts a section when that section's top passes 50% of the viewport height.

### Track Pill (signature)
The app's track switcher. It appears in the hero and the Photo tracks row.
- A 96%-white capsule with a 10% ink hairline, 4px inset and the Pill shadow. Three segments (RAW, JPG, EDIT), each a 7px track dot plus a label at 13px.
- Active: peach-accent fill, peach-dark label. Inactive: umber-grey label, which turns ink on hover.
- Every segment keeps the same weight in every state, so the fill slides and never lurches.
- Interactive pills measure the active segment and move one fill with `x` and `scaleX` on `presets.lively`. Under reduced motion the fill jumps. Static pills render spans with a plain background fill, so they never look clickable.
- The dot is decorative. The label carries the meaning.

### Photo Frame (signature)
`PhotoFrame` is the only place frame chrome is defined. It is a flat tone, a 1px frame-border and a 5px radius. It is always `aria-hidden`.
- **Chrome** where it earns its weight: a 5px track dot top-right, five rating pips bottom-left, and a frame number bottom-right in pebble. `size="large"` scales the chrome from sm up.
- **Bare** where it does not: the 48 × 32 local-first thumbnails and the scrolling fast-performance strip.
- Most frames are unrated (`rating: null`).
- Grids use `scatterTones()`: deterministic, with no tone repeated to the left of or above itself, so a grid never stripes.

### App Window
`WindowBar` is the only place window chrome is defined. It sits over an 18px-inset grid with 12px gaps, uses the Window shadow and an 18px top radius, and has a white surface.

### Panels (cards)
The file listing, the insights panel and the filter panel: white, 14px radius, a 10% ink hairline, the Panel shadow and a 20px inset. Header and footer strips are separated by 8% hairlines.

### Chips
- **Filter chips:** fully round, 12px medium, 6px × 12px, at least 24px tall. Inactive: surface-2 fill with an umber-grey label that turns ink on hover. Active: peach-light fill with a peach-dark label.
- **Gear chips:** surface-2 fill, umber-grey label, count in medium weight. Pebble on surface-2 measured APCA Lc 48 at 12px, and secondary medium measured Lc 71.

### Proportion Bar
6px tall and fully round, because at 4px it reads as a divider. The track is peach-light and the fill peach-accent. It fills once on entry with `presets.gentle`, staggered by `stagger.relaxed`, and never loops. The in-view observer goes on the track, not on the zero-width fill.

### Footer and links
The footer has a 9% ink top rule. Links are 14px umber grey and turn ink and underline (4px offset) on hover. They are 44px tall below sm and 24px from sm. The skip link appears on focus, fixed at the top left. The footer links the three legal pages (Privacy Policy, Terms and Conditions, Acceptable Use Policy), and the current page's link reads in ink.

### Legal pages
Markdown in `src/pages`, laid out by `LegalPage.astro` and styled by `.legal` in `global.css`. A single 580px column on the rail holds the 16px body to about 73 characters. The title is Satoshi Bold `clamp(30px, 3.2vw, 44px)`, with the document's own date line under it in 14px umber grey. Section headings are 21px bold with 56px above and 10px below; subheadings are 16px bold. Body text is umber at line-height 1.7, list markers are umber grey, and links are ink with a 28% ink underline that turns full ink on hover. There are no rules, cards or numbering beyond what the documents themselves carry. The text is published as supplied.

### Motion
- **One registry:** `src/lib/motion.ts` (presets ambient, gentle, lively, snap and ui; distance; stagger; easings; durations; cycle; speeds). CSS-driven motion reads the same numbers through `motionCssVariables()`, set on `<html>`.
- **Section reveals** are CSS, and apply only under `.js` (added before first paint) and `prefers-reduced-motion: no-preference`. A feature row's visual fades and rises 16px over `--motion-editorial` with `--ease-enter`. They reveal once via IntersectionObserver, and everything shows at once without it. Anything scrolled past unrevealed, by a fast scroll or an anchor jump, is revealed when the next thing is.
- **Copy line rise** (the signature entrance for type). The feature copy and the closing are split into their rendered lines after the fonts load, and again when the width changes. Each line rises out of its own mask over `durations.line` (0.8s) with `easings.rise`, an exponential ease-out, one `stagger.line` (70ms) after the last, running from the heading through the subheading into the body. In a feature row the copy starts one `--reveal-stagger` behind its visual. Screen readers get the unsplit text. Under reduced motion nothing is split or hidden.
- **Loops** (the tracks cycle, the sidecar write, the filter pass, the gallery scroll) pause on hover and focus, never start under reduced motion, and pin their state when their control is clicked. The gallery strip travels at a constant `speeds.gallery` px/s, never a fixed duration.
- `initial={false}` is used wherever the server HTML must show the settled state. `MotionConfig reducedMotion="user"` wraps every island. Only `transform` and `opacity` animate on frames.
- `popLayout` exits need a positioned parent (`FilterReveal.test.tsx`).

## Do's and Don'ts

### Do:
- **Do** take every duration, easing, spring, delay and travel distance from `src/lib/motion.ts`. In CSS, read the variables from `motionCssVariables()`. `motion-discipline.test.ts` fails on inlined values in demo, site, page and layout code.
- **Do** render photographs as `PhotoFrame` tones and windows through `WindowBar`, so the chrome has one owner.
- **Do** derive any count the bar states from `src/lib/tiles.ts`, so it equals the frames actually drawn. The only exception is the performance strip, which names the shoot (1127). `tiles.test.ts` guards this.
- **Do** keep new tones warm (hue 15 to 45), above 75% lightness, and inside the gallery's 8-point band (`tones.test.ts`).
- **Do** give every control a 2px `:focus-visible` ring in peach-accent, a 24px minimum hit area, and 44px on coarse pointers via `extend-touch-target-y`.
- **Do** pair every colour signal with text: track dots with labels, bars with printed percentages, stars with section names.
- **Do** judge text contrast with APCA and record the reading when a pairing changes.
- **Do** make every loop pausable (hover, focus and its own control) and still under reduced motion.

### Don't:
- **Don't** put a kicker or eyebrow above a heading.
- **Don't** use gradients as photo stand-ins. They read as swatches at any size.
- **Don't** add a colour outside the warm family other than the track dots, and don't use grey hairlines or neutral shadows.
- **Don't** lay feature content in a grid of equal cards, or present the product as a floating framed screenshot.
- **Don't** split rows into two columns below lg, or let the copy column fall under 340px.
- **Don't** add a live download, buy or signup control, a price, a date, testimonials or a logomark. None exist, and Get Qeepa stays disabled until one does.
- **Don't** hide server-rendered content that isn't gated behind `.js` and a motion preference, and don't start a Motion animation from opacity 0 on first render.
- **Don't** add a sixth spring preset without asking first.
