export type SiteConfig = {
  contactEmail: string;
  description: string;
  legal: { privacy: string; terms: string };
  links: { github: string };
  name: string;
  url: string;
};

export const siteConfig: SiteConfig = {
  // TODO: set once a contact address exists. Empty means the footer renders a
  // page link rather than a mailto.
  contactEmail: "",
  description:
    "A local-first photo manager for photographers who shoot in RAW. Cull, compare, and keep your edits.",
  legal: { privacy: "/privacy", terms: "/terms" },
  links: { github: "https://github.com/julianbuildsthings/qeepa-site" },
  name: "Qeepa",
  // TODO: set to the production URL once the site is deployed.
  url: "",
};
