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
  Calendar as CalendarIcon,
  Clock,
  Users,
  ChefHat,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Info,
  AlertTriangle,
  Copy,
  Check,
  Flame,
  Search,
} from "lucide-react";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";

const DIETARY_TAGS = [
  "Vegetarian",
  "Jain (No Onion / Garlic)",
  "Vegan",
  "Gluten-Sensitive",
  "Nut Allergy",
  "Dairy-Sensitive",
];

const OCCASIONS = [
  "Friends Hangout",
  "Birthday Celebration",
  "Couple Date",
  "Family Gathering",
  "College Group",
  "Team / Corporate Outing",
  "Other Celebration",
];

interface SlotOption {
  id: string;
  startTime: string;
  endTime: string;
  status: "AVAILABLE" | "BOOKED" | "BLOCKED" | "PAST";
  capacity: number;
}

function BookPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Multi-step State (1 through 6)
  const [currentStep, setCurrentStep] = useState(1);

  // Pre-fill parameters
  const initialPackage = searchParams.get("package") || "create";
  const initialKitchen = searchParams.get("kitchen") || "pizzeria";
  const initialGuests = parseInt(searchParams.get("guests") || "4", 10);
  const initialDish = searchParams.get("dish") || "";
  const initialCustomDish = searchParams.get("customDishDetails") || "";

  // Step 1: Package
  const [selectedPackage, setSelectedPackage] = useState<string>(initialPackage);

  // Step 2: Kitchen
  const [selectedKitchen, setSelectedKitchen] = useState<string>(initialKitchen);

  // Step 3: Date & Slot
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    return tomorrow.toISOString().split("T")[0];
  });
  const [availableSlots, setAvailableSlots] = useState<SlotOption[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string>("");
  const [selectedSlotTime, setSelectedSlotTime] = useState<string>("");
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Step 4: Group & Contact Details
  const [groupSize, setGroupSize] = useState<number>(initialGuests > 0 ? initialGuests : 4);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [occasion, setOccasion] = useState(OCCASIONS[0]);

  // Step 5: Dietary Preferences & Safety
  const [dietaryRequirements, setDietaryRequirements] = useState<string[]>([]);
  const [dietaryNotes, setDietaryNotes] = useState("");
  const [customDishDetails, setCustomDishDetails] = useState(
    initialCustomDish || (initialDish ? `Selected Dish: ${initialDish}` : "")
  );
  const [safetyAgreed, setSafetyAgreed] = useState(false);

  // Bot Trap
  const [botTrap, setBotTrap] = useState("");

  // Submission & Result
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [bookingResult, setBookingResult] = useState<any>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  // Selected entities helper
  const pkgObj = EXPERIENCES.find((p) => p.id === selectedPackage) || EXPERIENCES[1];
  const totalEstimatedPaise = (pkgObj.pricePerPerson || 799) * 100 * groupSize;
  const totalEstimatedRupees = (pkgObj.pricePerPerson || 799) * groupSize;

  // Fetch slots whenever kitchen or date changes
  useEffect(() => {
    let isMounted = true;
    async function loadSlots() {
      setLoadingSlots(true);
      try {
        const res = await fetch(`/api/slots?kitchenId=${selectedKitchen}&date=${selectedDate}`);
        const data = await res.json();
        if (isMounted && data.success && Array.isArray(data.slots) && data.slots.length > 0) {
          setAvailableSlots(data.slots);
          // auto-select first available slot if none selected
          const firstAvail = data.slots.find((s: SlotOption) => s.status === "AVAILABLE");
          if (firstAvail) {
            setSelectedSlotId(firstAvail.id);
            setSelectedSlotTime(`${firstAvail.startTime} – ${firstAvail.endTime}`);
          } else {
            setSelectedSlotId("");
            setSelectedSlotTime("");
          }
        } else if (isMounted) {
          // Fallback slots if API returned empty
          const fallback: SlotOption[] = [
            { id: "s-1", startTime: "11:30", endTime: "13:30", status: "AVAILABLE", capacity: 4 },
            { id: "s-2", startTime: "14:30", endTime: "16:30", status: "AVAILABLE", capacity: 4 },
            { id: "s-3", startTime: "17:30", endTime: "19:30", status: "AVAILABLE", capacity: 4 },
            { id: "s-4", startTime: "20:00", endTime: "22:00", status: "AVAILABLE", capacity: 4 },
          ];
          setAvailableSlots(fallback);
          setSelectedSlotId(fallback[0].id);
          setSelectedSlotTime("11:30 – 13:30");
        }
      } catch (e) {
        console.error("Error loading slots:", e);
      } finally {
        if (isMounted) setLoadingSlots(false);
      }
    }
    loadSlots();
    return () => {
      isMounted = false;
    };
  }, [selectedKitchen, selectedDate]);

  const toggleDietary = (item: string) => {
    setDietaryRequirements((prev) =>
      prev.includes(item) ? prev.filter((d) => d !== item) : [...prev, item]
    );
  };

  const handleNext = () => {
    setSubmissionError(null);
    if (currentStep === 4) {
      if (!customerName.trim() || !customerEmail.trim()) {
        setSubmissionError("Please provide your full name and email address.");
        return;
      }
      if (!customerEmail.includes("@") || !customerEmail.includes(".")) {
        setSubmissionError("Please provide a valid email address.");
        return;
      }
    }
    if (currentStep === 5) {
      if (!safetyAgreed) {
        setSubmissionError("Please review and agree to the kitchen safety protocol.");
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, 6));
    window.scrollTo({ top: 200, behavior: "smooth" });
  };

  const handleBack = () => {
    setSubmissionError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 200, behavior: "smooth" });
  };

  const handleSubmitRequest = async () => {
    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const payload = {
        kitchenId: selectedKitchen,
        packageId: selectedPackage,
        slotId: selectedSlotId || undefined,
        slotDate: selectedDate,
        slotTime: selectedSlotTime,
        groupSize,
        customerName,
        customerEmail,
        customerPhone: customerPhone || undefined,
        occasion,
        dietaryRequirements,
        dietaryNotes: dietaryNotes || undefined,
        customDishDetails: customDishDetails || undefined,
        botTrap,
      };

      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit request.");
      }

      setBookingResult(data.booking);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#8C1538", "#FF6B3D", "#FFB8C8"],
      });
    } catch (err: any) {
      setSubmissionError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyRefToClipboard = () => {
    if (bookingResult?.publicReference) {
      navigator.clipboard.writeText(bookingResult.publicReference);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-cream text-charcoal flex flex-col selection:bg-burgundy selection:text-white">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        {/* Header Banner */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <Badge variant="flame" className="mb-3">
            <Sparkles className="w-3.5 h-3.5 text-flame mr-1.5" />
            Pilot Booking Beta
          </Badge>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-charcoal tracking-tight mb-3">
            Reserve Your Group Kitchen
          </h1>
          <p className="text-sm sm:text-base text-charcoal/70">
            One booking reserves an entire private kitchen for your group. Choose your experience,
            pick a planned pilot date, and submit your reservation request.
          </p>
        </div>

        {/* Step Indicator Progress Bar */}
        {!bookingResult && (
          <div className="mb-10 bg-white/70 backdrop-blur-md rounded-2xl p-4 border border-cream-300 shadow-soft">
            <div className="flex items-center justify-between text-xs font-semibold text-charcoal/60 mb-2 px-1">
              <span>Step {currentStep} of 6</span>
              <span className="text-burgundy font-bold">
                {currentStep === 1 && "1. Choose Package"}
                {currentStep === 2 && "2. Select Kitchen"}
                {currentStep === 3 && "3. Date & Session Time"}
                {currentStep === 4 && "4. Group & Contact"}
                {currentStep === 5 && "5. Dietary & Preferences"}
                {currentStep === 6 && "6. Review & Request"}
              </span>
            </div>
            <div className="w-full bg-cream-200 h-2 rounded-full overflow-hidden flex">
              <div
                className="bg-gradient-to-r from-burgundy to-flame h-full transition-all duration-300 rounded-full"
                style={{ width: `${(currentStep / 6) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Error Notification */}
        {submissionError && (
          <div className="mb-6 p-4 rounded-2xl bg-burgundy/10 border border-burgundy/30 text-burgundy flex items-start gap-3 text-sm">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-burgundy" />
            <div>
              <p className="font-bold">Submission Notice</p>
              <p>{submissionError}</p>
            </div>
          </div>
        )}

        {/* SUCCESS CONFIRMATION SCREEN */}
        {bookingResult ? (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-cream-300 shadow-xl max-w-2xl mx-auto text-center space-y-6 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-burgundy/10 text-burgundy flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-flame block mb-1">
                Booking Request Submitted
              </span>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-charcoal">
                We&apos;ve Received Your Request!
              </h2>
              <p className="text-xs sm:text-sm text-charcoal/70 mt-2 max-w-md mx-auto">
                Thank you, <strong>{bookingResult.customerName}</strong>. Your pilot kitchen request
                is now registered. Our team reviews all pilot slots to ensure personalized culinary
                prep.
              </p>
            </div>

            {/* Reference Box */}
            <div className="bg-cream-100 rounded-2xl p-5 border border-cream-300 max-w-md mx-auto">
              <span className="text-xs font-mono text-charcoal/50 uppercase tracking-widest block mb-1">
                Your Public Reference
              </span>
              <div className="flex items-center justify-center gap-2">
                <span className="font-mono font-black text-2xl sm:text-3xl text-burgundy tracking-wider">
                  {bookingResult.publicReference}
                </span>
                <button
                  onClick={copyRefToClipboard}
                  className="p-2 rounded-lg bg-white border border-cream-300 hover:bg-cream-200 text-charcoal transition-colors"
                  title="Copy reference code"
                >
                  {copiedRef ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-charcoal/70" />
                  )}
                </button>
              </div>
              <p className="text-[11px] text-charcoal/60 mt-1">
                Keep this code safe. You will need this along with your email to track status.
              </p>
            </div>

            {/* Summary Details */}
            <div className="bg-white rounded-2xl border border-cream-200 p-4 text-left text-xs sm:text-sm space-y-2 max-w-md mx-auto">
              <div className="flex justify-between py-1 border-b border-cream-100">
                <span className="text-charcoal/60">Experience Package</span>
                <span className="font-bold text-charcoal">{bookingResult.packageName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-cream-100">
                <span className="text-charcoal/60">Pilot Kitchen</span>
                <span className="font-bold text-charcoal">{bookingResult.kitchenName}</span>
              </div>
              {bookingResult.slotDate && (
                <div className="flex justify-between py-1 border-b border-cream-100">
                  <span className="text-charcoal/60">Requested Date</span>
                  <span className="font-bold text-charcoal">{bookingResult.slotDate}</span>
                </div>
              )}
              {bookingResult.slotTime && (
                <div className="flex justify-between py-1 border-b border-cream-100">
                  <span className="text-charcoal/60">Session Window</span>
                  <span className="font-bold text-charcoal">{bookingResult.slotTime}</span>
                </div>
              )}
              <div className="flex justify-between py-1 border-b border-cream-100">
                <span className="text-charcoal/60">Private Group</span>
                <span className="font-bold text-charcoal">{bookingResult.groupSize} Guests</span>
              </div>
              <div className="flex justify-between py-1 font-bold">
                <span className="text-burgundy">Estimated Total</span>
                <span className="text-burgundy">
                  ₹{(bookingResult.estimatedPricePaise / 100).toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-flame/10 rounded-xl text-xs text-charcoal/80 text-left max-w-md mx-auto flex items-start gap-2.5">
              <Info className="w-4 h-4 text-flame shrink-0 mt-0.5" />
              <span>
                <strong>Next Steps:</strong> An email confirmation has been sent to{" "}
                <strong>{bookingResult.customerEmail}</strong>. You will be notified once our pilot
                director confirms your slot. No payment is taken at this stage.
              </span>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <Link
                href={`/booking-status?ref=${bookingResult.publicReference}&email=${encodeURIComponent(
                  bookingResult.customerEmail
                )}`}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-burgundy text-white font-bold text-xs uppercase tracking-wider hover:bg-burgundy-hover transition-colors inline-flex items-center justify-center gap-2"
              >
                <span>Track Request Status</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/"
                className="w-full sm:w-auto px-6 py-3 rounded-full border border-cream-300 bg-white text-charcoal font-bold text-xs uppercase tracking-wider hover:bg-cream-100 transition-colors inline-flex items-center justify-center"
              >
                Back to Home
              </Link>
            </div>
          </div>
        ) : (
          /* MULTI-STEP FORM FLOW */
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-cream-300 shadow-soft">
            {/* STEP 1: PACKAGE SELECTION */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="font-display font-bold text-2xl text-charcoal">
                    Step 1: Choose Your Experience Package
                  </h2>
                  <p className="text-xs sm:text-sm text-charcoal/70">
                    All packages include private kitchen access, prepped pantry ingredients, and safety supervision.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {EXPERIENCES.map((pkg) => {
                    const isSelected = selectedPackage === pkg.id;
                    return (
                      <div
                        key={pkg.id}
                        onClick={() => setSelectedPackage(pkg.id)}
                        className={cn(
                          "cursor-pointer rounded-2xl p-5 border-2 transition-all relative flex flex-col justify-between",
                          isSelected
                            ? "border-burgundy bg-burgundy/5 shadow-md"
                            : "border-cream-300 hover:border-cream-400 bg-white"
                        )}
                      >
                        {pkg.isSignature && (
                          <span className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-burgundy text-white text-[10px] font-bold tracking-wider uppercase">
                            Signature
                          </span>
                        )}
                        <div>
                          <span className="text-[10px] font-mono font-bold text-charcoal/50 uppercase tracking-widest block mb-1">
                            {pkg.code}
                          </span>
                          <h3 className="font-display font-black text-xl text-charcoal mb-1">
                            {pkg.name}
                          </h3>
                          <p className="text-xs text-charcoal/60 mb-3">{pkg.subtitle}</p>

                          <div className="mb-2 flex items-baseline flex-wrap gap-x-1">
                            <span className="font-display font-black text-xl lg:text-2xl text-burgundy">
                              {pkg.priceFormatted.split("/")[0]}
                            </span>
                            {pkg.priceFormatted.includes("/") && (
                              <span className="text-xs text-charcoal/60 font-normal">
                                /{pkg.priceFormatted.split("/")[1]}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-charcoal/70 mb-4">{pkg.description}</p>

                          <ul className="space-y-1.5 text-xs text-charcoal/80 mb-4">
                            {pkg.features.slice(0, 3).map((feat, idx) => (
                              <li key={idx} className="flex items-center gap-1.5">
                                <Check className="w-3.5 h-3.5 text-flame shrink-0" />
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="pt-3 border-t border-cream-200 flex items-center justify-between text-xs">
                          <span className="text-charcoal/50 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {pkg.duration}
                          </span>
                          <span
                            className={cn(
                              "font-bold",
                              isSelected ? "text-burgundy" : "text-charcoal/60"
                            )}
                          >
                            {isSelected ? "Selected" : "Select"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 2: KITCHEN SELECTION */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="font-display font-bold text-2xl text-charcoal">
                    Step 2: Select a Pilot Kitchen
                  </h2>
                  <p className="text-xs sm:text-sm text-charcoal/70">
                    Our initial pilot launch features two dedicated studios. Future studios will unlock subsequently.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {KITCHENS.map((kit) => {
                    const isPilot = kit.slug === "pizzeria" || kit.slug === "masala-kitchen";
                    const isSelected = selectedKitchen === kit.slug;

                    return (
                      <div
                        key={kit.slug}
                        onClick={() => {
                          if (isPilot) setSelectedKitchen(kit.slug);
                        }}
                        className={cn(
                          "rounded-2xl p-6 border-2 transition-all relative flex flex-col justify-between",
                          !isPilot
                            ? "opacity-60 bg-cream-100 border-cream-200 cursor-not-allowed"
                            : isSelected
                            ? "cursor-pointer border-burgundy bg-burgundy/5 shadow-md"
                            : "cursor-pointer border-cream-300 hover:border-cream-400 bg-white"
                        )}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-flame block mb-1">
                              {kit.theme}
                            </span>
                            <h3 className="font-display font-black text-xl text-charcoal">
                              {kit.name}
                            </h3>
                          </div>
                          {isPilot ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-green-100 text-green-800 text-[10px] font-bold">
                              Pilot Active
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full bg-charcoal/10 text-charcoal/60 text-[10px] font-bold">
                              Future Studio
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-charcoal/70 mb-4">{kit.heroTagline}</p>

                        <div className="text-xs text-charcoal/80 mb-4">
                          <span className="font-semibold block mb-1">Signature Concepts:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {kit.exampleDishes.slice(0, 3).map((dish, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded-md bg-cream-200/70 text-charcoal text-[11px]"
                              >
                                {dish}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-cream-200 flex items-center justify-between text-xs">
                          <span className="text-charcoal/60">Group Capacity: 4–6</span>
                          {isPilot && (
                            <span
                              className={cn(
                                "font-bold",
                                isSelected ? "text-burgundy" : "text-charcoal/60"
                              )}
                            >
                              {isSelected ? "Selected" : "Select Kitchen"}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 3: DATE & SESSION TIME */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="font-display font-bold text-2xl text-charcoal">
                    Step 3: Choose Preferred Date & Session Time
                  </h2>
                  <p className="text-xs sm:text-sm text-charcoal/70">
                    Each slot represents exclusive group access to your selected kitchen. Slots are in Asia/Kolkata (IST).
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Date Input */}
                  <div className="md:col-span-5 space-y-4">
                    <label className="block text-xs font-bold text-charcoal uppercase tracking-wider">
                      Select Preferred Date
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:outline-none focus:ring-2 focus:ring-burgundy bg-white text-sm"
                    />

                    <div className="p-4 bg-cream-100 rounded-xl border border-cream-200 text-xs text-charcoal/70 space-y-1.5">
                      <p className="font-bold text-charcoal flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-flame" />
                        Pilot Scheduling Policy
                      </p>
                      <p>
                        We operate 4 private sessions daily with sanitation buffers between sessions.
                      </p>
                    </div>
                  </div>

                  {/* Slot Picker */}
                  <div className="md:col-span-7 space-y-4">
                    <label className="block text-xs font-bold text-charcoal uppercase tracking-wider">
                      Available Session Windows for {selectedDate}
                    </label>

                    {loadingSlots ? (
                      <div className="py-8 text-center text-xs text-charcoal/60">
                        Checking slot availability...
                      </div>
                    ) : availableSlots.length === 0 ? (
                      <div className="py-8 text-center text-xs text-charcoal/60 bg-cream-100 rounded-xl">
                        No slots configured for this date. Please pick another date.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {availableSlots.map((slot) => {
                          const isSelected = selectedSlotId === slot.id;
                          const isBooked = slot.status === "BOOKED";
                          const isBlocked = slot.status === "BLOCKED";
                          const isDisabled = isBooked || isBlocked;

                          return (
                            <div
                              key={slot.id}
                              onClick={() => {
                                if (!isDisabled) {
                                  setSelectedSlotId(slot.id);
                                  setSelectedSlotTime(`${slot.startTime} – ${slot.endTime}`);
                                }
                              }}
                              className={cn(
                                "p-4 rounded-xl border-2 transition-all flex flex-col justify-between",
                                isDisabled
                                  ? "bg-cream-200/50 border-cream-200 cursor-not-allowed opacity-60"
                                  : isSelected
                                  ? "cursor-pointer border-burgundy bg-burgundy/10 shadow-sm"
                                  : "cursor-pointer border-cream-300 hover:border-cream-400 bg-white"
                              )}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-mono text-sm font-bold text-charcoal">
                                  {slot.startTime} – {slot.endTime}
                                </span>
                                {isBooked ? (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-charcoal/10 text-charcoal/60">
                                    Reserved
                                  </span>
                                ) : isBlocked ? (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-charcoal/10 text-charcoal/60">
                                    Maintenance
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-green-100 text-green-800">
                                    Available
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-charcoal/60">
                                Private group session
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: GROUP & CONTACT DETAILS */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="font-display font-bold text-2xl text-charcoal">
                    Step 4: Group & Primary Contact Details
                  </h2>
                  <p className="text-xs sm:text-sm text-charcoal/70">
                    The pilot model standard is 4 guests per group booking.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-charcoal uppercase tracking-wider">
                      Group Size (Guests) *
                    </label>
                    <select
                      value={groupSize}
                      onChange={(e) => setGroupSize(parseInt(e.target.value, 10))}
                      className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:outline-none focus:ring-2 focus:ring-burgundy bg-white text-sm"
                    >
                      <option value={2}>2 Guests (Couple Pilot)</option>
                      <option value={3}>3 Guests</option>
                      <option value={4}>4 Guests (Standard Pilot Group)</option>
                      <option value={5}>5 Guests</option>
                      <option value={6}>6 Guests (Maximum Studio Size)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-charcoal uppercase tracking-wider">
                      Occasion
                    </label>
                    <select
                      value={occasion}
                      onChange={(e) => setOccasion(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:outline-none focus:ring-2 focus:ring-burgundy bg-white text-sm"
                    >
                      {OCCASIONS.map((occ) => (
                        <option key={occ} value={occ}>
                          {occ}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-charcoal uppercase tracking-wider">
                      Primary Contact Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Maya Sharma"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:outline-none focus:ring-2 focus:ring-burgundy bg-white text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-charcoal uppercase tracking-wider">
                      Email Address (for status updates) *
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. maya@example.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:outline-none focus:ring-2 focus:ring-burgundy bg-white text-sm"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-bold text-charcoal uppercase tracking-wider">
                      WhatsApp / Mobile Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:outline-none focus:ring-2 focus:ring-burgundy bg-white text-sm"
                    />
                  </div>
                </div>

                {/* Honeypot */}
                <input
                  type="text"
                  name="botTrap"
                  tabIndex={-1}
                  value={botTrap}
                  onChange={(e) => setBotTrap(e.target.value)}
                  className="hidden"
                  autoComplete="off"
                />
              </div>
            )}

            {/* STEP 5: DIETARY REQUIREMENTS & SAFETY */}
            {currentStep === 5 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="font-display font-bold text-2xl text-charcoal">
                    Step 5: Dietary Requirements & Kitchen Safety
                  </h2>
                  <p className="text-xs sm:text-sm text-charcoal/70">
                    Let us know what your group eats so our culinary station preps appropriate ingredients.
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-bold text-charcoal uppercase tracking-wider">
                    Dietary Tags (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {DIETARY_TAGS.map((tag) => {
                      const isSelected = dietaryRequirements.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleDietary(tag)}
                          className={cn(
                            "px-3.5 py-2.5 rounded-xl border text-xs font-medium text-left transition-all flex items-center justify-between",
                            isSelected
                              ? "bg-burgundy text-white border-burgundy shadow-sm"
                              : "bg-white border-cream-300 text-charcoal hover:border-cream-400"
                          )}
                        >
                          <span>{tag}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-charcoal uppercase tracking-wider">
                    Special Allergen Details / Custom Dish Notes
                  </label>
                  <textarea
                    rows={2}
                    value={customDishDetails}
                    onChange={(e) => setCustomDishDetails(e.target.value)}
                    placeholder="e.g. Created custom flatbread in Build-Your-Plate studio, severe peanut allergy in one guest."
                    className="w-full px-4 py-3 rounded-xl border border-cream-300 focus:outline-none focus:ring-2 focus:ring-burgundy bg-white text-sm"
                  />
                </div>

                {/* Safety Protocol Declaration */}
                <div className="p-4 bg-cream-100 rounded-2xl border border-cream-300 space-y-3">
                  <div className="flex items-center gap-2 text-burgundy font-bold text-xs uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Kitchen Safety & Pilot Acknowledgment</span>
                  </div>
                  <p className="text-xs text-charcoal/70 leading-relaxed">
                    PlatePlay private kitchens feature professional induction cooktops, high-heat stone
                    ovens, and chef cutlery. A culinary guide is always present in the studio area to
                    supervise safety and provide assistance.
                  </p>

                  <label className="flex items-start gap-3 cursor-pointer pt-2">
                    <input
                      type="checkbox"
                      checked={safetyAgreed}
                      onChange={(e) => setSafetyAgreed(e.target.checked)}
                      className="mt-0.5 rounded border-cream-400 text-burgundy focus:ring-burgundy w-4 h-4"
                    />
                    <span className="text-xs text-charcoal font-semibold">
                      I understand this is an active cooking environment and agree that our group will follow all studio safety rules and guide instructions.
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* STEP 6: REVIEW & ESTIMATED PRICING */}
            {currentStep === 6 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="font-display font-bold text-2xl text-charcoal">
                    Step 6: Review & Submit Booking Request
                  </h2>
                  <p className="text-xs sm:text-sm text-charcoal/70">
                    Review your details below. No upfront payment is required at this stage.
                  </p>
                </div>

                {/* Comprehensive Breakdown */}
                <div className="bg-cream-100 rounded-2xl p-6 border border-cream-300 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-cream-200 text-xs sm:text-sm">
                    <div>
                      <span className="text-charcoal/50 block text-[11px] uppercase tracking-wider">
                        Package
                      </span>
                      <strong className="text-charcoal text-base">{pkgObj.name}</strong>
                      <span className="text-charcoal/60 block">{pkgObj.duration}</span>
                    </div>
                    <div>
                      <span className="text-charcoal/50 block text-[11px] uppercase tracking-wider">
                        Studio Kitchen
                      </span>
                      <strong className="text-charcoal text-base">
                        {selectedKitchen === "pizzeria" ? "Pizzeria Studio" : "Masala Kitchen"}
                      </strong>
                      <span className="text-charcoal/60 block">Private group allocation</span>
                    </div>
                    <div>
                      <span className="text-charcoal/50 block text-[11px] uppercase tracking-wider">
                        Session Date & Time
                      </span>
                      <strong className="text-charcoal">{selectedDate}</strong>
                      <span className="text-charcoal/60 block">{selectedSlotTime} (IST)</span>
                    </div>
                    <div>
                      <span className="text-charcoal/50 block text-[11px] uppercase tracking-wider">
                        Group & Contact
                      </span>
                      <strong className="text-charcoal">
                        {customerName} ({groupSize} Guests)
                      </strong>
                      <span className="text-charcoal/60 block">{customerEmail}</span>
                    </div>
                  </div>

                  {/* Dietary Summary */}
                  {dietaryRequirements.length > 0 && (
                    <div className="text-xs">
                      <span className="text-charcoal/60 font-semibold">Dietary Declarations: </span>
                      <span className="text-charcoal">{dietaryRequirements.join(", ")}</span>
                    </div>
                  )}

                  {customDishDetails && (
                    <div className="text-xs bg-white p-3 rounded-xl border border-cream-200">
                      <span className="text-charcoal/60 font-semibold block mb-0.5">
                        Custom Dish Details:
                      </span>
                      <span className="text-charcoal">{customDishDetails}</span>
                    </div>
                  )}

                  {/* Pricing Calculation */}
                  <div className="pt-2 border-t border-cream-200 space-y-1.5 text-xs sm:text-sm">
                    <div className="flex justify-between text-charcoal/70">
                      <span>
                        Base Experience ({groupSize} Guests × ₹{pkgObj.pricePerPerson})
                      </span>
                      <span className="font-mono">₹{totalEstimatedRupees.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between text-charcoal/70">
                      <span>Kitchen Equipment & Pantry Prep</span>
                      <span className="text-green-700 font-bold uppercase text-[11px]">Included</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-cream-300 text-base font-black text-burgundy">
                      <span>Estimated Pilot Total</span>
                      <span className="text-2xl font-mono">
                        ₹{totalEstimatedRupees.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <p className="text-[11px] text-charcoal/50 text-right">
                      *Introductory pilot pricing. Payable upon confirmed arrival or advance link.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-flame/10 rounded-xl text-xs text-charcoal/80 flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-flame shrink-0 mt-0.5" />
                  <span>
                    Submitting this form submits a <strong>pilot reservation request</strong>. We will review
                    slot availability and send you a confirmed reservation notice within 24–48 hours.
                  </span>
                </div>
              </div>
            )}

            {/* ACTION BUTTONS (PREV / NEXT / SUBMIT) */}
            <div className="mt-8 pt-6 border-t border-cream-200 flex items-center justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-full border border-cream-300 hover:bg-cream-100 text-charcoal text-xs font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              ) : (
                <div />
              )}

              {currentStep < 6 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  variant="burgundy"
                  size="md"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Continue to Step {currentStep + 1}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmitRequest}
                  disabled={isSubmitting}
                  variant="flame"
                  size="lg"
                  className="shadow-lg px-8"
                  rightIcon={
                    isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )
                  }
                >
                  {isSubmitting ? "Submitting Request..." : "Submit Booking Request"}
                </Button>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-cream flex items-center justify-center text-charcoal">
          Loading Booking Experience...
        </div>
      }
    >
      <BookPageContent />
    </Suspense>
  );
}
