import { NextResponse } from "next/server";
import { getAuthenticatedSession } from "@/lib/auth";
import { saveCreation, getSavedCreationsByUserId } from "@/lib/pilotService";

export async function GET() {
  try {
    const session = await getAuthenticatedSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const creations = await getSavedCreationsByUserId(session.id);
    return NextResponse.json({ creations });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to fetch creations." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getAuthenticatedSession();
    if (!session) {
      return NextResponse.json({ error: "Please sign in to save creations." }, { status: 401 });
    }

    const body = await req.json();
    const { dishName, kitchenId, dishId, base, sauce, cheeseOrMain, toppings, dietaryTags } = body;

    if (!dishName || !kitchenId || !dishId || !base || !sauce) {
      return NextResponse.json(
        { error: "Missing required creation components." },
        { status: 400 }
      );
    }

    const creation = await saveCreation({
      userId: session.id,
      dishName: dishName.trim(),
      kitchenId,
      dishId,
      base,
      sauce,
      cheeseOrMain: cheeseOrMain || "",
      toppings: Array.isArray(toppings) ? toppings : [],
      dietaryTags: Array.isArray(dietaryTags) ? dietaryTags : [],
    });

    return NextResponse.json({ success: true, creation });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to save creation." }, { status: 500 });
  }
}

