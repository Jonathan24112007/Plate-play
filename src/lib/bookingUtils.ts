import { randomInt } from "crypto";

/**
 * Generates a unique public reference in the format PP-BK-XXXXXX
 * (6 alphanumeric uppercase characters)
 */
export function generatePublicReference(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // exclude ambiguous I, O, 0, 1
  let result = "PP-BK-";
  for (let i = 0; i < 6; i++) {
    result += chars[randomInt(0, chars.length)];
  }
  return result;
}

/**
 * Convert paise to formatted INR string
 * e.g. 59900 → "₹599"
 */
export function formatPaise(paise: number): string {
  const rupees = paise / 100;
  return `₹${rupees.toLocaleString("en-IN")}`;
}

/**
 * Convert rupees to paise
 */
export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

/**
 * Calculate estimated total price in paise
 */
export function calculateEstimatedTotal(
  pricePerPersonPaise: number,
  groupSize: number
): number {
  return pricePerPersonPaise * groupSize;
}

/**
 * Format a Date object as a readable date string in Asia/Kolkata
 */
export function formatDateIST(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format a slot time range for display
 */
export function formatSlotTime(startTime: string, endTime: string): string {
  return `${startTime} – ${endTime}`;
}

/**
 * Get the operating mode from environment (defaults to DEMO)
 */
export function getOperatingMode(): "DEMO" | "PILOT" | "LIVE" {
  const mode = process.env.PLATEPLAY_MODE?.toUpperCase();
  if (mode === "PILOT" || mode === "LIVE") return mode;
  return "DEMO";
}

