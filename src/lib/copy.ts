/**
 * Every string on the page, in one place, so it can be diffed against the
 * approved brief and guarded by copy.test.ts.
 *
 * Two things the tests enforce and a future edit must not break: apostrophes
 * are curly, and nothing here invents a price, a date or social proof. The
 * product is pre-release — PRODUCT.md lists what actually exists.
 *
 * Each feature's `heading` and `subheading` form a two-tier heading. The
 * subheading is never rendered as a small label above the heading; a kicker is
 * banned on this page.
 */
export type FeatureCopy = {
  body: string;
  heading: string;
  id: string;
  subheading: string;
};

export const hero = {
  /** The 1440px rag. Rendered joined so it rewraps at narrower widths. */
  headline: ["Choosing your keepers", "shouldn’t feel", "like a chore."],
  lede: "Qeepa is a modern, local-first photo manager for photographers who shoot in RAW and want to seamlessly sort through their photos. Cull, compare, and keep your edits all in one place.",
};

export const features: FeatureCopy[] = [
  {
    body: "RAWs, exports and edits of the same shot are automatically bunched together as tracks. Compare them seamlessly and navigate through your shoots without digging around folders.",
    heading: "Photo tracks",
    id: "tracks",
    subheading: "Every version of a photo, together.",
  },
  {
    body: "Qeepa works directly with the photos already on your Mac. Because we don’t touch your files, it’s cross-compatible with almost anything.",
    heading: "Local-first",
    id: "local-first",
    subheading: "No accounts or cloud subscriptions.",
  },
  {
    body: "Large shoots stay quick to browse, scroll, and revisit, without staring at a loading icon all day.",
    heading: "Fast performance",
    id: "performance",
    subheading: "Handles thousands of photos seamlessly.",
  },
  {
    body: "Qeepa shows you the most frequently used camera settings and gear for every shoot, so you understand what sticks.",
    heading: "Shoot insights",
    id: "insights",
    subheading: "Understand how you shoot and what you kept.",
  },
  {
    body: "Filter your shoots by ratings and tags to manage your shoots and show the pics you care about.",
    heading: "Photo management",
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
    { href: "/acceptable-use", label: "Acceptable Use Policy" },
  ],
};
