"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Logo } from "@/components/common/Logo";
import {
  LayoutDashboard,
  CalendarDays,
  Clock,
  Settings,
  LogOut,
  ExternalLink,
  Shield,
  ChefHat,
  Menu,
  X,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Booking Requests", href: "/admin/bookings", icon: CalendarDays },
  { label: "Kitchen Operations", href: "/admin/operations", icon: ClipboardList },
  { label: "Kitchen Slots", href: "/admin/slots", icon: Clock },
  { label: "System Config", href: "/admin/config", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [operatingMode, setOperatingMode] = useState<string>("DEMO");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // If user is on the login page, render full width without admin chrome
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Fetch current operating mode
  useEffect(() => {
    fetch("/api/admin/config")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.operatingMode) setOperatingMode(data.operatingMode);
      })
      .catch(() => {});
  }, [pathname]);

  return (
    <div className="min-h-screen bg-cream text-charcoal flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-charcoal text-cream px-4 py-3 flex items-center justify-between border-b border-charcoal-border">
        <Logo theme="dark" size="sm" />
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="p-2 rounded-lg bg-charcoal-400 text-cream"
        >
          {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={cn(
          "w-64 bg-charcoal text-cream flex flex-col justify-between p-6 shrink-0 transition-all z-40 border-r border-charcoal-border",
          mobileNavOpen
            ? "fixed inset-y-0 left-0"
            : "hidden md:flex min-h-screen"
        )}
      >
        <div className="space-y-6">
          <div className="pt-2">
            <Logo theme="dark" size="md" />
            <span className="text-[10px] font-mono tracking-widest uppercase text-flame block mt-1">
              Admin & Pilot Beta
            </span>
          </div>

          {/* Mode Pill */}
          <div className="p-2.5 rounded-xl bg-charcoal-400 border border-charcoal-border flex items-center justify-between">
            <span className="text-[11px] text-cream/60">Mode:</span>
            <span
              className={cn(
                "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                operatingMode === "LIVE"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : operatingMode === "PILOT"
                  ? "bg-flame/20 text-flame border border-flame/30"
                  : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
              )}
            >
              {operatingMode}
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 pt-2">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all",
                    isActive
                      ? "bg-burgundy text-white shadow-md font-bold"
                      : "text-cream/70 hover:text-white hover:bg-charcoal-400"
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="space-y-3 pt-6 border-t border-charcoal-border">
          <Link
            href="/"
            className="flex items-center justify-between px-3.5 py-2 rounded-lg text-xs text-cream/60 hover:text-white hover:bg-charcoal-400 transition-colors"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-flame hover:bg-flame/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

