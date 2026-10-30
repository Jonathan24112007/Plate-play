import { NextResponse } from "next/server";
import { getAuthenticatedSession } from "@/lib/auth";
import { deleteSavedCreation } from "@/lib/pilotService";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAuthenticatedSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const ok = await deleteSavedCreation(id, session.id);
    if (!ok) {
      return NextResponse.json({ error: "Creation not found or unauthorized." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to delete creation." }, { status: 500 });
  }
}

