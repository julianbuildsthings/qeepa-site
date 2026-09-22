---
version: 1
slug: "src-pages-index-astro"
primary_target: "src/pages/index.astro"
related_targets: []
---

Scope: the Qeepa marketing landing page (`src/pages/index.astro`) — hero,
five feature rows, closing availability section, footer. Visitor mode:
**Persuade**.

Audience: photographers who shoot RAW and cull large shoots on their own Mac.
Job on this page: decide whether Qeepa is worth waiting for. Action: none —
the product is pre-release, so the page ends in a status, not a CTA. Proof is
the product demonstrating itself; there are no testimonials, prices, dates or
benchmarks, and none may be invented.

## Direction contract

THESIS: This page owns "every version of a photo, together" and proves it by
showing the product's own sunlit gallery rather than describing it. It refuses
the arrangement Mac-utility sites default to — centred hero, framed screenshot
floating on a plinth, then a grid of equal feature cards. Copy ranges left on a
single rail at x=120; the product is cropped by the fold rather than presented
as an object; every feature gets a full row, never a card.

OWN-WORLD: White ground. One warm family, `#FFFDFA` through `#C06E2C` —
sunbleached, apricot, blush, honey, peach, amber, clay, terracotta — and
nothing outside it except the three functional track dots (`--color-raw`,
`--color-jpg`, `--color-af`), which are the page's only non-warm colour and
earn it by carrying meaning. Satoshi Bold for display (80/84 at hero,
44/48 at feature headings, −0.038em / −0.032em); Erode for the wordmark alone.
Body Satoshi 400 at 17–19px, measure capped so it never exceeds the display
line above it. Shadows always two-layer and warm-tinted, never neutral grey.
Photo frames: 5–12px radius, near-vertical gradients (170–192°) with a
warm-white bloom from upper-left. The track pill — white, hairline border,
peach sliding fill, coloured dot plus label — is the recurring component and
appears in the hero and in at least two feature rows.

STORY: The visitor understands that Qeepa is a local-first Mac app that groups
every version of a shot into tracks and makes culling fast. They come to
believe it is made with care and will not touch their files. They do nothing —
they reach the availability status, learn it is coming to macOS as a one-time
purchase, and leave knowing the name.

FIRST VIEWPORT: Wordmark "Qeepa." in Erode 24/600 at x=120, y=33, over a
hairline rule at y=96 spanning full width. Headline Satoshi 700 at 80/84,
x=120, y=168, three lines ragged long-over-short ("Picking your keepers /
shouldn't feel / like a chore."). Lede Satoshi 400 at 19/30, x=120, y=464,
constrained to 716px so its right edge matches the headline's first line.
App window x=120 to x=1320 from y=596, running past the fold uncropped-bottom,
carrying a 5-wide grid of warm gradient tiles at 223×149 and the track pill
floating over the grid with RAW active. No CTA, no availability, no nav, no
eyebrow anywhere on the page.

FORM: Left rail with hard-cropped product — candidate 4 of 7 on the ordered
structural list, dealt as the lead by seed key `945ca8fd`
(`--scope surface --mode persuade`), then refined through four typographic
variants; variant 1A (Satoshi display) chosen. Feature rows alternate
orientation starting with the visual on the left at row one (the approved T3
"stack" treatment), and no row uses a single large gradient as its visual —
at feature scale a bare gradient reads as a colour wash, so structure comes
from multiple frames or app chrome.

FINISH: unreviewed and undocumented is unfinished; this build ends with the
finish review, the verdict, DESIGN.md, and every shipping raster carrying its
provenance.

## Amendments (2026-09-22)

The contract above is the direction as first committed. The user then
reviewed the build over several rounds and approved the following, which
supersede the contract wherever they conflict. A finish review should judge
against these, not flag them as drift.

- **Type scale, down.** The user found the copy "too big and zoomed in".
  Headline `clamp(34px, 4.7vw, 62px)`, feature heading `clamp(26px, 2.4vw,
  34px)`, subheading `clamp(17px, 1.4vw, 20px)`, body 15px, lede 16px capped at
  560px. The 80/84 and 44/48 figures above no longer apply.
- **Material: flat, light tones with metadata chrome, not gradients.** The
  gradient tiles were rejected as immature and jarring; the user then asked
  explicitly for lighter tones and called the darker oranges heavy-handed. The
  family in use is the light end only (`src/lib/tones.ts`, lightness ~93–98%),
  carrying a track dot, rating pips and frame number (approved Paper artboard
  `G-B · Preview chrome`). The fast-performance strip and local-first
  thumbnails are bare tones by request.
- **Header: the app's floating bar, not a wordmark over a rule.** White browse
  state over the hero ("Qeepa · 10 photos"); peach-light selection state inside
  a feature, naming it and its count. Five centred stars, the nth feature fills
  n, each a link to its section. A disabled "Get Qeepa". Feature names set in
  Erode, matching the app's bar at the user's request. At the closing it stays
  in the selection state with all five stars lit and names "Qeepa", with no
  count. No Features menu.
- **Ratings are squares everywhere on the page content.** The local-first
  listing uses the frames' rating pips, not stars; stars appear only in the bar.
- **Hero window is complete, not cropped by the fold.** Its height clamp was
  removed so the track pill sits on the true centre of row two at every width.
- **Rows stack below xl (1280), not lg.** At 1024 the copy column measured
  287px.
- **Fast performance** is the hero's window, scrolling continuously; its bar
  count is the shoot (1127), deliberately larger than the frames drawn.
- **Closing** is type only and centred, per the approved plan; no stand-in
  icon.
- **The track pill** appears in the hero and the Photo tracks row. Adding it to
  further rows is open, not required.

## Unresolved

- ~~"Shoot Insights" is not evidenced~~ — confirmed shipped (`summarise()` in
  the app's `src/utils/photo-metadata.ts`). Filtering by export status is
  confirmed not shipped; the copy no longer claims it.
- No logomark exists.
- Resolved with the user after the finish review:
  - Photo management body now reads "…to manage your shoots and show the pics
    you care about." (was "…clear out files you no longer need").
  - Track frames are one shot in three formats: 522.CR3 / 522.JPG /
    522.afphoto. Guarded in `TrackStack.test.tsx`.
  - Active track pill label darkened to `#5C300C` (APCA Lc 63.5; was 58.6).
  - The filtered Photo management panel's empty lower half: kept as is.
  - The track pill stays in the hero and Photo tracks only: kept as is.
- Still open: the Photo management subheading "Clear out clutter …" and the
  Shoot insights "what you kept" were not revisited; the body copy was the
  change asked for.
