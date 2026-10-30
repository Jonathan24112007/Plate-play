import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getActivityLogs } from "@/lib/pilotService";

export async function GET() {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const logs = await getActivityLogs();
    return NextResponse.json({ logs });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to fetch activity logs." }, { status: 500 });
  }
}

