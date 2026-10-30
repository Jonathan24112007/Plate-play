import crypto from "crypto";
import { isPaymentsEnabled, getBookingById } from "@/lib/pilotService";

export interface PaymentOrderResult {
  enabled: boolean;
  orderId?: string;
  amountPaise: number;
  currency: string;
  keyId?: string;
  isTestMode: boolean;
  message?: string;
}

export interface PaymentVerificationResult {
  success: boolean;
  orderId: string;
  paymentId: string;
  signatureValid: boolean;
  error?: string;
}

/**
 * Checks if payment processing is active for the current environment.
 * Default is FALSE unless explicitly enabled by an administrator or env config.
 */
export async function getPaymentStatus() {
  const enabled = await isPaymentsEnabled();
  return {
    enabled,
    provider: "Razorpay (India - INR)",
    isTestMode: process.env.NODE_ENV !== "production" || !process.env.RAZORPAY_KEY_SECRET,
    currency: "INR",
    taxRatePct: 5, // 5% GST for restaurant/culinary services in India
  };
}

/**
 * Initiates an order for an approved group booking.
 * If payments are disabled, returns a simulated test response explaining pre-launch status.
 */
export async function createPaymentOrder(
  bookingId: string
): Promise<PaymentOrderResult> {
  const enabled = await isPaymentsEnabled();
  const booking = await getBookingById(bookingId);

  if (!booking) {
    throw new Error("Booking request not found.");
  }

  // Payments are only requested for Approved sessions
  if (booking.status !== "APPROVED") {
    throw new Error("Payment can only be initialized for approved booking sessions.");
  }

  const amountPaise = booking.estimatedPricePaise;
  const currency = "INR";

  if (!enabled) {
    return {
      enabled: false,
      amountPaise,
      currency,
      isTestMode: true,
      message:
        "Payments are currently disabled during the PlatePlay pilot phase. No upfront payment required.",
    };
  }

  const keyId = process.env.RAZORPAY_KEY_ID || "rzp_test_plateplay_dummy";
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keySecret) {
    // Sandbox test order simulation
    const mockOrderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    return {
      enabled: true,
      orderId: mockOrderId,
      amountPaise,
      currency,
      keyId,
      isTestMode: true,
      message: "Sandbox test order created. Live merchant keys pending.",
    };
  }

  // Real Razorpay Orders API call (when keys are configured)
  try {
    const authHeader = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${authHeader}`,
      },
      body: JSON.stringify({
        amount: amountPaise,
        currency,
        receipt: booking.publicReference,
        notes: {
          bookingId: booking.id,
          reference: booking.publicReference,
          kitchen: booking.kitchenName,
          package: booking.packageName,
        },
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.description || "Razorpay order creation failed.");
    }

    const orderData = await res.json();
    return {
      enabled: true,
      orderId: orderData.id,
      amountPaise: orderData.amount,
      currency: orderData.currency,
      keyId,
      isTestMode: keyId.startsWith("rzp_test"),
    };
  } catch (e: any) {
    console.error("[Payment] Order creation error:", e);
    throw new Error(e.message || "Failed to create payment order.");
  }
}

/**
 * Verifies Razorpay payment signature server-side using HMAC SHA-256.
 * Essential to prevent tampered or fabricated client confirmations.
 */
export function verifyPaymentSignature(params: {
  orderId: string;
  paymentId: string;
  signature: string;
  secret?: string;
}): boolean {
  const secret = params.secret || process.env.RAZORPAY_KEY_SECRET;

  if (!secret) {
    // In test sandbox without secret, verify basic structural integrity
    return (
      params.orderId.length > 5 &&
      params.paymentId.length > 5 &&
      params.signature.length > 10
    );
  }

  const generatedSignature = crypto
    .createHmac("sha256", secret)
    .update(`${params.orderId}|${params.paymentId}`)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(generatedSignature),
    Buffer.from(params.signature)
  );
}

/**
 * Verifies Razorpay Webhook signature server-side.
 */
export function verifyWebhookSignature(
  rawBody: string,
  signature: string,
  webhookSecret: string
): boolean {
  if (!webhookSecret || !signature) return false;

  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(rawBody)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(signature)
    );
  } catch {
    return false;
  }
}

