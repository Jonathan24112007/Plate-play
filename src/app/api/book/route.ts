import { NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit } from "@/lib/rateLimit";
import { createBookingRequest } from "@/lib/pilotService";
import { getAuthenticatedSession } from "@/lib/auth";

const bookingSchema = z.object({
  kitchenId: z.string().min(1, "Please select a kitchen"),
  packageId: z.string().min(1, "Please select an experience package"),
  slotId: z.string().optional(),
  slotDate: z.string().optional(),
  slotTime: z.string().optional(),
  groupSize: z.number().int().min(1).max(8).default(4),
  customerName: z.string().min(2, "Name must be at least 2 characters").max(100),
  customerEmail: z.string().email("Please provide a valid email address"),
  customerPhone: z.string().max(20).optional().or(z.literal("")),
  occasion: z.string().max(100).optional(),
  dietaryRequirements: z.array(z.string()).default([]),
  dietaryNotes: z.string().max(500).optional(),
  customDishDetails: z.string().max(1000).optional(),
  // Honeypot field
  botTrap: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    // Rate limit check
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";
    const limiter = rateLimit(`book:${ip}`, 12, 15 * 60 * 1000);

    if (!limiter.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a few minutes before trying again." },
        { status: 429 }
      );
    }

    const body = await req.json();

    // Honeypot trap check
    if (body.botTrap && body.botTrap.trim() !== "") {
      // Quiet rejection for bots
      return NextResponse.json({ success: true, reference: "PP-BK-MOCK" });
    }

    const parsed = bookingSchema.safeParse(body);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      return NextResponse.json(
        { error: issue ? issue.message : "Invalid booking details submitted." },
        { status: 400 }
      );
    }

    const {
      kitchenId,
      packageId,
      slotId,
      slotDate,
      slotTime,
      groupSize,
      customerName,
      customerEmail,
      customerPhone,
      occasion,
      dietaryRequirements,
      dietaryNotes,
      customDishDetails,
    } = parsed.data;

    const session = await getAuthenticatedSession();

    const booking = await createBookingRequest({
      kitchenId,
      packageId,
      slotId,
      slotDate,
      slotTime,
      groupSize,
      customerName,
      customerEmail,
      customerPhone: customerPhone || undefined,
      occasion,
      dietaryRequirements,
      dietaryNotes,
      customDishDetails,
      userId: session?.id,
    });

    return NextResponse.json(
      {
        success: true,
        reference: booking.publicReference,
        booking: {
          id: booking.id,
          publicReference: booking.publicReference,
          customerName: booking.customerName,
          customerEmail: booking.customerEmail,
          packageName: booking.packageName,
          kitchenName: booking.kitchenName,
          slotDate: booking.slotDate,
          slotTime: booking.slotTime,
          groupSize: booking.groupSize,
          estimatedPricePaise: booking.estimatedPricePaise,
          status: booking.status,
          createdAt: booking.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[Booking API] Submission error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process booking request. Please try again." },
      { status: 400 }
    );
  }
}

