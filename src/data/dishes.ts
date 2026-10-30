export interface IngredientOption {
  id: string;
  name: string;
  color?: string;
  description?: string;
  dietary?: string[];
}

export interface DishType {
  id: string;
  name: string;
  subtitle: string;
  kitchenId: "pizzeria" | "masala-kitchen";
  description: string;
  defaultBase: string;
  defaultSauce: string;
  defaultCheeseOrMain: string;
  defaultToppings: string[];
}

export interface KitchenCustomizationConfig {
  kitchenId: "pizzeria" | "masala-kitchen";
  name: string;
  dishes: DishType[];
  bases: IngredientOption[];
  saucesOrFlavours: IngredientOption[];
  cheeseOrMains: IngredientOption[];
  toppingsOrExtras: IngredientOption[];
}

export const PIZZERIA_CONFIG: KitchenCustomizationConfig = {
  kitchenId: "pizzeria",
  name: "Pizzeria Studio",
  dishes: [
    {
      id: "classic-pizza",
      name: "Classic Pizza",
      subtitle: "The Timeless Margherita & Beyond",
      kitchenId: "pizzeria",
      description: "Artisanal stretched dough with San Marzano sauce and melted mozzarella.",
      defaultBase: "classic",
      defaultSauce: "tomato",
      defaultCheeseOrMain: "mozzarella",
      defaultToppings: ["basil"],
    },
    {
      id: "custom-pizza",
      name: "Custom Pizza",
      subtitle: "Your Flavor Canvas",
      kitchenId: "pizzeria",
      description: "Total freedom across bases, sauces, and multi-topping combinations.",
      defaultBase: "thin-crust",
      defaultSauce: "spicy-tomato",
      defaultCheeseOrMain: "mozzarella",
      defaultToppings: ["capsicum", "sweet-corn", "paneer"],
    },
    {
      id: "cheesy-garlic-bread",
      name: "Cheesy Garlic Bread",
      subtitle: "Warm, Herb-Infused Crust",
      kitchenId: "pizzeria",
      description: "Hand-kneaded garlic bread topped with herb butter and bubbly cheese.",
      defaultBase: "classic",
      defaultSauce: "creamy-herb",
      defaultCheeseOrMain: "cheddar-blend",
      defaultToppings: ["jalapenos", "basil"],
    },
  ],
  bases: [
    { id: "classic", name: "Classic Dough", color: "#E8C28A", description: "Fermented artisan dough with airy blistered crust", dietary: ["Vegetarian"] },
    { id: "thin-crust", name: "Thin Crust", color: "#D9A86E", description: "Crisp and light with a delicate cracker snap", dietary: ["Vegetarian"] },
    { id: "whole-wheat", name: "Whole Wheat", color: "#A87A4F", description: "Nutty, wholesome rustic whole-grain flour blend", dietary: ["Vegetarian", "High Fiber"] },
  ],
  saucesOrFlavours: [
    { id: "tomato", name: "San Marzano Tomato", color: "#D43827", description: "Crushed sweet Italian plum tomatoes with oregano", dietary: ["Vegan", "Gluten-Free"] },
    { id: "spicy-tomato", name: "Spicy Arrabbiata", color: "#B82216", description: "Fiery chili flakes simmered in rich garlic tomato reduction", dietary: ["Vegan", "Gluten-Free"] },
    { id: "creamy-herb", name: "Creamy Herb Pesto", color: "#8FA361", description: "Velvety basil, roasted garlic, and olive oil emulsion", dietary: ["Vegetarian"] },
  ],
  cheeseOrMains: [
    { id: "mozzarella", name: "Fior di Latte Mozzarella", color: "#F7F5EB", description: "Creamy, high-stretch fresh mozzarella shreds", dietary: ["Vegetarian"] },
    { id: "cheddar-blend", name: "Sharp Cheddar Blend", color: "#F5A623", description: "Aged sharp cheddar and Gouda for punchy depth", dietary: ["Vegetarian"] },
    { id: "none", name: "No Cheese (Marinara Style)", color: "#transparent", description: "Pure sauce and herbal olive oil focus", dietary: ["Vegan", "Dairy-Free"] },
  ],
  toppingsOrExtras: [
    { id: "onion", name: "Red Onion Rings", color: "#B33973", dietary: ["Vegan", "Gluten-Free"] },
    { id: "capsicum", name: "Bell Capsicum", color: "#489849", dietary: ["Vegan", "Gluten-Free"] },
    { id: "mushroom", name: "Button Mushrooms", color: "#8D7768", dietary: ["Vegan", "Gluten-Free"] },
    { id: "sweet-corn", name: "Golden Sweet Corn", color: "#F8CD46", dietary: ["Vegan", "Gluten-Free"] },
    { id: "olives", name: "Kalamata Olives", color: "#322E2F", dietary: ["Vegan", "Gluten-Free"] },
    { id: "paneer", name: "Spiced Paneer Cubes", color: "#FAF6EB", dietary: ["Vegetarian", "High Protein"] },
    { id: "jalapenos", name: "Pickled Jalapeños", color: "#547834", dietary: ["Vegan", "Spicy"] },
    { id: "basil", name: "Fresh Genovese Basil", color: "#2E7D32", dietary: ["Vegan", "Fresh Herb"] },
  ],
};

