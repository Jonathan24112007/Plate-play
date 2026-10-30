import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/payment";

export async function POST(req: Request) {
  try {
    const signature = req.headers.get("x-razorpay-signature");
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    const rawBody = await req.text();

    if (webhookSecret && signature) {
      const isValid = verifyWebhookSignature(rawBody, signature, webhookSecret);
      if (!isValid) {
        return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 });
      }
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;

    // Idempotent webhook event dispatch
    console.log(`[Payment Webhook] Received event: ${event}`);

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("[Payment Webhook Error]:", err);
    return NextResponse.json({ error: "Webhook processing failed." }, { status: 500 });
  }
}

