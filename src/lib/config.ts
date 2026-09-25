export type SiteConfig = {
  contactEmail: string;
  description: string;
  legal: {
    acceptableUse: string;
    licence: string;
    privacy: string;
    refunds: string;
    terms: string;
  };
  links: { github: string };
  name: string;
  url: string;
};

export const siteConfig: SiteConfig = {
  // The address the legal pages give for enquiries.
  contactEmail: "qeepaphotos@gmail.com",
  description:
    "A local-first photo manager for photographers who shoot in RAW. Cull, compare, and keep your edits.",
  legal: {
    acceptableUse: "/acceptable-use",
    licence: "/licence",
    privacy: "/privacy",
    refunds: "/refunds",
    terms: "/terms",
  },
  links: { github: "https://github.com/julianbuildsthings/qeepa-site" },
  name: "Qeepa",
  url: "https://qeepa.app",
};
