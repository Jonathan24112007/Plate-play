"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  ArrowRight,
  Sparkles,
  ShieldAlert,
  Settings,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsData {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  declinedRequests: number;
  availableSlotsCount: number;
  operatingMode: "DEMO" | "PILOT" | "LIVE";
}

interface BookingItem {
  id: string;
  publicReference: string;
  customerName: string;
  customerEmail: string;
  packageName: string;
  kitchenName: string;
  slotDate?: string;
  slotTime?: string;
  groupSize: number;
  estimatedPricePaise: number;
  status: "PENDING" | "APPROVED" | "DECLINED" | "CANCELLED";
  createdAt: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [recentBookings, setRecentBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modeUpdating, setModeUpdating] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, bookingsRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/bookings"),
      ]);

      if (statsRes.ok) {
        const sData = await statsRes.json();
        setStats(sData.stats);
      }

      if (bookingsRes.ok) {
        const bData = await bookingsRes.json();
        setRecentBookings(bData.bookings.slice(0, 5));
      }
    } catch (e) {
      console.error("Failed to load dashboard data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleModeChange = async (newMode: "DEMO" | "PILOT" | "LIVE") => {
    setModeUpdating(true);
    try {
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operatingMode: newMode }),
      });
      if (res.ok) {
        if (stats) setStats({ ...stats, operatingMode: newMode });
      }
    } catch (e) {
      console.error("Error setting operating mode:", e);
    } finally {
      setModeUpdating(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cream-300">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-charcoal tracking-tight">
            Pilot Management Overview
          </h1>
          <p className="text-xs sm:text-sm text-charcoal/60 mt-1">
            Real-time tracking of incoming group booking requests, slot capacities, and operating configuration.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-white border border-cream-300 hover:bg-cream-100 text-xs font-bold text-charcoal flex items-center gap-2 transition-colors"
        >
          <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
          <span>Refresh</span>
        </button>
      </div>

      {/* STATS METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pending Requests */}
        <div className="bg-white p-5 rounded-2xl border border-cream-300 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Review</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="font-display font-black text-3xl text-charcoal">
            {stats?.pendingRequests ?? 0}
          </div>
          <p className="text-[11px] text-charcoal/60">Awaiting director confirmation</p>
        </div>

        {/* Approved Bookings */}
        <div className="bg-white p-5 rounded-2xl border border-cream-300 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-xs font-bold uppercase tracking-wider">Approved Requests</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="font-display font-black text-3xl text-charcoal">
            {stats?.approvedRequests ?? 0}
          </div>
          <p className="text-[11px] text-charcoal/60">Slots reserved & confirmed</p>
        </div>

        {/* Total Requests */}
        <div className="bg-white p-5 rounded-2xl border border-cream-300 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-burgundy">
            <span className="text-xs font-bold uppercase tracking-wider">Total Submissions</span>
            <Users className="w-4 h-4" />
          </div>
          <div className="font-display font-black text-3xl text-charcoal">
            {stats?.totalRequests ?? 0}
          </div>
          <p className="text-[11px] text-charcoal/60">All-time pilot requests</p>
        </div>

        {/* Available Slots */}
        <div className="bg-white p-5 rounded-2xl border border-cream-300 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-flame">
            <span className="text-xs font-bold uppercase tracking-wider">Active Slots</span>
            <Calendar className="w-4 h-4" />
          </div>
          <div className="font-display font-black text-3xl text-charcoal">
            {stats?.availableSlotsCount ?? 0}
          </div>
          <p className="text-[11px] text-charcoal/60">Available across kitchens</p>
        </div>
      </div>

      {/* OPERATING MODE CONTROLLER */}
      <div className="bg-white p-6 rounded-3xl border border-cream-300 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-burgundy" />
              <h2 className="font-display font-bold text-lg text-charcoal">
                Platform Operating Mode
              </h2>
            </div>
            <p className="text-xs text-charcoal/60 mt-0.5">
              Controls public messaging, booking behavior, and pilot slot verification status.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-cream-100 p-1.5 rounded-2xl border border-cream-200">
            {(["DEMO", "PILOT", "LIVE"] as const).map((mode) => (
              <button
                key={mode}
                disabled={modeUpdating}
                onClick={() => handleModeChange(mode)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                  stats?.operatingMode === mode
                    ? mode === "LIVE"
                      ? "bg-emerald-600 text-white shadow-sm"
                      : mode === "PILOT"
                      ? "bg-flame text-white shadow-sm"
                      : "bg-burgundy text-white shadow-sm"
                    : "text-charcoal/70 hover:text-charcoal"
                )}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 bg-cream-50 rounded-xl border border-cream-200 text-xs text-charcoal/70">
          {stats?.operatingMode === "DEMO" && (
            <p>
              <strong>DEMO Mode:</strong> The website clearly displays pilot beta labels. Booking
              requests are stored for testing, but no live slots are enforced or guaranteed.
            </p>
          )}
          {stats?.operatingMode === "PILOT" && (
            <p>
              <strong>PILOT Mode:</strong> Real pilot booking requests are accepted for Pizzeria and
              Masala Kitchen. Confirmation notifications and slot capacities are actively managed.
            </p>
          )}
          {stats?.operatingMode === "LIVE" && (
            <p>
              <strong>LIVE Mode:</strong> Public booking is officially open. Venue operational status
              is presented as active.
            </p>
          )}
        </div>
      </div>

      {/* RECENT REQUESTS TABLE */}
      <div className="bg-white rounded-3xl border border-cream-300 shadow-soft overflow-hidden">
        <div className="p-6 border-b border-cream-200 flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-lg text-charcoal">
              Recent Booking Requests
            </h2>
            <p className="text-xs text-charcoal/60">Showing the latest 5 incoming submissions</p>
          </div>
          <Link
            href="/admin/bookings"
            className="text-xs font-bold text-burgundy hover:underline flex items-center gap-1"
          >
            <span>View All Requests</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <div className="p-8 text-center text-xs text-charcoal/50">
            No booking requests received yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream-100 text-charcoal/60 font-mono uppercase tracking-wider text-[10px] border-b border-cream-200">
                <tr>
                  <th className="p-4">Reference</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Studio & Package</th>
                  <th className="p-4">Date & Time</th>
                  <th className="p-4">Guests</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {recentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-cream-50/50 transition-colors">
                    <td className="p-4 font-mono font-bold text-burgundy">{b.publicReference}</td>
                    <td className="p-4">
                      <span className="font-bold text-charcoal block">{b.customerName}</span>
                      <span className="text-charcoal/50 text-[11px]">{b.customerEmail}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-charcoal block">{b.kitchenName}</span>
                      <span className="text-charcoal/60 text-[11px]">{b.packageName}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-charcoal font-medium block">{b.slotDate || "—"}</span>
                      <span className="text-charcoal/50 text-[11px]">{b.slotTime || ""}</span>
                    </td>
                    <td className="p-4 font-bold text-charcoal">{b.groupSize}</td>
                    <td className="p-4">
                      <span
                        className={cn(
                          "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                          b.status === "PENDING" && "bg-amber-100 text-amber-800",
                          b.status === "APPROVED" && "bg-emerald-100 text-emerald-800",
                          b.status === "DECLINED" && "bg-charcoal/10 text-charcoal/70",
                          b.status === "CANCELLED" && "bg-cream-200 text-charcoal/50"
                        )}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/admin/bookings?search=${b.publicReference}`}
                        className="px-3 py-1.5 rounded-lg bg-cream-200 hover:bg-cream-300 text-charcoal text-[11px] font-bold transition-colors inline-block"
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

