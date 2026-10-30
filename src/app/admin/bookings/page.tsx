"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  X,
  Mail,
  Calendar,
  AlertCircle,
  FileText,
  User,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BookingItem {
  id: string;
  publicReference: string;
  kitchenId: string;
  kitchenName: string;
  packageId: string;
  packageName: string;
  slotId?: string;
  slotDate?: string;
  slotTime?: string;
  groupSize: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  occasion?: string;
  dietaryRequirements: string[];
  dietaryNotes?: string;
  customDishDetails?: string;
  estimatedPricePaise: number;
  status: "PENDING" | "APPROVED" | "DECLINED" | "CANCELLED";
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
  statusHistory: Array<{
    previousStatus?: string;
    newStatus: string;
    changedAt: string;
    changedBy: string;
    notes?: string;
  }>;
}

function AdminBookingsContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  // Selected booking for detailed view/modal
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const url = new URL("/api/admin/bookings", window.location.origin);
      if (selectedStatus !== "ALL") url.searchParams.set("status", selectedStatus);
      if (searchQuery.trim()) url.searchParams.set("search", searchQuery.trim());

      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings);
      }
    } catch (e) {
      console.error("Failed to load bookings:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [selectedStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBookings();
  };

  const openBookingModal = (b: BookingItem) => {
    setSelectedBooking(b);
    setAdminNoteInput(b.adminNotes || "");
    setActionError(null);
  };

  const handleUpdateStatus = async (
    newStatus: "PENDING" | "APPROVED" | "DECLINED" | "CANCELLED"
  ) => {
    if (!selectedBooking) return;
    setUpdatingStatus(true);
    setActionError(null);

    try {
      const res = await fetch(`/api/admin/bookings/${selectedBooking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          adminNotes: adminNoteInput,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update booking status.");
      }

      setSelectedBooking(data.booking);
      // update list
      setBookings((prev) =>
        prev.map((item) => (item.id === data.booking.id ? data.booking : item))
      );
    } catch (err: any) {
      setActionError(err.message || "Failed to update status.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-charcoal tracking-tight">
          Booking Requests Management
        </h1>
        <p className="text-xs sm:text-sm text-charcoal/60 mt-1">
          Review, approve, or decline pilot kitchen reservation requests.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-cream-300 shadow-soft flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-1 bg-cream-100 p-1 rounded-xl border border-cream-200 text-xs w-full md:w-auto">
          {["ALL", "PENDING", "APPROVED", "DECLINED", "CANCELLED"].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={cn(
                "px-3.5 py-1.5 rounded-lg font-bold transition-all",
                selectedStatus === status
                  ? "bg-white text-burgundy shadow-sm"
                  : "text-charcoal/70 hover:text-charcoal"
              )}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full md:w-80">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search reference, name, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-cream-300 text-xs focus:outline-none focus:ring-2 focus:ring-burgundy"
            />
            <Search className="w-3.5 h-3.5 text-charcoal/40 absolute left-3 top-2.5" />
          </div>
          <button
            type="submit"
            className="px-3.5 py-1.5 rounded-xl bg-burgundy text-white text-xs font-bold hover:bg-burgundy-hover"
          >
            Search
          </button>
        </form>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-3xl border border-cream-300 shadow-soft overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-charcoal/60">
            Loading booking requests...
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-12 text-center text-xs text-charcoal/50">
            No requests found matching your filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream-100 text-charcoal/60 font-mono uppercase tracking-wider text-[10px] border-b border-cream-200">
                <tr>
                  <th className="p-4">Reference</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Kitchen Studio</th>
                  <th className="p-4">Package</th>
                  <th className="p-4">Date & Slot</th>
                  <th className="p-4">Guests</th>
                  <th className="p-4">Est. Total</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {bookings.map((b) => (
                  <tr
                    key={b.id}
                    onClick={() => openBookingModal(b)}
                    className="hover:bg-cream-50/60 cursor-pointer transition-colors"
                  >
                    <td className="p-4 font-mono font-bold text-burgundy">{b.publicReference}</td>
                    <td className="p-4">
                      <span className="font-bold text-charcoal block">{b.customerName}</span>
                      <span className="text-charcoal/50 text-[11px]">{b.customerEmail}</span>
                    </td>
                    <td className="p-4 font-semibold text-charcoal">{b.kitchenName}</td>
                    <td className="p-4 text-charcoal">{b.packageName}</td>
                    <td className="p-4">
                      <span className="font-medium text-charcoal block">{b.slotDate || "—"}</span>
                      <span className="text-charcoal/50 text-[11px]">{b.slotTime || ""}</span>
                    </td>
                    <td className="p-4 font-bold text-charcoal">{b.groupSize}</td>
                    <td className="p-4 font-mono font-bold text-burgundy">
                      ₹{(b.estimatedPricePaise / 100).toLocaleString("en-IN")}
                    </td>
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
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openBookingModal(b);
                        }}
                        className="px-3 py-1 rounded-lg bg-cream-200 hover:bg-cream-300 text-charcoal text-[11px] font-bold"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DETAIL & ACTION MODAL */}
      {selectedBooking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/70 backdrop-blur-sm"
          onClick={() => setSelectedBooking(null)}
        >
          <div
            className="w-full max-w-2xl bg-white text-charcoal rounded-3xl p-6 sm:p-8 shadow-2xl border border-cream-300 max-h-[90vh] overflow-y-auto relative animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedBooking(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-cream-200 hover:bg-cream-300 text-charcoal transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="pb-4 border-b border-cream-200">
              <span className="text-[10px] font-mono uppercase tracking-widest text-charcoal/50 block mb-1">
                Booking Request Details
              </span>
              <div className="flex items-center gap-3">
                <h2 className="font-display font-black text-2xl text-charcoal">
                  {selectedBooking.publicReference}
                </h2>
                <span
                  className={cn(
                    "px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider",
                    selectedBooking.status === "PENDING" && "bg-amber-100 text-amber-800",
                    selectedBooking.status === "APPROVED" && "bg-emerald-100 text-emerald-800",
                    selectedBooking.status === "DECLINED" && "bg-charcoal/10 text-charcoal/70",
                    selectedBooking.status === "CANCELLED" && "bg-cream-200 text-charcoal/50"
                  )}
                >
                  {selectedBooking.status}
                </span>
              </div>
            </div>

            {/* Action Notice */}
            {actionError && (
              <div className="my-4 p-3 rounded-xl bg-burgundy/10 border border-burgundy/30 text-burgundy text-xs">
                {actionError}
              </div>
            )}

            {/* Core Info Grid */}
            <div className="py-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-cream-100 p-3.5 rounded-xl border border-cream-200">
                <span className="text-charcoal/50 uppercase tracking-wider block text-[10px] mb-1">
                  Primary Customer
                </span>
                <p className="font-bold text-sm text-charcoal">{selectedBooking.customerName}</p>
                <p className="text-charcoal/70">{selectedBooking.customerEmail}</p>
                {selectedBooking.customerPhone && (
                  <p className="text-charcoal/70">{selectedBooking.customerPhone}</p>
                )}
                {selectedBooking.occasion && (
                  <p className="text-charcoal/60 mt-1 italic">
                    Occasion: {selectedBooking.occasion}
                  </p>
                )}
              </div>

              <div className="bg-cream-100 p-3.5 rounded-xl border border-cream-200">
                <span className="text-charcoal/50 uppercase tracking-wider block text-[10px] mb-1">
                  Experience & Studio
                </span>
                <p className="font-bold text-sm text-charcoal">{selectedBooking.packageName}</p>
                <p className="text-charcoal/70">{selectedBooking.kitchenName}</p>
                <p className="text-charcoal/70 mt-1">
                  {selectedBooking.slotDate} · {selectedBooking.slotTime}
                </p>
                <p className="font-bold text-burgundy mt-1">
                  {selectedBooking.groupSize} Guests · ₹
                  {(selectedBooking.estimatedPricePaise / 100).toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            {/* Dietary & Custom Dish */}
            <div className="space-y-3 pb-4 border-b border-cream-200 text-xs">
              <div>
                <span className="font-bold text-charcoal block mb-1">Dietary Declarations:</span>
                {selectedBooking.dietaryRequirements.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedBooking.dietaryRequirements.map((d, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md bg-cream-200 text-charcoal font-medium text-[11px]"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-charcoal/50">None specified</span>
                )}
              </div>

              {selectedBooking.customDishDetails && (
                <div>
                  <span className="font-bold text-charcoal block mb-1">Custom Dish / Notes:</span>
                  <p className="p-3 bg-cream-100 rounded-xl border border-cream-200 text-charcoal/80">
                    {selectedBooking.customDishDetails}
                  </p>
                </div>
              )}
            </div>

            {/* Admin Notes Field */}
            <div className="py-4 space-y-2">
              <label className="text-xs font-bold text-charcoal uppercase tracking-wider block">
                Director / Admin Notes (Visible to Customer in Tracker)
              </label>
              <textarea
                rows={2}
                value={adminNoteInput}
                onChange={(e) => setAdminNoteInput(e.target.value)}
                placeholder="e.g. Aprons reserved, chef mentor assigned for 02:30 PM slot."
                className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-xs focus:outline-none focus:ring-2 focus:ring-burgundy"
              />
            </div>

            {/* Approval / Decline Actions */}
            <div className="pt-2 flex flex-wrap gap-2.5 justify-end">
              {selectedBooking.status !== "APPROVED" && (
                <button
                  type="button"
                  disabled={updatingStatus}
                  onClick={() => handleUpdateStatus("APPROVED")}
                  className="px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve & Confirm Slot</span>
                </button>
              )}

              {selectedBooking.status !== "DECLINED" && (
                <button
                  type="button"
                  disabled={updatingStatus}
                  onClick={() => handleUpdateStatus("DECLINED")}
                  className="px-5 py-2.5 rounded-full bg-charcoal hover:bg-black text-white text-xs font-bold transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Decline Request</span>
                </button>
              )}

              {selectedBooking.status !== "CANCELLED" && (
                <button
                  type="button"
                  disabled={updatingStatus}
                  onClick={() => handleUpdateStatus("CANCELLED")}
                  className="px-4 py-2.5 rounded-full border border-cream-300 hover:bg-cream-100 text-charcoal text-xs font-bold transition-colors disabled:opacity-50"
                >
                  Cancel Request
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminBookingsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-charcoal/60">
          Loading booking management...
        </div>
      }
    >
      <AdminBookingsContent />
    </Suspense>
  );
}

