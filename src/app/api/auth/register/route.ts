import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createUser, getUserByEmail } from "@/lib/pilotService";
import { sendVerificationEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/rateLimit";

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "local";
    const rl = checkRateLimit(`register_${ip}`, 10, 60 * 1000); // 10 attempts per minute
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many registration attempts. Please wait a minute." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { name, email, password, phone } = body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Please provide a valid name (at least 2 characters)." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    const existing = await getUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email address already exists." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await createUser({
      name,
      email,
      passwordHash,
      phone,
      role: "CUSTOMER",
    });

    if (user.verificationToken) {
      sendVerificationEmail(user.email, user.verificationToken).catch(console.error);
    }

    return NextResponse.json({
      success: true,
      message: "Account created successfully.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
      },
    });
  } catch (err: any) {
    console.error("[Register API Error]:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error during registration." },
      { status: 500 }
    );
  }
}

