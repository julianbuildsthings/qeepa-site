export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  author: {
    name: string;
    url: string;
  };
  links: {
    github: string;
  };
  navItems: {
    href: string;
    label: string;
    external?: boolean;
  }[];
};

export const siteConfig: SiteConfig = {
  name: "Qeepa",
  description:
    "Qeepa is the photo workflow app for managing shoots from RAW capture to final deliverable.",
  // TODO: set to the production URL once the site is deployed.
  url: "",
  author: {
    // TODO: replace with the display name you want in the footer.
    name: "julianbuildsthings",
    url: "https://github.com/julianbuildsthings",
  },
  links: {
    github: "https://github.com/julianbuildsthings/qeepa-site",
  },
  // Add real landing-page sections as they're built, e.g.:
  //   { href: "/#features", label: "Features" },
  //   { href: "/#pricing", label: "Pricing" },
  navItems: [],
};
