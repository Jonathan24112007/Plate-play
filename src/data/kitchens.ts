export interface Kitchen {
  id: string;
  name: string;
  slug: string;
  subtitle: string;
  heroTagline: string;
  status: "Planned pilot kitchen" | "Future experience";
  isPilot: boolean;
  tagline: string;
  description: string;
  theme: string;
  exampleDishes: string[];
  highlights: string[];
  equipment: string[];
  image: string;
  imageAlt: string;
  color: string;
}

export const KITCHENS: Kitchen[] = [
  {
    id: "pizzeria",
    name: "Pizzeria",
    slug: "pizzeria",
    subtitle: "Dough, Flame & Crust",
    heroTagline: "Stretch it. Top it. Make it yours.",
    theme: "Artisanal Italian & High-Heat Stone Baking",
    exampleDishes: [
      "Classic Margherita with Fresh Basil",
      "Spicy Arrabbiata & Herb Flatbread",
      "Cheesy Garlic Pull-Apart Bread",
      "Custom Four-Cheese Flame Pizza",
    ],
    status: "Planned pilot kitchen",
    isPilot: true,
    tagline: "Pizza, dough, toppings, pasta-inspired creations.",
    description:
      "Hand-stretch your dough, layer house-made crushed tomato sauces, sprinkle fresh mozzarella, and watch blistered crusts rise in dedicated high-heat pizza ovens.",
    highlights: [
      "Fermented artisan dough",
      "Crushed San Marzano sauces",
      "Specialty cheeses & herbs",
      "High-temperature stone baking",
    ],
    equipment: [
      "Stone-deck pizza oven",
      "Handmade wooden peels",
      "Dough proofing stations",
      "Rotary herb cutters",
    ],
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80",
    imageAlt:
      "Fresh artisanal pizza with basil and molten cheese on a warm rustic board",
    color: "#FF6B3D",
  },
  {
    id: "masala-kitchen",
    name: "Masala Kitchen",
    slug: "masala-kitchen",
    subtitle: "Aromatic & Bold Spices",
    heroTagline: "Spice it up. Mix it your way.",
    theme: "Regional Indian Spices & Tawa Cooking",
    exampleDishes: [
      "Smoked Paneer & Jeera Rice Bowl",
      "Street-Style Tawa Masala Wrap",
      "Custom Spiced Dal & Millet Bowl",
      "Cast-Iron Garlic Naan Pizzettes",
    ],
    status: "Planned pilot kitchen",
    isPilot: true,
    tagline: "Indian cooking, spices, familiar favourites, and creative twists.",
    description:
      "Toast whole spices, unlock layered gravies, sear on heavy cast-iron tawas, and craft authentic or modern regional flavours together.",
    highlights: [
      "Whole spice tempering bar",
      "Rich slow-cooked gravies",
      "Cast-iron tawa flatbreads",
      "Regional chaat & modern twists",
    ],
    equipment: [
      "Heavy cast iron tawas",
      "Brass spice dabbis",
      "High-BTU flame burners",
      "Clay pot simmering gear",
    ],
    image:
      "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1200&q=80",
    imageAlt:
      "Fragrant spices and Indian culinary dishes in vibrant brass bowls",
    color: "#8C1538",
  },
  {
    id: "the-wok",
    name: "The Wok",
    slug: "the-wok",
    subtitle: "High Heat & Fresh Aromatics",
    heroTagline: "Big flavours. Bold experiments.",
    theme: "East & Southeast Asian Street Wok Traditions",
    exampleDishes: [
      "Hand-Pleated Truffle Dim Sums",
      "Smoky Wok-Tossed Chili Garlic Noodles",
      "Custom Crispy Tofu & Asian Greens Stir Fry",
      "Fire-Cracked Pepper Fried Rice",
    ],
    status: "Future experience",
    isPilot: false,
    tagline: "Asian-inspired cooking experiences.",
    description:
      "Master the art of high-heat wok tossing, steam delicate handmade dim sums, and balance fiery, savoury, and umami glaze profiles.",
    highlights: [
      "Wok hei high-heat tossing",
      "Hand-pleated dim sum stations",
      "Chili crunch & umami oils",
      "Noodle & broth assemblies",
    ],
    equipment: [
      "Round-bottom carbon steel woks",
      "Multi-tier bamboo steamers",
      "Wok burner rings",
      "Cleaver prep stations",
    ],
    image:
      "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=1200&q=80",
    imageAlt:
      "Dynamic wok stir fry with fresh crisp vegetables and glistening glaze",
    color: "#FF6B3D",
  },
  {
    id: "bakehouse",
    name: "Bakehouse",
    slug: "bakehouse",
    subtitle: "Sweet Arts & Warm Ovens",
    heroTagline: "Whisk. Bake. Create.",
    theme: "Artisan Pastry, Cakes & Sweet Confections",
    exampleDishes: [
      "Molten Chocolate Lava Pots",
      "Rustic Seasonal Berry Galettes",
      "Flaky Cinnamon Brioche Scrolls",
      "Build-Your-Own Cupcake & Ganache Lab",
    ],
    status: "Future experience",
    isPilot: false,
    tagline: "Desserts, pastries, cakes, and baking experiences.",
    description:
      "Whisk velvety batters, pipe delicate pastries, master chocolate ganache, and fill your kitchen with the irresistible scent of fresh-baked indulgence.",
    highlights: [
      "Artisan pastry piping",
      "Tempered chocolate glazes",
      "Fresh fruit tartlets",
      "Warm brioche & cookie bars",
    ],
    equipment: [
      "Professional stand mixers",
      "Precision convection ovens",
      "Marble confectionery slabs",
      "Silicone pastry molds",
    ],
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80",
    imageAlt:
      "Warm freshly baked artisan pastries dusted with fine sugar",
    color: "#8C1538",
  },
];
