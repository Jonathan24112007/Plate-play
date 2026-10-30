"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  Server,
  Mail,
  Key,
  Globe,
  CreditCard,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminConfigPage() {
  const [operatingMode, setOperatingMode] = useState<"DEMO" | "PILOT" | "LIVE">("DEMO");
  const [paymentsEnabled, setPaymentsEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/config")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.operatingMode) setOperatingMode(data.operatingMode);
        if (typeof data?.paymentsEnabled === "boolean") setPaymentsEnabled(data.paymentsEnabled);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSaveMode = async (mode: "DEMO" | "PILOT" | "LIVE") => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operatingMode: mode }),
      });
      if (res.ok) {
        setOperatingMode(mode);
        setFeedbackMsg(`Operating mode updated to ${mode}!`);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (e) {
      console.error("Failed to save config:", e);
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePayments = async () => {
    setSaving(true);
    const nextState = !paymentsEnabled;
    try {
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentsEnabled: nextState }),
      });
      if (res.ok) {
        setPaymentsEnabled(nextState);
        setFeedbackMsg(
          nextState
            ? "Payment gateway processing enabled."
            : "Payments disabled. Requests in pilot mode will not collect money."
        );
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3500);
      }
    } catch (e) {
      console.error("Failed to toggle payments:", e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl pb-16">
      {/* Header */}
      <div>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-charcoal tracking-tight">
          System & Pilot Configuration
        </h1>
        <p className="text-xs sm:text-sm text-charcoal/60 mt-1">
          Control application operating state, verification modes, payment gateway flags, and operational parameters.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Operating Mode Selector */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cream-300 shadow-soft space-y-6">
        <div>
          <h2 className="font-display font-bold text-lg text-charcoal">
            Operating Mode Selection
          </h2>
          <p className="text-xs text-charcoal/60 mt-0.5">
            Select the active state of PlatePlay. Mode changes take effect immediately across all routes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* DEMO */}
          <div
            onClick={() => handleSaveMode("DEMO")}
            className={cn(
              "p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between",
              operatingMode === "DEMO"
                ? "border-burgundy bg-burgundy/5 shadow-md"
                : "border-cream-300 hover:border-cream-400 bg-white"
            )}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-display font-black text-base text-charcoal">DEMO</span>
                {operatingMode === "DEMO" && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-burgundy text-white uppercase">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-charcoal/70 leading-relaxed">
                Illustrative pre-launch state. Users explore the website and submit pilot requests, but no live slots are promised.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-cream-200 text-[11px] font-mono text-charcoal/50">
              Default safe mode
            </div>
          </div>

          {/* PILOT */}
          <div
            onClick={() => handleSaveMode("PILOT")}
            className={cn(
              "p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between",
              operatingMode === "PILOT"
                ? "border-flame bg-flame/5 shadow-md"
                : "border-cream-300 hover:border-cream-400 bg-white"
            )}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-display font-black text-base text-charcoal">PILOT</span>
                {operatingMode === "PILOT" && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-flame text-white uppercase">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-charcoal/70 leading-relaxed">
                Real pilot slots active for Pizzeria & Masala Kitchen. Studio checklists, confirmation notifications, and reviews run live.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-cream-200 text-[11px] font-mono text-flame font-bold">
              Pilot testing mode
            </div>
          </div>

          {/* LIVE */}
          <div
            onClick={() => handleSaveMode("LIVE")}
            className={cn(
              "p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between",
              operatingMode === "LIVE"
                ? "border-emerald-600 bg-emerald-50/50 shadow-md"
                : "border-cream-300 hover:border-cream-400 bg-white"
            )}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-display font-black text-base text-charcoal">LIVE</span>
                {operatingMode === "LIVE" && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-600 text-white uppercase">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-charcoal/70 leading-relaxed">
                Public operations live. All venue slots and operational kitchens are presented as active to the public.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-cream-200 text-[11px] font-mono text-emerald-700 font-bold">
              Full commercial mode
            </div>
          </div>
        </div>
      </div>

      {/* Payment Gateway Architecture & Feature Flag */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cream-300 shadow-soft space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display font-bold text-lg text-charcoal flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-burgundy" />
              <span>Payment Gateway Readiness (Razorpay INR)</span>
            </h2>
            <p className="text-xs text-charcoal/60 mt-0.5">
              Strict payment kill-switch. Disabled by default until commercial and tax clearances are approved.
            </p>
          </div>

          <button
            onClick={handleTogglePayments}
            disabled={saving}
            className={cn(
              "px-5 py-2.5 rounded-full font-bold text-xs transition-all shadow-sm shrink-0",
              paymentsEnabled
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "bg-charcoal text-white hover:bg-charcoal/90"
            )}
          >
            {paymentsEnabled ? "Payments Active (Live / Sandbox)" : "Payments Disabled (Pre-Launch)"}
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200 text-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-charcoal">Current Payment Status:</span>
            <span
              className={cn(
                "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                paymentsEnabled
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800"
              )}
            >
              {paymentsEnabled ? "ENABLED" : "DISABLED (DEFAULT)"}
            </span>
          </div>

          <p className="text-charcoal/70 leading-relaxed">
            When disabled, booking requests and estimated prices (e.g. ₹599, ₹799, ₹1,099 per person) are recorded without charging customers. No real card or UPI numbers are accepted or stored.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-[11px] text-charcoal/60">
            <div>
              <strong>Provider:</strong> Razorpay Standard Checkout (UPI, Cards, NetBanking)
            </div>
            <div>
              <strong>Signature Validation:</strong> HMAC SHA-256 Server-Side
            </div>
          </div>
        </div>
      </div>

      {/* Operational Parameters & Environment Details */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cream-300 shadow-soft space-y-4">
        <h2 className="font-display font-bold text-lg text-charcoal">
          Operating Guardrails & Architecture
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-cream-100 border border-cream-200 space-y-1">
            <span className="font-bold text-charcoal flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-burgundy" />
              Timezone Standard
            </span>
            <p className="text-charcoal/70">
              All dates and time session windows are calculated and scheduled in{" "}
              <strong>Asia/Kolkata (IST)</strong>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-cream-100 border border-cream-200 space-y-1">
            <span className="font-bold text-charcoal flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              Exclusive Group Booking
            </span>
            <p className="text-charcoal/70">
              One booking reserves an entire private studio for a group. Slot capacity defaults to 4
              guests with double-booking prevention.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-cream-100 border border-cream-200 space-y-1">
            <span className="font-bold text-charcoal flex items-center gap-1.5">
              <Server className="w-4 h-4 text-flame" />
              Database Architecture
            </span>
            <p className="text-charcoal/70">
              PostgreSQL ready via Prisma ORM. Uses persistent JSON data store fallback in demo mode
              or when external database URL is unset.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-cream-100 border border-cream-200 space-y-1">
            <span className="font-bold text-charcoal flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-burgundy" />
              Email Notifications
            </span>
            <p className="text-charcoal/70">
              Resend integration prepared for customer confirmations. Gracefully logs when
              RESEND_API_KEY is not configured.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
