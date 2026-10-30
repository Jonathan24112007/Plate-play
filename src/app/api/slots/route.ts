import { NextResponse } from "next/server";
import { getSlotsForDate, getKitchens } from "@/lib/pilotService";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const kitchenIdOrSlug = searchParams.get("kitchenId");
    const date = searchParams.get("date"); // YYYY-MM-DD

    if (!kitchenIdOrSlug || !date) {
      return NextResponse.json(
        { error: "kitchenId and date parameters are required" },
        { status: 400 }
      );
    }

    const kitchens = await getKitchens();
    const matchedKitchen = kitchens.find(
      (k) => k.slug === kitchenIdOrSlug || k.id === kitchenIdOrSlug
    );

    const kitchenId = matchedKitchen ? matchedKitchen.id : kitchenIdOrSlug;
    const slots = await getSlotsForDate(kitchenId, date);

    return NextResponse.json({
      success: true,
      kitchenId,
      date,
      slots,
    });
  } catch (error: any) {
    console.error("[Slots API] Error:", error);
    return NextResponse.json({ error: "Failed to load slots" }, { status: 500 });
  }
}