export const MASALA_KITCHEN_CONFIG: KitchenCustomizationConfig = {
  kitchenId: "masala-kitchen",
  name: "Masala Kitchen Studio",
  dishes: [
    {
      id: "paneer-rice-bowl",
      name: "Paneer Rice Bowl",
      subtitle: "Aromatic Basmati & Tawa Sear",
      kitchenId: "masala-kitchen",
      description: "Fragrant spiced long-grain rice layered with golden paneer and rich gravy.",
      defaultBase: "rice",
      defaultSauce: "creamy-spiced",
      defaultCheeseOrMain: "paneer",
      defaultToppings: ["onion", "herbs", "yogurt-drizzle"],
    },
    {
      id: "masala-wrap",
      name: "Masala Wrap",
      subtitle: "Street-Style Kathi Roll",
      kitchenId: "masala-kitchen",
      description: "Flaky tawa roti wrapped around seared fillings, zesty chutney, and crunchy slaw.",
      defaultBase: "roti-wrap",
      defaultSauce: "mild-masala",
      defaultCheeseOrMain: "paneer",
      defaultToppings: ["onion", "capsicum", "herbs"],
    },
    {
      id: "custom-bowl",
      name: "Custom Indian-Inspired Bowl",
      subtitle: "Your Regional Spice Story",
      kitchenId: "masala-kitchen",
      description: "Build an inventive grain or millet base with vibrant gravies and toppings.",
      defaultBase: "millet-bowl",
      defaultSauce: "tangy-tomato",
      defaultCheeseOrMain: "chickpeas",
      defaultToppings: ["capsicum", "corn", "herbs"],
    },
  ],
  bases: [
    { id: "rice", name: "Jeera Basmati Rice", color: "#F7F3E8", description: "Steamed long-grain rice tempered with toasted cumin seeds", dietary: ["Vegan", "Gluten-Free"] },
    { id: "roti-wrap", name: "Flaky Tawa Roti", color: "#DAB57E", description: "Handmade whole-wheat layered paratha charred on cast-iron", dietary: ["Vegetarian"] },
    { id: "millet-bowl", name: "Ancient Grain Millet", color: "#CBB38B", description: "Nutty slow-cooked foxtail and pearl millet blend", dietary: ["Vegan", "Gluten-Free", "High Fiber"] },
  ],
  saucesOrFlavours: [
    { id: "mild-masala", name: "Mild Roasted Masala", color: "#D66324", description: "Caramelized onion, ginger, turmeric, and warm coriander essence", dietary: ["Vegan", "Gluten-Free"] },
    { id: "tangy-tomato", name: "Tangy Tomato Makhani", color: "#C03A2B", description: "Slow-simmered tomato butter reduction with fenugreek leaves", dietary: ["Vegetarian", "Gluten-Free"] },
    { id: "creamy-spiced", name: "Velvet Cashew Spiced Sauce", color: "#D48C46", description: "Rich ground cashew paste infused with green cardamom and saffron", dietary: ["Vegetarian", "Nut-Rich"] },
  ],
  cheeseOrMains: [
    { id: "paneer", name: "Tawa Seared Paneer", color: "#FFF8EA", description: "Soft malai cottage cheese cubes browned with mild paprika", dietary: ["Vegetarian", "High Protein"] },
    { id: "chickpeas", name: "Spiced Kabul Chickpeas", color: "#D4A359", description: "Slow-braised hearty chickpeas packed with earthiness", dietary: ["Vegan", "High Protein", "Gluten-Free"] },
    { id: "mixed-vegetables", name: "Charred Farm Vegetables", color: "#788E44", description: "Broccoli, baby corn, zucchini, and carrots flash-seared", dietary: ["Vegan", "Gluten-Free"] },
  ],
  toppingsOrExtras: [
    { id: "onion", name: "Pickled Lachha Onions", color: "#C4417C", dietary: ["Vegan", "Gluten-Free"] },
    { id: "capsicum", name: "Stir-Fried Capsicum", color: "#489849", dietary: ["Vegan", "Gluten-Free"] },
    { id: "corn", name: "Roasted Sweet Corn", color: "#F8CD46", dietary: ["Vegan", "Gluten-Free"] },
    { id: "herbs", name: "Fresh Coriander & Mint", color: "#2E7D32", dietary: ["Vegan", "Fresh"] },
    { id: "yogurt-drizzle", name: "Cooling Spiced Mint Raita", color: "#E8EFE5", dietary: ["Vegetarian", "Cooling"] },
  ],
};

