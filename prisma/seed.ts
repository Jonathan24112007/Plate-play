import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding PlatePlay v0.3 data...");

  // Seed Kitchens
  const pizzeria = await prisma.kitchen.upsert({
    where: { slug: "pizzeria" },
    update: {},
    create: {
      slug: "pizzeria",
      name: "Pizzeria Studio",
      description: "Stone ovens, artisanal dough, and blistered crusts.",
      status: "ACTIVE",
    },
  });

  const masala = await prisma.kitchen.upsert({
    where: { slug: "masala-kitchen" },
    update: {},
    create: {
      slug: "masala-kitchen",
      name: "Masala Kitchen",
      description: "Vibrant whole spices, cast-iron skillets, and modern Indian bowls.",
      status: "ACTIVE",
    },
  });

  await prisma.kitchen.upsert({
    where: { slug: "the-wok" },
    update: {},
    create: {
      slug: "the-wok",
      name: "The Wok",
      description: "High-heat stir fry, noodle tossing, and signature dumpling steamers.",
      status: "COMING_SOON",
    },
  });

  await prisma.kitchen.upsert({
    where: { slug: "bakehouse" },
    update: {},
    create: {
      slug: "bakehouse",
      name: "Bakehouse",
      description: "Precision patisserie, artisan pastry laminations, and chocolate labs.",
      status: "COMING_SOON",
    },
  });

  // Seed Experience Packages
  await prisma.experiencePackage.upsert({
    where: { slug: "play" },
    update: { pricePerPersonPaise: 59900 },
    create: {
      slug: "play",
      name: "PLAY",
      pricePerPersonPaise: 59900,
      durationMinutes: "1–2 hours",
      description: "Pick a dish, follow a guided recipe, and create something delicious together.",
      active: true,
    },
  });

  await prisma.experiencePackage.upsert({
    where: { slug: "create" },
    update: { pricePerPersonPaise: 79900 },
    create: {
      slug: "create",
      name: "CREATE",
      pricePerPersonPaise: 79900,
      durationMinutes: "2–3 hours",
      description: "Choose your ingredients, experiment with flavours, and build a dish that's uniquely yours.",
      active: true,
    },
  });

  await prisma.experiencePackage.upsert({
    where: { slug: "unleash" },
    update: { pricePerPersonPaise: 109900 },
    create: {
      slug: "unleash",
      name: "UNLEASH",
      pricePerPersonPaise: 109900,
      durationMinutes: "2–3 hours",
      description: "Got your own recipe? Bring your idea to life in a private kitchen with advance ingredient prep.",
      active: true,
    },
  });

  // Seed SiteConfig for Operating Mode
  await prisma.siteConfig.upsert({
    where: { key: "OPERATING_MODE" },
    update: {},
    create: {
      key: "OPERATING_MODE",
      value: "DEMO",
    },
  });

  console.log("Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

