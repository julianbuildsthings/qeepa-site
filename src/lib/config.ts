export type SiteConfig = {
  contactEmail: string;
  description: string;
  legal: { licence: string; privacy: string; refunds: string; terms: string };
  links: { checkout: string; github: string };
  name: string;
  url: string;
};

export const siteConfig: SiteConfig = {
  // The address the legal pages give for enquiries.
  contactEmail: "qeepaphotos@gmail.com",
  description:
    "A local-first photo manager for photographers who shoot in RAW. Cull, compare, and keep your edits.",
  legal: { licence: "/licence", privacy: "/privacy", refunds: "/refunds", terms: "/terms" },
  links: {
    // The Lemon Squeezy checkout every Get Qeepa control points at.
    checkout: "https://qeepa.lemonsqueezy.com/checkout/buy/dd07c7d9-27cc-4e8d-a39d-699c1e436e41",
    github: "https://github.com/julianbuildsthings/qeepa-site",
  },
  name: "Qeepa",
  url: "https://qeepa.app",
};
