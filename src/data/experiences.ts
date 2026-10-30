export interface Experience {
  id: "play" | "create" | "unleash";
  code: string;
  name: string;
  subtitle: string;
  pricePerPerson: number;
  priceFormatted: string;
  duration: string;
  badge?: string;
  isSignature?: boolean;
  description: string;
  features: string[];
  idealFor: string;
  sampleDishes: string[];
  colorTheme: {
    accent: string;
    border: string;
    badgeBg: string;
    badgeText: string;
    lightBg: string;
  };
}

export const EXPERIENCES: Experience[] = [
  {
    id: "play",
    code: "EXPERIENCE 01",
    name: "PLAY",
    subtitle: "Pick a Dish",
    pricePerPerson: 599,
    priceFormatted: "₹599/person",
    duration: "1–2 hours",
    description:
      "Pick a dish, follow a guided recipe, and create something delicious together.",
    features: [
      "Curated recipe selection",
      "Pre-measured ingredients",
      "Guided cooking",
      "Beginner-friendly experience",
      "Private group kitchen",
    ],
    idealFor: "First-timers, casual friend hangouts, relaxed dates",
    sampleDishes: [
      "Handcrafted Neapolitan Margherita Pizza",
      "Fresh Handmade Fettuccine al Limone",
      "Smoked Velvet Butter Chicken Bowl",
      "Warm Cinnamon Churros with Salted Dulce",
    ],
    colorTheme: {
      accent: "#FF6B3D",
      border: "hover:border-flame/40",
      badgeBg: "bg-flame/10",
      badgeText: "text-flame-dark",
      lightBg: "bg-cream-100",
    },
  },
  {
    id: "create",
    code: "EXPERIENCE 02",
    name: "CREATE",
    subtitle: "Build Your Plate",
    pricePerPerson: 799,
    priceFormatted: "₹799/person",
    duration: "2–3 hours",
    badge: "Signature Experience",
    isSignature: true,
    description:
      "Choose your ingredients, experiment with flavours, and build a dish that's uniquely yours.",
    features: [
      "Customizable ingredients",
      "Creative cooking freedom",
      "Approved ingredient selection",
      "Optional culinary guidance",
      "Mystery Box experiences as a future offering",
    ],
    idealFor: "Creative foodie groups, birthday celebrations, double dates",
    sampleDishes: [
      "Custom Glazed Bao Buns & Fusion Slaws",
      "Build-Your-Own Artisanal Flatbread Lab",
      "Street-Style Tacos with DIY Salsas & Crema",
      "Saffron & Wild Mushroom Risotto Experiment",
    ],
    colorTheme: {
      accent: "#8C1538",
      border: "border-burgundy/40 shadow-burgundyGlow/10",
      badgeBg: "bg-burgundy",
      badgeText: "text-white",
      lightBg: "bg-burgundy-subtle",
    },
  },
  {
    id: "unleash",
    code: "EXPERIENCE 03",
    name: "UNLEASH",
    subtitle: "Your Kitchen",
    pricePerPerson: 1099,
    priceFormatted: "₹1,099/person",
    duration: "2–3 hours",
    description:
      "Got your own recipe? Bring your idea to life in a private kitchen.",
    features: [
      "Submit your recipe in advance",
      "Ingredient and equipment review",
      "Custom ingredient preparation",
      "Greater creative freedom",
      "Culinary assistance available",
    ],
    idealFor: "Passionate home cooks, family secret recipes, group challenge nights",
    sampleDishes: [
      "Family Heirloom Biryani or Pasta Tradition",
      "Experimental Multi-course Dinner for Friends",
      "Custom Pastry or Cake Celebration Creation",
      "Content Creator Recipe Cook-off",
    ],
    colorTheme: {
      accent: "#211A19",
      border: "hover:border-charcoal/40",
      badgeBg: "bg-charcoal/10",
      badgeText: "text-charcoal",
      lightBg: "bg-cream-200/60",
    },
  },
];

