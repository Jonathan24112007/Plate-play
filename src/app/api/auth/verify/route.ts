import { NextResponse } from "next/server";
import { verifyUserEmail } from "@/lib/pilotService";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");

    if (!token) {
      return NextResponse.redirect(new URL("/login?error=InvalidToken", req.url));
    }

    const verified = await verifyUserEmail(token);
    if (!verified) {
      return NextResponse.redirect(new URL("/login?error=ExpiredOrInvalidToken", req.url));
    }

    return NextResponse.redirect(new URL("/login?verified=true", req.url));
  } catch (err: any) {
    console.error("[Verify API Error]:", err);
    return NextResponse.redirect(new URL("/login?error=VerificationFailed", req.url));
  }
}

