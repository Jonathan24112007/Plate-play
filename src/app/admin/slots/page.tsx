"use client";

import React, { useState, useEffect } from "react";
import {
  Clock,
  Calendar,
  Plus,
  CheckCircle2,
  AlertTriangle,
  X,
  Filter,
  RefreshCw,
  Edit2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SlotItem {
  id: string;
  kitchenId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "AVAILABLE" | "BOOKED" | "BLOCKED" | "PAST";
  capacity: number;
  notes?: string;
}

export default function AdminSlotsPage() {
  const [slots, setSlots] = useState<SlotItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [kitchenFilter, setKitchenFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("");

  // Create Slot Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newKitchenId, setNewKitchenId] = useState("k-pizzeria");
  const [newDate, setNewDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  });
  const [newStartTime, setNewStartTime] = useState("11:30");
  const [newEndTime, setNewEndTime] = useState("13:30");
  const [newCapacity, setNewCapacity] = useState(4);
  const [newNotes, setNewNotes] = useState("");
  const [creating, setCreating] = useState(false);

  // Edit Slot State
  const [editingSlot, setEditingSlot] = useState<SlotItem | null>(null);
  const [updating, setUpdating] = useState(false);

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/slots");
      if (res.ok) {
        const data = await res.json();
        setSlots(data.slots);
      }
    } catch (e) {
      console.error("Failed to load slots:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const handleCreateSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch("/api/admin/slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kitchenId: newKitchenId,
          date: newDate,
          startTime: newStartTime,
          endTime: newEndTime,
          capacity: newCapacity,
          status: "AVAILABLE",
          notes: newNotes || undefined,
        }),
      });

      if (res.ok) {
        setIsAddModalOpen(false);
        fetchSlots();
      }
    } catch (e) {
      console.error("Error creating slot:", e);
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateSlotStatus = async (slotId: string, newStatus: SlotItem["status"]) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/slots/${slotId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const data = await res.json();
        setSlots((prev) => prev.map((s) => (s.id === slotId ? data.slot : s)));
        if (editingSlot?.id === slotId) setEditingSlot(data.slot);
      }
    } catch (e) {
      console.error("Error updating slot:", e);
    } finally {
      setUpdating(false);
    }
  };

  // Filter slots
  const filteredSlots = slots.filter((s) => {
    if (kitchenFilter !== "ALL" && s.kitchenId !== kitchenFilter) return false;
    if (dateFilter && s.date !== dateFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cream-300">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-charcoal tracking-tight">
            Kitchen Slot Management
          </h1>
          <p className="text-xs sm:text-sm text-charcoal/60 mt-1">
            Configure session windows, capacity limits, and maintenance blocks across pilot kitchens.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchSlots}
            className="p-2 rounded-xl bg-white border border-cream-300 hover:bg-cream-100 text-charcoal"
            title="Refresh Slots"
          >
            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-burgundy hover:bg-burgundy-hover text-white text-xs font-bold flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create Session Slot</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-cream-300 shadow-soft flex flex-wrap gap-4 items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <label className="font-bold text-charcoal/70 uppercase tracking-wider text-[11px]">
            Kitchen:
          </label>
          <select
            value={kitchenFilter}
            onChange={(e) => setKitchenFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-cream-300 bg-cream-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-burgundy"
          >
            <option value="ALL">All Kitchens</option>
            <option value="k-pizzeria">Pizzeria Studio</option>
            <option value="k-masala">Masala Kitchen</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <label className="font-bold text-charcoal/70 uppercase tracking-wider text-[11px]">
            Filter Date:
          </label>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-cream-300 bg-cream-50 text-xs focus:outline-none focus:ring-2 focus:ring-burgundy"
          />
          {dateFilter && (
            <button
              onClick={() => setDateFilter("")}
              className="text-[11px] text-burgundy underline font-bold"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Slots Table */}
      <div className="bg-white rounded-3xl border border-cream-300 shadow-soft overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-charcoal/60">Loading slots...</div>
        ) : filteredSlots.length === 0 ? (
          <div className="p-12 text-center text-xs text-charcoal/50">
            No session slots found for current filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream-100 text-charcoal/60 font-mono uppercase tracking-wider text-[10px] border-b border-cream-200">
                <tr>
                  <th className="p-4">Kitchen</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Session Window</th>
                  <th className="p-4">Capacity</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Toggle Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {filteredSlots.map((s) => (
                  <tr key={s.id} className="hover:bg-cream-50/50 transition-colors">
                    <td className="p-4 font-bold text-charcoal">
                      {s.kitchenId === "k-pizzeria" ? "Pizzeria Studio" : "Masala Kitchen"}
                    </td>
                    <td className="p-4 font-mono font-medium">{s.date}</td>
                    <td className="p-4 font-mono">
                      {s.startTime} – {s.endTime}
                    </td>
                    <td className="p-4 font-bold text-charcoal">{s.capacity} Guests</td>
                    <td className="p-4">
                      <span
                        className={cn(
                          "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                          s.status === "AVAILABLE" && "bg-emerald-100 text-emerald-800",
                          s.status === "BOOKED" && "bg-burgundy/10 text-burgundy",
                          s.status === "BLOCKED" && "bg-charcoal/10 text-charcoal/70"
                        )}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-1.5">
                      {s.status !== "AVAILABLE" && (
                        <button
                          disabled={updating}
                          onClick={() => handleUpdateSlotStatus(s.id, "AVAILABLE")}
                          className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[10px] font-bold"
                        >
                          Make Available
                        </button>
                      )}
                      {s.status !== "BLOCKED" && (
                        <button
                          disabled={updating}
                          onClick={() => handleUpdateSlotStatus(s.id, "BLOCKED")}
                          className="px-2.5 py-1 rounded-md bg-charcoal/10 text-charcoal hover:bg-charcoal/20 text-[10px] font-bold"
                        >
                          Block Slot
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE SLOT MODAL */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/70 backdrop-blur-sm"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white text-charcoal rounded-3xl p-6 sm:p-8 shadow-2xl border border-cream-300 relative animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-cream-200 hover:bg-cream-300 text-charcoal transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="font-display font-black text-xl text-charcoal mb-4">
              Add Pilot Session Slot
            </h2>

            <form onSubmit={handleCreateSlot} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-charcoal/70 uppercase tracking-wider text-[10px]">
                  Kitchen Studio
                </label>
                <select
                  value={newKitchenId}
                  onChange={(e) => setNewKitchenId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-cream-50 focus:outline-none focus:ring-2 focus:ring-burgundy"
                >
                  <option value="k-pizzeria">Pizzeria Studio</option>
                  <option value="k-masala">Masala Kitchen</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-charcoal/70 uppercase tracking-wider text-[10px]">
                  Date
                </label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-cream-50 focus:outline-none focus:ring-2 focus:ring-burgundy"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-charcoal/70 uppercase tracking-wider text-[10px]">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-cream-50 focus:outline-none focus:ring-2 focus:ring-burgundy"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-charcoal/70 uppercase tracking-wider text-[10px]">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={newEndTime}
                    onChange={(e) => setNewEndTime(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-cream-50 focus:outline-none focus:ring-2 focus:ring-burgundy"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-charcoal/70 uppercase tracking-wider text-[10px]">
                  Group Capacity (Guests)
                </label>
                <input
                  type="number"
                  min={1}
                  max={8}
                  value={newCapacity}
                  onChange={(e) => setNewCapacity(parseInt(e.target.value, 10))}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-cream-50 focus:outline-none focus:ring-2 focus:ring-burgundy"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-charcoal/70 uppercase tracking-wider text-[10px]">
                  Internal Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Extra prep time reserved"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-cream-50 focus:outline-none focus:ring-2 focus:ring-burgundy"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-cream-300 hover:bg-cream-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 rounded-full bg-burgundy hover:bg-burgundy-hover text-white font-bold"
                >
                  {creating ? "Adding..." : "Add Session Slot"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

