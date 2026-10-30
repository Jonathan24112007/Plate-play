import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAllSlots, addSlot } from "@/lib/pilotService";
import { z } from "zod";

const createSlotSchema = z.object({
  kitchenId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format must be YYYY-MM-DD"),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  capacity: z.number().int().min(1).max(20).default(4),
  status: z.enum(["AVAILABLE", "BOOKED", "BLOCKED", "PAST"]).default("AVAILABLE"),
  notes: z.string().optional(),
});

export async function GET() {
  const session = await getServerSession(authOptions as any);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const slots = await getAllSlots();
    return NextResponse.json({ success: true, slots });
  } catch (err: any) {
    console.error("[Admin Slots API] Error:", err);
    return NextResponse.json({ error: "Failed to fetch slots" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions as any);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = createSlotSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid slot data" },
        { status: 400 }
      );
    }

    const created = await addSlot(parsed.data);
    return NextResponse.json({ success: true, slot: created }, { status: 201 });
  } catch (err: any) {
    console.error("[Admin Create Slot API] Error:", err);
    return NextResponse.json({ error: "Failed to create slot" }, { status: 500 });
  }
}

