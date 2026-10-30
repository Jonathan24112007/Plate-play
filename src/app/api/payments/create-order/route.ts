import { NextResponse } from "next/server";
import { getAuthenticatedSession } from "@/lib/auth";
import { createPaymentOrder, getPaymentStatus } from "@/lib/payment";

export async function POST(req: Request) {
  try {
    const session = await getAuthenticatedSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bookingId } = await req.json();
    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID is required." }, { status: 400 });
    }

    const order = await createPaymentOrder(bookingId);
    return NextResponse.json({ success: true, order });
  } catch (err: any) {
    console.error("[Payment Create Order Error]:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create payment order." },
      { status: 400 }
    );
  }
}

export async function GET() {
  const status = await getPaymentStatus();
  return NextResponse.json(status);
}

