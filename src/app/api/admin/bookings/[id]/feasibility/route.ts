import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { updateUnleashReview } from "@/lib/pilotService";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const updated = await updateUnleashReview(id, body, admin.email);
    if (!updated) {
      return NextResponse.json({ error: "Booking request not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, booking: updated });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to update feasibility." }, { status: 500 });
  }
}

