import { NextResponse } from "next/server";
import { createPasswordResetToken } from "@/lib/pilotService";
import { sendPasswordResetEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/rateLimit";

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "local";
    const rl = checkRateLimit(`forgot_pwd_${ip}`, 5, 60 * 1000);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many reset attempts. Please wait a minute." },
        { status: 429 }
      );
    }

    const { email } = await req.json();
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const token = await createPasswordResetToken(email);
    if (token) {
      sendPasswordResetEmail(email, token).catch(console.error);
    }

    // Always return success to prevent email enumeration attacks
    return NextResponse.json({
      success: true,
      message: "If an account exists with this email, password reset instructions have been sent.",
    });
  } catch (err: any) {
    console.error("[Forgot Password API Error]:", err);
    return NextResponse.json(
      { error: "Failed to process password reset request." },
      { status: 500 }
    );
  }
}

