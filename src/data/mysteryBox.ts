export interface MysteryIngredient {
  id: string;
  name: string;
  category: "Fat & Richness" | "Acid & Zing" | "Umami & Earth" | "Sweet & Floral" | "Crunch & Texture" | "Heat & Spice";
  flavorProfile: string;
  chefHint: string;
  iconColor: string;
}

export interface MysteryChallenge {
  id: string;
  title: string;
  prompt: string;
  focus: string;
}

export const MYSTERY_INGREDIENTS_POOL: MysteryIngredient[] = [
  {
    id: "smoked-truffle-butter",
    name: "Smoked Truffle Butter",
    category: "Fat & Richness",
    flavorProfile: "Woody, earthy, decadent dairy richness",
    chefHint: "Melt at the final seconds over hot starch or charred dough.",
    iconColor: "#FF6B3D",
  },
  {
    id: "dragonfruit-yuzu-coulis",
    name: "Dragonfruit & Yuzu Coulis",
    category: "Acid & Zing",
    flavorProfile: "Vibrant electric magenta, citrus punch with mild sweetness",
    chefHint: "Use as an artistic finishing drizzle to cut heavy gravies or cheeses.",
    iconColor: "#FFB8C8",
  },
  {
    id: "artisanal-burrata",
    name: "Hand-Pulled Burrata",
    category: "Fat & Richness",
    flavorProfile: "Velvety stracciatella, fresh sweet cream",
    chefHint: "Tear open fresh at room temperature for dramatic plate appeal.",
    iconColor: "#FFF7F0",
  },
  {
    id: "hot-honey-drizzle",
    name: "Chili-Infused Wildflower Honey",
    category: "Heat & Spice",
    flavorProfile: "Amber sweetness followed by a tingling habanero burn",
    chefHint: "Drizzle over crisp savory crusts or savory paneer skewers.",
    iconColor: "#FF6B3D",
  },
  {
    id: "black-garlic-paste",
    name: "Aged Black Garlic Puree",
    category: "Umami & Earth",
    flavorProfile: "Balsamic-molasses undertones, deep caramelized savoriness",
    chefHint: "Whisk into reductions or spread directly beneath cheese layers.",
    iconColor: "#211A19",
  },
  {
    id: "salted-pistachio-crumble",
    name: "Roasted Salted Pistachio Crumble",
    category: "Crunch & Texture",
    flavorProfile: "Nutty, sea-salted crunch with vibrant green hues",
    chefHint: "Scatter across the rim or center for essential textural contrast.",
    iconColor: "#8FA361",
  },
  {
    id: "saffron-threads",
    name: "Kashmiri Mongra Saffron",
    category: "Sweet & Floral",
    flavorProfile: "Warm hay, floral honey aroma, vivid golden tint",
    chefHint: "Bloom in two tablespoons of warm liquid before incorporating.",
    iconColor: "#F5A623",
  },
  {
    id: "lotus-stem-crisps",
    name: "Spiced Lotus Stem Chips",
    category: "Crunch & Texture",
    flavorProfile: "Delicate geometric wheel crisps with chaat seasoning",
    chefHint: "Use as an edible crown or dipping scoop for layered plates.",
    iconColor: "#DAB57E",
  },
  {
    id: "kaffir-lime-oil",
    name: "Cold-Pressed Kaffir Lime Leaf Oil",
    category: "Acid & Zing",
    flavorProfile: "Pungent citrus aroma, herbal brightness",
    chefHint: "Two drops onto warm steam releases an intoxicating table aroma.",
    iconColor: "#489849",
  },
  {
    id: "gorgonzola-crema",
    name: "Whipped Mountain Gorgonzola",
    category: "Fat & Richness",
    flavorProfile: "Piquant, salty blue cheese whipped to cloud-like foam",
    chefHint: "Dot sparingly to create bold flavour bursts against sweet sauces.",
    iconColor: "#ECD9C7",
  },
];

export const MYSTERY_CHALLENGES: MysteryChallenge[] = [
  {
    id: "challenge-contrast",
    title: "The Sweet & Savory Balance",
    prompt: "Create an unexpected fusion plate where the sweet element elevates the savory base without overpowering it.",
    focus: "Flavour Harmony",
  },
  {
    id: "challenge-texture",
    title: "Texture Odyssey",
    prompt: "Design a dish featuring distinct crunch, velvet richness, and an aromatic liquid component in a single bite.",
    focus: "Mouthfeel & Plating",
  },
  {
    id: "challenge-comfort",
    title: "Reinvented Comfort Classic",
    prompt: "Take a familiar street food or comfort classic and transform it into a high-end showstopper using your three mystery wildcards.",
    focus: "Creative Reinvention",
  },
  {
    id: "challenge-color",
    title: "The Visual Showstopper",
    prompt: "Plate a dish that looks as breathtaking as it tastes, using your wildcards to create striking visual contrast and drama.",
    focus: "Aesthetic Plating",
  },
];

export function getRandomMysterySet(): {
  ingredients: MysteryIngredient[];
  challenge: MysteryChallenge;
} {
  const shuffled = [...MYSTERY_INGREDIENTS_POOL].sort(() => 0.5 - Math.random());
  const selectedIngredients = shuffled.slice(0, 3);
  const randomChallenge =
    MYSTERY_CHALLENGES[Math.floor(Math.random() * MYSTERY_CHALLENGES.length)];

  return {
    ingredients: selectedIngredients,
    challenge: randomChallenge,
  };
}

