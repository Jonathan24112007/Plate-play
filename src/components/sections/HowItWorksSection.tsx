"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Compass,
  Sparkles,
  SlidersHorizontal,
  Flame,
  PartyPopper,
  CheckCircle,
  ShieldCheck,
  Sparkle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  tag: string;
  perk: string;
}

const STEPS: Step[] = [
  {
    number: "01",
    title: "Pick Your Kitchen",
    subtitle: "Themed Spaces",
    description:
      "Select your culinary playground from themed setups like our flame-fired Pizzeria or aromatic Masala Kitchen.",
    icon: Compass,
    tag: "Theme Selection",
    perk: "Specialized equipment calibrated for group fun",
  },
  {
    number: "02",
    title: "Choose Your Experience",
    subtitle: "PLAY · CREATE · UNLEASH",
    description:
      "Decide how you want to play: follow a guided classic, invent your own custom plate, or bring a secret recipe to life.",
    icon: Sparkles,
    tag: "Format Choice",
    perk: "Tailored to your group's desired level of creative freedom",
  },
  {
    number: "03",
    title: "Make It Yours",
    subtitle: "Preferences & Dietary Needs",
    description:
      "Share your dish preferences, spice tolerance, and dietary requirements in advance so everything is prepped safely.",
    icon: SlidersHorizontal,
    tag: "Customization",
    perk: "All allergies strictly isolated and pre-accommodated",
  },
  {
    number: "04",
    title: "Cook Together",
    subtitle: "Private Studio Experience",
    description:
      "Step into your group's private kitchen. Turn on your favourite tunes, follow intuitive guides, or request chef tips anytime.",
    icon: Flame,
    tag: "Hands-on Action",
    perk: "100% private kitchen · Chef support on standby",
  },
  {
    number: "05",
    title: "Plate. Eat. Celebrate.",
    subtitle: "The Shared Feast",
    description:
      "Style your dishes, snap the photos, sit together around your private dining table, and savour what you built together.",
    icon: PartyPopper,
    tag: "The Finale",
    perk: "Zero dishwashing or cleanup required from you",
  },
];

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section
      id="how-it-works"
      className="py-24 md:py-32 bg-cream relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-flame/10 text-flame text-xs font-bold tracking-widest uppercase mb-4">
            The Journey
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-charcoal tracking-tight leading-[1.1] mb-6">
            Your kitchen adventure <br />
            <span className="text-flame">starts here.</span>
          </h2>
          <p className="text-base sm:text-lg text-charcoal/75 leading-relaxed">
            From booking your private studio to taking that first hot bite, here is how PlatePlay makes cooking an unforgettable social experience.
          </p>
        </div>

        {/* 5-Step Process Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative mb-16">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-10 right-10 h-0.5 bg-gradient-to-r from-flame/20 via-burgundy/20 to-flame/30 -z-0" />

          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isCurrent = activeStep === idx;
            return (
              <div
                key={step.number}
                onClick={() => setActiveStep(idx)}
                className={cn(
                  "p-6 rounded-3xl border transition-all duration-300 cursor-pointer relative z-10 flex flex-col justify-between group",
                  isCurrent
                    ? "bg-cream-50 border-flame shadow-card scale-[1.02]"
                    : "bg-cream-100/70 border-cream-300 hover:border-flame/40 hover:bg-cream-50"
                )}
              >
                <div>
                  {/* Step Number & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <span
                      className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center font-display font-bold text-sm transition-all",
                        isCurrent
                          ? "bg-flame text-white shadow-glow"
                          : "bg-cream-200 text-charcoal/70 group-hover:bg-flame/15 group-hover:text-flame"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </span>
                    <span className="font-display font-black text-xl text-charcoal/30">
                      {step.number}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <div className="mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-burgundy block mb-1">
                      {step.subtitle}
                    </span>
                    <h3 className="font-display font-bold text-lg text-charcoal group-hover:text-flame transition-colors">
                      {step.title}
                    </h3>
                  </div>

                  <p className="text-xs text-charcoal/70 leading-relaxed mb-4">
                    {step.description}
                  </p>
                </div>

                {/* Perk Pill */}
                <div className="pt-3 border-t border-cream-200 flex items-start gap-1.5 text-[11px] font-medium text-charcoal/80">
                  <CheckCircle className="w-3.5 h-3.5 text-flame shrink-0 mt-0.5" />
                  <span>{step.perk}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Crucial Operational Callout Banner */}
        <div className="max-w-4xl mx-auto rounded-3xl bg-charcoal text-cream p-6 sm:p-8 shadow-2xl relative overflow-hidden border border-cream/10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-flame/15 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-burgundy/60 border border-flame/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-7 h-7 text-flame" />
            </div>
            <div className="space-y-1.5 text-center sm:text-left flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-xs font-bold text-flame uppercase tracking-wider">
                  The Golden Rule
                </span>
                <span className="text-cream/40">·</span>
                <span className="text-xs text-cream/70">Operationally Handled</span>
              </div>
              <h4 className="font-display font-bold text-xl text-cream">
                All ingredient prep & kitchen cleanup are handled by PlatePlay.
              </h4>
              <p className="text-xs sm:text-sm text-cream/70 leading-relaxed">
                No chopping piles of onions, no washing greasy pans, no cleanup dread. We set up your private station with measured ingredients and handle the entire cleanup afterwards. You focus 100% on cooking, laughing, and eating.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

