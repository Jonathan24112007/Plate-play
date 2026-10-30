import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getAllBookings } from "@/lib/pilotService";

export async function GET() {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const allBookings = await getAllBookings();
    // Operations focuses on approved and active sessions
    const sessions = allBookings
      .filter((b) => b.status === "APPROVED" || b.status === "PENDING")
      .map((b) => {
        // Derive categorized inventory
        const isPizza = b.kitchenId.includes("pizzeria");
        const isMasala = b.kitchenId.includes("masala");

        const coreInventory = isPizza
          ? [
              "Fermented artisan pizza dough (pre-portioned)",
              "San Marzano crushed tomato sauce",
              "Fior di latte fresh mozzarella",
              "Extra virgin olive oil & sea salt flakes",
            ]
          : isMasala
          ? [
              "Aged long-grain basmati rice",
              "Whole spices (cardamom, cinnamon, cloves, cumin)",
              "House ginger-garlic aromatics & desi ghee",
              "Tawa flatbread dough balls",
            ]
          : ["Standard pantry staples & seasoning kit"];

        const specialtyInventory = isPizza
          ? [
              "White truffle drizzle & aged balsamic glaze",
              "Buffalo mozzarella pearls",
              "Fresh hydroponic basil & chili honey",
            ]
          : isMasala
          ? [
              "Saffron-infused rose water essence",
              "Kashmiri degi mirch & smoked paprika blend",
              "Toasted sesame seeds & fried shallot crisps",
            ]
          : ["Specialty culinary finishing touches"];

        const onDemandInventory = b.customDishDetails
          ? [
              `Custom request: ${b.customDishDetails}`,
              "Allergen-isolated cutting board & utensils",
            ]
          : ["Standard group prep (no custom ingredients requested)"];

        const equipment = isPizza
          ? [
              "Stone-deck high-heat pizza oven (pre-heated to 380°C)",
              "Artisan perforated pizza peels & cutters",
              "Bench scrapers & semolina dusting trays",
            ]
          : isMasala
          ? [
              "Commercial induction woks & heavy cast-iron tawas",
              "Spice toasting skillets & mortar-pestles",
              "Copper-bottom serving handis",
            ]
          : ["Induction stations & professional chef knives"];

        return {
          id: b.id,
          publicReference: b.publicReference,
          customerName: b.customerName,
          customerEmail: b.customerEmail,
          customerPhone: b.customerPhone,
          kitchenName: b.kitchenName,
          packageName: b.packageName,
          groupSize: b.groupSize,
          slotDate: b.slotDate,
          slotTime: b.slotTime,
          status: b.status,
          occasion: b.occasion,
          dietaryRequirements: b.dietaryRequirements,
          dietaryNotes: b.dietaryNotes,
          customDishDetails: b.customDishDetails,
          unleashReview: b.unleashReview,
          checklist: b.operationalChecklist || {
            coreIngredientsReady: false,
            specialtyIngredientsReady: false,
            onDemandIngredientsReady: false,
            equipmentSanitized: false,
            workstationSet: false,
            safetyBriefingCompleted: false,
            sessionCompleted: false,
            cleaningResetDone: false,
          },
          inventory: {
            core: coreInventory,
            specialty: specialtyInventory,
            onDemand: onDemandInventory,
            equipment,
          },
        };
      });

    return NextResponse.json({ sessions });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to load operations data." }, { status: 500 });
  }
}

