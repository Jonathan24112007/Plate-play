import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { updateOperationalChecklist } from "@/lib/pilotService";

export async function PATCH(
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

    const updated = await updateOperationalChecklist(id, body);
    if (!updated) {
      return NextResponse.json({ error: "Session not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, booking: updated });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to update checklist." }, { status: 500 });
  }
}

