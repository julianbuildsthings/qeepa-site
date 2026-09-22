export type SiteConfig = {
  contactEmail: string;
  description: string;
  legal: { acceptableUse: string; privacy: string; terms: string };
  links: { github: string };
  name: string;
  url: string;
};

export const siteConfig: SiteConfig = {
  // The address the legal pages give for enquiries.
  contactEmail: "qeepaphotos@gmail.com",
  description:
    "A local-first photo manager for photographers who shoot in RAW. Cull, compare, and keep your edits.",
  legal: { acceptableUse: "/acceptable-use", privacy: "/privacy", terms: "/terms" },
  links: { github: "https://github.com/julianbuildsthings/qeepa-site" },
  name: "Qeepa",
  url: "https://qeepa.app",
};
