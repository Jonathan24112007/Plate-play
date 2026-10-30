import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAllBookings } from "@/lib/pilotService";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions as any);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    let bookings = await getAllBookings();

    if (status && status !== "ALL") {
      bookings = bookings.filter((b) => b.status === status);
    }

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      bookings = bookings.filter(
        (b) =>
          b.publicReference.toLowerCase().includes(q) ||
          b.customerName.toLowerCase().includes(q) ||
          b.customerEmail.toLowerCase().includes(q) ||
          b.kitchenName.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({ success: true, bookings });
  } catch (err: any) {
    console.error("[Admin Bookings API] Error:", err);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

