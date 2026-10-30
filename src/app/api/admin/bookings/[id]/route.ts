import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getBookingById, updateBookingStatus } from "@/lib/pilotService";
import { z } from "zod";

const updateSchema = z.object({
  status: z.enum(["DRAFT", "PENDING", "APPROVED", "DECLINED", "CANCELLED", "COMPLETED"]),
  adminNotes: z.string().max(1000).optional(),
});

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions as any);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const booking = await getBookingById(id);
  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, booking });
}

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
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid payload" },
        { status: 400 }
      );
    }

    const { status, adminNotes } = parsed.data;
    const adminEmail = (session as any)?.user?.email || "admin";

    const updated = await updateBookingStatus(id, status, adminNotes, adminEmail);
    if (!updated) {
      return NextResponse.json({ error: "Booking request not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, booking: updated });
  } catch (err: any) {
    console.error("[Admin Update Booking API] Error:", err);
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}
