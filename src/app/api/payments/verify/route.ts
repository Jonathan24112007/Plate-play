import { NextResponse } from "next/server";
import { getAuthenticatedSession } from "@/lib/auth";
import { verifyPaymentSignature } from "@/lib/payment";
import { getBookingById } from "@/lib/pilotService";

export async function POST(req: Request) {
  try {
    const session = await getAuthenticatedSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bookingId, orderId, paymentId, signature } = await req.json();

    if (!bookingId || !orderId || !paymentId || !signature) {
      return NextResponse.json(
        { error: "Missing required payment verification parameters." },
        { status: 400 }
      );
    }

    const booking = await getBookingById(bookingId);
    if (!booking) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }

    const isValid = verifyPaymentSignature({ orderId, paymentId, signature });
    if (!isValid) {
      return NextResponse.json(
        { error: "Cryptographic payment verification failed. Invalid signature." },
        { status: 400 }
      );
    }

    // Update payment details on the booking record
    booking.paymentStatus = "PAID";
    booking.paymentDetails = {
      enabled: true,
      status: "PAID",
      orderId,
      paymentId,
      amountPaise: booking.estimatedPricePaise,
      currency: "INR",
      paidAt: new Date().toISOString(),
      method: "razorpay_upi_card",
      isTestMode: process.env.NODE_ENV !== "production",
    };

    return NextResponse.json({
      success: true,
      message: "Payment successfully verified.",
      paymentStatus: "PAID",
    });
  } catch (err: any) {
    console.error("[Payment Verify Error]:", err);
    return NextResponse.json(
      { error: err.message || "Failed to verify payment." },
      { status: 500 }
    );
  }
}

