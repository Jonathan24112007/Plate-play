"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import {
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Users,
  ChefHat,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusResponse {
  publicReference: string;
  status: "PENDING" | "APPROVED" | "DECLINED" | "CANCELLED";
  customerName: string;
  packageName: string;
  kitchenName: string;
  slotDate?: string;
  slotTime?: string;
  groupSize: number;
  estimatedPricePaise: number;
  createdAt: string;
  updatedAt: string;
  adminNotes?: string | null;
  statusHistory: Array<{
    status: string;
    changedAt: string;
  }>;
}

function BookingStatusContent() {
  const searchParams = useSearchParams();
  const initialRef = searchParams.get("ref") || "";
  const initialEmail = searchParams.get("email") || "";

  const [ref, setRef] = useState(initialRef);
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState<StatusResponse | null>(null);

  const fetchStatus = async (r: string, e: string) => {
    if (!r.trim() || !e.trim()) {
      setError("Please provide both your booking reference and email address.");
      return;
    }

    setLoading(true);
    setError(null);
    setBooking(null);

    try {
      const res = await fetch(
        `/api/booking-status?ref=${encodeURIComponent(r.trim())}&email=${encodeURIComponent(
          e.trim()
        )}`
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Unable to find booking request.");
      }

      setBooking(data.booking);
    } catch (err: any) {
      setError(err.message || "Failed to retrieve booking status.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialRef && initialEmail) {
      fetchStatus(initialRef, initialEmail);
    }
  }, [initialRef, initialEmail]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStatus(ref, email);
  };

  return (
    <div className="min-h-screen bg-cream text-charcoal flex flex-col selection:bg-burgundy selection:text-white">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <Badge variant="flame" className="mb-3">
            <Search className="w-3.5 h-3.5 text-flame mr-1.5" />
            Request Tracker
          </Badge>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-charcoal tracking-tight mb-3">
            Check Booking Status
          </h1>
          <p className="text-xs sm:text-sm text-charcoal/70">
            Enter your booking reference code (e.g. PP-BK-XXXXXX) along with the email used when
            submitting the request.
          </p>
        </div>

        {/* Lookup Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-cream-300 shadow-soft mb-8">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-5 space-y-1">
              <label className="text-xs font-bold text-charcoal uppercase tracking-wider">
                Reference Code *
              </label>
              <input
                type="text"
                value={ref}
                onChange={(e) => setRef(e.target.value.toUpperCase())}
                placeholder="PP-BK-XXXXXX"
                className="w-full px-4 py-2.5 rounded-xl border border-cream-300 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-burgundy uppercase"
                required
              />
            </div>

            <div className="sm:col-span-5 space-y-1">
              <label className="text-xs font-bold text-charcoal uppercase tracking-wider">
                Customer Email *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy"
                required
              />
            </div>

            <div className="sm:col-span-2 flex items-end">
              <Button
                type="submit"
                disabled={loading}
                variant="burgundy"
                size="md"
                className="w-full justify-center h-[42px]"
              >
                {loading ? "Checking..." : "Look Up"}
              </Button>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-3.5 rounded-xl bg-burgundy/10 border border-burgundy/20 text-burgundy text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Status Result Display */}
        {booking && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-cream-300 shadow-xl space-y-8 animate-fade-in">
            {/* Status Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-cream-200">
              <div>
                <span className="text-xs font-mono text-charcoal/50 uppercase tracking-widest block mb-1">
                  Reference: {booking.publicReference}
                </span>
                <h2 className="font-display font-black text-2xl text-charcoal">
                  Hi, {booking.customerName}
                </h2>
              </div>

              <div>
                {booking.status === "PENDING" && (
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-100 text-amber-900 font-bold text-xs">
                    <Clock className="w-4 h-4 text-amber-700 animate-pulse" />
                    <span>Under Review</span>
                  </span>
                )}
                {booking.status === "APPROVED" && (
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Request Approved</span>
                  </span>
                )}
                {booking.status === "DECLINED" && (
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-charcoal/10 text-charcoal/80 font-bold text-xs">
                    <XCircle className="w-4 h-4 text-charcoal/70" />
                    <span>Slot Unavailable</span>
                  </span>
                )}
                {booking.status === "CANCELLED" && (
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-cream-200 text-charcoal/60 font-bold text-xs">
                    <XCircle className="w-4 h-4 text-charcoal/40" />
                    <span>Cancelled</span>
                  </span>
                )}
              </div>
            </div>

            {/* Status Explanation Card */}
            <div
              className={cn(
                "p-4 rounded-2xl text-xs sm:text-sm leading-relaxed",
                booking.status === "PENDING"
                  ? "bg-amber-50 border border-amber-200 text-amber-950"
                  : booking.status === "APPROVED"
                  ? "bg-emerald-50 border border-emerald-200 text-emerald-950"
                  : "bg-cream-100 border border-cream-300 text-charcoal/80"
              )}
            >
              {booking.status === "PENDING" && (
                <p>
                  Your request is queued for pilot review. Our kitchen director reviews ingredient
                  prep and studio safety protocols for your group. You will receive an email once
                  confirmed.
                </p>
              )}
              {booking.status === "APPROVED" && (
                <p>
                  <strong>Great news!</strong> Your pilot slot is confirmed. Please arrive 10 minutes
                  before your session window for apron allocation and chef briefing.
                </p>
              )}
              {booking.status === "DECLINED" && (
                <p>
                  We were unable to secure this slot due to maintenance or capacity limits. You may
                  submit another request for an alternate date or join our waitlist for updates.
                </p>
              )}
              {booking.status === "CANCELLED" && (
                <p>This pilot request has been cancelled. Feel free to submit a new request anytime.</p>
              )}
              {booking.adminNotes && (
                <div className="mt-2 pt-2 border-t border-black/10 text-xs">
                  <strong>Note from Studio Director:</strong> {booking.adminNotes}
                </div>
              )}
            </div>

            {/* Booking Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-cream-100 border border-cream-200">
                <span className="text-[10px] font-mono uppercase text-charcoal/50 block mb-1">
                  Package
                </span>
                <span className="font-bold text-sm text-charcoal">{booking.packageName}</span>
              </div>
              <div className="p-4 rounded-xl bg-cream-100 border border-cream-200">
                <span className="text-[10px] font-mono uppercase text-charcoal/50 block mb-1">
                  Studio
                </span>
                <span className="font-bold text-sm text-charcoal">{booking.kitchenName}</span>
              </div>
              <div className="p-4 rounded-xl bg-cream-100 border border-cream-200">
                <span className="text-[10px] font-mono uppercase text-charcoal/50 block mb-1">
                  Date & Slot
                </span>
                <span className="font-bold text-sm text-charcoal block">{booking.slotDate || "TBD"}</span>
                <span className="text-xs text-charcoal/60">{booking.slotTime || ""}</span>
              </div>
              <div className="p-4 rounded-xl bg-cream-100 border border-cream-200">
                <span className="text-[10px] font-mono uppercase text-charcoal/50 block mb-1">
                  Estimated Total
                </span>
                <span className="font-bold text-sm text-burgundy">
                  ₹{(booking.estimatedPricePaise / 100).toLocaleString("en-IN")}
                </span>
                <span className="text-[10px] text-charcoal/50 block">({booking.groupSize} Guests)</span>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-3 pt-4 border-t border-cream-200">
              <h3 className="font-display font-bold text-sm text-charcoal uppercase tracking-wider">
                Status History
              </h3>
              <div className="space-y-2">
                {booking.statusHistory.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs text-charcoal/70 bg-cream-50 p-2.5 rounded-lg border border-cream-200">
                    <span className="font-semibold text-charcoal">Status changed to: {item.status}</span>
                    <span className="font-mono text-charcoal/50">
                      {new Date(item.changedAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Link
                href="/book"
                className="text-xs font-bold text-burgundy hover:underline flex items-center gap-1"
              >
                <span>Need to submit another request?</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function BookingStatusPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-cream flex items-center justify-center text-charcoal">
          Loading Booking Tracker...
        </div>
      }
    >
      <BookingStatusContent />
    </Suspense>
  );
}
