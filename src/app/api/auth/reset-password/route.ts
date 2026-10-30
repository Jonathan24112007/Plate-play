import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { resetPasswordWithToken } from "@/lib/pilotService";

export async function POST(req: Request) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || typeof token !== "string") {
      return NextResponse.json({ error: "Reset token is required." }, { status: 400 });
    }

    if (!newPassword || typeof newPassword !== "string" || newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    const newHash = await bcrypt.hash(newPassword, 12);
    const success = await resetPasswordWithToken(token, newHash);

    if (!success) {
      return NextResponse.json(
        { error: "Reset token is invalid or has expired." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Password has been successfully updated. You may now sign in.",
    });
  } catch (err: any) {
    console.error("[Reset Password API Error]:", err);
    return NextResponse.json(
      { error: "Failed to reset password." },
      { status: 500 }
    );
  }
}

