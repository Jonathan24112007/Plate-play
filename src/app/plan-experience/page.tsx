"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Button } from "@/components/common/Button";
import { Badge } from "@/components/common/Badge";
import { EXPERIENCES } from "@/data/experiences";
import { KITCHENS } from "@/data/kitchens";
import {
  Sparkles,
  Users,
  ChefHat,
  Calendar,
  Heart,
  CheckCircle2,
  Copy,
  Check,
  ArrowRight,
  ArrowLeft,
  Info,
  Clock,
  Flame,
  ShieldCheck,
  Sliders,
} from "lucide-react";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";

const OCCASIONS = [
  "Friends Hangout",
  "Birthday Celebration",
  "Family Time",
  "Couple Experience",
  "College Group",
  "Corporate / Team Outing",
  "Other",
];

const DIETARY_OPTIONS = [
  "Vegetarian",
  "Jain (No Onion / Garlic)",
  "Vegan",
  "Gluten-Sensitive",
  "Nut Allergy",
  "Dairy-Sensitive",
];

function PlanExperienceContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Multi-step State (1 to 6)
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Package
  const initialPackage = searchParams.get("package") || "create";
  const [selectedPackage, setSelectedPackage] = useState<string>(initialPackage);

  // Step 2: Kitchen
  const initialKitchen = searchParams.get("kitchen") || "pizzeria";
  const [selectedKitchen, setSelectedKitchen] = useState<string>(initialKitchen);

  // Step 3: Group details
  const [groupSize, setGroupSize] = useState<number>(4); // Default 4 for pilot model
  const [occasion, setOccasion] = useState<string>("Friends Hangout");
  const [vibeNote, setVibeNote] = useState<string>("");

  // Step 4: Dietary preferences
  const [dietary, setDietary] = useState<string[]>([]);
  const [dietaryNotes, setDietaryNotes] = useState<string>("");

  // Transferred dish from /build-your-plate
  const customDishName = searchParams.get("dishName") || "";
  const customDishBase = searchParams.get("base") || "";
  const customDishSauce = searchParams.get("sauce") || "";
  const customDishToppings = searchParams.get("toppings") || "";

  // Feedback states
  const [copied, setCopied] = useState(false);

  // Pricing calculations
  const packageData =
    EXPERIENCES.find((exp) => exp.id === selectedPackage) || EXPERIENCES[1];
  const pricePerPerson = packageData.pricePerPerson;
  const estimatedTotal = groupSize * pricePerPerson;

  // Toggle dietary
  const handleToggleDietary = (item: string) => {
    setDietary((prev) =>
      prev.includes(item) ? prev.filter((d) => d !== item) : [...prev, item]
    );
  };

  // Copy Plan Text
  const handleCopyPlan = () => {
    const kitchenData = KITCHENS.find((k) => k.id === selectedKitchen);
    const planText = `📋 PlatePlay Experience Plan:
Package: ${packageData.name} (${packageData.subtitle}) - ₹${packageData.pricePerPerson}/person
Studio: ${kitchenData?.name || selectedKitchen}
Group Size: ${groupSize} guests ${groupSize !== 4 ? "(Custom Size - Pending Confirmation)" : "(Standard Pilot Pod)"}
Occasion: ${occasion}
Estimated Base Total: ₹${estimatedTotal.toLocaleString("en-IN")}
Dietary Notes: ${dietary.length > 0 ? dietary.join(", ") : "None specified"} ${dietaryNotes ? `(${dietaryNotes})` : ""}
${customDishName ? `Transferred Custom Dish: "${customDishName}"` : ""}

Planned with PlatePlay Experience Planner (v0.2)`;

    navigator.clipboard.writeText(planText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ["#FF6B3D", "#8C1538", "#FFB8C8"],
      });
    } catch (e) {}
  };

  // Transfer to Waitlist
  const handleJoinWaitlistWithPlan = () => {
    router.push(
      `/#waitlist?experience=${selectedPackage}&kitchen=${selectedKitchen}&groupSize=${groupSize}&occasion=${encodeURIComponent(
        occasion
      )}`
    );
  };

  return (
    <div className="min-h-screen bg-cream text-charcoal flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-burgundy/10 text-burgundy text-xs font-bold tracking-widest uppercase mb-3">
              <Calendar className="w-3.5 h-3.5" />
              <span>Interactive Session Planner</span>
            </div>
            <h1 className="font-display font-black text-3xl sm:text-5xl text-charcoal tracking-tight leading-[1.08] mb-3">
              Plan Your <span className="text-burgundy">Experience.</span>
            </h1>
            <p className="text-sm sm:text-base text-charcoal/75 leading-relaxed max-w-xl mx-auto">
              Configure your group size, occasion, and kitchen format. Calculate dynamic introductory estimates and transfer your plan to priority waitlist access.
            </p>
          </div>

          {/* Stepper Progress Bar */}
          <div className="mb-10">
            <div className="flex items-center justify-between max-w-2xl mx-auto relative px-2">
              <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 bg-cream-300 -z-0" />
              {[1, 2, 3, 4, 5, 6].map((step) => {
                const isCompleted = currentStep > step;
                const isCurrent = currentStep === step;
                return (
                  <button
                    key={step}
                    onClick={() => setCurrentStep(step)}
                    className={cn(
                      "w-9 h-9 rounded-full flex items-center justify-center font-display font-bold text-xs transition-all relative z-10",
                      isCurrent
                        ? "bg-flame text-white shadow-glow ring-4 ring-cream"
                        : isCompleted
                        ? "bg-burgundy text-white ring-2 ring-cream"
                        : "bg-cream-200 text-charcoal/60 border border-cream-300 ring-2 ring-cream"
                    )}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : step}
                  </button>
                );
              })}
            </div>
            <div className="text-center mt-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-burgundy">
                {currentStep === 1 && "Step 1: Choose Your Package"}
                {currentStep === 2 && "Step 2: Choose Your Kitchen Studio"}
                {currentStep === 3 && "Step 3: Group Size & Occasion"}
                {currentStep === 4 && "Step 4: Dietary Needs & Notes"}
                {currentStep === 5 && "Step 5: Dynamic Base Estimate"}
                {currentStep === 6 && "Step 6: Review & Final Plan"}
              </span>
            </div>
          </div>

          {/* Planner Form Card */}
          <div className="bg-cream-50 rounded-3xl p-6 sm:p-10 border-2 border-burgundy/15 shadow-card relative mb-8">
            {/* STEP 1: Package Selection */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-cream-200 pb-4">
                  <h2 className="font-display font-bold text-2xl text-charcoal">
                    Select Your Cooking Experience
                  </h2>
                  <p className="text-xs sm:text-sm text-charcoal/60 mt-1">
                    Choose the format matching your group&apos;s creative freedom.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {EXPERIENCES.map((exp) => {
                    const isSelected = selectedPackage === exp.id;
                    return (
                      <div
                        key={exp.id}
                        onClick={() => setSelectedPackage(exp.id)}
                        className={cn(
                          "p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between",
                          isSelected
                            ? "bg-cream border-burgundy shadow-md ring-2 ring-burgundy/20"
                            : "bg-cream-100/70 border-cream-300 hover:border-charcoal/30"
                        )}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-mono font-bold text-charcoal/50">
                              {exp.code}
                            </span>
                            {exp.badge && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-burgundy text-white uppercase">
                                {exp.badge}
                              </span>
                            )}
                          </div>
                          <h3 className="font-display font-black text-2xl text-charcoal">
                            {exp.name}
                          </h3>
                          <span className="text-xs font-bold text-flame block mb-3">
                            {exp.subtitle}
                          </span>
                          <p className="text-xs text-charcoal/70 leading-relaxed mb-4">
                            {exp.description}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-cream-200">
                          <span className="font-display font-black text-xl text-burgundy block">
                            ₹{exp.pricePerPerson}
                            <span className="text-xs text-charcoal/60 font-normal">
                              {" "}
                              / person
                            </span>
                          </span>
                          <span className="text-[11px] text-charcoal/50 flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3 text-flame" />
                            {exp.duration}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 2: Kitchen Selection */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-cream-200 pb-4">
                  <h2 className="font-display font-bold text-2xl text-charcoal">
                    Select Your Cooking Studio
                  </h2>
                  <p className="text-xs sm:text-sm text-charcoal/60 mt-1">
                    Choose the private themed kitchen for your group booking.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {KITCHENS.filter((k) => k.isPilot).map((kitchen) => {
                    const isSelected = selectedKitchen === kitchen.id;
                    return (
                      <div
                        key={kitchen.id}
                        onClick={() => setSelectedKitchen(kitchen.id)}
                        className={cn(
                          "p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between",
                          isSelected
                            ? "bg-cream border-flame shadow-md ring-2 ring-flame/20"
                            : "bg-cream-100/70 border-cream-300 hover:border-flame/30"
                        )}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="px-2.5 py-0.5 rounded-full bg-flame/15 text-flame text-xs font-bold uppercase tracking-wider">
                              Pilot Kitchen
                            </span>
                            <Flame className="w-4 h-4 text-flame" />
                          </div>
                          <h3 className="font-display font-bold text-xl text-charcoal mb-1">
                            {kitchen.name}
                          </h3>
                          <p className="text-xs font-semibold text-burgundy mb-2">
                            {kitchen.heroTagline}
                          </p>
                          <p className="text-xs text-charcoal/70 leading-relaxed mb-4">
                            {kitchen.description}
                          </p>
                        </div>

                        <div className="text-[11px] font-medium text-charcoal/60 pt-3 border-t border-cream-200">
                          Examples: {kitchen.exampleDishes.slice(0, 2).join(", ")}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Transferred Dish Badge from Build Your Plate */}
                {customDishName && (
                  <div className="p-4 rounded-2xl bg-flame/10 border border-flame/20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-flame" />
                      <span className="text-xs font-bold text-charcoal">
                        Custom Dish Connected: &ldquo;{customDishName}&rdquo;
                      </span>
                    </div>
                    <Link
                      href="/build-your-plate"
                      className="text-xs text-flame font-bold hover:underline"
                    >
                      Edit Recipe &rarr;
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* STEP 3: Group Details & Occasion */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-cream-200 pb-4">
                  <h2 className="font-display font-bold text-2xl text-charcoal">
                    Group Details & Occasion
                  </h2>
                  <p className="text-xs sm:text-sm text-charcoal/60 mt-1">
                    Tell us who is joining and the vibe of your outing.
                  </p>
                </div>

                {/* Group Size Selector */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-charcoal">
                      Number of Participants
                    </label>
                    <span className="text-xs font-semibold text-burgundy">
                      {groupSize === 4
                        ? "Standard 4-Person Pilot Pod (Recommended)"
                        : "Custom Group Size (Pending Pilot Approval)"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {[2, 3, 4, 5, 6, 8].map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setGroupSize(size)}
                        className={cn(
                          "w-12 h-12 rounded-2xl font-display font-bold text-sm transition-all flex items-center justify-center border",
                          groupSize === size
                            ? "bg-burgundy text-white border-burgundy shadow-sm"
                            : "bg-cream text-charcoal border-cream-300 hover:border-burgundy/40"
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-charcoal/50 mt-1.5">
                    *The initial PlatePlay pilot model is configured around 4-person private kitchen pods. Other sizes require confirmation.
                  </p>
                </div>

                {/* Occasion Selection */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-2">
                    What&apos;s the Occasion?
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {OCCASIONS.map((occ) => (
                      <button
                        key={occ}
                        type="button"
                        onClick={() => setOccasion(occ)}
                        className={cn(
                          "p-3 rounded-xl text-left text-xs font-semibold transition-all border",
                          occasion === occ
                            ? "bg-flame text-white border-flame shadow-sm"
                            : "bg-cream text-charcoal/80 border-cream-300 hover:border-flame/40"
                        )}
                      >
                        {occ}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Optional Session Preferences / Notes */}
                <div>
                  <label
                    htmlFor="vibeNotes"
                    className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1.5"
                  >
                    Session Preferences / Vibe Notes (Optional):
                  </label>
                  <input
                    id="vibeNotes"
                    type="text"
                    value={vibeNote}
                    onChange={(e) => setVibeNote(e.target.value)}
                    placeholder="e.g. Competitive cook-off, high energy music, surprise birthday"
                    className="w-full px-4 py-3 rounded-xl bg-cream border border-cream-300 text-xs sm:text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-flame"
                  />
                </div>
              </div>
            )}

            {/* STEP 4: Dietary Preferences */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-cream-200 pb-4">
                  <h2 className="font-display font-bold text-2xl text-charcoal">
                    Dietary Preferences & Allergies
                  </h2>
                  <p className="text-xs sm:text-sm text-charcoal/60 mt-1">
                    Help our prep team isolate ingredients and ensure safe stations.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-2.5">
                    Dietary Requirements (Select all that apply)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {DIETARY_OPTIONS.map((item) => {
                      const isSelected = dietary.includes(item);
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => handleToggleDietary(item)}
                          className={cn(
                            "px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 border",
                            isSelected
                              ? "bg-burgundy text-white border-burgundy shadow-sm"
                              : "bg-cream text-charcoal/80 border-cream-300 hover:border-burgundy/40"
                          )}
                        >
                          <span>{item}</span>
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="dietaryDetail"
                    className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1.5"
                  >
                    Specific Ingredient Restrictions / Notes:
                  </label>
                  <textarea
                    id="dietaryDetail"
                    rows={3}
                    value={dietaryNotes}
                    onChange={(e) => setDietaryNotes(e.target.value)}
                    placeholder="e.g. No mushrooms for 1 guest, strictly peanut-free station"
                    className="w-full p-4 rounded-xl bg-cream border border-cream-300 text-xs sm:text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-flame"
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-800">
                  <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                  <span>
                    <strong>Safety Notice:</strong> While we strictly isolate prep stations, requests are subject to culinary feasibility and safe inventory sourcing. Final accommodations will be reviewed prior to confirmation.
                  </span>
                </div>
              </div>
            )}

            {/* STEP 5: Dynamic Base Estimate */}
            {currentStep === 5 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-cream-200 pb-4">
                  <h2 className="font-display font-bold text-2xl text-charcoal">
                    Introductory Price Estimate
                  </h2>
                  <p className="text-xs sm:text-sm text-charcoal/60 mt-1">
                    Calculated based on your selected package and group size.
                  </p>
                </div>

                {/* Calculation Breakdown Card */}
                <div className="p-6 rounded-2xl bg-cream border border-cream-300 space-y-4">
                  <div className="flex items-center justify-between text-sm text-charcoal/80">
                    <span>
                      Package: <strong>{packageData.name}</strong> ({packageData.subtitle})
                    </span>
                    <span className="font-mono font-bold">
                      ₹{pricePerPerson} / guest
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-charcoal/80">
                    <span>
                      Group Size: <strong>{groupSize} Guests</strong>
                    </span>
                    <span className="font-mono font-bold">&times; {groupSize}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-charcoal/80">
                    <span>Private Kitchen Studio & Guidance</span>
                    <span className="text-emerald-600 font-bold">Included</span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-charcoal/80">
                    <span>Ingredient Prep & Full Kitchen Cleanup</span>
                    <span className="text-emerald-600 font-bold">Included</span>
                  </div>

                  <div className="pt-4 border-t border-cream-300 flex items-baseline justify-between">
                    <div>
                      <span className="font-display font-black text-2xl sm:text-3xl text-burgundy">
                        ₹{estimatedTotal.toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs text-charcoal/60 block">
                        Estimated Introductory Base Total
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-flame">
                        ≈ ₹{Math.round(estimatedTotal / groupSize).toLocaleString("en-IN")} / person
                      </span>
                    </div>
                  </div>
                </div>

                {/* Required Pricing Transparency Disclaimer */}
                <div className="p-4 rounded-xl bg-flame/10 border border-flame/20 flex items-start gap-2.5 text-xs text-charcoal/80">
                  <Info className="w-4 h-4 text-flame shrink-0 mt-0.5" />
                  <p>
                    <strong>Estimate Disclosure:</strong> This is an introductory pilot estimate, not a confirmed reservation price. Applicable statutory taxes, custom ingredient requests (under UNLEASH), and private kitchen scheduling feasibility may affect the final confirmation amount.
                  </p>
                </div>
              </div>
            )}

            {/* STEP 6: Review & Final Plan Summary */}
            {currentStep === 6 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-cream-200 pb-4">
                  <h2 className="font-display font-bold text-2xl text-charcoal">
                    Your Complete Experience Plan
                  </h2>
                  <p className="text-xs sm:text-sm text-charcoal/60 mt-1">
                    Review your configured session details before joining early access.
                  </p>
                </div>

                {/* Plan Highlights Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-cream border border-cream-300">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal/50 block mb-1">
                      Package & Format
                    </span>
                    <p className="font-display font-bold text-lg text-burgundy">
                      {packageData.name} ({packageData.subtitle})
                    </p>
                    <p className="text-xs text-charcoal/60">{packageData.duration}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-cream border border-cream-300">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal/50 block mb-1">
                      Private Studio Space
                    </span>
                    <p className="font-display font-bold text-lg text-charcoal">
                      {KITCHENS.find((k) => k.id === selectedKitchen)?.name || selectedKitchen}
                    </p>
                    <p className="text-xs text-flame font-semibold">Planned Pilot Studio</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-cream border border-cream-300">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal/50 block mb-1">
                      Group & Occasion
                    </span>
                    <p className="font-display font-bold text-base text-charcoal">
                      {groupSize} Guests · {occasion}
                    </p>
                    {vibeNote && (
                      <p className="text-xs text-charcoal/60 italic mt-0.5">
                        &ldquo;{vibeNote}&rdquo;
                      </p>
                    )}
                  </div>

                  <div className="p-4 rounded-2xl bg-cream border border-cream-300">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal/50 block mb-1">
                      Estimated Base Total
                    </span>
                    <p className="font-display font-black text-2xl text-burgundy">
                      ₹{estimatedTotal.toLocaleString("en-IN")}
                    </p>
                    <p className="text-[10px] text-charcoal/50">*Introductory estimate</p>
                  </div>
                </div>

                {/* Transferred Custom Dish (if present) */}
                {customDishName && (
                  <div className="p-4 rounded-2xl bg-cream border border-flame/30">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-flame block mb-1">
                      Attached Custom Studio Recipe
                    </span>
                    <p className="font-display font-bold text-base text-charcoal">
                      &ldquo;{customDishName}&rdquo;
                    </p>
                    <p className="text-xs text-charcoal/60">
                      Base: {customDishBase} · Sauce: {customDishSauce} · Toppings:{" "}
                      {customDishToppings || "Selected in Studio"}
                    </p>
                  </div>
                )}

                {/* Dietary Summary */}
                <div className="p-4 rounded-2xl bg-cream border border-cream-300">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal/50 block mb-1">
                    Dietary Requirements:
                  </span>
                  <p className="text-xs text-charcoal/80">
                    {dietary.length > 0 ? dietary.join(", ") : "Standard (No restrictions selected)"}
                    {dietaryNotes ? ` — ${dietaryNotes}` : ""}
                  </p>
                </div>

                {/* Working Buttons in Summary */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="w-full sm:w-auto px-5 py-3 rounded-full border border-charcoal/20 text-charcoal hover:bg-cream-200 transition-colors text-xs font-bold"
                  >
                    Edit Plan
                  </button>

                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={handleCopyPlan}
                      className="w-full sm:w-auto px-4 py-3 rounded-full border border-burgundy/30 bg-cream text-burgundy hover:bg-burgundy/10 transition-colors text-xs font-bold flex items-center justify-center gap-1.5"
                    >
                      {copied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copied ? "Plan Copied!" : "Copy Plan"}</span>
                    </button>

                    <Button
                      variant="flame"
                      size="md"
                      onClick={() => {
                        const params = new URLSearchParams({
                          package: selectedPackage,
                          kitchen: selectedKitchen,
                          guests: groupSize.toString(),
                          occasion: occasion,
                        });
                        if (customDishName) params.set("dish", customDishName);
                        if (customDishName) {
                          params.set(
                            "customDishDetails",
                            `Custom Recipe: ${customDishName} (Base: ${customDishBase}, Sauce: ${customDishSauce}, Toppings: ${customDishToppings})`
                          );
                        }
                        router.push(`/book?${params.toString()}`);
                      }}
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                      className="w-full sm:w-auto shadow-md"
                    >
                      Request a Pilot Session
                    </Button>

                    <button
                      type="button"
                      onClick={handleJoinWaitlistWithPlan}
                      className="w-full sm:w-auto text-xs text-charcoal/60 hover:text-burgundy underline font-semibold px-2 py-1"
                    >
                      Or join waitlist
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Stepper Navigation Buttons (for steps 1-5) */}
            {currentStep < 6 && (
              <div className="pt-6 mt-6 border-t border-cream-200 flex items-center justify-between">
                <button
                  type="button"
                  disabled={currentStep === 1}
                  onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 1))}
                  className="px-4 py-2.5 rounded-full text-xs font-bold text-charcoal/70 hover:text-charcoal disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <Button
                  variant="flame"
                  size="sm"
                  onClick={() => setCurrentStep((prev) => Math.min(prev + 1, 6))}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  {currentStep === 5 ? "Review Plan" : "Continue"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function PlanExperiencePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-cream flex items-center justify-center">
          <div className="text-center font-display font-bold text-burgundy text-lg">
            Loading Experience Planner...
          </div>
        </div>
      }
    >
      <PlanExperienceContent />
    </Suspense>
  );
}

