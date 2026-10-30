"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Button } from "@/components/common/Button";
import { Badge } from "@/components/common/Badge";
import {
  CalendarDays,
  ChefHat,
  Sliders,
  User,
  Shield,
  Clock,
  Users,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Trash2,
  Copy,
  ExternalLink,
  LogOut,
  RefreshCw,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

type TabKey = "overview" | "bookings" | "creations" | "profile" | "security";

interface BookingItem {
  id: string;
  publicReference: string;
  kitchenName: string;
  packageName: string;
  slotDate?: string;
  slotTime?: string;
  groupSize: number;
  status: "PENDING" | "APPROVED" | "DECLINED" | "CANCELLED" | "COMPLETED";
  paymentStatus: "UNPAID" | "PENDING" | "PAID" | "REFUNDED" | "FAILED";
  estimatedPricePaise: number;
  createdAt: string;
  customDishDetails?: string;
}

interface SavedCreation {
  id: string;
  dishName: string;
  kitchenId: string;
  dishId: string;
  base: string;
  sauce: string;
  cheeseOrMain: string;
  toppings: string[];
  dietaryTags: string[];
  createdAt: string;
}

function DashboardContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as TabKey) || "overview";

  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [creations, setCreations] = useState<SavedCreation[]>([]);
  const [loading, setLoading] = useState(true);

  // Profile Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Security Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdMsg, setPwdMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/dashboard");
    }
  }, [status, router]);

  const loadUserData = async () => {
    if (!session) return;
    setLoading(true);
    try {
      const [bookingsRes, creationsRes, profileRes] = await Promise.all([
        fetch("/api/customer/bookings"),
        fetch("/api/creations"),
        fetch("/api/auth/me"),
      ]);

      if (bookingsRes.ok) {
        const bData = await bookingsRes.json();
        setBookings(bData.bookings || []);
      }

      if (creationsRes.ok) {
        const cData = await creationsRes.json();
        setCreations(cData.creations || []);
      }

      if (profileRes.ok) {
        const pData = await profileRes.json();
        if (pData.user) {
          setName(pData.user.name || "");
          setPhone(pData.user.phone || "");
        }
      }
    } catch (e) {
      console.error("Error loading dashboard data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      loadUserData();
    }
  }, [session]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg(null);

    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile.");
      setProfileMsg({ type: "success", text: "Profile details updated successfully." });
    } catch (err: any) {
      setProfileMsg({ type: "error", text: err.message || "Something went wrong." });
    } finally {
      setProfileSaving(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdSaving(true);
    setPwdMsg(null);

    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to change password.");
      setPwdMsg({ type: "success", text: "Your password has been changed successfully." });
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: any) {
      setPwdMsg({ type: "error", text: err.message || "Failed to update password." });
    } finally {
      setPwdSaving(false);
    }
  };

  const handleDeleteCreation = async (id: string) => {
    if (!confirm("Are you sure you want to remove this dish creation?")) return;
    try {
      const res = await fetch(`/api/creations/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCreations((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (e) {
      console.error("Delete creation error:", e);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = prompt(
      "CAUTION: Deleting your account will permanently delete all saved dish creations and history. Type DELETE to confirm:"
    );
    if (confirmed === "DELETE") {
      try {
        const res = await fetch("/api/auth/me", { method: "DELETE" });
        if (res.ok) {
          signOut({ callbackUrl: "/" });
        }
      } catch (e) {
        alert("Failed to delete account. Please try again.");
      }
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-burgundy border-t-transparent rounded-full animate-spin" />
          <p className="font-display font-bold text-burgundy text-sm">
            Loading your PlatePlay dashboard...
          </p>
        </div>
      </div>
    );
  }

  const approvedBookings = bookings.filter((b) => b.status === "APPROVED");
  const pendingBookings = bookings.filter((b) => b.status === "PENDING");

  return (
    <div className="min-h-screen bg-cream text-charcoal flex flex-col selection:bg-burgundy selection:text-white">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        {/* User Welcome Banner */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-cream-300 shadow-soft mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-burgundy/10 text-burgundy flex items-center justify-center font-display font-extrabold text-2xl shrink-0">
              {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "P"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-black text-2xl sm:text-3xl text-charcoal tracking-tight">
                  Hi, {session?.user?.name || "Chef"}!
                </h1>
                <Badge variant="flame" className="text-[10px] py-0.5">
                  Member
                </Badge>
              </div>
              <p className="text-xs text-charcoal/60 mt-0.5">{session?.user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href="/build-your-plate"
              className="px-4 py-2.5 rounded-full bg-cream-100 hover:bg-cream-200 border border-cream-300 text-xs font-bold text-charcoal flex items-center gap-1.5 transition-colors"
            >
              <Sliders className="w-3.5 h-3.5 text-flame" />
              <span>Dish Studio</span>
            </Link>
            <Button
              href="/book"
              variant="flame"
              size="sm"
              className="shadow-sm"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Reserve a Kitchen
            </Button>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="p-2.5 rounded-full hover:bg-black/5 text-charcoal/60 hover:text-burgundy transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-cream-200">
          <button
            onClick={() => setActiveTab("overview")}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2",
              activeTab === "overview"
                ? "bg-burgundy text-white shadow-sm"
                : "text-charcoal/70 hover:text-charcoal hover:bg-cream-100"
            )}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>
          <button
            onClick={() => setActiveTab("bookings")}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2",
              activeTab === "bookings"
                ? "bg-burgundy text-white shadow-sm"
                : "text-charcoal/70 hover:text-charcoal hover:bg-cream-100"
            )}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>My Bookings ({bookings.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("creations")}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2",
              activeTab === "creations"
                ? "bg-burgundy text-white shadow-sm"
                : "text-charcoal/70 hover:text-charcoal hover:bg-cream-100"
            )}
          >
            <ChefHat className="w-3.5 h-3.5" />
            <span>My Creations ({creations.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2",
              activeTab === "profile"
                ? "bg-burgundy text-white shadow-sm"
                : "text-charcoal/70 hover:text-charcoal hover:bg-cream-100"
            )}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile</span>
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2",
              activeTab === "security"
                ? "bg-burgundy text-white shadow-sm"
                : "text-charcoal/70 hover:text-charcoal hover:bg-cream-100"
            )}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Account Security</span>
          </button>
        </div>

        {/* ─── TAB 1: OVERVIEW ─── */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-fade-in">
            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-cream-300 shadow-soft">
                <span className="text-[11px] font-mono text-charcoal/50 uppercase tracking-wider block mb-1">
                  Upcoming Approved
                </span>
                <span className="font-display font-black text-3xl text-emerald-700">
                  {approvedBookings.length}
                </span>
                <span className="text-xs text-charcoal/60 block mt-1">Confirmed private kitchen slots</span>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-cream-300 shadow-soft">
                <span className="text-[11px] font-mono text-charcoal/50 uppercase tracking-wider block mb-1">
                  Pending Requests
                </span>
                <span className="font-display font-black text-3xl text-amber-600">
                  {pendingBookings.length}
                </span>
                <span className="text-xs text-charcoal/60 block mt-1">Under pilot review</span>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-cream-300 shadow-soft">
                <span className="text-[11px] font-mono text-charcoal/50 uppercase tracking-wider block mb-1">
                  Saved Dishes
                </span>
                <span className="font-display font-black text-3xl text-burgundy">
                  {creations.length}
                </span>
                <span className="text-xs text-charcoal/60 block mt-1">Custom recipe blueprints</span>
              </div>
            </div>

            {/* Upcoming Approved Sessions Alert */}
            {approvedBookings.length > 0 && (
              <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200 space-y-4">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>You Have Confirmed Cooking Sessions!</span>
                </div>
                <div className="space-y-3">
                  {approvedBookings.map((b) => (
                    <div
                      key={b.id}
                      className="bg-white rounded-xl p-4 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <span className="font-mono font-bold text-burgundy block">
                          {b.publicReference} · {b.kitchenName}
                        </span>
                        <span className="text-charcoal font-semibold">
                          {b.packageName} Experience ({b.groupSize} Guests)
                        </span>
                        <div className="flex items-center gap-3 text-charcoal/60 mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-flame" />
                            {b.slotDate || "Date TBD"} ({b.slotTime || "Time TBD"})
                          </span>
                        </div>
                      </div>
                      <Link
                        href={`/booking-status?ref=${b.publicReference}&email=${encodeURIComponent(
                          session?.user?.email || ""
                        )}`}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-700 text-white font-bold hover:bg-emerald-800 transition-colors text-center"
                      >
                        Session Details
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Creations Quick Glance */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-300 shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display font-bold text-lg text-charcoal">
                    Recent Studio Creations
                  </h2>
                  <p className="text-xs text-charcoal/60">Your customized dish configurations</p>
                </div>
                <Link
                  href="/build-your-plate"
                  className="text-xs font-bold text-burgundy hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create New Dish</span>
                </Link>
              </div>

              {creations.length === 0 ? (
                <div className="p-8 text-center bg-cream-50 rounded-2xl border border-cream-200 space-y-3">
                  <ChefHat className="w-10 h-10 text-charcoal/30 mx-auto" />
                  <p className="text-xs font-medium text-charcoal/60">
                    You haven&apos;t saved any custom dishes yet.
                  </p>
                  <Button href="/build-your-plate" variant="flame" size="sm">
                    Open Build Your Plate
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {creations.slice(0, 3).map((dish) => (
                    <div
                      key={dish.id}
                      className="p-4 rounded-2xl bg-cream-50 border border-cream-200 flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-[10px] font-mono text-flame uppercase tracking-wider block mb-1">
                          {dish.kitchenId === "pizzeria" ? "Pizzeria Studio" : "Masala Kitchen"}
                        </span>
                        <h3 className="font-display font-bold text-base text-charcoal mb-1">
                          {dish.dishName}
                        </h3>
                        <p className="text-xs text-charcoal/60 line-clamp-2">
                          Base: {dish.base} · Sauce: {dish.sauce}
                        </p>
                      </div>
                      <div className="pt-3 mt-3 border-t border-cream-200 flex items-center justify-between text-xs">
                        <Link
                          href={`/build-your-plate?kitchen=${dish.kitchenId}&dish=${dish.dishId}&base=${dish.base}&sauce=${dish.sauce}`}
                          className="font-bold text-burgundy hover:underline flex items-center gap-1"
                        >
                          <span>Open in Studio</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── TAB 2: MY BOOKINGS ─── */}
        {activeTab === "bookings" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-300 shadow-soft space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cream-200">
              <div>
                <h2 className="font-display font-bold text-xl text-charcoal">
                  My Reservation Requests
                </h2>
                <p className="text-xs text-charcoal/60">
                  Track the real-time status of your group kitchen sessions
                </p>
              </div>
              <Button href="/book" variant="burgundy" size="sm">
                Request Another Session
              </Button>
            </div>

            {bookings.length === 0 ? (
              <div className="p-10 text-center space-y-3">
                <CalendarDays className="w-12 h-12 text-charcoal/20 mx-auto" />
                <h3 className="font-display font-bold text-base text-charcoal">
                  No reservations found
                </h3>
                <p className="text-xs text-charcoal/60 max-w-sm mx-auto">
                  Reserve a private kitchen with your group to start making unforgettable culinary memories.
                </p>
                <div className="pt-2">
                  <Button href="/book" variant="flame" size="md">
                    Book a Session Now
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((b) => (
                  <div
                    key={b.id}
                    className="p-5 rounded-2xl border border-cream-300 bg-cream-50/50 hover:bg-cream-50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-black text-sm text-burgundy">
                          {b.publicReference}
                        </span>
                        <span
                          className={cn(
                            "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                            b.status === "PENDING" && "bg-amber-100 text-amber-800",
                            b.status === "APPROVED" && "bg-emerald-100 text-emerald-800",
                            b.status === "DECLINED" && "bg-charcoal/10 text-charcoal/70",
                            b.status === "CANCELLED" && "bg-cream-200 text-charcoal/50",
                            b.status === "COMPLETED" && "bg-blue-100 text-blue-800"
                          )}
                        >
                          {b.status === "PENDING" ? "Under Review" : b.status}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-cream-200 text-charcoal/70 font-semibold">
                          Payment: {b.paymentStatus} (Beta)
                        </span>
                      </div>

                      <h3 className="font-display font-bold text-base text-charcoal">
                        {b.kitchenName} · {b.packageName} Experience
                      </h3>

                      <div className="flex items-center gap-4 text-xs text-charcoal/70 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-flame" />
                          {b.slotDate || "Date TBD"} ({b.slotTime || "Time TBD"})
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-flame" />
                          {b.groupSize} Guests
                        </span>
                        <span className="font-bold text-burgundy">
                          Est. ₹{(b.estimatedPricePaise / 100).toLocaleString("en-IN")}
                        </span>
                      </div>

                      {b.customDishDetails && (
                        <p className="text-[11px] text-charcoal/60 line-clamp-1 italic">
                          Custom Details: {b.customDishDetails}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        href={`/booking-status?ref=${b.publicReference}&email=${encodeURIComponent(
                          session?.user?.email || ""
                        )}`}
                        className="px-4 py-2 rounded-xl bg-white border border-cream-300 hover:bg-cream-200 text-charcoal text-xs font-bold transition-colors"
                      >
                        Live Tracker
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── TAB 3: MY CREATIONS ─── */}
        {activeTab === "creations" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-300 shadow-soft space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cream-200">
              <div>
                <h2 className="font-display font-bold text-xl text-charcoal">
                  My Custom Studio Dishes
                </h2>
                <p className="text-xs text-charcoal/60">
                  Dish configurations crafted in Build Your Plate
                </p>
              </div>
              <Button href="/build-your-plate" variant="flame" size="sm">
                Create New Dish
              </Button>
            </div>

            {creations.length === 0 ? (
              <div className="p-10 text-center space-y-3">
                <ChefHat className="w-12 h-12 text-charcoal/20 mx-auto" />
                <h3 className="font-display font-bold text-base text-charcoal">
                  No saved creations yet
                </h3>
                <p className="text-xs text-charcoal/60 max-w-sm mx-auto">
                  Head over to Build Your Plate to design your group&apos;s custom pizza or spiced bowl.
                </p>
                <div className="pt-2">
                  <Button href="/build-your-plate" variant="flame" size="md">
                    Open Studio
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {creations.map((c) => (
                  <div
                    key={c.id}
                    className="p-5 rounded-2xl border border-cream-300 bg-cream-50 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-flame">
                          {c.kitchenId === "pizzeria" ? "Pizzeria Studio" : "Masala Kitchen"}
                        </span>
                        <span className="text-[10px] text-charcoal/40 font-mono">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="font-display font-black text-lg text-charcoal mb-2">
                        {c.dishName}
                      </h3>

                      <div className="space-y-1 text-xs text-charcoal/70 bg-white p-3 rounded-xl border border-cream-200 mb-4">
                        <div>
                          <strong>Base:</strong> {c.base}
                        </div>
                        <div>
                          <strong>Sauce:</strong> {c.sauce}
                        </div>
                        {c.cheeseOrMain && (
                          <div>
                            <strong>Main:</strong> {c.cheeseOrMain}
                          </div>
                        )}
                        <div>
                          <strong>Toppings:</strong>{" "}
                          {c.toppings?.length > 0 ? c.toppings.join(", ") : "None"}
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-cream-200 flex items-center justify-between gap-2">
                      <Link
                        href={`/build-your-plate?kitchen=${c.kitchenId}&dish=${c.dishId}&base=${c.base}&sauce=${c.sauce}`}
                        className="text-xs font-bold text-burgundy hover:underline flex items-center gap-1"
                      >
                        <span>Open Studio</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/plan-experience?kitchen=${c.kitchenId}&dish=${encodeURIComponent(
                            c.dishName
                          )}`}
                          className="px-2.5 py-1 rounded-lg bg-burgundy/10 text-burgundy text-[11px] font-bold hover:bg-burgundy/20 transition-colors"
                        >
                          Plan Session
                        </Link>
                        <button
                          onClick={() => handleDeleteCreation(c.id)}
                          className="p-1.5 rounded-lg text-charcoal/40 hover:text-burgundy hover:bg-burgundy/10 transition-colors"
                          title="Delete creation"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── TAB 4: MY PROFILE ─── */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-300 shadow-soft max-w-2xl space-y-6 animate-fade-in">
            <div>
              <h2 className="font-display font-bold text-xl text-charcoal">
                My Profile Details
              </h2>
              <p className="text-xs text-charcoal/60">
                Manage your display information for kitchen reservations
              </p>
            </div>

            {profileMsg && (
              <div
                className={cn(
                  "p-3.5 rounded-xl text-xs flex items-center gap-2",
                  profileMsg.type === "success"
                    ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                    : "bg-burgundy/10 border border-burgundy/20 text-burgundy"
                )}
              >
                {profileMsg.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{profileMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-charcoal uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-charcoal uppercase tracking-wider">
                  Email Address <span className="text-charcoal/40 font-normal">(Account Identity)</span>
                </label>
                <input
                  type="email"
                  value={session?.user?.email || ""}
                  disabled
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-200 bg-cream-100 text-charcoal/60 text-sm cursor-not-allowed font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-charcoal uppercase tracking-wider">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy"
                />
              </div>

              <Button
                type="submit"
                disabled={profileSaving}
                variant="burgundy"
                size="md"
                className="mt-2"
              >
                {profileSaving ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </div>
        )}

        {/* ─── TAB 5: ACCOUNT SECURITY ─── */}
        {activeTab === "security" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-300 shadow-soft max-w-2xl space-y-8 animate-fade-in">
            <div>
              <h2 className="font-display font-bold text-xl text-charcoal">
                Account Security
              </h2>
              <p className="text-xs text-charcoal/60">
                Update your account password and manage your active access
              </p>
            </div>

            {pwdMsg && (
              <div
                className={cn(
                  "p-3.5 rounded-xl text-xs flex items-center gap-2",
                  pwdMsg.type === "success"
                    ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                    : "bg-burgundy/10 border border-burgundy/20 text-burgundy"
                )}
              >
                {pwdMsg.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{pwdMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-charcoal uppercase tracking-wider">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-charcoal uppercase tracking-wider">
                  New Password (Min 8 Characters)
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy"
                />
              </div>

              <Button
                type="submit"
                disabled={pwdSaving}
                variant="burgundy"
                size="md"
                className="mt-2"
              >
                {pwdSaving ? "Updating Password..." : "Update Password"}
              </Button>
            </form>

            <div className="pt-6 border-t border-cream-200">
              <h3 className="font-display font-bold text-base text-charcoal text-red-600">
                Danger Zone
              </h3>
              <p className="text-xs text-charcoal/60 mt-1 mb-4">
                Permanently delete your PlatePlay account, reservations history, and saved dish creations.
              </p>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold transition-colors"
              >
                Delete My Account
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-cream flex items-center justify-center">
          <div className="text-center font-display font-bold text-burgundy text-sm">
            Loading Dashboard...
          </div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}

