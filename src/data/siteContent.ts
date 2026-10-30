export interface NavItem {
  label: string;
  href: string;
}

export const BRAND = {
  name: "PlatePlay",
  tagline: "Cook · Create · Connect",
  subHeadline: "Your people. Your kitchen. Your creation.",
  heroPitch:
    "Book a private kitchen, cook something amazing, and turn an ordinary outing into a story worth sharing.",
  philosophyStatement:
    "Restaurants let you eat. Cooking classes let you learn. PlatePlay lets you create.",
  taglineStatement: "Life's too short for boring plans.",
  oneLineSummary: "One booking = One private kitchen = One group.",
  copyright: `© ${new Date().getFullYear()} PlatePlay. All rights reserved.`,
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "#hero" },
  { label: "The Concept", href: "#concept" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Experiences", href: "#experiences" },
  { label: "Kitchens", href: "#kitchens" },
  { label: "About", href: "#about" },
  { label: "FAQ", href: "#faq" },
];

