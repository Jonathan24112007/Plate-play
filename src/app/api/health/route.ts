import { NextResponse } from "next/server";
import { getOperatingMode, isPaymentsEnabled } from "@/lib/pilotService";

const startTime = Date.now();

export async function GET() {
  try {
    const operatingMode = await getOperatingMode();
    const paymentsEnabled = await isPaymentsEnabled();
    const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);

    return NextResponse.json(
      {
        status: "healthy",
        version: "v1.0.0",
        uptimeSeconds,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development",
        operatingMode,
        paymentsEnabled,
        storage: process.env.DATABASE_URL ? "postgresql" : "json-persistent-fallback",
        services: {
          auth: "next-auth-v4-ready",
          email: process.env.RESEND_API_KEY ? "resend-live" : "resend-mock-fallback",
          payments: paymentsEnabled ? "razorpay-active" : "disabled-prelaunch",
        },
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        status: "unhealthy",
        error: err.message || "Health check failed",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

