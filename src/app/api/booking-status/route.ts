import { NextResponse } from "next/server";
import { getBookingByRefAndEmail } from "@/lib/pilotService";
import { rateLimit } from "@/lib/rateLimit";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const ref = searchParams.get("ref");
    const email = searchParams.get("email");

    // Enforce rate limiting on status lookups
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";
    const limiter = rateLimit(`status:${ip}`, 30, 10 * 60 * 1000);

    if (!limiter.allowed) {
      return NextResponse.json(
        { error: "Too many lookups. Please wait a few moments." },
        { status: 429 }
      );
    }

    if (!ref || !ref.trim()) {
      return NextResponse.json(
        { error: "Booking reference number is required." },
        { status: 400 }
      );
    }

    if (!email || !email.trim()) {
      return NextResponse.json(
        { error: "Customer email is required to verify ownership." },
        { status: 400 }
      );
    }

    const booking = await getBookingByRefAndEmail(ref, email);

    if (!booking) {
      return NextResponse.json(
        {
          error:
            "No booking request found matching this reference and email combination. Please check your details and try again.",
        },
        { status: 404 }
      );
    }

    // Return safe public fields only
    return NextResponse.json({
      success: true,
      booking: {
        publicReference: booking.publicReference,
        status: booking.status,
        customerName: booking.customerName,
        packageName: booking.packageName,
        kitchenName: booking.kitchenName,
        slotDate: booking.slotDate,
        slotTime: booking.slotTime,
        groupSize: booking.groupSize,
        estimatedPricePaise: booking.estimatedPricePaise,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
        adminNotes: booking.adminNotes || null,
        statusHistory: booking.statusHistory.map((h) => ({
          status: h.newStatus,
          changedAt: h.changedAt,
        })),
      },
    });
  } catch (error: any) {
    console.error("[Booking Status API] Error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve status. Please try again later." },
      { status: 500 }
    );
  }
}

