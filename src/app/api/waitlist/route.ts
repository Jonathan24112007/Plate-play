import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export interface WaitlistSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  experience: "play" | "create" | "unleash" | "not_sure";
  consent: boolean;
  createdAt: string;
}

// In-memory store for dev / fallback
const memorySubmissions: WaitlistSubmission[] = [];

export async function POST(request: Request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json(
        { error: "Invalid JSON payload received." },
        { status: 400 }
      );
    }
    const { name, email, phone, experience, consent, honeypot } = body;

    // Spam prevention: honeypot check
    if (honeypot) {
      return NextResponse.json(
        { error: "Automated submission detected." },
        { status: 400 }
      );
    }

    // Server-side validation
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Please enter a valid name (at least 2 characters)." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const validExperiences = ["play", "create", "unleash", "not_sure"];
    if (!experience || !validExperiences.includes(experience)) {
      return NextResponse.json(
        { error: "Please select a preferred experience." },
        { status: 400 }
      );
    }

    if (!consent) {
      return NextResponse.json(
        { error: "You must consent to receive pilot launch updates." },
        { status: 400 }
      );
    }

    const isLiveConfigured = process.env.WAITLIST_STORAGE_ENABLED === "true";
    const submission: WaitlistSubmission = {
      id: "PP-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? String(phone).trim() : undefined,
      experience,
      consent: Boolean(consent),
      createdAt: new Date().toISOString(),
    };

    // Lightweight server storage when configured or local dev file storage
    let storedPersistently = false;
    if (isLiveConfigured) {
      try {
        const filePath = path.join(process.cwd(), "waitlist-records.json");
        let existing: WaitlistSubmission[] = [];
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, "utf-8");
          existing = JSON.parse(content);
        }
        existing.push(submission);
        fs.writeFileSync(filePath, JSON.stringify(existing, null, 2), "utf-8");
        storedPersistently = true;
      } catch (err) {
        console.error("Failed to write to persistent file storage:", err);
      }
    } else {
      // Demo / preview mode
      memorySubmissions.push(submission);
    }

    return NextResponse.json({
      success: true,
      mode: isLiveConfigured ? "live" : "demo",
      storedPersistently,
      confirmationCode: submission.id,
      message: isLiveConfigured
        ? "You're on the list! We'll notify you as soon as pilot slots open."
        : "Demo Mode: Form validated successfully! (Storage is in preview mode as no database is configured).",
      data: {
        name: submission.name,
        email: submission.email,
        experience: submission.experience,
      },
    });
  } catch (error) {
    console.error("Waitlist API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  const isLiveConfigured = process.env.WAITLIST_STORAGE_ENABLED === "true";
  return NextResponse.json({
    status: "ok",
    service: "PlatePlay Waitlist API",
    mode: isLiveConfigured ? "live" : "demo",
    version: "0.1.0",
  });
}

