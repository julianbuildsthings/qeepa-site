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
  headline: ["Picking your keepers", "shouldn’t feel", "like a chore."],
  lede: "Qeepa is a modern, local-first photo manager for photographers who shoot in RAW and want to seamlessly sort through their photos. Cull, compare, and keep your edits.",
};

export const features: FeatureCopy[] = [
  {
    body: "RAWs, exports and edits of the same shot are automatically bunched together as tracks. Switch between them instantly, compare the differences, and move through your shoots without ever digging around in folders.",
    heading: "Photo tracks",
    id: "tracks",
    subheading: "Every version of a photo, together.",
  },
  {
    body: "Qeepa works directly with the photos already on your Mac. Because we don’t touch your files, it works alongside tools such as Lightroom, FastRawViewer, Affinity and everywhere you can work with your beautiful photos. It’s basically Finder on steroids, built with photographers in mind.",
    heading: "Local-first",
    id: "local-first",
    subheading: "No accounts, no cloud subscription, and no touching your photos.",
  },
  {
    body: "Large shoots stay quick to browse, scroll, and revisit without staring at a loading icon waiting for massive RAW files to open. JPEG previews and caching keep everything snappy and responsive.",
    heading: "Fast performance",
    id: "performance",
    subheading: "Built to work with thousands of photos without skipping a beat.",
  },
  {
    body: "Qeepa shows you the most frequently used camera settings and gear for every shoot. Better yet, you can filter by the photos you kept or delivered to clients, so you can understand what settings made your photos stick.",
    heading: "Shoot insights",
    id: "insights",
    subheading: "Understand how you shoot and what you kept.",
  },
  {
    body: "Filter a shoot by rating and export status to surface files that may no longer need to take up space. Reveal the results in Finder, review them in context and decide for yourself what stays or goes. Qeepa helps you find the files; it never deletes them for you.",
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
    { href: "/contact", label: "Contact" },
  ],
};
