"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  UtensilsCrossed,
  CheckCircle2,
  Clock,
  Users,
  ChefHat,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  ClipboardList,
  CheckSquare,
  Square,
  ShieldCheck,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SessionOperation {
  id: string;
  publicReference: string;
  customerName: string;
  customerPhone?: string;
  kitchenName: string;
  packageName: string;
  groupSize: number;
  slotDate?: string;
  slotTime?: string;
  status: string;
  occasion?: string;
  dietaryRequirements: string[];
  dietaryNotes?: string;
  customDishDetails?: string;
  checklist: {
    coreIngredientsReady: boolean;
    specialtyIngredientsReady: boolean;
    onDemandIngredientsReady: boolean;
    equipmentSanitized: boolean;
    workstationSet: boolean;
    safetyBriefingCompleted: boolean;
    sessionCompleted: boolean;
    cleaningResetDone: boolean;
  };
  inventory: {
    core: string[];
    specialty: string[];
    onDemand: string[];
    equipment: string[];
  };
}

export default function KitchenOperationsPage() {
  const [sessions, setSessions] = useState<SessionOperation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/operations");
      if (res.ok) {
        const data = await res.json();
        setSessions(data.sessions || []);
      }
    } catch (e) {
      console.error("Failed to load operations:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const toggleChecklistStep = async (
    sessionId: string,
    stepKey: keyof SessionOperation["checklist"]
  ) => {
    const session = sessions.find((s) => s.id === sessionId);
    if (!session) return;

    const updatedChecklist = {
      ...session.checklist,
      [stepKey]: !session.checklist[stepKey],
    };

    // Optimistic UI update
    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId ? { ...s, checklist: updatedChecklist } : s
      )
    );

    try {
      await fetch(`/api/admin/operations/${sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedChecklist),
      });
    } catch (e) {
      console.error("Checklist update error:", e);
    }
  };

  const filteredSessions = sessions.filter((s) =>
    filterDate ? s.slotDate === filterDate : true
  );

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cream-300">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-charcoal tracking-tight flex items-center gap-2.5">
            <ClipboardList className="w-7 h-7 text-flame" />
            <span>Kitchen Operations & Prep Hub</span>
          </h1>
          <p className="text-xs text-charcoal/60 mt-1">
            Staff preparation checklists, inventory staging, and sanitation oversight for active group sessions
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="px-3.5 py-2 rounded-xl bg-white border border-cream-300 text-xs font-bold text-charcoal hover:bg-cream-100 flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Date Filter & Guidance Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-cream-300 shadow-soft">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-charcoal uppercase tracking-wider">
            Filter by Date:
          </span>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-cream-300 text-xs bg-cream-50 focus:outline-none focus:ring-2 focus:ring-burgundy"
          />
          {filterDate && (
            <button
              onClick={() => setFilterDate("")}
              className="text-xs text-flame font-semibold hover:underline ml-1"
            >
              Clear
            </button>
          )}
        </div>

        <div className="text-[11px] text-charcoal/60 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Follow strict safety protocol: sanitize induction stoves & verify allergen separation.</span>
        </div>
      </div>

      {/* Sessions Operational Cards */}
      {filteredSessions.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-cream-300 text-center space-y-3">
          <ChefHat className="w-12 h-12 text-charcoal/20 mx-auto" />
          <h2 className="font-display font-bold text-lg text-charcoal">
            No Active Operational Sessions
          </h2>
          <p className="text-xs text-charcoal/60 max-w-sm mx-auto">
            When customer booking requests are reviewed and approved, their operational checklists and inventory manifests appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredSessions.map((session) => {
            const steps = [
              { key: "coreIngredientsReady" as const, label: "Core Inventory Staged & Weighed" },
              { key: "specialtyIngredientsReady" as const, label: "Specialty Finishes & Herbs Portioned" },
              { key: "onDemandIngredientsReady" as const, label: "Custom Sourcing / Allergens Checked" },
              { key: "equipmentSanitized" as const, label: "Induction Stations & Knives Sanitized" },
              { key: "workstationSet" as const, label: "Aprons, Boards & Peels Laid Out" },
              { key: "safetyBriefingCompleted" as const, label: "Welcome & Safety Briefing Completed" },
              { key: "sessionCompleted" as const, label: "Cooking Session Wrapped & Plated" },
              { key: "cleaningResetDone" as const, label: "Kitchen Deep-Cleaned & Reset for Next Group" },
            ];

            const completedCount = steps.filter((st) => session.checklist[st.key]).length;
            const progressPct = Math.round((completedCount / steps.length) * 100);

            return (
              <div
                key={session.id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-300 shadow-soft space-y-6"
              >
                {/* Header Information */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-cream-200">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-black text-sm text-burgundy bg-burgundy/10 px-2.5 py-0.5 rounded-lg">
                        {session.publicReference}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                        {session.status}
                      </span>
                      <span className="text-xs font-bold text-charcoal">
                        {session.kitchenName}
                      </span>
                    </div>

                    <h2 className="font-display font-black text-xl text-charcoal">
                      {session.packageName} Experience · {session.groupSize} Guests
                    </h2>

                    <div className="flex items-center gap-4 text-xs text-charcoal/70 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-flame" />
                        {session.slotDate || "Date TBD"} ({session.slotTime || "Time TBD"})
                      </span>
                      <span>Primary: <strong>{session.customerName}</strong> {session.customerPhone && `(${session.customerPhone})`}</span>
                    </div>
                  </div>

                  {/* Progress Indicator */}
                  <div className="bg-cream-50 p-4 rounded-2xl border border-cream-200 min-w-[200px] text-right">
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="font-mono text-charcoal/60 uppercase">Prep Progress</span>
                      <span className="font-mono font-bold text-burgundy">{progressPct}%</span>
                    </div>
                    <div className="w-full bg-cream-200 h-2 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full transition-all duration-300",
                          progressPct === 100 ? "bg-emerald-600" : "bg-flame"
                        )}
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-charcoal/50 block mt-1">
                      {completedCount} of {steps.length} operational steps verified
                    </span>
                  </div>
                </div>

                {/* Dietary & Custom Recipe Alerts */}
                {(session.dietaryRequirements.length > 0 ||
                  session.dietaryNotes ||
                  session.customDishDetails) && (
                  <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2 text-xs">
                    <div className="flex items-center gap-1.5 text-amber-900 font-bold">
                      <AlertTriangle className="w-4 h-4 text-amber-700" />
                      <span>Culinary & Dietary Alerts</span>
                    </div>
                    {session.dietaryRequirements.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-amber-800 font-semibold">Dietary Profile:</span>
                        {session.dietaryRequirements.map((d) => (
                          <span
                            key={d}
                            className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold"
                          >
                            {d}
                          </span>
                        ))}
                      </div>
                    )}
                    {session.dietaryNotes && (
                      <p className="text-amber-900">
                        <strong>Dietary Notes:</strong> {session.dietaryNotes}
                      </p>
                    )}
                    {session.customDishDetails && (
                      <p className="text-amber-900">
                        <strong>Custom Dish Concept:</strong> {session.customDishDetails}
                      </p>
                    )}
                  </div>
                )}

                {/* Split Operational Grid: Left = Inventory Manifests, Right = Checklist */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left: 3-Tier Inventory Breakdown */}
                  <div className="lg:col-span-6 space-y-4">
                    <h3 className="font-display font-bold text-sm text-charcoal uppercase tracking-wider flex items-center gap-1.5">
                      <Package className="w-4 h-4 text-burgundy" />
                      <span>Ingredient & Equipment Staging</span>
                    </h3>

                    <div className="space-y-3 text-xs">
                      {/* Core Inventory */}
                      <div className="p-3.5 rounded-2xl bg-cream-50 border border-cream-200">
                        <span className="font-bold text-burgundy uppercase text-[11px] block mb-1">
                          1. Core Inventory (Always Stocked)
                        </span>
                        <ul className="list-disc list-inside space-y-1 text-charcoal/80">
                          {session.inventory.core.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Specialty Inventory */}
                      <div className="p-3.5 rounded-2xl bg-cream-50 border border-cream-200">
                        <span className="font-bold text-flame uppercase text-[11px] block mb-1">
                          2. Specialty Inventory (Culinary Finishes)
                        </span>
                        <ul className="list-disc list-inside space-y-1 text-charcoal/80">
                          {session.inventory.specialty.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>

                      {/* On-Demand Inventory */}
                      <div className="p-3.5 rounded-2xl bg-cream-50 border border-cream-200">
                        <span className="font-bold text-charcoal uppercase text-[11px] block mb-1">
                          3. On-Demand / Custom Hub Items
                        </span>
                        <ul className="list-disc list-inside space-y-1 text-charcoal/80">
                          {session.inventory.onDemand.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Equipment Setup */}
                      <div className="p-3.5 rounded-2xl bg-cream-100 border border-cream-300">
                        <span className="font-bold text-charcoal uppercase text-[11px] block mb-1">
                          Equipment & Tools Required
                        </span>
                        <ul className="list-disc list-inside space-y-1 text-charcoal/80">
                          {session.inventory.equipment.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Right: Step-by-Step Checklist */}
                  <div className="lg:col-span-6 space-y-4">
                    <h3 className="font-display font-bold text-sm text-charcoal uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Operational Checklist</span>
                    </h3>

                    <div className="space-y-2">
                      {steps.map((st) => {
                        const checked = session.checklist[st.key];
                        return (
                          <div
                            key={st.key}
                            onClick={() => toggleChecklistStep(session.id, st.key)}
                            className={cn(
                              "p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3 select-none text-xs",
                              checked
                                ? "bg-emerald-50/80 border-emerald-300 text-emerald-950"
                                : "bg-white border-cream-300 text-charcoal hover:border-charcoal/30"
                            )}
                          >
                            {checked ? (
                              <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                            ) : (
                              <Square className="w-4 h-4 text-charcoal/30 shrink-0" />
                            )}
                            <span className={cn("font-medium", checked && "line-through opacity-80")}>
                              {st.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

