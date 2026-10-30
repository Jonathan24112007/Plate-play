import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { updateSlot } from "@/lib/pilotService";
import { z } from "zod";

const updateSlotSchema = z.object({
  status: z.enum(["AVAILABLE", "BOOKED", "BLOCKED", "PAST"]).optional(),
  capacity: z.number().int().min(1).max(20).optional(),
  notes: z.string().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions as any);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = updateSlotSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid payload" },
        { status: 400 }
      );
    }

    const updated = await updateSlot(id, parsed.data);
    if (!updated) {
      return NextResponse.json({ error: "Slot not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, slot: updated });
  } catch (err: any) {
    console.error("[Admin Update Slot API] Error:", err);
    return NextResponse.json({ error: "Failed to update slot" }, { status: 500 });
  }
}

