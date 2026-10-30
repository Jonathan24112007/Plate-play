"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/common/Button";
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  User,
  Mail,
  Phone,
  HelpCircle,
  Copy,
  Check,
  ArrowRight,
} from "lucide-react";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";

interface WaitlistSectionProps {
  selectedExperience?: string;
  onExperienceChange?: (id: string) => void;
}

export function WaitlistSection({
  selectedExperience = "play",
  onExperienceChange,
}: WaitlistSectionProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [experience, setExperience] = useState(selectedExperience);
  const [consent, setConsent] = useState(true);
  const [honeypot, setHoneypot] = useState(""); // Spam trap

  // Status & feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    confirmationCode: string;
    mode: string;
    message: string;
    name: string;
  } | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [apiMode, setApiMode] = useState<"demo" | "live">("demo");
  const [transferredPlan, setTransferredPlan] = useState<{
    kitchen?: string;
    groupSize?: string;
    occasion?: string;
  } | null>(null);

  // Sync when prop changes or from URL search params
  useEffect(() => {
    if (selectedExperience) {
      setExperience(selectedExperience);
    }
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const expParam = urlParams.get("experience");
      const kitchenParam = urlParams.get("kitchen");
      const groupSizeParam = urlParams.get("groupSize");
      const occasionParam = urlParams.get("occasion");

      if (expParam && ["play", "create", "unleash", "not_sure"].includes(expParam)) {
        setExperience(expParam);
      }
      if (kitchenParam || groupSizeParam || occasionParam) {
        setTransferredPlan({
          kitchen: kitchenParam || undefined,
          groupSize: groupSizeParam || undefined,
          occasion: occasionParam || undefined,
        });
      }
    }
  }, [selectedExperience]);

  // Check API mode on mount
  useEffect(() => {
    fetch("/api/waitlist")
      .then((res) => res.json())
      .then((data) => {
        if (data.mode === "live") setApiMode("live");
      })
      .catch(() => {});
  }, []);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Client-side validations
    if (!name.trim() || name.trim().length < 2) {
      setErrorMsg("Please enter your full name (at least 2 characters).");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailPattern.test(email.trim())) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    if (!consent) {
      setErrorMsg("Please agree to receive early pilot updates.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          experience,
          consent,
          honeypot,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to join waitlist. Please check inputs.");
      }

      setSuccessData({
        confirmationCode: data.confirmationCode || "PP-PILOT",
        mode: data.mode || "demo",
        message: data.message,
        name: data.data?.name || name,
      });

      // Celebrate
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#FF6B3D", "#8C1538", "#FFB8C8"],
        });
      } catch (err) {}
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setSuccessData(null);
    setErrorMsg(null);
  };

  return (
    <section
      id="waitlist"
      className="py-24 md:py-32 bg-cream-50 relative overflow-hidden border-t border-cream-200"
    >
      {/* Decorative ambient gradients */}
      <div className="absolute top-1/3 -right-20 w-80 h-80 bg-flame/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 -left-20 w-80 h-80 bg-burgundy/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-14 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-flame/10 text-flame text-xs font-bold tracking-widest uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Early Access</span>
          </div>

          <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-charcoal tracking-tight leading-[1.1] mb-6">
            Be first <span className="text-flame">to play.</span>
          </h2>

          <p className="text-base sm:text-lg text-charcoal/80 leading-relaxed max-w-2xl mx-auto mb-4">
            PlatePlay is getting ready to bring a new kind of cooking experience to life. Join the early-access list for pilot announcements, experience previews, and launch updates.
          </p>

          {/* Transparent Storage / Demo Mode Indicator */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream-200 text-charcoal/70 text-xs font-medium border border-cream-300">
            <span
              className={cn(
                "w-2 h-2 rounded-full",
                apiMode === "live" ? "bg-emerald-500" : "bg-amber-500 animate-pulse"
              )}
            />
            <span>
              {apiMode === "live"
                ? "Live Pilot Waitlist Active"
                : "Demo Mode Active · Preview Validation"}
            </span>
          </div>
        </div>

        {/* Waitlist Card Container */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-cream rounded-3xl p-8 sm:p-12 border-2 border-burgundy/20 shadow-card relative">
            {successData ? (
              /* Success confirmation state */
              <div className="text-center py-6 space-y-6 animate-in fade-in duration-300">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-soft">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-burgundy block mb-1">
                    Registration Confirmed
                  </span>
                  <h3 className="font-display font-black text-3xl text-charcoal mb-2">
                    You&apos;re on the priority list, {successData.name}!
                  </h3>
                  <p className="text-sm text-charcoal/70 max-w-md mx-auto">
                    {successData.mode === "live"
                      ? "We will email you first when private pilot kitchen reservation windows unlock in your area."
                      : "Submission validated! In v0.1 demo mode, your data is checked and assigned a sample priority token."}
                  </p>
                </div>

                {/* Priority Token Box */}
                <div className="p-4 rounded-2xl bg-cream-100 border border-cream-300 max-w-sm mx-auto flex items-center justify-between">
                  <div className="text-left">
                    <span className="text-[10px] font-mono uppercase text-charcoal/50 block">
                      Priority Pass Token
                    </span>
                    <span className="font-mono font-bold text-lg text-burgundy">
                      {successData.confirmationCode}
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopyCode(successData.confirmationCode)}
                    className="p-2 rounded-xl bg-cream-50 hover:bg-cream-200 border border-charcoal/10 text-charcoal/70 transition-colors"
                    title="Copy token"
                  >
                    {copiedCode ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button
                    variant="outline-burgundy"
                    size="md"
                    onClick={resetForm}
                  >
                    Register another crew member
                  </Button>
                </div>
              </div>
            ) : (
              /* Waitlist submission form */
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error Banner */}
                {errorMsg && (
                  <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Connected Session Plan Banner */}
                {transferredPlan && (
                  <div className="p-4 rounded-2xl bg-burgundy/10 border border-burgundy/25 flex items-center justify-between text-xs text-charcoal">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-burgundy shrink-0" />
                      <span>
                        <strong>Session Plan Linked:</strong> {transferredPlan.groupSize ? `${transferredPlan.groupSize} Guests` : "Private Group"} {transferredPlan.occasion ? `· ${transferredPlan.occasion}` : ""}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setTransferredPlan(null)}
                      className="text-xs text-charcoal/50 hover:text-charcoal font-semibold ml-2"
                    >
                      Clear
                    </button>
                  </div>
                )}

                {/* Honeypot Spam Prevention field (Hidden from humans) */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="website">Leave this field blank</label>
                  <input
                    type="text"
                    id="website"
                    name="website"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                {/* Full Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-2"
                  >
                    Your Name <span className="text-flame">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-charcoal/40 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      id="name"
                      required
                      placeholder="e.g. Alex Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-cream-50 border border-cream-300 text-charcoal text-sm placeholder:text-charcoal/40 focus:outline-none focus:ring-2 focus:ring-flame focus:border-flame transition-all"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-2"
                  >
                    Email Address <span className="text-flame">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-charcoal/40 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      id="email"
                      required
                      placeholder="alex@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-cream-50 border border-cream-300 text-charcoal text-sm placeholder:text-charcoal/40 focus:outline-none focus:ring-2 focus:ring-flame focus:border-flame transition-all"
                    />
                  </div>
                </div>

                {/* Phone Number (Optional) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label
                      htmlFor="phone"
                      className="text-xs font-bold uppercase tracking-wider text-charcoal/80"
                    >
                      Phone Number
                    </label>
                    <span className="text-[11px] text-charcoal/50">Optional</span>
                  </div>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-charcoal/40 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="tel"
                      id="phone"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-cream-50 border border-cream-300 text-charcoal text-sm placeholder:text-charcoal/40 focus:outline-none focus:ring-2 focus:ring-flame focus:border-flame transition-all"
                    />
                  </div>
                </div>

                {/* Preferred Experience Selection */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-2">
                    Preferred Experience <span className="text-flame">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { id: "play", label: "PLAY", sub: "Pick a Dish" },
                      { id: "create", label: "CREATE", sub: "Build Plate" },
                      { id: "unleash", label: "UNLEASH", sub: "Your Recipe" },
                      { id: "not_sure", label: "NOT SURE", sub: "Surprise Me" },
                    ].map((item) => {
                      const isSelected = experience === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setExperience(item.id);
                            if (onExperienceChange) onExperienceChange(item.id);
                          }}
                          className={cn(
                            "p-3 rounded-2xl border text-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-flame",
                            isSelected
                              ? "bg-burgundy text-white border-burgundy shadow-sm"
                              : "bg-cream-50 border-cream-300 text-charcoal hover:bg-cream-200"
                          )}
                        >
                          <span className="font-display font-bold text-xs block">
                            {item.label}
                          </span>
                          <span
                            className={cn(
                              "text-[10px] block mt-0.5",
                              isSelected ? "text-cream/80" : "text-charcoal/50"
                            )}
                          >
                            {item.sub}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Consent Checkbox */}
                <div className="pt-2">
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-cream-300 text-flame focus:ring-flame accent-flame"
                    />
                    <span className="text-xs text-charcoal/75 leading-relaxed">
                      I agree to receive pilot announcements, private preview invitations, and launch updates from PlatePlay. We respect your inbox and never sell data.
                    </span>
                  </label>
                </div>

                {/* Submit CTA */}
                <Button
                  type="submit"
                  variant="flame"
                  size="lg"
                  isLoading={isLoading}
                  className="w-full justify-center shadow-lg group"
                  rightIcon={
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  }
                >
                  Count Me In
                </Button>

                {/* Privacy & Anti-Spam reassurance */}
                <div className="flex items-center justify-center gap-2 text-[11px] text-charcoal/50 pt-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-burgundy" />
                  <span>Zero spam · Strictly pilot communications</span>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

