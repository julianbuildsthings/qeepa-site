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

## Unresolved

- "Shoot Insights" (feature row 4) is not evidenced in the app's feature audit,
  and filtering by export status in row 5 is likewise unverified. Both are
  recorded as unconfirmed in PRODUCT.md and must not be demonstrated as
  shipping features until checked.
- No logomark exists; the header is the wordmark alone.
