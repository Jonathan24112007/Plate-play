import { NextResponse } from "next/server";
import { getAuthenticatedSession } from "@/lib/auth";
import { getBookingsByCustomer } from "@/lib/pilotService";

export async function GET() {
  try {
    const session = await getAuthenticatedSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookings = await getBookingsByCustomer(session.email, session.id);
    return NextResponse.json({ bookings });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to fetch customer bookings." }, { status: 500 });
  }
}

