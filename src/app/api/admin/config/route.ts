import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getOperatingMode,
  setOperatingMode,
  isPaymentsEnabled,
  setPaymentsEnabled,
} from "@/lib/pilotService";
import { z } from "zod";

const configSchema = z.object({
  operatingMode: z.enum(["DEMO", "PILOT", "LIVE"]).optional(),
  paymentsEnabled: z.boolean().optional(),
});

export async function GET() {
  const session = await getServerSession(authOptions as any);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const mode = await getOperatingMode();
  const payments = await isPaymentsEnabled();

  return NextResponse.json({
    success: true,
    operatingMode: mode,
    paymentsEnabled: payments,
  });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions as any);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = configSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid configuration options submitted." }, { status: 400 });
    }

    const adminEmail = (session as any)?.user?.email || "admin";

    if (parsed.data.operatingMode) {
      await setOperatingMode(parsed.data.operatingMode);
    }

    if (typeof parsed.data.paymentsEnabled === "boolean") {
      await setPaymentsEnabled(parsed.data.paymentsEnabled, adminEmail);
    }

    const mode = await getOperatingMode();
    const payments = await isPaymentsEnabled();

    return NextResponse.json({
      success: true,
      operatingMode: mode,
      paymentsEnabled: payments,
    });
  } catch (err: any) {
    console.error("[Admin Config API] Error:", err);
    return NextResponse.json({ error: "Failed to update configuration." }, { status: 500 });
  }
}
